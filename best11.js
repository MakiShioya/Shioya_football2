const container = document.getElementById('formation-nodes');
const select = document.getElementById('edition-select');

// 評点に応じたCSSクラスを返すヘルパー関数
function getRankClass(score, isDummy) {
    if (isDummy) return 'rank-grey';
    if (score >= 10) return 'rank-rainbow'; // 10点以上：虹色の星
    if (score >= 9)  return 'rank-orange';  // 9点以上：オレンジ
    if (score >= 8)  return 'rank-purple';  // 8点以上：紫
    if (score >= 7)  return 'rank-blue';    // 7点以上：青
    if (score >= 6)  return 'rank-green';   // 6点以上：緑
    return 'rank-grey';                     // それ未満：灰色
}

async function loadBest11(targetFile = null) {
    try {
        const indexRes = await fetch('data/best11/best11_index.json');
        const indexData = await indexRes.json();
        const reversedIndex = [...indexData].reverse();

        if (select.options[0].value === "") {
            select.innerHTML = reversedIndex.map(i => `<option value="${i.file}">${i.label}</option>`).join('');
            select.onchange = (e) => loadBest11(e.target.value);
        }

        const baseFile = targetFile || reversedIndex[0].file;
        const confirmedFile = `Confirmed_${baseFile}`;
        const response = await fetch(`data/best11/${confirmedFile}`);
        const data = await response.json();

        document.querySelector('.top-bar h1').innerText = `今週の日本代表 (${data.formation})`;
        
        container.innerHTML = data.list.map(p => {
            const ratingDisplay = p.isDummy ? "-" : p.finalScore.toFixed(1);
            
            // ★ スコアに応じたクラスを決定
            const rankClass = getRankClass(p.finalScore, p.isDummy);

            return `
                <div class="player-node" style="top: ${p.top}%; left: ${p.left}%;">
                    <!-- rankClass をクラスリストに追加 -->
                    <div class="rating-icon ${rankClass}">${ratingDisplay}</div>
                    <div class="player-name-label">${p.name}</div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; padding: 40px; color:#fff;">データ集計中です。火曜日の更新をお待ちください。</p>';
    }
}

window.addEventListener('DOMContentLoaded', () => loadBest11());
