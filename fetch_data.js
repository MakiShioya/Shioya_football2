const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_SPORTS_KEY;

// 外部のJSONファイルから共通辞書を読み込む
const JP_TEAM_PLAYERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'japanese_players.json'), 'utf8'));

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

async function fetchMatches() {
    const offsets = [-1, 0, 1];
    const dir = path.join(__dirname, 'public', 'data', 'matches');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const offset of offsets) {
        const date = getJSTDateString(offset);
        console.log(`\n[Fetch] ${date} のデータを取得中...`);

        const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;
        const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error(`[Error] APIエラー発生:`, data.errors);
            await sleep(6500);
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

                if (offset === -1 && isFinished && isJapaneseMatch) {
                    console.log(`  >> 注目試合のスタッツ取得: ${homeName} vs ${awayName}`);
                    await sleep(6500); 
                    
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
                                    // ★ 修正：playerObj.full でマッチング
                                    if (apiName.includes(engKey)) {
                                        const s = p.statistics[0];
                                        dailyStats.push({
                                            fixtureId: item.fixture.id,
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
                    }
                }

                dailyMatches.push(matchData);
            }
        }

        const dateStr = date.replace(/-/g, '');
        fs.writeFileSync(path.join(dir, `matches_${dateStr}.json`), JSON.stringify({ status: true, response: { matches: dailyMatches } }), 'utf8');
        if (dailyStats.length > 0) {
            fs.writeFileSync(path.join(dir, `stats_${dateStr}.json`), JSON.stringify({ stats: dailyStats }), 'utf8');
        }

        console.log(`[Success] ${dateStr} 保存完了。試合:${dailyMatches.length}件, スタッツ:${dailyStats.length}件`);
        await sleep(6500);
    }
}

fetchMatches().catch(err => { console.error(err); process.exit(1); });
