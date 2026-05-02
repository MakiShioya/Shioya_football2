async function loadBest11() {
    const container = document.getElementById('best11-list');

    try {
        // バックエンドで確定させたファイルを読み込む
        const response = await fetch('data/best11.json');
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();

        container.innerHTML = data.list.map((p, index) => {
            let events = [];
            if (p.goals > 0) events.push(`⚽${p.goals}`);
            if (p.assists > 0) events.push(`🅰️${p.assists}`);
            const eventStr = events.length > 0 ? `<span style="color: #d35400; font-weight: bold; margin-left: 5px;">${events.join(' ')}</span>` : '';

            return `
                <div class="player-card">
                    <div class="rank-badge">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${p.name} ${eventStr}</div>
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
        container.innerHTML = '<p style="text-align:center; padding: 40px;">毎週火曜日3:00に更新されます。<br>初回更新までお待ちください。</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadBest11);
