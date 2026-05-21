let appTransferData = [];

document.addEventListener('DOMContentLoaded', async () => {
    const isApp = window.Capacitor !== undefined || window.location.protocol === 'file:';

    if (isApp) {
        // ① iOSアプリ環境
        await loadTransferDataForApp();
        
        document.getElementById('status-filter').addEventListener('change', renderTransfersForApp);
        document.getElementById('league-filter').addEventListener('change', renderTransfersForApp);
        document.getElementById('player-search').addEventListener('input', renderTransfersForApp);
        document.getElementById('sort-order').addEventListener('change', renderTransfersForApp);
    } else {
        // ② Web環境
        document.getElementById('status-filter').addEventListener('change', filterAndSortWebCards);
        document.getElementById('league-filter').addEventListener('change', filterAndSortWebCards);
        document.getElementById('player-search').addEventListener('input', filterAndSortWebCards);
        document.getElementById('sort-order').addEventListener('change', filterAndSortWebCards);
        
        filterAndSortWebCards();
    }
});

// iOSアプリ用：データをインターネット（本番サーバー）から取得
async function loadTransferDataForApp() {
    try {
        const response = await fetch('https://football.shioya-soft.com/data/transfers.json');
        const data = await response.json();
        appTransferData = data.transfers || [];
        renderTransfersForApp();
    } catch (error) {
        console.error("移籍データの取得に失敗しました:", error);
        document.getElementById('transfer-list').innerHTML = '<p style="text-align:center; padding: 40px; color: red;">データの読み込みに失敗しました。</p>';
    }
}

// iOSアプリ用：並び替え・検索を含めた動的レンダリング
function renderTransfersForApp() {
    const container = document.getElementById('transfer-list');
    const statusFilter = document.getElementById('status-filter').value;
    const leagueFilter = document.getElementById('league-filter').value;
    const searchQuery = document.getElementById('player-search').value.trim().toLowerCase();
    const sortOrder = document.getElementById('sort-order').value;

    // 1. 絞り込みと検索
    let filtered = appTransferData.filter(data => {
        if (statusFilter !== "all" && data.status !== statusFilter) return false;
        if (leagueFilter !== "all") {
            const hasTargetLeague = data.clubs.some(club => club.league === leagueFilter);
            if (!hasTargetLeague) return false;
        }
        if (searchQuery !== "" && !data.player.toLowerCase().includes(searchQuery)) return false;
        return true;
    });

    // 2. 日時での並び替え
    filtered.sort((a, b) => {
        const timeA = new Date(a.lastUpdated).getTime();
        const timeB = new Date(b.lastUpdated).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px; color: #ECDBBF;">該当する移籍情報はありません。</p>';
        return;
    }

    container.innerHTML = filtered.map(data => {
        const cardClass = data.status === "確定" ? "status-confirmed" : "status-rumor";
        const badgeClass = data.status === "確定" ? "badge-confirmed" : "badge-rumor";
        const clubsHtml = data.clubs.map(club => `<li class="club-item">➡ ${club.name}</li>`).join('');
        
        const commentHtml = data.comment ? `
            <div class="transfer-comment" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(139,69,19,0.2); font-size: 0.95rem; color: #432517; line-height: 1.5; text-align: left;">
                ${data.comment}
            </div>` : '';

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
                ${commentHtml}
            </div>
        `;
    }).join('');
}

// Web環境用：既存の静的HTMLカードの絞り込み・検索・並び替え（DOM操作）
function filterAndSortWebCards() {
    const statusFilter = document.getElementById('status-filter').value;
    const leagueFilter = document.getElementById('league-filter').value;
    const searchQuery = document.getElementById('player-search').value.trim().toLowerCase();
    const sortOrder = document.getElementById('sort-order').value;
    
    const container = document.getElementById('transfer-list');
    const cards = Array.from(document.querySelectorAll('.transfer-card'));
    
    let visibleCount = 0;

    // 絞り込みと非表示の制御
    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        const cardLeagues = card.getAttribute('data-leagues') ? card.getAttribute('data-leagues').split(',') : [];
        const cardPlayer = card.getAttribute('data-player') ? card.getAttribute('data-player').toLowerCase() : '';

        const matchStatus = (statusFilter === "all" || cardStatus === statusFilter);
        const matchLeague = (leagueFilter === "all" || cardLeagues.includes(leagueFilter));
        const matchSearch = (searchQuery === "" || cardPlayer.includes(searchQuery));

        if (matchStatus && matchLeague && matchSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // 並び替え（DOM要素の並び順を変更）
    cards.sort((a, b) => {
        const timeA = new Date(a.getAttribute('data-time')).getTime();
        const timeB = new Date(b.getAttribute('data-time')).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    // 並び替えた要素を親要素(container)に再追加して画面に反映
    cards.forEach(card => container.appendChild(card));

    // メッセージ制御
    let noMatchMessage = document.getElementById('web-no-match-message');
    if (visibleCount === 0) {
        if (!noMatchMessage) {
            noMatchMessage = document.createElement('p');
            noMatchMessage.id = 'web-no-match-message';
            noMatchMessage.style.cssText = 'text-align:center; padding: 40px; color: #ECDBBF;';
            noMatchMessage.innerText = '該当する移籍情報はありません。';
            container.appendChild(noMatchMessage);
        } else {
            noMatchMessage.style.display = 'block';
            container.appendChild(noMatchMessage); // 常に最下部に置く
        }
    } else if (noMatchMessage) {
        noMatchMessage.style.display = 'none';
    }
}