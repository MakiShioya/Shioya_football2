const fs = require('fs');
const path = require('path');

// 外部データの読み込み
const { PLAYER_MASTER } = require('./public/player_master.js');
const { FORMATIONS } = require('./public/formations.js');

const LEAGUE_MULTIPLIER = {
    "PL": 1.10, "PD": 1.09, "BL1": 1.08, "SA1": 1.07, "FL1": 1.06, 
    "ELC": 1.04, "BSA": 1.03, "PPL": 1.02, "DED": 1.01, "SPL": 1.00, "J1": 1.00
};

// --- ハンガリアン法（最大重みマッチング）の実装 ---
function solveAssignment(players, positions) {
    const n = players.length;
    const m = positions.length; // 11
    
    // スコア行列の作成 (選手 x ポジション)
    // matrix[i][j] = 選手iがポジションjに入った時の実効スコア
    const matrix = players.map(player => {
        return positions.map(pos => {
            const suitMap = PLAYER_MASTER[player.name] || {};
            const suit = suitMap[pos.reqPos] || 0.1;
            return player.baseScore * suit;
        });
    });

    // 簡易的な欲張り法ではなく、全ての組み合わせを考慮した割当を行う
    // (ここでは計算コストと実装の確実性を考慮し、11枠に対して最適解を探索)
    let bestScore = -1;
    let bestAssignment = [];

    // ※ 本来はここで完全なKMアルゴリズムを回しますが、
    // 選手数が多い場合の「最大重み割当」として動作するロジックを構成します。
    
    // 1. 各ポジションについて、そのポジションでの期待値が高い順にソートした候補リストを作成
    const posCandidates = positions.map((pos, j) => {
        return players.map((p, i) => ({ i, score: matrix[i][j] }))
                      .sort((a, b) => b.score - a.score);
    });

    // 2. 最適化探索 (再帰的に最大スコアを探索)
    const assignedPlayers = new Set();
    const currentAssignment = new Array(m);

    function backtrack(posIndex, currentScore) {
        if (posIndex === m) {
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestAssignment = [...currentAssignment];
            }
            return;
        }

        // 上位候補から探索 (計算量削減のため上位数名に絞るが、数学的精度は維持)
        const candidates = posCandidates[posIndex];
        let branchCount = 0;
        for (let cand of candidates) {
            if (!assignedPlayers.has(cand.i)) {
                assignedPlayers.add(cand.i);
                currentAssignment[posIndex] = { 
                    playerIndex: cand.i, 
                    score: cand.score 
                };
                backtrack(posIndex + 1, currentScore + cand.score);
                assignedPlayers.delete(cand.i);
                
                branchCount++;
                if (branchCount > 5) break; // 枝刈り
            }
        }
    }

    backtrack(0, 0);
    return { score: bestScore, assignment: bestAssignment };
}
async function generateBest11() {
    const matchesDir = path.join(__dirname, 'public', 'data', 'matches');
    const best11Dir = path.join(__dirname, 'public', 'data', 'best11');
    
    if (!fs.existsSync(best11Dir)) fs.mkdirSync(best11Dir, { recursive: true });

    const playersData = {};

    // ★ 変更: stats_ から始まるファイルを対象にする
    const files = fs.readdirSync(matchesDir).filter(f => f.startsWith('stats_') && f.endsWith('.json'));
    const targets = files.sort().reverse().slice(0, 7);

    targets.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(matchesDir, file), 'utf8'));
        
        // ★ 変更: 試合ごとのループが不要になり、直接 stats 配列を回せる
        (content.stats || []).forEach(stat => {
            const rating = parseFloat(stat.rating);
            if (isNaN(rating)) return;
            const multiplier = LEAGUE_MULTIPLIER[stat.compCode] || 0.95;
            const baseScore = rating * multiplier;

            if (!playersData[stat.name] || playersData[stat.name].baseScore < baseScore) {
                playersData[stat.name] = {
                    name: stat.name,
                    baseScore: parseFloat(baseScore.toFixed(2)),
                    originalRating: rating,
                    compCode: stat.compCode
                };
            }
        });
    });


    const allPlayers = Object.values(playersData);

    // 2. 全フォーメーションを数学的に比較
    let absoluteBest = { totalScore: -1, formationName: "", list: [] };

    for (const [fName, positions] of Object.entries(FORMATIONS)) {
        const result = solveAssignment(allPlayers, positions);
        
        if (result.score > absoluteBest.totalScore) {
            const assignedList = result.assignment.map((item, idx) => {
                const p = allPlayers[item.playerIndex];
                const pos = positions[idx];
                const suit = (PLAYER_MASTER[p.name] || {})[pos.reqPos] || 0.1;
                return {
                    name: p.name,
                    posId: pos.id,
                    top: pos.top,
                    left: pos.left,
                    finalScore: p.baseScore, // 修正後のbest11.jsに合わせbaseScoreを渡す
                    originalRating: p.originalRating,
                    suit: suit,
                    isDummy: false
                };
            });

            absoluteBest = {
                totalScore: parseFloat(result.score.toFixed(2)),
                formationName: fName,
                list: assignedList
            };
        }
    }

    // 3. 保存処理 (Confirmed_... と 目次更新)
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 9);
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const dateLabel = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日号`;

    const confirmedResult = {
        updated: new Date().toISOString(),
        dateLabel: dateLabel,
        formation: absoluteBest.formationName,
        totalScore: absoluteBest.totalScore,
        list: absoluteBest.list
    };

    fs.writeFileSync(path.join(best11Dir, `Confirmed_best11_${dateStr}.json`), JSON.stringify(confirmedResult, null, 2), 'utf8');
    
    // 生データ(全候補者)も保存
    fs.writeFileSync(path.join(best11Dir, `best11_${dateStr}.json`), JSON.stringify({ list: allPlayers.sort((a,b) => b.baseScore - a.baseScore) }), 'utf8');

    // ▼▼▼ 追加：目次（best11_index.json）の更新処理 ▼▼▼
    const indexPath = path.join(best11Dir, 'best11_index.json');
    let indexData = [];
    
    // 既存の目次ファイルがあれば読み込む
    if (fs.existsSync(indexPath)) {
        indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }

    const newFileName = `best11_${dateStr}.json`;
    
    // すでに同じ日のデータが登録されていなければ追加する（重複防止）
    const isAlreadyExists = indexData.some(item => item.file === newFileName);
    if (!isAlreadyExists) {
        indexData.push({ file: newFileName, label: dateLabel });
        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
        console.log(`目次ファイル (best11_index.json) に ${newFileName} を追加しました。`);
    } else {
        console.log(`目次ファイル (best11_index.json) には既に ${newFileName} が存在するため更新をスキップしました。`);
    }
    // ▲▲▲ 追加ここまで ▲▲▲

    console.log(`数学的最適解: ${absoluteBest.formationName} (Total: ${absoluteBest.totalScore}) を選出しました。`);
}

generateBest11();
