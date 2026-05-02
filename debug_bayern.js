const API_KEY = process.env.API_SPORTS_KEY;

// 昨日のバイエルン戦のFixture ID
const TARGET_FIXTURE_ID = 1388588;

async function debugBayernPlayers() {
    console.log(`[Debug] Fixture ID: ${TARGET_FIXTURE_ID} のスタッツを取得中...`);

    const statsUrl = `https://v3.football.api-sports.io/fixtures/players?fixture=${TARGET_FIXTURE_ID}`;
    const statsRes = await fetch(statsUrl, { headers: { 'x-apisports-key': API_KEY } });
    const statsData = await statsRes.json();

    if (statsData.errors && Object.keys(statsData.errors).length > 0) {
        console.error(`[Error] APIエラー発生:`, statsData.errors);
        return;
    }

    if (statsData.response && statsData.response.length > 0) {
        for (const teamStats of statsData.response) {
            const teamName = teamStats.team.name;
            
            // バイエルンのデータのみを抽出
            if (teamName === "Bayern München") {
                console.log(`\n=== ${teamName} の登録選手一覧 ===`);
                for (const p of teamStats.players) {
                    const minutes = p.statistics[0]?.games?.minutes || 0;
                    console.log(`- 名前: ${p.player.name} (出場: ${minutes}分)`);
                }
            }
        }
    } else {
        console.log("[Debug] スタッツデータが空、または存在しません。");
    }
}

debugBayernPlayers().catch(err => console.error(err));
