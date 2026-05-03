const container = document.getElementById('formation-nodes');
const select = document.getElementById('edition-select');
let currentWeeklyData = []; // 詳細表示用にデータを保持

function getRankClass(score, isDummy) {
    if (isDummy) return 'rank-grey';
    if (score >= 10) return 'rank-rainbow';
    if (score >= 9)  return 'rank-orange';
    if (score >= 8)  return 'rank-purple';
    if (score >= 7)  return 'rank-blue';
    if (score >= 6)  return 'rank-green';
    return 'rank-grey';
}

// loadBest11 関数内をアップデート
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
        
        // 1. 確定版と生データの両方をフェッチ
        const [confirmedRes, rawRes] = await Promise.all([
            fetch(`data/best11/Confirmed_${baseFile}`),
            fetch(`data/best11/${baseFile}`)
        ]);

        const data = await confirmedRes.json();
        const rawPlayers = await rawRes.json();
        
        currentWeeklyData = data.list;

        // ピッチの描画
        document.querySelector('.top-bar h1').innerText = `今週の日本代表 (${data.formation})`;
        container.innerHTML = data.list.map((p, index) => {
            const ratingDisplay = p.isDummy ? "-" : p.finalScore.toFixed(1);
            const rankClass = getRankClass(p.finalScore, p.isDummy);
            return `
                <div class="player-node" style="top: ${p.top}%; left: ${p.left}%;" onclick="showPlayerDetail(${index})">
                    <div class="rating-icon ${rankClass}">${ratingDisplay}</div>
                    <div class="player-name-label">${p.name}</div>
                </div>
            `;
        }).join('');

        // 2. サブメンバー（選外の高得点者）を特定
        const starterNames = data.list.map(s => s.name);
        const subMembers = rawPlayers
            .filter(p => !starterNames.includes(p.name)) // スタメンにいない
            .sort((a, b) => b.finalScore - a.finalScore) // スコア順
            .slice(0, 7); // 上位7人（ベンチ枠）

        // 3. リストにサブメンバーを描画
        listContainer.innerHTML = `
            <div class="sub-members-section">
                <div class="sub-members-title">控え選手 (サブメンバー)</div>
                <div class="sub-list">
                    ${subMembers.map(m => `
                        <div class="sub-item">
                            ${m.name} <span class="sub-rating">${m.finalScore.toFixed(1)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; padding: 40px; color:#fff;">データ集計中です。</p>';
        listContainer.innerHTML = '';
    }
}

// 選手詳細ポップアップを表示する
function showPlayerDetail(index) {
    const p = currentWeeklyData[index];
    if (p.isDummy) return;

    const modal = document.getElementById('playerDetailModal');
    const content = document.getElementById('player-detail-body');

    // リーグ係数を逆算 (finalScore = originalRating * leagueMultiplier)
    const leagueMult = (p.finalScore / p.originalRating).toFixed(2);
    // 総合評価点 (finalScore * suit)
    const totalEval = (p.finalScore * p.suit).toFixed(2);

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-name">${p.name}</div>
            <div style="font-size: 0.9rem; color: #8b4513;">総合評価点</div>
            <div class="total-score-box">${totalEval}</div>
        </div>
        <table class="score-table">
            <tr><th>元の評価点</th><td>${p.originalRating.toFixed(2)}</td></tr>
            <tr><th>リーグ係数</th><td>× ${leagueMult}</td></tr>
            <tr><th>ポジション係数</th><td>× ${p.suit.toFixed(2)}</td></tr>
        </table>
        <p style="font-size: 0.8rem; color: #666; margin-top: 15px; text-align: center;">
            ※リーグ係数は所属リーグのレベルに応じて適用されます。<br>
            ※ポジション係数は各ポジションへの適性を示します。
        </p>
    `;

    modal.style.display = 'flex';
}

function closePlayerDetailModal() {
    document.getElementById('playerDetailModal').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => loadBest11());
