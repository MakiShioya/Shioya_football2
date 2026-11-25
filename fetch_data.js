const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_SPORTS_KEY;
const API_BASE = 'https://v3.football.api-sports.io';

// 外部のJSONファイルから共通辞書を読み込む
const JP_TEAM_PLAYERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'japanese_players.json'), 'utf8'));

// 取りこぼした日を、保存済みの試合IDで取り直すか（API の回数を使うので、既定では使わない。2026-11-25 塩谷さんの判断）
// 無料プランは日付での取得が「前日〜翌日」に限られるが、試合IDを指定すれば数日前の試合も取れた（2026-11-25 確認）。
const CATCH_UP_ENABLED = false;
// 何日前までさかのぼるか（ベスト11の対象の1週間ぶん）
const CATCH_UP_DAYS = 7;
// 1日の無料枠（100回）のうち、取り直しで使わずに残しておく回数
const KEEP_REMAINING = 15;

function getJSTDateString(offset) {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + 9);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

function mapLeagueIdToCode(id) {
    const mapping = {
        39: "PL", 40: "ELC", 140: "PD", 78: "BL1", 135: "SA1",
        61: "FL1", 94: "PPL", 88: "DED", 144: "BSA", 98: "J1", 179: "SPL",
        2: "CL",  // Champions League
        3: "EL",  // Europa League
        848: "ECL" // Conference League
    };
    return mapping[id] || "OTHER";
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const matchesDir = path.join(__dirname, 'public', 'data', 'matches');

// API の残り回数（応答のヘッダーから分かる。分からないうちは null）
let requestsRemaining = null;

// API を呼ぶ。通信に失敗したら、間をあけて最大4回まで試す
// （朝スリープから起きた直後は Wi-Fi がまだつながっていないことがあるため）
async function apiGet(pathAndQuery) {
    const MAX_TRY = 4;
    for (let attempt = 1; attempt <= MAX_TRY; attempt++) {
        try {
            const res = await fetch(`${API_BASE}/${pathAndQuery}`, {
                headers: { 'x-apisports-key': API_KEY },
                signal: AbortSignal.timeout(30000)
            });
            const remaining = res.headers.get('x-ratelimit-requests-remaining');
            if (remaining !== null && !isNaN(parseInt(remaining, 10))) {
                requestsRemaining = parseInt(remaining, 10);
            }
            return await res.json();
        } catch (err) {
            const reason = (err.cause && err.cause.code) || err.message;
            console.error(`  [Retry] 通信に失敗 (${attempt}/${MAX_TRY}): ${reason}`);
            if (attempt === MAX_TRY) throw err;
            await sleep(attempt * 30000); // 30秒, 60秒, 90秒 待つ
        }
    }
}

function isJapaneseTeam(name) {
    return JP_TEAM_PLAYERS[name] !== undefined;
}

// fixtures/players の応答から、日本人選手の行だけを取り出す
function extractJapaneseStats(statsData, fixtureId, compCode) {
    const result = [];
    for (const teamStats of (statsData.response || [])) {
        const targetPlayers = JP_TEAM_PLAYERS[teamStats.team.name];
        if (!targetPlayers) continue;

        for (const p of teamStats.players) {
            const apiName = p.player.name;
            for (const [engKey, playerObj] of Object.entries(targetPlayers)) {
                if (apiName.includes(engKey)) {
                    const s = p.statistics[0];
                    result.push({
                        fixtureId: fixtureId,
                        compCode: compCode,
                        name: playerObj.full, // ここはフルネームを維持
                        minutes: s.games.minutes || 0,
                        rating: s.games.rating || "-",
                        starter: s.games.substitute === false,
                        goals: s.goals.total || 0,
                        assists: s.goals.assists || 0
                    });
                }
            }
        }
    }
    return result;
}

// 1日分の試合一覧を取得して保存する。withStats なら、終わった日本人の試合のスタッツも取る
// stats ファイルは「スタッツ取得が最後まで成功した日」だけ書く（日本人の試合があれば0人でも空で書く）。
// 書かれていない日は、翌日以降の取り直しの対象になる。
async function fetchDay(date, withStats) {
    const dateStr = date.replace(/-/g, '');
    console.log(`\n[Fetch] ${date} のデータを取得中...${withStats ? '（スタッツも取得）' : ''}`);

    const data = await apiGet(`fixtures?date=${date}`);
    if (data.errors && Object.keys(data.errors).length > 0) {
        console.error(`[Error] APIエラー発生:`, data.errors);
        return false;
    }

    const dailyMatches = [];
    const dailyStats = [];
    let japaneseMatchCount = 0;
    let statsFailed = false;

    for (const item of (data.response || [])) {
        const homeName = item.teams.home.name;
        const awayName = item.teams.away.name;
        const compCode = mapLeagueIdToCode(item.league.id);

        dailyMatches.push({
            fixtureId: item.fixture.id,
            utcDate: item.fixture.date,
            competition: { code: compCode, name: item.league.name },
            homeTeam: { name: homeName, id: item.teams.home.id },
            awayTeam: { name: awayName, id: item.teams.away.id },
            score: { fullTime: { home: item.goals.home, away: item.goals.away } },
            status: item.fixture.status.short
        });

        const isJapaneseMatch = isJapaneseTeam(homeName) || isJapaneseTeam(awayName);
        if (!isJapaneseMatch) continue;
        japaneseMatchCount++;

        const isFinished = ["FT", "AET", "PEN"].includes(item.fixture.status.short);
        if (!withStats || !isFinished || statsFailed) continue;

        console.log(`  >> 注目試合のスタッツ取得: ${homeName} vs ${awayName}`);
        await sleep(6500); // 無料プランは1分10回まで

        let statsData;
        try {
            statsData = await apiGet(`fixtures/players?fixture=${item.fixture.id}`);
        } catch (err) {
            console.error(`  [Error] スタッツ取得に失敗: ${err.message}`);
            statsFailed = true;
            continue;
        }
        if (statsData.errors && Object.keys(statsData.errors).length > 0) {
            console.error(`  [Error] スタッツのAPIエラー:`, statsData.errors);
            statsFailed = true;
            continue;
        }

        dailyStats.push(...extractJapaneseStats(statsData, item.fixture.id, compCode));
    }

    fs.writeFileSync(path.join(matchesDir, `matches_${dateStr}.json`), JSON.stringify({ status: true, response: { matches: dailyMatches } }), 'utf8');

    let statsNote = '';
    if (withStats) {
        if (statsFailed) {
            // 途中で失敗した日は書かない（中途半端なデータを残さず、次回まるごと取り直す）
            statsNote = '（スタッツは失敗。次回取り直します）';
        } else if (dailyStats.length > 0 || japaneseMatchCount > 0) {
            fs.writeFileSync(path.join(matchesDir, `stats_${dateStr}.json`), JSON.stringify({ stats: dailyStats }), 'utf8');
        }
    }

    console.log(`[Success] ${dateStr} 保存完了。試合:${dailyMatches.length}件, スタッツ:${dailyStats.length}件${statsNote}`);
    return !statsFailed;
}

// 直近の日で、日本人の試合があったのにスタッツが無い日を探す（取りこぼしの候補）
// 無料プランは日付での取得が「前日〜翌日」に限られるので、保存済みの試合一覧にある試合IDを使って1試合ずつ取り直す。
// 試合一覧が無い日は試合IDが分からないので取り直せない。
function findMissingStatsDays() {
    const days = [];
    for (let offset = -2; offset >= -(CATCH_UP_DAYS + 1); offset--) {
        const date = getJSTDateString(offset);
        const dateStr = date.replace(/-/g, '');
        if (fs.existsSync(path.join(matchesDir, `stats_${dateStr}.json`))) continue;

        const matchesPath = path.join(matchesDir, `matches_${dateStr}.json`);
        if (!fs.existsSync(matchesPath)) {
            console.log(`[CatchUp] ${date} は試合一覧が無いため取り直せません`);
            continue;
        }
        const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8')).response.matches || [];
        const japaneseCount = matches.filter(m => isJapaneseTeam(m.homeTeam.name) || isJapaneseTeam(m.awayTeam.name)).length;
        // 1試合につき「結果」と「選手スタッツ」の2回
        if (japaneseCount > 0) days.push({ date, estimatedCalls: japaneseCount * 2 });
    }
    return days;
}

// 取りこぼした日を、試合IDで1試合ずつ取り直す
async function catchUpDay(date) {
    const dateStr = date.replace(/-/g, '');
    const matchesPath = path.join(matchesDir, `matches_${dateStr}.json`);
    const content = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
    const matches = content.response.matches || [];
    console.log(`\n[CatchUp] ${date} を取り直し中...`);

    const dailyStats = [];
    let failed = false;

    for (const match of matches) {
        if (!isJapaneseTeam(match.homeTeam.name) && !isJapaneseTeam(match.awayTeam.name)) continue;

        // 1. 試合の結果（保存してある一覧は「試合前」の状態のことがあるので、最新に直す）
        await sleep(6500); // 無料プランは1分10回まで
        const fixtureData = await apiGet(`fixtures?id=${match.fixtureId}`);
        if (fixtureData.errors && Object.keys(fixtureData.errors).length > 0) {
            console.error(`  [Error] 試合結果のAPIエラー:`, fixtureData.errors);
            failed = true;
            break;
        }
        const item = (fixtureData.response || [])[0];
        if (!item) continue;
        match.status = item.fixture.status.short;
        match.utcDate = item.fixture.date;
        match.score = { fullTime: { home: item.goals.home, away: item.goals.away } };

        if (!["FT", "AET", "PEN"].includes(match.status)) continue;

        // 2. 選手のスタッツ
        console.log(`  >> 注目試合のスタッツ取得: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
        await sleep(6500);
        const statsData = await apiGet(`fixtures/players?fixture=${match.fixtureId}`);
        if (statsData.errors && Object.keys(statsData.errors).length > 0) {
            console.error(`  [Error] スタッツのAPIエラー:`, statsData.errors);
            failed = true;
            break;
        }
        dailyStats.push(...extractJapaneseStats(statsData, match.fixtureId, match.competition.code));
    }

    if (failed) {
        console.log(`[CatchUp] ${dateStr} は途中で失敗したので保存せず、次回取り直します`);
        return false;
    }
    fs.writeFileSync(matchesPath, JSON.stringify(content), 'utf8');
    fs.writeFileSync(path.join(matchesDir, `stats_${dateStr}.json`), JSON.stringify({ stats: dailyStats }), 'utf8');
    console.log(`[CatchUp] ${dateStr} 保存完了。スタッツ:${dailyStats.length}件`);
    return true;
}

async function main() {
    if (!fs.existsSync(matchesDir)) fs.mkdirSync(matchesDir, { recursive: true });

    let hadError = false;

    // 1. いつもの取得：前日（スタッツも）・当日・翌日
    for (const offset of [-1, 0, 1]) {
        try {
            await fetchDay(getJSTDateString(offset), offset === -1);
        } catch (err) {
            hadError = true;
            console.error(`[Error] ${getJSTDateString(offset)} の取得に失敗:`, err.message);
        }
        await sleep(6500);
    }

    // 2. 取りこぼしの取り直し（無料枠を使い切らない範囲で。CATCH_UP_ENABLED が true のときだけ）
    const missing = CATCH_UP_ENABLED ? findMissingStatsDays() : [];
    if (missing.length > 0) {
        console.log(`\n[CatchUp] スタッツが欠けている日: ${missing.map(m => m.date).join(', ')}`);
    }
    for (const day of missing) {
        if (requestsRemaining !== null && requestsRemaining - day.estimatedCalls < KEEP_REMAINING) {
            console.log(`[CatchUp] API の残り回数 (${requestsRemaining}) が少ないので、${day.date} は次回に回します`);
            continue;
        }
        try {
            await catchUpDay(day.date);
        } catch (err) {
            hadError = true;
            console.error(`[Error] ${day.date} の取り直しに失敗:`, err.message);
        }
        await sleep(6500);
    }

    if (requestsRemaining !== null) console.log(`\n[Info] API の残り回数（今日）: ${requestsRemaining}`);
    if (hadError) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
