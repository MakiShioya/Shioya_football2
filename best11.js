const container = document.getElementById('formation-nodes');
const select = document.getElementById('edition-select');

async function loadBest11(targetFile = null) {
    try {
        const indexRes = await fetch('data/best11/best11_index.json');
        const indexData = await indexRes.json();
        const reversedIndex = [...indexData].reverse();

        if (select.options[0].value === "") {
            select.innerHTML = reversedIndex.map(i => `<option value="${i.file}">${i.label}</option>`).join('');
            select.onchange = (e) => loadBest11(e.target.value);
        }

        const fileToLoad = targetFile || reversedIndex[0].file;
        const response = await fetch(`data/best11/${fileToLoad}`);
        const data = await response.json();

        let players = data.list;

        // ① 人数が足りない場合は「ダミー選手」で11人になるまで穴埋め
        while (players.length < 11) {
            players.push({
                name: "調整中",
                finalScore: 0, // スコア0なので合計点には影響しない
                isDummy: true
            });
        }

        let bestFormationResult = null;
        let highestTotalScore = -1;

        // ② 全フォーメーションをテストして、最も総合点が高くなるものを探す
        for (const [formationName, positions] of Object.entries(FORMATIONS)) {
            // ビットDPによる最適配置の計算
            const result = solveOptimalAssignment(players, positions);
            
            // これまでの最高得点を更新したら記録を上書き
            if (result.totalScore > highestTotalScore) {
                highestTotalScore = result.totalScore;
                bestFormationResult = {
                    name: formationName,
                    score: result.totalScore,
                    assignment: result.assignment
                };
            }
        }

        // ③ 決定した最強フォーメーションを描画
        renderPitch(bestFormationResult);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; padding: 40px; color:#fff;">データエラーが発生しました。</p>';
    }
}

// ★ B案：ビットDP（動的計画法）を用いた最適配置アルゴリズム
function solveOptimalAssignment(players, positions) {
    const M = 11; // 常に11ポジション
    const N = players.length; // 候補選手数（11人以上のベンチ入りにも対応）

    // スコア行列の作成 matrix[i][j] = 選手iをポジションjに置いたときのスコア
    const matrix = [];
    for (let i = 0; i < N; i++) {
        matrix[i] = [];
        for (let j = 0; j < M; j++) {
            let p = players[i];
            let pos = positions[j];
            let suit = 0;
            
            if (p.isDummy) {
                suit = 0; // ダミー選手はどこに置いても0点
            } else if (PLAYER_MASTER[p.name] && PLAYER_MASTER[p.name][pos.reqPos]) {
                // マスターデータから適性を取得（本職1.0, サブ0.8など）
                suit = PLAYER_MASTER[p.name][pos.reqPos];
            }
            
            // 評価値 × 適性レート
            matrix[i][j] = p.finalScore * suit;
        }
    }

    // dp[mask] = 埋まったポジションがmask(ビット列)のときの最大スコア
    let dp = new Array(1 << M).fill(-1);
    let history = Array.from({length: N + 1}, () => new Array(1 << M).fill(null));
    dp[0] = 0;

    for (let i = 0; i < N; i++) {
        let nextDp = [...dp]; 
        for (let mask = 0; mask < (1 << M); mask++) {
            if (dp[mask] === -1) continue;
            
            // 選手iを「どこにも起用しない」場合の履歴
            history[i + 1][mask] = { prevMask: mask, pos: -1 };

            // 選手iを空いているポジションjに起用する場合
            for (let j = 0; j < M; j++) {
                if (!((mask >> j) & 1)) { // ポジションjがまだ空いているかチェック
                    let nextMask = mask | (1 << j);
                    let score = dp[mask] + matrix[i][j];
                    if (score > nextDp[nextMask]) {
                        nextDp[nextMask] = score;
                        history[i + 1][nextMask] = { prevMask: mask, pos: j }; // 記録
                    }
                }
            }
        }
        dp = nextDp;
    }

    // 復元処理（最大スコアを叩き出した組み合わせを逆算して割り出す）
    let currMask = (1 << M) - 1;
    let assignment = [];
    for (let i = N; i > 0; i--) {
        let rec = history[i][currMask];
        if (rec && rec.pos !== -1) {
            assignment.push({ 
                player: players[i - 1], 
                posInfo: positions[rec.pos] 
            });
        }
        currMask = rec ? rec.prevMask : currMask;
    }

    return { totalScore: dp[(1 << M) - 1], assignment };
}

// ピッチへの描画処理
function renderPitch(bestFormation) {
    // タイトルに採用されたフォーメーション名を付記
    document.querySelector('.top-bar h1').innerText = `今週の日本代表 (${bestFormation.name})`;

    container.innerHTML = bestFormation.assignment.map(item => {
        const p = item.player;
        const pos = item.posInfo;
        const ratingRounded = p.isDummy ? "-" : p.finalScore.toFixed(1);
        
        // ダミー選手はアイコンをグレーアウトする
        const iconStyle = p.isDummy ? "background: #555; border-color: #333;" : "";

        return `
            <div class="player-node" style="top: ${pos.top}%; left: ${pos.left}%;">
                <div class="rating-icon" style="${iconStyle}">${ratingRounded}</div>
                <div class="player-name-label">${p.name}</div>
            </div>
        `;
    }).join('');
}

window.addEventListener('DOMContentLoaded', () => loadBest11());
