// グローバル変数として保持（アプリ環境でのみ使用）
let appTransferData = [];

document.addEventListener('DOMContentLoaded', async () => {
    // iOSアプリ環境（Capacitor）または、ローカルのファイルシステム環境かどうかを判定
    const isApp = window.Capacitor !== undefined || window.location.protocol === 'file:';

    if (isApp) {
        // ① iOSアプリ環境: JSONを非同期でフェッチして、動的に描画
        await loadTransferDataForApp();
        
        // フィルターイベントの設定（アプリは従来通りイベントで再描画を走らせる）
        document.getElementById('status-filter').addEventListener('change', renderTransfersForApp);
        document.getElementById('league-filter').addEventListener('change', renderTransfersForApp);
    } else {
        // ② Web環境: すでにHTMLがサーバー側で埋め込まれているため、
        // 再描画（innerHTMLの書き換え）はせず、スタイル（display）の切り替えだけで絞り込みを行う
        document.getElementById('status-filter').addEventListener('change', filterWebHtmlCards);
        document.getElementById('league-filter').addEventListener('change', filterWebHtmlCards);
        
        // 初回読み込み時に現在のフィルター値に合わせておく
        filterWebHtmlCards();
    }
});

/**
 * 【iOSアプリ用】 データを取得してグローバルに格納し、初回描画
 */


async function loadTransferDataForApp() {
    const listContainer = document.getElementById('transfer-list');
    
    try {
        // 修正前: const response = await fetch('data/transfers.json');
        // 👈 【修正】URLをインターネット上の本番ドメインのものに変更します
        const response = await fetch('https://football.shioya-soft.com/data/transfers.json');
        
        const data = await response.json();
        // （以下、既存のレンダリング処理は一切変えずにそのまま維持します）
        appTransferData = data.transfers || [];
        renderTransfersForApp();
    } catch (error) {
        console.error("移籍データの取得に失敗しました:", error);
        document.getElementById('transfer-list').innerHTML = '<p style="text-align:center; padding: 40px; color: red;">データの読み込みに失敗しました。</p>';
    }
}

/**
 * 【iOSアプリ用】 従来のロジックに基づく動的レンダリング
 */
function renderTransfersForApp() {
    const container = document.getElementById('transfer-list');
    const statusFilter = document.getElementById('status-filter').value;
    const leagueFilter = document.getElementById('league-filter').value;

    const filtered = appTransferData.filter(data => {
        if (statusFilter !== "all" && data.status !== statusFilter) return false;
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
        const cardClass = data.status === "確定" ? "status-confirmed" : "status-rumor";
        const badgeClass = data.status === "確定" ? "badge-confirmed" : "badge-rumor";
        const clubsHtml = data.clubs.map(club => `<li class="club-item">➡ ${club.name}</li>`).join('');

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

/**
 * 【Web環境用】 すでに構築されている静的HTML要素の表示/非表示(CSS)を切り替える
 */
function filterWebHtmlCards() {
    const statusFilter = document.getElementById('status-filter').value;
    const leagueFilter = document.getElementById('league-filter').value;
    const cards = document.querySelectorAll('.transfer-card');
    
    let visibleCount = 0;

    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        // カンマ区切りの文字列から配列化
        const cardLeagues = card.getAttribute('data-leagues') ? card.getAttribute('data-leagues').split(',') : [];

        // 絞り込み条件判定
        const matchStatus = (statusFilter === "all" || cardStatus === statusFilter);
        const matchLeague = (leagueFilter === "all" || cardLeagues.includes(leagueFilter));

        if (matchStatus && matchLeague) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // 該当するカードが0件のときのメッセージ制御用の「ノーマッチカード」がなければ作成、あれば表示切り替え
    let noMatchMessage = document.getElementById('web-no-match-message');
    if (visibleCount === 0) {
        if (!noMatchMessage) {
            noMatchMessage = document.createElement('p');
            noMatchMessage.id = 'web-no-match-message';
            noMatchMessage.style.cssText = 'text-align:center; padding: 40px; color: #ECDBBF;';
            noMatchMessage.innerText = '該当する移籍情報はありません。';
            document.getElementById('transfer-list').appendChild(noMatchMessage);
        } else {
            noMatchMessage.style.display = 'block';
        }
    } else if (noMatchMessage) {
        noMatchMessage.style.display = 'none';
    }
}
