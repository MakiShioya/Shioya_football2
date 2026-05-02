const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_SPORTS_KEY;

// ★ 新追加：スタッツを取得したい日本人選手の英語名（姓だけなど特徴的な部分）と日本語名の辞書
// ※APIがどんな表記で返してくるか分からないため、最初は代表的な選手だけでテストします。
const TARGET_PLAYERS = {
    "Mitoma": "三笘薫",
    "Endo": "遠藤航",
    "Kubo": "久保建英",
    "Minamino": "南野拓実",
    "Kamada": "鎌田大地",
    "Doan": "堂安律",
    "Morita": "守田英正",
    "Sugawara": "菅原由勢",
    "Ito": "伊藤洋輝",
    "Tomiyasu": "冨安健洋"
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

// 少し待機するための関数（APIの連続リクエスト制限対策）
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchMatches() {
    const offsets = [-1, 0, 1, 2];
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    for (const offset of offsets) {
        const date = getJSTDateString(offset);
        console.log(`[Fetch] ${date} のデータを取得中...`);

        const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;
        const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
        if (!response.ok) throw new Error(`APIエラー: ${response.status}`);
        const data = await response.json();

        const dailyMatches = [];

        // 1試合ずつ処理
        for (const item of data.response) {
            const matchData = {
                fixtureId: item.fixture.id, // ★スタッツ取得用にIDを保存
                utcDate: item.fixture.date,
                competition: { code: mapLeagueIdToCode(item.league.id) },
                homeTeam: { name: item.teams.home.name },
                awayTeam: { name: item.teams.away.name },
                score: { fullTime: { home: item.goals.home, away: item.goals.away } },
                japaneseStats: [] // ★スタッツを入れる空の配列を用意
            };

            // ★ ここから新機能：昨日の試合（offset === -1）なら詳細スタッツを取りに行く
            if (offset === -1) {
                // ※全試合叩くと制限を超えるので、とりあえず無条件ではなく
                // 今回は「昨日の試合」かつ「試合が終了している(Match Finished)」ものだけを対象にするなど工夫もできますが、
                // まずは対象選手がいるかチーム名でざっくり判定せずに、テストとしていくつか取得してみます。
                
                // --- 【重要】APIのチーム名リストがバックエンドに無いため、
                // 本来は対象チームの時だけリクエストしますが、今回は安全のため、
                // 「5大リーグの昨日の試合」に絞ってスタッツを取得します。
                const majorIds = [39, 140, 78, 135, 61];
                if (majorIds.includes(item.league.id) && ["FT", "AET", "PEN"].includes(item.fixture.status.short)) {
                    
                    await sleep(300); // 1秒間に何十回もリクエストしないよう0.3秒待機
                    console.log(`  └ 試合ID: ${item.fixture.id} のスタッツを取得中...`);
                    
                    const statsUrl = `https://v3.football.api-sports.io/fixtures/players?fixture=${item.fixture.id}`;
                    const statsRes = await fetch(statsUrl, { headers: { 'x-apisports-key': API_KEY } });
                    const statsData = await statsRes.json();

                    if (statsData.response && statsData.response.length > 0) {
                        // homeとawayの両チームの選手リストを見る
                        for (const teamStats of statsData.response) {
                            for (const p of teamStats.players) {
                                const apiName = p.player.name;
                                
                                // TARGET_PLAYERSの辞書に引っかかる名前があるか探す
                                for (const [engKey, jpName] of Object.entries(TARGET_PLAYERS)) {
                                    if (apiName.includes(engKey)) {
                                        const stats = p.statistics[0]; // 0番目にその試合のデータが入る
                                        matchData.japaneseStats.push({
                                            name: jpName,
                                            minutes: stats.games.minutes || 0,
                                            rating: stats.games.rating || "-",
                                            starter: stats.games.substitute === false,
                                            goals: stats.goals.total || 0,
                                            assists: stats.goals.assists || 0
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            dailyMatches.push(matchData);
        }

        const fileName = `matches_${date.replace(/-/g, '')}.json`;
        const output = { status: true, response: { matches: dailyMatches } };
        fs.writeFileSync(path.join(dir, fileName), JSON.stringify(output), 'utf8');
        console.log(`[Success] ${fileName} を保存しました。`);
    }
}

fetchMatches().catch(err => {
    console.error(err);
    process.exit(1);
});
