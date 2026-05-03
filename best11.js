const container = document.getElementById('formation-nodes');
const select = document.getElementById('edition-select');
let currentWeeklyData = []; 

function getRankClass(score, isDummy) {
    if (isDummy) return 'rank-grey';
    if (score >= 10) return 'rank-rainbow';
    if (score >= 9)  return 'rank-orange';
    if (score >= 8)  return 'rank-purple';
    if (score >= 7)  return 'rank-blue';
    if (score >= 6)  return 'rank-green';
    return 'rank-grey';
}

async function loadBest11(targetFile = null) {
    const listContainer = document.getElementById('best11-list');
    try {
        const indexRes = await fetch('data/best11/best11_index.json');
        const indexData = await indexRes.json();
        const reversedIndex = [...indexData].reverse();

        if (select.options[0].value === "") {
            select.innerHTML = reversedIndex.map(i => `<option value="${i.file}">${i.label}</option>`).join('');
            select.onchange = (e) => loadBest11(e.target.value);
        }

        const baseFile = targetFile || reversedIndex[0].file;
        
        const [confirmedRes, rawRes] = await Promise.all([
            fetch(`data/best11/Confirmed_${baseFile}`),
            fetch(`data/best11/${baseFile}`)
        ]);

        const data = await confirmedRes.json();
        const rawPlayersObj = await rawRes.json();
        
        const starterNames = data.list.map(s => s.name);
        const subMembers = (rawPlayersObj.list || [])
            .filter(p => !starterNames.includes(p.name) && !p.isDummy)
            .sort((a, b) => b.finalScore - a.finalScore)
            .slice(0, 7);

        currentWeeklyData = [...data.list, ...subMembers];

        // 1. ピッチ（スタメン）の描画
        document.querySelector('.top-bar h1').innerText = `今週の日本代表 (${data.formation})`;
        container.innerHTML = data.list.map((p, index) => {
            // ★ ポジション係数を反映した最終スコアを計算
            const displayScore = p.isDummy ? 0 : p.finalScore * (p.suit || 1.0);
            const ratingDisplay = p.isDummy ? "-" : displayScore.toFixed(1);
            const rankClass = getRankClass(displayScore, p.isDummy); // 色判定も補正後で行う

            return `
                <div class="player-node" style="top: ${p.top}%; left: ${p.left}%;" onclick="showPlayerDetail(${index})">
                    <div class="rating-icon ${rankClass}">${ratingDisplay}</div>
                    <div class="player-name-label">${p.name}</div>
                </div>
            `;
        }).join('');

        // 2. 控え選手リストの描画
        if (subMembers.length > 0) {
            listContainer.innerHTML = `
                <div class="sub-members-section">
                    <div class="sub-members-title">控え選手 (ベンチ入り)</div>
                    <div class="sub-list">
                        ${subMembers.map((m, i) => {
                            // 控えも同様に計算（控えは基本的にsuit=1.0）
                            const displayScore = m.finalScore * (m.suit || 1.0);
                            const rankClass = getRankClass(displayScore, false);
                            const globalIndex = data.list.length + i;
                            
                            return `
                                <div class="sub-item" onclick="showPlayerDetail(${globalIndex})">
                                    ${m.name} <span class="sub-rating ${rankClass}">${displayScore.toFixed(1)}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            listContainer.innerHTML = '';
        }

    } catch (error) {
        console.error("表示エラー:", error);
        container.innerHTML = '<p style="text-align:center; padding: 40px; color:#fff;">データ集計中です。</p>';
        listContainer.innerHTML = ''; 
    }
}

function showPlayerDetail(index) {
    const p = currentWeeklyData[index];
    if (!p || p.isDummy) return;

    const modal = document.getElementById('playerDetailModal');
    const content = document.getElementById('player-detail-body');

    const suitVal = p.suit || 1.0;
    const leagueMult = (p.finalScore / p.originalRating).toFixed(2);
    // 表示用スコアと一致させるため1.0桁で計算
    const totalEval = (p.finalScore * suitVal).toFixed(1);

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-name">${p.name}</div>
            <div style="font-size: 0.9rem; color: #8b4513;">総合評価点</div>
            <div class="total-score-box">${totalEval}</div>
        </div>
        <table class="score-table">
            <tr><th>元の評価点</th><td>${p.originalRating.toFixed(2)}</td></tr>
            <tr><th>リーグ係数</th><td>× ${leagueMult}</td></tr>
            <tr><th>ポジション係数</th><td>× ${suitVal.toFixed(2)}</td></tr>
        </table>
        <p style="font-size: 0.8rem; color: #666; margin-top: 15px; text-align: center;">
            ※リーグ係数は所属リーグのレベルに応じて適用されます。<br>
            ※ポジション係数は選出ポジションへの適性を示します。
        </p>
    `;
    modal.style.display = 'flex';
}

function closePlayerDetailModal() {
    document.getElementById('playerDetailModal').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => loadBest11());
