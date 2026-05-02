const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_SPORTS_KEY;

// 日本人所属チームと選手の辞書
const JP_TEAM_PLAYERS = {
    "Crystal Palace": { "Kamada": "鎌田大地" },
    "Liverpool": { "Endo": "遠藤航" },
    "Brighton": { "Mitoma": "三笘薫" },
    "Southampton": { "Matsuki": "松木玖生" },
    "Leeds": { "Tanaka": "田中碧" },
    "Blackburn": { "Ohashi": "大橋祐紀", "Morishita": "森下龍矢" },
    "Coventry": { "Sakamoto": "坂元達裕" },
    "Hull City": { "Hirakawa": "平河悠" },
    "QPR": { "Saito": "斉藤光毅" },
    "Stoke City": { "Seko": "瀬古樹" },
    "Birmingham": { "Iwata": "岩田智輝", "Fujimoto": "藤本寛也", "Furuhashi": "古橋亨梧" },
    "Real Sociedad": { "Kubo": "久保建英" },
    "Mallorca": { "Asano": "浅野拓磨" },
    "Las Palmas": { "Miyashiro": "宮代大聖" },
    "Bayern München": { "Itō": "伊藤洋輝" },
    "SC Freiburg": { "Suzuki": "鈴木唯人" },
    "Werder Bremen": { "Sugawara": "菅原由勢" },
    "Eintracht Frankfurt": { "Kosugi": "小杉啓太", "Doan": "堂安律" },
    "1899 Hoffenheim": { "Machida": "町田浩樹" },
    "Mainz 05": { "Kawasaki": "川崎颯太", "Sano": "佐野海舟" },
    "Borussia Monchengladbach": { "Takai": "高井幸大", "Machino": "町野修斗" },
    "St. Pauli": { "Schmidt": "ニック・シュミット", "Ando": "安藤智哉", "Hara": "原大智", "Fujita": "藤田譲瑠チマ" },
    "VfL Wolfsburg": { "Shiogai": "塩貝健人" },
    "VfL Bochum": { "Miyoshi": "三好康児" },
    "Fortuna Dusseldorf": { "Appelkamp": "アペルカンプ真大", "Tanaka": "田中聡" },
    "Parma": { "Suzuki": "鈴木彩艶" },
    "Monaco": { "Minamino": "南野拓実" },
    "Le Havre": { "Seko": "瀬古歩夢" },
    "Sint-Truiden": { "Ito": "伊藤涼太郎", "Kokubo": "小久保玲央ブライアン", "Taniguchi": "谷口彰悟", "Yamamoto": "山本理仁" },
    "Ajax": { "Itakura": "板倉滉", "Tomiyasu": "冨安健洋" },
    "Feyenoord": { "Ueda": "上田綺世", "Watanabe": "渡辺剛" },
    "Sporting CP": { "Morita": "守田英正" },
    "Celtic": { "Hatate": "旗手怜央", "Maeda": "前田大然" }
};

function getJSTDateString(offset) {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + 9);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

function mapLeagueIdToCode(id) {
    const mapping = {
        39: "PL", 40: "ELC", 140: "PD", 78: "BL1", 135: "SA1",
        61: "FL1", 94: "PPL", 88: "DED", 144: "BSA", 98: "J1", 179: "SPL"
    };
    return mapping[id] || "OTHER";
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchMatches() {
    const offsets = [-1, 0, 1];
    const dir = path.join(__dirname, 'data', 'matches');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const offset of offsets) {
        const date = getJSTDateString(offset);
        console.log(`\n[Fetch] ${date} のデータを取得中...`);

        const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;
        const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
        const data = await response.json();

        // API制限やエラーの確認用ログ
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error(`[Error] APIエラー発生:`, data.errors);
            await sleep(6500);
            continue;
        }

        const dailyMatches = [];

        if (data.response) {
            for (const item of data.response) {
                const homeName = item.teams.home.name;
                const awayName = item.teams.away.name;

                const matchData = {
                    fixtureId: item.fixture.id,
                    utcDate: item.fixture.date,
                    competition: { 
                        code: mapLeagueIdToCode(item.league.id),
                        name: item.league.name
                    },
                    homeTeam: { name: homeName, id: item.teams.home.id },
                    awayTeam: { name: awayName, id: item.teams.away.id },
                    score: { fullTime: { home: item.goals.home, away: item.goals.away } },
                    status: item.fixture.status.short,
                    japaneseStats: []
                };

                const isJapaneseMatch = JP_TEAM_PLAYERS[homeName] || JP_TEAM_PLAYERS[awayName];
                const isFinished = ["FT", "AET", "PEN"].includes(item.fixture.status.short);

                if (offset === -1 && isFinished && isJapaneseMatch) {
                    console.log(`  >> 注目試合のスタッツ取得: ${homeName} vs ${awayName}`);
                    
                    // ★修正：1分間10回の制限を避けるため、確実に6.5秒待つ
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
                                for (const [engKey, jpName] of Object.entries(targetPlayers)) {
                                    if (apiName.includes(engKey)) {
                                        const s = p.statistics[0];
                                        matchData.japaneseStats.push({
                                            name: jpName,
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

        const fileName = `matches_${date.replace(/-/g, '')}.json`;
        fs.writeFileSync(path.join(dir, fileName), JSON.stringify({ status: true, response: { matches: dailyMatches } }), 'utf8');
        console.log(`[Success] ${fileName} 保存完了。全 ${dailyMatches.length} 試合を記録しました。`);
        
        // ★修正：次の日の全試合一覧を取得しにいく前にも6.5秒待つ
        await sleep(6500);
    }
}

fetchMatches().catch(err => { console.error(err); process.exit(1); });
