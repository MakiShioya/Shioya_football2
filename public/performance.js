let NAME_TO_ID_MAP = {}; // 名前からIDを引くための辞書

async function loadPerformance() {
    const container = document.getElementById('performance-list');
    
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 6); 
    targetDate.setDate(targetDate.getDate() - 1);   
    
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    try {
        const cacheBuster = new Date().getTime();
        
        // 1. 選手名簿とデータを並列で取得
        const [dictRes, matchesRes, statsRes] = await Promise.all([
            fetch(`https://football.shioya-soft.com/japanese_players.json?t=${cacheBuster}`),
            fetch(`https://football.shioya-soft.com/data/matches/matches_${dateStr}.json?t=${cacheBuster}`),
            fetch(`https://football.shioya-soft.com/data/matches/stats_${dateStr}.json?t=${cacheBuster}`)
        ]);

        // 【修正ポイント】辞書の作成（変数のタイポを修正しました）
        if (dictRes.ok) {
            const rawDict = await dictRes.json();
            for (const team in rawDict) {
                // ここが rawDict になっている必要があります
                for (const [id, pInfo] of Object.entries(rawDict[team])) {
                    NAME_TO_ID_MAP[pInfo.full] = id;
                    NAME_TO_ID_MAP[pInfo.short] = id;
                }
            }
        }
        
        if (!statsRes.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがなかったか、定期メンテナンス中です。（6:00~9:00）毎日朝9時に更新されます。</p>';
            return;
        }

        const statsData = await statsRes.json();
        const statsList = statsData.stats || [];

        if (statsList.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px;">昨日は日本人の出場データがなかったか、定期メンテナンス中です。（6:00~9:00）毎日朝9時に更新されます。</p>';
            return;
        }

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

            // 判定：この試合に最推し選手が含まれているか？
            const hasFavorite = item.players.some(s => {
                const pId = NAME_TO_ID_MAP[s.name];
                return pId && pId === window.currentFavoriteId;
            });
            
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
                
                // 個別の選手行の判定
                const pId = NAME_TO_ID_MAP[s.name];
                const isFav = pId && pId === window.currentFavoriteId;
                const shineClass = isFav ? 'favorite-shine' : '';

                return `
                    <div class="player-row ${shineClass}">
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
                <div class="report-card ${hasFavorite ? 'favorite-match-border' : ''}">
                    ${matchHeader}
                    ${playersHtml}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Fatal Error:", error);
        container.innerHTML = '<p style="text-align:center; color: red; padding: 20px;">データの表示中にエラーが発生しました。</p>';
    }
}

// 起動処理
window.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        setTimeout(() => {
            loadPerformance();
        }, 500);
    });
});