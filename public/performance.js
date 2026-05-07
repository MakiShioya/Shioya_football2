async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    // 日付計算（変更なし）
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 6); 
    targetDate.setDate(targetDate.getDate() - 1);   
    
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        const cacheBuster = new Date().getTime();
        
        // データの取得
        const [matchesRes, statsRes] = await Promise.all([
            fetch(`https://football.shioya-soft.com/data/matches/matches_${dateStr}.json?t=${cacheBuster}`),
            fetch(`https://football.shioya-soft.com/data/matches/stats_${dateStr}.json?t=${cacheBuster}`)
        ]);
        
        if (!statsRes.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        const statsData = await statsRes.json();
        const statsList = statsData.stats || [];

        if (statsList.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        // 試合データの読み込み（失敗しても続行できるようにする）
        let matchesMap = {};
        if (matchesRes.ok) {
            const matchesData = await matchesRes.json();
            // APIの構造に合わせて調整（.response.matches か .response 直下か）
            const rawMatches = matchesData.response.matches || matchesData.response || [];
            rawMatches.forEach(m => {
                matchesMap[m.fixtureId || m.fixture?.id] = m;
            });
        }

        // ★ ロジック変更：statsList（日本人）をベースにHTMLを生成する
        // 試合ごとにまとめたいので、一旦整理
        const reportByMatch = {};
        statsList.forEach(s => {
            if (!reportByMatch[s.fixtureId]) {
                reportByMatch[s.fixtureId] = {
                    info: matchesMap[s.fixtureId] || null,
                    players: []
                };
            }
            reportByMatch[s.fixtureId].players.push(s);
        });

        container.innerHTML = Object.keys(reportByMatch).map(fId => {
            const item = reportByMatch[fId];
            const match = item.info;
            
            // 試合情報（取得できていれば表示、なければIDのみ）
            const matchHeader = match ? `
                <div class="match-info">
                    <span>${match.homeTeam?.name || match.teams?.home?.name || 'Home'} vs ${match.awayTeam?.name || match.teams?.away?.name || 'Away'}</span>
                    <span>スコア: ${match.score?.fullTime?.home ?? '-'} - ${match.score?.fullTime?.away ?? '-'}</span>
                </div>
            ` : `<div class="match-info">試合情報取得中 (ID: ${fId})</div>`;

            const playersHtml = item.players.map(s => {
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
                    ${matchHeader}
                    ${playersHtml}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Fatal Error:", error);
        container.innerHTML = '<p style="text-align:center; color: red;">データの表示中にエラーが発生しました。</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadPerformance);