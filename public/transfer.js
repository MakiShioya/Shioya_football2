// 移籍情報のマスターデータ
const MOCK_DATA = [
    {
        player: "守田英正",
        status: "噂",
        lastUpdated: "2026/05/08 09:00",
        clubs: [
            { name: "リーズ", league: "プレミア" }
        ]
    },
    {
        player: "上田綺世",
        status: "噂",
        lastUpdated: "2026/05/08 09:00",
        clubs: [
            { name: "トッテナム", league: "プレミア" },
            { name: "ブライトン", league: "プレミア" },
            { name: "エヴァートン", league: "プレミア" },
            { name: "リーズ", league: "プレミア" }
        ]
    }
];

function renderTransfers() {
    const container = document.getElementById('transfer-list');
    const statusFilter = document.getElementById('status-filter').value;
    const leagueFilter = document.getElementById('league-filter').value;

    const filtered = MOCK_DATA.filter(data => {
        // ステータスの絞り込み
        if (statusFilter !== "all" && data.status !== statusFilter) {
            return false;
        }

        // リーグの絞り込み（clubs配列の中に、選択されたリーグが1つでも含まれていればOK）
        if (leagueFilter !== "all") {
            const hasTargetLeague = data.clubs.some(club => club.league === leagueFilter);
            if (!hasTargetLeague) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px; color: #ECDBBF;">該当する移籍情報はありません。</p>';
        return;
    }

    container.innerHTML = filtered.map(data => {
        // ステータスによるCSSクラスの切り替え
        const cardClass = data.status === "確定" ? "status-confirmed" : "status-rumor";
        const badgeClass = data.status === "確定" ? "badge-confirmed" : "badge-rumor";

        // クラブのリストを生成
        const clubsHtml = data.clubs.map(club => {
            return `<li class="club-item">➡ ${club.name}</li>`;
        }).join('');

        return `
            <div class="transfer-card ${cardClass}">
                <div class="update-time">更新: ${data.lastUpdated}</div>
                <div class="card-header">
                    <span class="player-name">🇯🇵 ${data.player}</span>
                    <span class="status-badge ${badgeClass}">${data.status}</span>
                </div>
                <ul class="club-list">
                    ${clubsHtml}
                </ul>
            </div>
        `;
    }).join('');
}

// 画面読み込み時と、セレクトボックス変更時に実行
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('status-filter').addEventListener('change', renderTransfers);
    document.getElementById('league-filter').addEventListener('change', renderTransfers);
    
    renderTransfers();
});