/**
 * リーグごとの基本情報（国旗、略称、日本語名）
 */
const LEAGUE_INFO = {
    "PL":  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", short: "ARS", jp: "プレミア" },
    "PD":  { flag: "🇪🇸", short: "ESP", jp: "ラ・リーガ" },
    "BL1": { flag: "🇩🇪", short: "GER", jp: "ブンデス" },
    "SA1": { flag: "🇮🇹", short: "ITA", jp: "セリエA" },
    "FL1": { flag: "🇫🇷", short: "FRA", jp: "リーグアン" },
    "ELC": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", short: "ENG2", jp: "英2部" },
    "PPL": { flag: "🇵🇹", short: "POR", jp: "ポルトガル" },
    "DED": { flag: "🇳🇱", short: "NED", jp: "オランダ" },
    "J1":  { flag: "🇯🇵", short: "JPN", jp: "Jリーグ" }
};

const COMPETITION_CODES = {
    "premier_league": "PL",
    "laliga": "PD",
    "bundesliga": "BL1",
    "serie_a": "SA1",
    "ligue_1": "FL1",
    "championship": "ELC",
    "portugal": "PPL",
    "netherlands": "DED",
    "j_league": "J1"
};

const MAJOR_LEAGUE_CODES = ["PL", "PD", "BL1", "SA1", "FL1"];

const TEAM_DISPLAYS = {
    "PL": {
        "Arsenal FC": "アーセナル",
        "Liverpool FC": "リヴァプール",
        "Brighton & Hove Albion FC": "ブライトン"
    },
    "PD": {
        "Real Sociedad de Fútbol": "レアル・ソシエダ",
        "FC Barcelona": "バルセロナ"
    },
    "BL1": {
        "FC Bayern München": "バイエルン"
    },
    "FL1": {
        "AS Monaco FC": "モナコ"
    }
};

// 日本人選手データ
const JAPANESE_PLAYERS = {
    "Arsenal FC": ["富安健洋"],
    "Liverpool FC": ["遠藤航"],
    "Brighton & Hove Albion FC": ["三笘薫"],
    "Crystal Palace FC": ["鎌田大地"],
    "Real Sociedad de Fútbol": ["久保建英"],
    "AS Monaco FC": ["南野拓実"],
    "FC Bayern München": ["伊藤洋輝"]
    // ...必要に応じて追加
};

let allMatches = [];
let targetDate = new Date();
const TODAY = new Date();

function updateDateUI() {
    const y = targetDate.getFullYear();
    const m = targetDate.getMonth() + 1;
    const d = targetDate.getDate();
    const displayEl = document.getElementById('date-display');
    if (displayEl) {
        displayEl.innerText = `${y}年${m}月${d}日`;
    }
}

function getFormattedDateForAPI() {
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
}

function selectTab(offset, tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    targetDate = new Date(TODAY);
    targetDate.setDate(TODAY.getDate() + offset);
    updateDateUI();
    loadMatches();
}

async function loadMatches() {
    const container = document.getElementById('match-list');
    container.innerHTML = '<p style="text-align: center; color: #ECDBBF; margin-top: 40px; font-size: 1.1rem; font-weight: bold;">試合情報を読み込み中...</p>';
    
    try {
        const dateStr = getFormattedDateForAPI();
        const response = await fetch(`data/matches_${dateStr}.json`);
        
        if (!response.ok) {
            container.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">試合データがありません。</p>';
            allMatches = [];
            return;
        }

        const data = await response.json();
        if (!data.status || !data.response.matches) {
            container.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">試合データがありません。</p>';
            return;
        }

        allMatches = data.response.matches;
        renderMatches();
    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = '<p style="text-align:center; color: red; padding: 40px;">データの取得に失敗しました。</p>';
    }
}

function renderMatches() {
    const container = document.getElementById('match-list');
    const selectedLeague = document.getElementById('league-filter').value;
    const isJapaneseOnly = document.getElementById('japanese-filter').checked;
    const isMajorLeagueOnly = document.getElementById('major-league-filter').checked;
    
    const filtered = allMatches.filter(match => {
        const homeName = match.homeTeam.name;
        const awayName = match.awayTeam.name;
        const matchCompCode = match.competition.code; 

        if (selectedLeague !== "all") {
            const targetCode = COMPETITION_CODES[selectedLeague];
            if (matchCompCode !== targetCode) return false;
        }

        if (isMajorLeagueOnly) {
            if (!MAJOR_LEAGUE_CODES.includes(matchCompCode)) return false;
        }

        if (isJapaneseOnly) {
            const hasJapaneseHome = JAPANESE_PLAYERS[homeName] !== undefined;
            const hasJapaneseAway = JAPANESE_PLAYERS[awayName] !== undefined;
            return hasJapaneseHome || hasJapaneseAway;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">該当する試合予定はありません。</p>';
        return;
    }

    container.innerHTML = filtered.map(match => {
        const compCode = match.competition.code;
        const info = LEAGUE_INFO[compCode] || { flag: "🏳️", short: "---" };

        // --- 定義漏れを防ぐための追加ロジック ---
        // 1. 時間のフォーマット
        const dateObj = new Date(match.utcDate);
        const jstTimeStr = new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(dateObj);

        // 2. 日本語名の取得
        const homeNameRaw = match.homeTeam.name;
        const awayNameRaw = match.awayTeam.name;
        const homeJP = (TEAM_DISPLAYS[compCode] && TEAM_DISPLAYS[compCode][homeNameRaw]) || homeNameRaw;
        const awayJP = (TEAM_DISPLAYS[compCode] && TEAM_DISPLAYS[compCode][awayNameRaw]) || awayNameRaw;

        const displayHomeName = `${info.flag}${info.short} ${homeJP}`;
        const displayAwayName = `${info.flag}${info.short} ${awayJP}`;

        // 3. 日本人バッジの生成
        const homePlayers = JAPANESE_PLAYERS[homeNameRaw] ? JAPANESE_PLAYERS[homeNameRaw].join(', ') : '';
        const awayPlayers = JAPANESE_PLAYERS[awayNameRaw] ? JAPANESE_PLAYERS[awayNameRaw].join(', ') : '';
        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${awayPlayers}</div>` : '';

        // 4. スコアの表示
        const hScore = match.score?.fullTime?.home;
        const aScore = match.score?.fullTime?.away;
        const scoreDisplay = (hScore !== null && hScore !== undefined) ? `${hScore} - ${aScore}` : 'VS';

        return `
            <div style="border: 3px solid #8b4513; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; border-radius: 12px; background: #fff8dc; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold;">${jstTimeStr} (日本時間)</div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${displayHomeName}</div>
                        ${homeBadge}
                    </div>
                    <div style="width: 20%; text-align: center; font-size: 1.3em; font-weight: 900; margin-top: 5px; color: #432517;">
                        ${scoreDisplay}
                    </div>
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${displayAwayName}</div>
                        ${awayBadge}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('league-filter').addEventListener('change', renderMatches);
    document.getElementById('japanese-filter').addEventListener('change', renderMatches);
    document.getElementById('major-league-filter').addEventListener('change', renderMatches);
    selectTab(0, 'tab-today');
});
