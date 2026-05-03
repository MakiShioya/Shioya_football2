const fs = require('fs');
const path = require('path');

// ★ リーグ補正 (J1追加、オランダ重複削除)
const LEAGUE_MULTIPLIER = {
    "PL": 1.10, "PD": 1.09, "BL1": 1.08, "SA1": 1.07, "FL1": 1.06, 
    "ELC": 1.04, "BSA": 1.03, "PPL": 1.02, "DED": 1.01, "SPL": 1.00, "J1": 1.00
};

async function generateBest11() {
    const matchesDir = path.join(__dirname, 'data', 'matches');
    const best11Dir = path.join(__dirname, 'data', 'best11');
    
    if (!fs.existsSync(best11Dir)) {
        fs.mkdirSync(best11Dir, { recursive: true });
    }

    const playersData = {};

    // 日付処理
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 9);
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `best11_${dateStr}.json`;
    const confirmedName = `Confirmed_best11_${dateStr}.json`; // 確定版も同時に作る
    const indexName = 'best11_index.json';

    // 1. 直近の試合データから各選手の最高評点を抽出 (カタログ作成)
    const files = fs.readdirSync(matchesDir).filter(f => f.startsWith('matches_') && f.endsWith('.json'));
    const targets = files.sort().reverse().slice(0, 7);

    targets.forEach(file => {
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
                        compCode: match.competition.code
                    };
                }
            });
        });
    });

    const allPlayers = Object.values(playersData);

    // 2. ★ ベスト11選考ロジック (ここが真紀さんの求めている部分)
    const selectedFormation = FORMATIONS["4-2-3-1"]; // デフォルトのフォーメーション
    const pickedIds = [];
    const best11List = [];

    selectedFormation.positions.forEach(pos => {
        // 全選手に対して、このポジションでの「実効スコア」を計算してソート
        const candidates = allPlayers
            .map(player => {
                const master = JAPANESE_PLAYERS_MASTER.find(m => m.name === player.name);
                const suit = master ? (master.suit[pos.name] || 0.1) : 0.5; // マスターになければ適性低め
                return { ...player, suit, effectiveScore: player.finalScore * suit, top: pos.top, left: pos.left };
            })
            .filter(player => !pickedIds.includes(player.name)) // まだ選ばれていない選手
            .sort((a, b) => b.effectiveScore - a.effectiveScore);

        if (candidates.length > 0) {
            const topPlayer = candidates[0];
            best11List.push(topPlayer);
            pickedIds.push(topPlayer.name);
        }
    });

    // 3. 結果の保存
    // 全候補者リスト (控え選手表示用)
    const fullResult = { updated: new Date().toISOString(), list: allPlayers.sort((a,b) => b.finalScore - a.finalScore) };
    fs.writeFileSync(path.join(best11Dir, fileName), JSON.stringify(fullResult), 'utf8');

    // 確定版ベスト11 (ピッチ表示用)
    const confirmedResult = { 
        updated: new Date().toISOString(), 
        dateLabel: `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日号`,
        formation: "4-2-3-1",
        list: best11List 
    };
    fs.writeFileSync(path.join(best11Dir, confirmedName), JSON.stringify(confirmedResult), 'utf8');

    // 目次更新 (省略せず従来通り)
    // ...
}
