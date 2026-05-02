async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    // 1. 「昨日」の日付文字列を作成 (YYYYMMDD)
    const yesterday = new Date();
    yesterday.setUTCHours(yesterday.getUTCHours() + 9); // JST
    yesterday.setDate(yesterday.getDate() - 1);
    
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, '0');
    const d = String(yesterday.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        // ★ 修正箇所：パスを `data/` から `data/matches/` に変更
        const response = await fetch(`data/matches/matches_${dateStr}.json`);
        
        if (!response.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日の詳細データはまだ生成されていません。</p>';
            return;
        }

        const data = await response.json();
        // 2. 日本人スタッツがある試合だけをフィルタリング
        const matchesWithStats = data.response.matches.filter(m => m.japaneseStats && m.japaneseStats.length > 0);

        if (matchesWithStats.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        // 3. HTMLの生成
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
