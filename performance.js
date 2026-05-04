async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    // 日付の基準を app.js と統一する
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 6); 
    targetDate.setDate(targetDate.getDate() - 1);   
    
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        const cacheBuster = new Date().getTime();
        
        // ★ 修正：matches と stats の両方のファイルを同時に取得する
        const [matchesRes, statsRes] = await Promise.all([
            fetch(`data/matches/matches_${dateStr}.json?t=${cacheBuster}`),
            fetch(`data/matches/stats_${dateStr}.json?t=${cacheBuster}`)
        ]);
        
        // 試合データ自体がない場合
        if (!matchesRes.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日の詳細データはまだ生成されていません。</p>';
            return;
        }

        // 日本人スタッツのファイルがない（誰も出場しなかった）場合
        if (!statsRes.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        const matchesData = await matchesRes.json();
        const statsData = await statsRes.json();

        const matchesList = matchesData.response.matches || [];
        const statsList = statsData.stats || [];

        if (statsList.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。</p>';
            return;
        }

        // ★ 修正：取得した stats を fixtureId ごとにグループ化する
        const statsByFixture = {};
        statsList.forEach(s => {
            if (!statsByFixture[s.fixtureId]) {
                statsByFixture[s.fixtureId] = [];
            }
            statsByFixture[s.fixtureId].push(s);
        });

        // スタッツが存在する試合だけを抽出
        const matchesWithStats = matchesList.filter(m => statsByFixture[m.fixtureId]);

        container.innerHTML = matchesWithStats.map(match => {
            // その試合に紐づく日本人スタッツを取得
            const matchStats = statsByFixture[match.fixtureId];
            
            const statsContent = matchStats.map(s => {
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
