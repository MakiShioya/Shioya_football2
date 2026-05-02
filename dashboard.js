// アプリ全体でデータを保持するための変数
let allStats = [];      // 取得した全データ
let currentStats = [];  // 現在表示対象のデータ（絞り込み後）
let sortCol = 'goals';  // 現在のソート基準（デフォルトは得点）
let sortAsc = false;    // 昇順(true)か降順(false)か（デフォルトは多い順＝降順）

// 1. 初回読み込み処理
async function loadDashboard() {
    try {
        const response = await fetch('data/season/season_stats.json');
        if (!response.ok) throw new Error('データが見つかりません');
        
        const data = await response.json();
        allStats = data.players || [];
        currentStats = [...allStats]; // 初期状態は全データ

        setupFilters();
        renderDashboard();
    } catch (error) {
        console.error(error);
        document.getElementById('leaders-container').innerHTML = 
            '<p style="text-align:center; grid-column: 1 / -1;">データがありません。<br>通算成績の自動取得をお待ちください。</p>';
        document.getElementById('stats-tbody').innerHTML = 
            '<tr><td colspan="5">データが見つかりません。</td></tr>';
    }
}

// 2. リーグ絞り込みボタンの設定
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // ボタンの見た目を切り替え
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // データの絞り込み
            const targetLeague = e.target.getAttribute('data-league');
            if (targetLeague === 'ALL') {
                currentStats = [...allStats];
            } else {
                currentStats = allStats.filter(p => p.league === targetLeague);
            }

            // 画面を再描画
            renderDashboard();
        });
    });
}

// 3. 画面全体の再描画
function renderDashboard() {
    renderLeaders();
    // 絞り込みが変わった時は、現在のソート順を維持したままテーブルを再描画
    sortData(sortCol, true); 
}

// 4. リーダーボード（4部門）の計算と描画
function renderLeaders() {
    const container = document.getElementById('leaders-container');
    if (currentStats.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">このリーグに所属する選手が見つかりません。</p>';
        return;
    }

    // reduceを使って各部門の最大値を持つ選手オブジェクトを特定
    const topScorer = currentStats.reduce((max, p) => parseInt(p.goals) > parseInt(max.goals) ? p : max, currentStats[0]);
    const topAssist = currentStats.reduce((max, p) => parseInt(p.assists) > parseInt(max.assists) ? p : max, currentStats[0]);
    const topRating = currentStats.reduce((max, p) => parseFloat(p.rating) > parseFloat(max.rating) ? p : max, currentStats[0]);
    const topMinutes = currentStats.reduce((max, p) => parseInt(p.minutes) > parseInt(max.minutes) ? p : max, currentStats[0]);

    container.innerHTML = `
        <div class="leader-card">
            <div class="leader-icon">⚽</div>
            <div class="leader-title">得点王</div>
            <div class="leader-name">${topScorer.name}</div>
            <div class="leader-stat">${topScorer.goals} <span style="font-size:0.8rem; color:#8b4513;">G</span></div>
            <div class="leader-sub">${topScorer.team}</div>
        </div>
        <div class="leader-card">
            <div class="leader-icon">🅰️</div>
            <div class="leader-title">アシスト王</div>
            <div class="leader-name">${topAssist.name}</div>
            <div class="leader-stat">${topAssist.assists} <span style="font-size:0.8rem; color:#8b4513;">A</span></div>
            <div class="leader-sub">${topAssist.team}</div>
        </div>
        <div class="leader-card">
            <div class="leader-icon">👑</div>
            <div class="leader-title">MVP (平均評点)</div>
            <div class="leader-name">${topRating.name}</div>
            <div class="leader-stat">${topRating.rating}</div>
            <div class="leader-sub">${topRating.team}</div>
        </div>
        <div class="leader-card">
            <div class="leader-icon">⏱️</div>
            <div class="leader-title">鉄人 (出場時間)</div>
            <div class="leader-name">${topMinutes.name}</div>
            <div class="leader-stat">${topMinutes.minutes} <span style="font-size:0.8rem; color:#8b4513;">分</span></div>
            <div class="leader-sub">${topMinutes.team}</div>
        </div>
    `;
}

// 5. テーブルのソート機能（HTMLのonclickから呼ばれるためwindowオブジェクトに登録）
window.sortData = function(column, keepDirection = false) {
    if (!keepDirection) {
        if (sortCol === column) {
            sortAsc = !sortAsc; // 同じ列がクリックされたら昇順/降順を反転
        } else {
            sortCol = column;
            sortAsc = false; // 別の列がクリックされたら「多い順(降順)」からスタート
        }
    }

    currentStats.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // 数値比較のためのパース処理
        if (column === 'rating') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        } else if (['goals', 'assists', 'minutes'].includes(column)) {
            valA = parseInt(valA);
            valB = parseInt(valB);
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    renderTable();
};

// 6. テーブルの描画
function renderTable() {
    const tbody = document.getElementById('stats-tbody');
    if (currentStats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">データがありません。</td></tr>';
        return;
    }

    tbody.innerHTML = currentStats.map(p => `
        <tr>
            <td class="player-cell">
                ${p.name}<br>
                <div class="team-league">${p.team} / ${p.leagueCode}</div>
            </td>
            <td style="font-weight: bold; color: #d35400;">${p.goals}</td>
            <td style="font-weight: bold; color: #d35400;">${p.assists}</td>
            <td>${p.rating}</td>
            <td>${p.minutes}</td>
        </tr>
    `).join('');
}

// 起動処理
window.addEventListener('DOMContentLoaded', loadDashboard);
