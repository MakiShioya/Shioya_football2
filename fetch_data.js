const fs = require('fs');
const path = require('path');

// ステップ1で設定した新しいキーがここに入ります
const API_KEY = process.env.API_SPORTS_KEY;

function getJSTDateString(offset) {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + 9);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

async function fetchMatches() {
    // 前日から翌々日までの4日分を1日ずつ取得（APIの仕様に合わせるため）
    const offsets = [-1, 0, 1, 2];
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    // 取得したいリーグIDのリスト (API-SportsのID)
    // 39: プレミア, 140: ラ・リーガ, 78: ブンデス, 135: セリエA, 61: リーグアン, 98: J1
    const leagueIds = [39, 140, 78, 135, 61, 98];

    for (const offset of offsets) {
        const date = getJSTDateString(offset);
        console.log(`[Fetch] ${date} のデータを取得中...`);

        const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;
        const response = await fetch(url, {
            headers: { 'x-apisports-key': API_KEY }
        });

        if (!response.ok) throw new Error(`APIエラー: ${response.status}`);
        const data = await response.json();

        // --- データの変換処理 ---
        // API-Sportsの形式を、これまでのapp.jsが読める形式に翻訳します
        const dailyMatches = data.response.map(item => ({
            utcDate: item.fixture.date,
            competition: { 
                // IDをこれまでのコード(PL, PDなど)に変換
                code: mapLeagueIdToCode(item.league.id) 
            },
            homeTeam: { name: item.teams.home.name },
            awayTeam: { name: item.teams.away.name },
            score: {
                fullTime: {
                    home: item.goals.home,
                    away: item.goals.away
                }
            }
        }));

        const fileName = `matches_${date.replace(/-/g, '')}.json`;
        const output = {
            status: true,
            response: { matches: dailyMatches }
        };

        fs.writeFileSync(path.join(dir, fileName), JSON.stringify(output), 'utf8');
        console.log(`[Success] ${fileName} を保存しました。`);
    }
}

// リーグIDを以前のコードに変換する補助関数
function mapLeagueIdToCode(id) {
    const mapping = {
        39: "PL",  140: "PD", 78: "BL1", 
        135: "SA1", 61: "FL1", 98: "J1"
    };
    return mapping[id] || "OTHER";
}

fetchMatches().catch(err => {
    console.error(err);
    process.exit(1);
});
