async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    // ★ 修正1：日付の基準を app.js と統一する（午前6時切り替え）
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 6); // 現在時刻から6時間引く
    targetDate.setDate(targetDate.getDate() - 1);   // その基準から見て「昨日」にする
    
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        // ★ 修正2：キャッシュバスターを追加して常に最新データを強制取得
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data/matches/matches_${dateStr}.json?t=${cacheBuster}`);
        
        if (!response.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日の詳細データはまだ生成されていません。</p>';
            return;
        }

        const data = await response.json();
        const matchesWithStats = data.response.matches.filter(m => m.japaneseStats && m.japaneseStats.length > 0);

        if (matchesWithStats.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        container.innerHTML = matchesWithStats.map(match => {
            const statsContent = match.japaneseStats.map(s => {
                const events = [];
                if (s.goals > 0) events.push(`<span class="event-badge">⚽${s.goals}G</span>`);
                if (s.assists > 0) events.push(`<span class="event-badge">🅰️${s.assists}A</span>`);
                
                return `
                    <div class="player-row">
                        <div class="player-header">
                            <span class="player-name">🇯🇵 ${s.name}</span>
                            <span class="rating-badge">評点: ${s.rating}</span>
                        </div>
                        <div class="stat-details">
                            ${s.starter ? 'スタメン' : '途中出場'} / ${s.minutes}分出場 ${events.join(' ')}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="report-card">
                    <div class="match-info">
                        <span>${match.homeTeam.name} vs ${match.awayTeam.name}</span>
                        <span>スコア: ${match.score.fullTime.home} - ${match.score.fullTime.away}</span>
                    </div>
                    ${statsContent}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; color: red;">データの読み込みに失敗しました。</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadPerformance);
