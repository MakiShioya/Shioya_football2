const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

// JSTの日付を計算
function getJSTDateString(offset) {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + 9);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD 形式
}

async function fetchMatches() {
    // 前日(-1)から翌々日(+2)までの4日分を一気に取得
    const from = getJSTDateString(-1);
    const to = getJSTDateString(2);
    
    console.log(`[Fetch] ${from} から ${to} のデータを取得します...`);
    
    const url = `https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`;
    
    const response = await fetch(url, {
        headers: { 'X-Auth-Token': API_KEY }
    });

    if (!response.ok) throw new Error(`APIエラー: ${response.status}`);
    
    const data = await response.json();
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    // 取得した全試合を、日付ごとのファイルにバラして保存する
    // これにより、フロント側は日付を指定して読み込めるようになります
    const dates = [getJSTDateString(-1), getJSTDateString(0), getJSTDateString(1), getJSTDateString(2)];
    
    dates.forEach(date => {
        const dailyMatches = data.matches.filter(m => m.utcDate.startsWith(date));
        const fileName = `matches_${date.replace(/-/g, '')}.json`;
        
        // 以前のAPI形式に少し似せた構造で保存
        const output = {
            status: true,
            response: { matches: dailyMatches }
        };
        
        fs.writeFileSync(path.join(dir, fileName), JSON.stringify(output), 'utf8');
        console.log(`[Success] ${fileName} を保存しました。`);
    });
}

fetchMatches().catch(err => {
    console.error(err);
    process.exit(1);
});
