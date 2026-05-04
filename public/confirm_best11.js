const fs = require('fs');
const path = require('path');
const { PLAYER_MASTER } = require('./player_master.js');
const { FORMATIONS } = require('./formations.js');

function confirmBest11(fileName) {
    const best11Dir = path.join(__dirname, 'data', 'best11');
    const inputPath = path.join(best11Dir, fileName);
    
    if (!fs.existsSync(inputPath)) return;

    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    let players = data.list;

    // 11人に満たない場合はダミーを追加
    while (players.length < 11) {
        players.push({ name: "調整中", finalScore: 0, isDummy: true });
    }

    let bestFormationResult = null;
    let highestTotalScore = -1;

    // 全フォーメーションをテスト
    for (const [formationName, positions] of Object.entries(FORMATIONS)) {
        const result = solveOptimalAssignment(players, positions);
        if (result.totalScore > highestTotalScore) {
            highestTotalScore = result.totalScore;
            bestFormationResult = { name: formationName, totalScore: result.totalScore, assignment: result.assignment };
        }
    }

    // 確定版データの構築
    const confirmedResult = {
        updated: new Date().toISOString(),
        dateLabel: data.dateLabel,
        formation: bestFormationResult.name,
        // ▼ 修正: bestFormationResult.score -> bestFormationResult.totalScore
        totalScore: parseFloat(bestFormationResult.totalScore.toFixed(2)),
        list: bestFormationResult.assignment.map(item => {
            const p = item.player;
            const pos = item.posInfo;
            const suit = (!p.isDummy && PLAYER_MASTER[p.name]) ? (PLAYER_MASTER[p.name][pos.reqPos] || 0.1) : 0;
            
            return {
                name: p.name,
                posId: pos.id,
                top: pos.top,
                left: pos.left,
                finalScore: p.finalScore || 0, // リーグ倍率適用後
                originalRating: p.originalRating || 0,
                suit: suit, // ポジション適性倍率
                isDummy: p.isDummy || false
            };
        })
    };

    const confirmedFileName = `Confirmed_${fileName}`;
    fs.writeFileSync(path.join(best11Dir, confirmedFileName), JSON.stringify(confirmedResult), 'utf8');
    return confirmedFileName;
}

// ビットDPアルゴリズム（ロジックは以前と同じ）
function solveOptimalAssignment(players, positions) {
    const M = 11;
    const N = players.length;
    const matrix = Array.from({length: N}, () => new Array(M).fill(0));

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            let p = players[i];
            let pos = positions[j];
            let suit = (!p.isDummy && PLAYER_MASTER[p.name]) ? (PLAYER_MASTER[p.name][pos.reqPos] || 0.1) : 0;
            matrix[i][j] = (p.finalScore || 0) * suit;
        }
    }

    let dp = new Array(1 << M).fill(-1);
    let history = Array.from({length: N + 1}, () => new Array(1 << M).fill(null));
    dp[0] = 0;

    for (let i = 0; i < N; i++) {
        let nextDp = [...dp];
        for (let mask = 0; mask < (1 << M); mask++) {
            if (dp[mask] === -1) continue;
            history[i + 1][mask] = { prevMask: mask, pos: -1 };
            for (let j = 0; j < M; j++) {
                if (!((mask >> j) & 1)) {
                    let nextMask = mask | (1 << j);
                    let score = dp[mask] + matrix[i][j];
                    if (score > nextDp[nextMask]) {
                        nextDp[nextMask] = score;
                        history[i + 1][nextMask] = { prevMask: mask, pos: j };
                    }
                }
            }
        }
        dp = nextDp;
    }

    let currMask = (1 << M) - 1;
    let assignment = [];
    for (let i = N; i > 0; i--) {
        let rec = history[i][currMask];
        if (rec && rec.pos !== -1) {
            assignment.push({ player: players[i - 1], posInfo: positions[rec.pos] });
        }
        currMask = rec ? rec.prevMask : currMask;
    }
    return { score: dp[(1 << M) - 1], totalScore: dp[(1 << M) - 1], assignment };
}

// ▼ 変更：GitHub Actions 等から `node confirm_best11.js` と単独で呼ばれた時の処理 ▼
if (require.main === module) {
    const indexFilePath = path.join(__dirname, 'data', 'best11', 'best11_index.json');
    
    if (fs.existsSync(indexFilePath)) {
        const indexData = JSON.parse(fs.readFileSync(indexFilePath, 'utf8'));
        
        if (indexData.length > 0) {
            // generate_best11.js が目次の最後に追加したファイル名を取得
            const latestFile = indexData[indexData.length - 1].file;
            console.log(`最新の候補ファイル [${latestFile}] を検出しました。確定処理を開始します...`);
            
            const confirmedFileName = confirmBest11(latestFile);
            console.log(`✅ 確定完了: ${confirmedFileName} を保存しました。`);
        } else {
            console.log("best11_index.json に記録がありません。");
        }
    } else {
        console.log("best11_index.json が見つかりません。");
    }
}

module.exports = { confirmBest11 };
