const fs = require('fs');
const path = require('path');

// ★ 新シーズンの対象期間（2026年8月1日〜2027年7月1日）
const SEASON_START_DATE = '2026-08-01';
const SEASON_END_DATE   = '2027-07-01';

// 外部のJSONファイルから共通辞書を読み込む
const JP_TEAM_PLAYERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'japanese_players.json'), 'utf8'));

// 選手名からチーム名を高速に逆引きするための辞書を作成
const PLAYER_TO_TEAM = {};
for (const [team, playersObj] of Object.entries(JP_TEAM_PLAYERS)) {
    for (const playerObj of Object.values(playersObj)) {
        PLAYER_TO_TEAM[playerObj.full] = team;
    }
}

async function aggregateSeasonStats() {
    const matchesDir = path.join(__dirname, 'public', 'data', 'matches');
    const seasonDir = path.join(__dirname, 'public', 'data', 'season');
    if (!fs.existsSync(seasonDir)) fs.mkdirSync(seasonDir, { recursive: true });

    const statsFiles = fs.readdirSync(matchesDir).filter(f => f.startsWith('stats_') && f.endsWith('.json'));
    
    if (statsFiles.length === 0) {
        console.log("計算対象のスタッツデータが見つかりません。");
        return;
    }

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
            
            // ★【追加】日付フィルタリング判定
            // matchInfo が存在し、かつ date がある場合に期間チェックを行う
            if (matchInfo && matchInfo.date) {
                const matchDate = matchInfo.date.substring(0, 10); // "YYYY-MM-DD" を抽出
                // 設定したシーズン期間外の試合であれば集計をスキップ
                if (matchDate < SEASON_START_DATE || matchDate > SEASON_END_DATE) {
                    return;
                }
            }

            if (!playerAggregates[stat.name]) {
                playerAggregates[stat.name] = {
                    name: stat.name,
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

            // リーグ情報の「格上げ」ロジック
            const mainLeagues = ["PL", "PD", "BL1", "SA1", "FL1", "ELC", "PPL", "DED", "BSA", "J1", "SPL"];
            const isCurrentMain = mainLeagues.includes(stat.compCode);
            const isSavedMain = mainLeagues.includes(p.leagueCode);

            if (isCurrentMain && !isSavedMain) {
                p.leagueCode = stat.compCode;
                if (matchInfo) p.league = matchInfo.competition.name;
            }

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

    fs.writeFileSync(
        path.join(seasonDir, 'season_stats.json'),
        JSON.stringify({ updated: new Date().toISOString(), players: resultList }, null, 2),
        'utf8'
    );

    console.log(`集計完了: 2026-2027シーズンの通算成績（${resultList.length} 名）を算出しました。`);
}

aggregateSeasonStats();