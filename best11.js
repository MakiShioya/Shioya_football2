// ★リーグ係数の設定（ここで自由にバランス調整が可能です）
const LEAGUE_MULTIPLIER = {
    "PL": 1.20,
    "PD": 1.15, "BL1": 1.15, "SA1": 1.15,
    "FL1": 1.10,
    "PPL": 1.00, "DED": 1.00, "BSA": 1.00, "ELC": 1.00
};

// 過去7日分の日付文字列(YYYYMMDD)の配列を取得する関数
function getLast7DaysDates() {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setUTCHours(d.getUTCHours() + 9); // JST
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dates.push(`${y}${m}${day}`);
    }
    return dates;
}

async function loadBest11() {
    const container = document.getElementById('best11-list');
    const dates = getLast7DaysDates();
    const playersData = {}; // 選手ごとの最高スコアを保持するオブジェクト

    // 過去7日分のJSONをまとめて取得
    await Promise.all(dates.map(async (dateStr) => {
        try {
            const response = await fetch(`data/matches_${dateStr}.json`);
            if (!response.ok) return; // ファイルがない（未来の日付など）場合はスキップ
            const data = await response.json();
            
            data.response.matches.forEach(match => {
                if (!match.japaneseStats || match.japaneseStats.length === 0) return;
                
                const compCode = match.competition.code;
                const multiplier = LEAGUE_MULTIPLIER[compCode] || 0.95; // 未定義リーグは0.95

                match.japaneseStats.forEach(stat => {
                    const originalRating = parseFloat(stat.rating);
                    if (isNaN(originalRating)) return; // 評点が「-」などの場合は除外

                    // 係数を掛けて最終スコアを算出
                    const finalScore = originalRating * multiplier;

                    // 既にデータがあり、今回のスコアの方が低ければ何もしない（週内の最高スコアを採用）
                    if (playersData[stat.name] && playersData[stat.name].finalScore >= finalScore) return;

                    playersData[stat.name] = {
                        name: stat.name,
                        originalRating: originalRating.toFixed(2),
                        finalScore: finalScore,
                        multiplier: multiplier,
                        compCode: compCode,
                        opponent: match.homeTeam.name === stat.team ? match.awayTeam.name : match.homeTeam.name,
                        goals: stat.goals,
                        assists: stat.assists,
                        minutes: stat.minutes
                    };
                });
            });
        } catch (error) {
            console.log(`${dateStr}のデータ読み込みをスキップしました`);
        }
    }));

    // オブジェクトを配列に変換し、finalScoreの降順（高い順）に並び替え
    const rankedPlayers = Object.values(playersData).sort((a, b) => b.finalScore - a.finalScore);

    // 上位11名を抽出
    const best11 = rankedPlayers.slice(0, 11);

    if (best11.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">集計可能なデータがありません。<br>（データ蓄積まで数日お待ちください）</p>';
        return;
    }

    // HTMLの生成
    container.innerHTML = best11.map((p, index) => {
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
}

window.addEventListener('DOMContentLoaded', loadBest11);
