const fs = require('fs');
const path = require('path');

async function aggregateSeasonStats() {
    const matchesDir = path.join(__dirname, 'data', 'matches');
    const seasonDir = path.join(__dirname, 'data', 'season');
    if (!fs.existsSync(seasonDir)) fs.mkdirSync(seasonDir, { recursive: true });

    // 1. 個人スタッツファイル (stats_*.json) を取得対象にする
    const statsFiles = fs.readdirSync(matchesDir).filter(f => f.startsWith('stats_') && f.endsWith('.json'));
    
    if (statsFiles.length === 0) {
        console.log("計算対象のスタッツデータが見つかりません。");
        return;
    }

    // 2. リーグ名やチーム名を取得するため、試合結果 (matches_*.json) を辞書化する
    const matchLookup = {};
    const matchFiles = fs.readdirSync(matchesDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    
    matchFiles.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(matchesDir, file), 'utf8'));
        if (content.response && content.response.matches) {
            content.response.matches.forEach(m => {
                matchLookup[m.fixtureId] = m;
            });
        }
    });

    const playerAggregates = {};

    statsFiles.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(matchesDir, file), 'utf8'));
        if (!content.stats) return;

        content.stats.forEach(stat => {
            // 辞書から試合情報を引き当てて、所属リーグやチーム名を取得
            const matchInfo = matchLookup[stat.fixtureId];
            
            if (!playerAggregates[stat.name]) {
                playerAggregates[stat.name] = {
                    name: stat.name,
                    // ※元のロジックを踏襲し、とりあえずホームチーム名を入れています
                    team: matchInfo ? matchInfo.homeTeam.name : "Unknown", 
                    league: matchInfo ? matchInfo.competition.name : "Unknown",
                    leagueCode: stat.compCode,
                    goals: 0,
                    assists: 0,
                    ratingSum: 0,
                    ratingCount: 0,
                    minutes: 0,
                    appearances: 0
                };
            }

            const p = playerAggregates[stat.name];
            p.goals += parseInt(stat.goals || 0);
            p.assists += parseInt(stat.assists || 0);
            p.minutes += parseInt(stat.minutes || 0);
            p.appearances += 1;

            const rating = parseFloat(stat.rating);
            if (!isNaN(rating) && rating > 0) {
                p.ratingSum += rating;
                p.ratingCount += 1;
            }
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

    console.log(`集計完了: ${statsFiles.length}個のスタッツファイルから ${resultList.length} 名の通算成績を算出しました。`);
}

aggregateSeasonStats();
