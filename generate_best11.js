const fs = require('fs');
const path = require('path');

const LEAGUE_MULTIPLIER = {
    "PL": 1.20, "PD": 1.15, "BL1": 1.15, "SA1": 1.15, "FL1": 1.10,
    "PPL": 1.00, "DED": 1.00, "BSA": 1.00, "ELC": 1.00
};

async function generateBest11() {
    const dataDir = path.join(__dirname, 'data');
    const playersData = {};

    // 実行時のJST日付を取得 (ファイル名用)
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 9);
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `best11_${dateStr}.json`;
    const indexName = 'best11_index.json';

    const files = fs.readdirSync(dataDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    const targets = files.sort().reverse().slice(0, 7);

    targets.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
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

    const best11 = Object.values(playersData).sort((a, b) => b.finalScore - a.finalScore).slice(0, 11);
    const result = { updated: new Date().toISOString(), dateLabel: `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日号`, list: best11 };

    // 1. 個別の週刊ファイルを保存
    fs.writeFileSync(path.join(dataDir, fileName), JSON.stringify(result), 'utf8');

    // 2. 目次ファイルを更新
    let indexData = [];
    const indexPath = path.join(dataDir, indexName);
    if (fs.existsSync(indexPath)) {
        indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
    // 重複を避けて追加
    if (!indexData.find(i => i.file === fileName)) {
        indexData.push({ file: fileName, label: result.dateLabel });
    }
    fs.writeFileSync(indexPath, JSON.stringify(indexData), 'utf8');

    console.log(`${result.dateLabel} の日本代表を確定し、アーカイブに追加しました。`);
}

generateBest11();
