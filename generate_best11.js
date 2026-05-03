const fs = require('fs');
const path = require('path');

const LEAGUE_MULTIPLIER = {
    "PL": 1.10, "PD": 1.09, "BL1": 1.08, "SA1": 1.07, "FL1": 1.06, "ELC": 1.04, "BSA": 1.03,
    "PPL": 1.02, "DED": 1.01, "DED": 1.00
};

async function generateBest11() {
    // ★ 1. フォルダパスの定義を整理
    const matchesDir = path.join(__dirname, 'data', 'matches'); // 読み込み元
    const best11Dir = path.join(__dirname, 'data', 'best11');   // 保存先
    
    // ★ 2. 保存先フォルダがない場合は作成する (recursive: true で data フォルダごと作成可能)
    if (!fs.existsSync(best11Dir)) {
        fs.mkdirSync(best11Dir, { recursive: true });
    }

    const playersData = {};

    // 実行時のJST日付を取得 (ファイル名用)
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 9);
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `best11_${dateStr}.json`;
    const indexName = 'best11_index.json';

    // ★ 3. 読み込み元を matchesDir に変更
    const files = fs.readdirSync(matchesDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    const targets = files.sort().reverse().slice(0, 7);

    targets.forEach(file => {
        // ★ 4. ファイルのフルパスも matchesDir を使用
        const content = JSON.parse(fs.readFileSync(path.join(matchesDir, file), 'utf8'));
        content.response.matches.forEach(match => {
            if (!match.japaneseStats) return;
            const multiplier = LEAGUE_MULTIPLIER[match.competition.code] || 0.95;
            match.japaneseStats.forEach(stat => {
                const rating = parseFloat(stat.rating);
                if (isNaN(rating)) return;
                const finalScore = rating * multiplier;
                if (!playersData[stat.name] || playersData[stat.name].finalScore < finalScore) {
                    playersData[stat.name] = {
                        name: stat.name,
                        finalScore: parseFloat(finalScore.toFixed(2)),
                        originalRating: rating,
                        compCode: match.competition.code,
                        goals: stat.goals,
                        assists: stat.assists,
                        minutes: stat.minutes
                    };
                }
            });
        });
    });

    const weeklyPlayers = Object.values(playersData).sort((a, b) => b.finalScore - a.finalScore);
    const result = { updated: new Date().toISOString(), dateLabel: `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日号`, list: weeklyPlayers };

    // ★ 5. 個別の週刊ファイルを best11Dir に保存
    fs.writeFileSync(path.join(best11Dir, fileName), JSON.stringify(result), 'utf8');

    // ★ 6. 目次ファイルを best11Dir 内で更新
    let indexData = [];
    const indexPath = path.join(best11Dir, indexName);
    if (fs.existsSync(indexPath)) {
        indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
    // 重複を避けて追加
    if (!indexData.find(i => i.file === fileName)) {
        indexData.push({ file: fileName, label: result.dateLabel });
    }
    fs.writeFileSync(indexPath, JSON.stringify(indexData), 'utf8');

    console.log(`${result.dateLabel} の日本代表を確定し、アーカイブ（data/best11/）に追加しました。`);
}

generateBest11();
