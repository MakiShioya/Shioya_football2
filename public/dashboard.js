// アプリ全体でデータを保持するための変数
let allStats = [];      
let currentStats = [];  
let sortCol = 'goals';  
let sortAsc = false;    
let NAME_TO_ID_MAP = {}; // 名前からIDを引くための辞書を追加

// 1. 初回読み込み処理
async function loadDashboard() {
    try {
        // 選手名簿（辞書）を先に読み込む
        const cacheBuster = new Date().getTime();
        const resDict = await fetch(`https://football.shioya-soft.com/japanese_players.json?t=${cacheBuster}`);
        if (resDict.ok) {
            const rawDict = await resDict.json();
            for (const team in rawDict) {
                for (const [id, pInfo] of Object.entries(rawDict[team])) {
                    NAME_TO_ID_MAP[pInfo.full] = id;
                    NAME_TO_ID_MAP[pInfo.short] = id;
                }
            }
        }

        const response = await fetch('https://football.shioya-soft.com/data/season/season_stats.json');
        if (!response.ok) throw new Error('データが見つかりません');
        
        const data = await response.json();
        allStats = data.players || [];
        currentStats = [...allStats]; 

        setupFilters();
        renderDashboard();
    } catch (error) {
        console.error(error);
        document.getElementById('leaders-container').innerHTML = 
            '<p style="text-align:center; grid-column: 1 / -1;">データがありません。</p>';
    }
}

// 2. リーグ絞り込みボタンの設定（変更なし）
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const targetLeague = e.target.getAttribute('data-league');
            if (targetLeague === 'ALL') {
                currentStats = [...allStats];
            } else {
                currentStats = allStats.filter(p => p.league === targetLeague);
            }
            renderDashboard();
        });
    });
}

// 3. 画面全体の再描画（変更なし）
function renderDashboard() {
    renderLeaders();
    sortData(sortCol, true); 
}

// 4. リーダーボードの描画（最推し判定を追加）
function renderLeaders() {
    const container = document.getElementById('leaders-container');
    if (currentStats.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">所属選手が見つかりません。</p>';
        return;
    }

    const topScorer = currentStats.reduce((max, p) => parseInt(p.goals) > parseInt(max.goals) ? p : max, currentStats[0]);
    const topAssist = currentStats.reduce((max, p) => parseInt(p.assists) > parseInt(max.assists) ? p : max, currentStats[0]);
    const topRating = currentStats.reduce((max, p) => parseFloat(p.rating) > parseFloat(max.rating) ? p : max, currentStats[0]);
    const topMinutes = currentStats.reduce((max, p) => parseInt(p.minutes) > parseInt(max.minutes) ? p : max, currentStats[0]);

    // 判定用関数
    const getShineClass = (name) => {
        const pId = NAME_TO_ID_MAP[name];
        return (pId && pId === window.currentFavoriteId) ? 'favorite-shine' : '';
    };

    container.innerHTML = `
        <div class="leader-card ${getShineClass(topScorer.name)}">
            <div class="leader-icon">⚽</div>
            <div class="leader-title">得点王</div>
            <div class="leader-name">${topScorer.name}</div>
            <div class="leader-stat">${topScorer.goals} <span style="font-size:0.8rem; color:#8b4513;">G</span></div>
            <div class="leader-sub">${topScorer.team}</div>
        </div>
        <div class="leader-card ${getShineClass(topAssist.name)}">
            <div class="leader-icon">🅰️</div>
            <div class="leader-title">アシスト王</div>
            <div class="leader-name">${topAssist.name}</div>
            <div class="leader-stat">${topAssist.assists} <span style="font-size:0.8rem; color:#8b4513;">A</span></div>
            <div class="leader-sub">${topAssist.team}</div>
        </div>
        <div class="leader-card ${getShineClass(topRating.name)}">
            <div class="leader-icon">👑</div>
            <div class="leader-title">MVP (平均評点)</div>
            <div class="leader-name">${topRating.name}</div>
            <div class="leader-stat">${topRating.rating}</div>
            <div class="leader-sub">${topRating.team}</div>
        </div>
        <div class="leader-card ${getShineClass(topMinutes.name)}">
            <div class="leader-icon">⏱️</div>
            <div class="leader-title">鉄人 (出場時間)</div>
            <div class="leader-name">${topMinutes.name}</div>
            <div class="leader-stat">${topMinutes.minutes} <span style="font-size:0.8rem; color:#8b4513;">分</span></div>
            <div class="leader-sub">${topMinutes.team}</div>
        </div>
    `;
}

// 5. テーブルのソート機能（変更なし）
window.sortData = function(column, keepDirection = false) {
    if (!keepDirection) {
        if (sortCol === column) {
            sortAsc = !sortAsc;
        } else {
            sortCol = column;
            sortAsc = false;
        }
    }
    currentStats.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
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

// 6. テーブルの描画（行の最推し判定を追加）
// 6. テーブルの描画（dashboard.js の下の方）
function renderTable() {
    const tbody = document.getElementById('stats-tbody');
    if (currentStats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">データがありません。</td></tr>';
        return;
    }

    tbody.innerHTML = currentStats.map(p => {
        const pId = NAME_TO_ID_MAP[p.name];
        const isFav = (pId && pId === window.currentFavoriteId);
        
        // ★ ここを修正: テーブル行専用の安全なクラスにする
        const rowClass = isFav ? 'favorite-row' : '';

        return `
            <tr class="${rowClass}">
                <td class="player-cell">
                    ${p.name}<br>
                    <div class="team-league">${p.team} / ${p.leagueCode}</div>
                </td>
                <td style="font-weight: bold; color: #d35400;">${p.goals}</td>
                <td style="font-weight: bold; color: #d35400;">${p.assists}</td>
                <td>${p.rating}</td>
                <td>${p.minutes}</td>
            </tr>
        `;
    }).join('');
}

// 起動処理（Auth監視を入れてタイミングを合わせる）
window.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        // IDが確定するのを待ってからロード開始
        setTimeout(() => {
            loadDashboard();
        }, 500);
    });
});