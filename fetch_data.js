const fs = require('fs');
const path = require('path');

const API_KEY = process.env.RAPID_API_KEY; // GitHub Secretsからキーを取得

// 日本時間（JST）で日付文字列（YYYYMMDD）を計算する関数
function getJSTDateString(offsetDays) {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + 9); // JSTへ変換
    d.setDate(d.getDate() + offsetDays);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}${m}${day}`;
}

// 該当日のデータを取得してJSON保存する関数
async function fetchDataForDate(dateStr) {
    console.log(`[Fetch] ${dateStr} のデータをAPIから取得します...`);
    const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${dateStr}`;
    
    const response = await fetch(url, {
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`APIリクエスト失敗: Status ${response.status}`);
    }

    const data = await response.json();
    const filePath = path.join(__dirname, 'data', `matches_${dateStr}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    console.log(`[Success] ${filePath} に保存しました。`);
}

async function main() {
    try {
        // dataフォルダがなければ作成
        const dir = path.join(__dirname, 'data');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        // 1. 毎日の定例取得（前日[-1] と 翌々日[+2]）
        // これにより1日2回のAPI消費で回します
        await fetchDataForDate(getJSTDateString(-1));
        await fetchDataForDate(getJSTDateString(2));

        // 2. 初回起動時用の安全装置（今日と明日のファイルが無ければ特別に取得）
        const todayStr = getJSTDateString(0);
        if (!fs.existsSync(path.join(dir, `matches_${todayStr}.json`))) {
            console.log("※初回起動とみなし、本日のデータを取得します");
            await fetchDataForDate(todayStr);
        }
        
        const tomorrowStr = getJSTDateString(1);
        if (!fs.existsSync(path.join(dir, `matches_${tomorrowStr}.json`))) {
            console.log("※初回起動とみなし、明日のデータを取得します");
            await fetchDataForDate(tomorrowStr);
        }

    } catch (error) {
        console.error('エラー発生:', error);
        process.exit(1);
    }
}

main();
