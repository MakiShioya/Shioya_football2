async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    // app.js と全く同じ計算方法にする
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 6); 
    // ★ 昨日のデータを見たいので、ここから1日引く
    targetDate.setDate(targetDate.getDate() - 1); 
    
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        const cacheBuster = new Date().getTime();
        
        // ★ 絶対URLに戻す（app.jsと同じ形式）
        const matchesUrl = `https://football.shioya-soft.com/data/matches/matches_${dateStr}.json?t=${cacheBuster}`;
        const statsUrl = `https://football.shioya-soft.com/data/matches/stats_${dateStr}.json?t=${cacheBuster}`;

        const [matchesRes, statsRes] = await Promise.all([
            fetch(matchesUrl),
            fetch(statsUrl)
        ]);
        
        console.log("3. StatsのHTTPステータス:", statsRes.status, "取得成功フラグ:", statsRes.ok);

        if (!statsRes.ok) {
            console.log("【結果】ファイルが取得できませんでした（分岐Aに到達）");
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。（詳細：ファイル取得失敗）</p>';
            return;
        }

        const statsData = await statsRes.json();
        const statsList = statsData.stats || [];

        console.log("4. 取得したStatsの配列の中身:", statsList);

        if (statsList.length === 0) {
            console.log("【結果】ファイルは取得できましたが中身が空です（分岐Bに到達）");
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがありませんでした。（詳細：配列が0件）</p>';
            return;
        }

        // 以降は正常な場合の描画処理
        let matchesMap = {};
        if (matchesRes.ok) {
            const matchesData = await matchesRes.json();
            const rawMatches = matchesData.response.matches || matchesData.response || [];
            rawMatches.forEach(m => {
                matchesMap[m.fixtureId || m.fixture?.id] = m;
            });
        }

        const reportByMatch = {};
        statsList.forEach(s => {
            if (!reportByMatch[s.fixtureId]) {
                reportByMatch[s.fixtureId] = { info: matchesMap[s.fixtureId] || null, players: [] };
            }
            reportByMatch[s.fixtureId].players.push(s);
        });

        container.innerHTML = Object.keys(reportByMatch).map(fId => {
            const item = reportByMatch[fId];
            const match = item.info;
            
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

            return `<div class="report-card">${matchHeader}${playersHtml}</div>`;
        }).join('');

        console.log("【結果】描画処理まで正常に完了しました");

    } catch (error) {
        console.error("Fatal Error:", error);
        container.innerHTML = '<p style="text-align:center; color: red;">データの表示中にエラーが発生しました。</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadPerformance);
