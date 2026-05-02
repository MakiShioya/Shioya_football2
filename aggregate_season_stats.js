const fs = require('fs');
const path = require('path');

async function aggregateSeasonStats() {
    const matchesDir = path.join(__dirname, 'data', 'matches');
    const seasonDir = path.join(__dirname, 'data', 'season');
    if (!fs.existsSync(seasonDir)) fs.mkdirSync(seasonDir, { recursive: true });

    // 保存されているすべての試合データを取得
    const files = fs.readdirSync(matchesDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    
    if (files.length === 0) {
        console.log("計算対象の試合データが見つかりません。");
        return;
    }

    const playerAggregates = {};

    files.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(matchesDir, file), 'utf8'));
        content.response.matches.forEach(match => {
            if (!match.japaneseStats) return;

            match.japaneseStats.forEach(stat => {
                if (!playerAggregates[stat.name]) {
                    playerAggregates[stat.name] = {
                        name: stat.name,
                        team: match.homeTeam.name.includes(stat.name) || match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name, // 簡易的な所属判定
                        league: match.competition.name,
                        leagueCode: match.competition.code,
                        goals: 0,
                        assists: 0,
                        ratingSum: 0,
                        ratingCount: 0,
                        minutes: 0,
                        appearances: 0
                    };
                }

                const p = playerAggregates[stat.name];
                p.goals += (stat.goals || 0);
                p.assists += (stat.assists || 0);
                p.minutes += (stat.minutes || 0);
                p.appearances += 1;

                const rating = parseFloat(stat.rating);
                if (!isNaN(rating) && rating > 0) {
                    p.ratingSum += rating;
                    p.ratingCount += 1;
                }
            });
        });
    });

    // 平均評点を計算して整形
    const resultList = Object.values(playerAggregates).map(p => ({
        name: p.name,
        team: p.team,
        league: p.league,
        leagueCode: p.leagueCode,
        goals: p.goals,
        assists: p.assists,
        rating: p.ratingCount > 0 ? (p.ratingSum / p.ratingCount).toFixed(2) : "0.00",
        minutes: p.minutes,
        appearances: p.appearances
    }));

    // season_stats.json を上書き保存
    fs.writeFileSync(
        path.join(seasonDir, 'season_stats.json'),
        JSON.stringify({ updated: new Date().toISOString(), players: resultList }, null, 2),
        'utf8'
    );

    console.log(`集計完了: ${files.length}個のファイルから ${resultList.length} 名の通算成績を算出しました。`);
}

aggregateSeasonStats();
