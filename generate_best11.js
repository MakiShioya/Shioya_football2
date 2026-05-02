const fs = require('fs');
const path = require('path');

// 係数設定（ここでバランス調整可能）
const LEAGUE_MULTIPLIER = {
    "PL": 1.20, "PD": 1.15, "BL1": 1.15, "SA1": 1.15, "FL1": 1.10,
    "PPL": 1.00, "DED": 1.00, "BSA": 1.00, "ELC": 1.00
};

async function generateBest11() {
    const dataDir = path.join(__dirname, 'data');
    const playersData = {};

    // 過去7日分（先週の月曜〜日曜分）を読み込む
    const files = fs.readdirSync(dataDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    
    // 直近7つのファイルを対象にする
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
                // 週内の最高スコアを採用
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

    const best11 = Object.values(playersData)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 11);

    // 確定した11人を保存
    fs.writeFileSync(
        path.join(dataDir, 'best11.json'),
        JSON.stringify({ updated: new Date().toISOString(), list: best11 }),
        'utf8'
    );
    console.log('今週の日本代表を確定しました。');
}

generateBest11();
