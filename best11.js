async function loadBest11(targetFile = null) {
    const container = document.getElementById('best11-list');
    const select = document.getElementById('edition-select');

    try {
        // 目次ファイルを読み込む
        const indexRes = await fetch('data/best11_index.json');
        const indexData = await indexRes.json();
        const reversedIndex = indexData.reverse(); // 新しい順に並び替え

        // プルダウンの更新（初回のみ）
        if (select.options[0].value === "") {
            select.innerHTML = reversedIndex.map(i => `<option value="${i.file}">${i.label}</option>`).join('');
            select.onchange = (e) => loadBest11(e.target.value);
        }

        // 表示するファイルを決定（引数がない場合は最新のファイル）
        const fileToLoad = targetFile || reversedIndex[0].file;

        const response = await fetch(`data/${fileToLoad}`);
        const data = await response.json();

        container.innerHTML = data.list.map((p, index) => {
            let events = [];
            if (p.goals > 0) events.push(`⚽${p.goals}`);
            if (p.assists > 0) events.push(`🅰️${p.assists}`);
            return `
                <div class="player-card">
                    <div class="rank-badge">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${p.name} ${events.join(' ')}</div>
                        <div class="match-context">${p.compCode}リーグ / ${p.minutes}分出場</div>
                    </div>
                    <div class="score-box">
                        <div class="final-score">${p.finalScore.toFixed(2)}</div>
                        <div class="original-rating">元評点: ${p.originalRating}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">データがまだありません。火曜日の更新をお待ちください。</p>';
    }
}

window.addEventListener('DOMContentLoaded', () => loadBest11());
