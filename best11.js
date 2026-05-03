const container = document.getElementById('formation-nodes');
const select = document.getElementById('edition-select');

async function loadBest11(targetFile = null) {
    try {
        // 目次ファイルの読み込み
        const indexRes = await fetch('data/best11/best11_index.json');
        const indexData = await indexRes.json();
        const reversedIndex = [...indexData].reverse();

        // プルダウンの更新（初回のみ）
        if (select.options[0].value === "") {
            select.innerHTML = reversedIndex.map(i => `<option value="${i.file}">${i.label}</option>`).join('');
            select.onchange = (e) => loadBest11(e.target.value);
        }

        // 読み込むベースファイルを決定
        const baseFile = targetFile || reversedIndex[0].file;
        
        // ★ 確定版（Confirmed_）ファイルを読み込む
        const confirmedFile = `Confirmed_${baseFile}`;
        const response = await fetch(`data/best11/${confirmedFile}`);
        const data = await response.json();

        // タイトルに採用されたフォーメーション名と合計スコアを付記
        document.querySelector('.top-bar h1').innerText = `今週の日本代表 (${data.formation})`;
        
        // ピッチへの配置描画
        container.innerHTML = data.list.map(p => {
            const ratingDisplay = p.isDummy ? "-" : p.finalScore.toFixed(1);
            
            // ダミー選手はアイコンをグレーアウトする
            const iconStyle = p.isDummy ? "background: #555; border-color: #333;" : "";

            return `
                <div class="player-node" style="top: ${p.top}%; left: ${p.left}%;">
                    <div class="rating-icon" style="${iconStyle}">${ratingDisplay}</div>
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
