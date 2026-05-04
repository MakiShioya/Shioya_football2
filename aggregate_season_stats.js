const fs = require('fs');
const path = require('path');

// 日本人選手の所属辞書
const JAPANESE_PLAYERS = {
    "Crystal Palace": ["鎌田大地"],
    "Liverpool": ["遠藤航"],
    "Brighton": ["三笘薫"],
    "Southampton": ["松木玖生"],
    "Leeds": ["田中碧"],
    "Blackburn": ["大橋祐紀", "森下龍矢"],
    "Coventry": ["坂元達裕"],
    "Hull City": ["平河悠"],
    "QPR": ["斉藤光毅"],
    "Stoke City": ["瀬古樹"],
    "Birmingham": ["岩田智輝", "藤本寛也", "古橋亨梧"],
    "Real Sociedad": ["久保建英"],
    "Mallorca": ["浅野拓磨"],
    "Las Palmas": ["宮代大聖"],
    "Bayern München": ["伊藤洋輝"],
    "SC Freiburg": ["鈴木唯人"],
    "Werder Bremen": ["菅原由勢"],
    "Eintracht Frankfurt": ["小杉啓太", "堂安律"],
    "1899 Hoffenheim": ["町田浩樹"],
    "FSV Mainz 05": ["川崎颯太", "佐野海舟"],
    "Borussia Mönchengladbach": ["高井幸大", "町野修斗"],
    "FC St. Pauli": ["ニック・シュミット", "安藤智哉", "原大智", "藤田譲瑠チマ"],
    "VfL Wolfsburg": ["塩貝健人"],
    "VfL Bochum": ["三好康児"],
    "Fortuna Dusseldorf": ["アペルカンプ真大", "田中聡"],
    "Parma": ["鈴木彩艶"],
    "Monaco": ["南野拓実"],
    "Le Havre": ["瀬古歩夢"],
    "St. Truiden": ["伊藤涼太郎", "小久保玲央ブライアン", "谷口彰悟", "山本理仁"],
    "Ajax": ["板倉滉", "冨安健洋"],
    "Feyenoord": ["上田綺世", "渡辺剛"],
    "Sporting CP": ["守田英正"],
    "Celtic": ["旗手怜央", "前田大然"]
};

// 選手名からチーム名を高速に逆引きするための辞書を作成
const PLAYER_TO_TEAM = {};
for (const [team, players] of Object.entries(JAPANESE_PLAYERS)) {
    for (const player of players) {
        PLAYER_TO_TEAM[player] = team;
    }
}

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

    // 2. リーグ名を取得するため、試合結果 (matches_*.json) を辞書化する
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
            const matchInfo = matchLookup[stat.fixtureId];
            
            if (!playerAggregates[stat.name]) {
                playerAggregates[stat.name] = {
                    name: stat.name,
                    // 辞書を使って正確なチーム名を取得（辞書にない場合は過去の暫定処理をフォールバックとして残す）
                    team: PLAYER_TO_TEAM[stat.name] || (matchInfo ? matchInfo.homeTeam.name : "Unknown"),
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

    console.log(`集計完了: ${statsFiles.length}個のスタッツファイルから ${resultList.length} 名の正確な通算成績を算出しました。`);
}

aggregateSeasonStats();
