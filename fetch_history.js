const fs = require('fs');
const path = require('path');

// GitHub ActionsのSecretsからAPIキーを取得
const API_KEY = process.env.API_SPORTS_KEY;

// 共通辞書を読み込む
const JP_TEAM_PLAYERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'japanese_players.json'), 'utf8'));

// 取得期間の設定（開幕から今日まで）
const START_DATE_STR = '2025-08-01'; 
const END_DATE_STR = new Date().toISOString().split('T')[0];

// ★ 追加：強制上書きモード（true にすると既存ファイルを無視して再取得します）
const FORCE_UPDATE = true;

function mapLeagueIdToCode(id) {
    const mapping = {
        39: "PL", 40: "ELC", 140: "PD", 78: "BL1", 135: "SA1",
        61: "FL1", 94: "PPL", 88: "DED", 144: "BSA", 98: "J1", 179: "SPL",
        2: "CL", 3: "EL", 848: "ECL"
    };
    return mapping[id] || "OTHER";
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHistoricalMatches() {
    const dir = path.join(__dirname, 'public', 'data', 'matches');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let currentDate = new Date(START_DATE_STR);
    const targetEndDate = new Date(END_DATE_STR);

    console.log(`過去データ一括取得開始: ${START_DATE_STR} から ${END_DATE_STR} まで`);
    if (FORCE_UPDATE) console.log("【注意】強制上書きモードがONになっています。既存データは再取得されます。");

    while (currentDate <= targetEndDate) {
        const dateStrAPI = currentDate.toISOString().split('T')[0];
        const dateStrFile = dateStrAPI.replace(/-/g, '');

        // ★ 修正：強制上書きモードが OFF の時だけスキップする
        if (!FORCE_UPDATE && fs.existsSync(path.join(dir, `matches_${dateStrFile}.json`))) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        console.log(`\n[Fetch] ${dateStrAPI} を取得中...`);

        const url = `https://v3.football.api-sports.io/fixtures?date=${dateStrAPI}`;
        const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error(`[Error] APIエラー:`, data.errors);
            await sleep(2000); 
            continue;
        }

        const dailyMatches = [];
        const dailyStats = [];

        if (data.response) {
            for (const item of data.response) {
                const homeName = item.teams.home.name;
                const awayName = item.teams.away.name;
                const compCode = mapLeagueIdToCode(item.league.id);

                const matchData = {
                    fixtureId: item.fixture.id,
                    utcDate: item.fixture.date,
                    competition: { code: compCode, name: item.league.name },
                    homeTeam: { name: homeName, id: item.teams.home.id },
                    awayTeam: { name: awayName, id: item.teams.away.id },
                    score: { fullTime: { home: item.goals.home, away: item.goals.away } },
                    status: item.fixture.status.short
                };

                const isJapaneseMatch = JP_TEAM_PLAYERS[homeName] || JP_TEAM_PLAYERS[awayName];
                const isFinished = ["FT", "AET", "PEN"].includes(item.fixture.status.short);

                if (isFinished && isJapaneseMatch) {
                    await sleep(300); 
                    
                    const statsUrl = `https://v3.football.api-sports.io/fixtures/players?fixture=${item.fixture.id}`;
                    const statsRes = await fetch(statsUrl, { headers: { 'x-apisports-key': API_KEY } });
                    const statsData = await statsRes.json();

                    if (statsData.response) {
                        for (const teamStats of statsData.response) {
                            const teamName = teamStats.team.name;
                            const targetPlayers = JP_TEAM_PLAYERS[teamName];
                            if (!targetPlayers) continue;

                            for (const p of teamStats.players) {
                                const apiName = p.player.name;
                                for (const [engKey, playerObj] of Object.entries(targetPlayers)) {
                                    if (apiName.includes(engKey)) {
                                        const s = p.statistics[0];
                                        dailyStats.push({
                                            fixtureId: item.fixture.id,
                                            compCode: compCode,
                                            name: playerObj.full,
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
                    }
                }
                dailyMatches.push(matchData);
            }
        }

        fs.writeFileSync(path.join(dir, `matches_${dateStrFile}.json`), JSON.stringify({ status: true, response: { matches: dailyMatches } }), 'utf8');
        if (dailyStats.length > 0) {
            fs.writeFileSync(path.join(dir, `stats_${dateStrFile}.json`), JSON.stringify({ stats: dailyStats }), 'utf8');
        }

        console.log(`[Success] ${dateStrFile} 保存完了`);
        
        await sleep(200); 
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log("★★★ すべてのシーズンのデータの取得・上書きが完了しました！ ★★★");
}

fetchHistoricalMatches().catch(err => { console.error(err); });
