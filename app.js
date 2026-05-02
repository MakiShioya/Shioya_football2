/**
 * リーグごとの基本情報（国旗、日本語名）
 * ※略称(short)の設定は削除しました。
 */
const LEAGUE_INFO = {
    "PL":  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", jp: "プレミア" },
    "PD":  { flag: "🇪🇸", jp: "ラ・リーガ" },
    "BL1": { flag: "🇩🇪", jp: "ブンデス" },
    "SA1": { flag: "🇮🇹", jp: "セリエA" },
    "FL1": { flag: "🇫🇷", jp: "リーグアン" },
    "ELC": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿❷", jp: "英2部" },
    "PPL": { flag: "🇵🇹", jp: "ポルトガル" },
    "DED": { flag: "🇳🇱", jp: "オランダ" },
    "J1":  { flag: "🇯🇵", jp: "Jリーグ" }
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
    "Crystal Palace FC": ["鎌田大地"],
    "Liverpool FC": ["遠藤航"],
    "Brighton & Hove Albion FC": ["三笘薫"],
    "Southampton FC": ["松木玖生"],
    "Southampton": ["松木玖生"],
    "Leeds United FC": ["田中碧"],
    "Leeds": ["田中碧"],
    "Blackburn Rovers FC": ["大橋祐紀", "森下龍矢"],
    "Blackburn": ["大橋祐紀", "森下龍矢"],
    "Coventry City FC": ["坂元達裕"],
    "Coventry": ["坂元達裕"],
    "Hull City AFC": ["平河悠"],
    "Hull City": ["平河悠"],
    "Queens Park Rangers FC": ["斉藤光毅"],
    "QPR": ["斉藤光毅"],
    "Stoke City FC": ["瀬古樹"],
    "Stoke": ["瀬古樹"],
    "Birmingham City FC": ["岩田智輝", "藤本寛也", "古橋亨梧"],
    "Birmingham": ["岩田智輝", "藤本寛也", "古橋亨梧"],

    "Real Sociedad de Fútbol": ["久保建英"],
    "Real Sociedad": ["久保建英"],
    "RCD Mallorca": ["浅野拓磨"],
    "Mallorca": ["浅野拓磨"],
    "UD Las Palmas": ["宮代大聖"],
    "Las Palmas": ["宮代大聖"],

    "FC Bayern München": ["伊藤洋輝"],
    "Bayern München": ["伊藤洋輝"],
    "SC Freiburg": ["鈴木唯人"],
    "Freiburg": ["鈴木唯人"],
    "SV Werder Bremen": ["菅原由勢"],
    "Werder Bremen": ["菅原由勢"],
    "Eintracht Frankfurt": ["小杉啓太", "堂安律"],
    "TSG 1899 Hoffenheim": ["町田浩樹"],
    "Hoffenheim": ["町田浩樹"],
    "1. FSV Mainz 05": ["川崎颯太", "佐野海舟"],
    "Mainz 05": ["川崎颯太", "佐野海舟"],
    "Borussia Mönchengladbach": ["高井幸大", "町野修斗"],
    "FC St. Pauli 1910": ["ニック・シュミット", "安藤智哉", "原大智", "藤田譲瑠チマ"],
    "St. Pauli": ["ニック・シュミット", "安藤智哉", "原大智", "藤田譲瑠チマ"],
    "VfL Wolfsburg": ["塩貝健人"],
    "Wolfsburg": ["塩貝健人"],
    "VfL Bochum 1848": ["三好康児"],
    "Bochum": ["三好康児"],
    "Fortuna Düsseldorf": ["アペルカンプ真大", "田中聡"],
    "SV Darmstadt 98": ["秋山裕紀", "古川陽介"],
    "Darmstadt": ["秋山裕紀", "古川陽介"],

    "Parma Calcio 1913": ["鈴木彩艶"],
    "Parma": ["鈴木彩艶"],

    "AS Monaco FC": ["南野拓実"],
    "Monaco": ["南野拓実"],
    "Le Havre AC": ["瀬古歩夢"],
    "Le Havre": ["瀬古歩夢"],

    "Oud-Heverlee Leuven": ["明本考浩", "大南拓磨"],
    "OH Leuven": ["明本考浩", "大南拓磨"],
    "KVC Westerlo": ["木村誠二", "齋藤俊輔", "坂本一彩"],
    "Westerlo": ["木村誠二", "齋藤俊輔", "坂本一彩"],
    "KRC Genk": ["伊東純也", "横山歩夢", "吉永夢希"],
    "Genk": ["伊東純也", "横山歩夢", "吉永夢希"],
    "K. Sint-Truidense VV": ["伊藤涼太郎", "小久保玲央ブライアン", "後藤啓介", "新川志音", "谷口彰悟", "畑大雅", "松澤海斗", "山本理仁"],
    "Sint-Truiden": ["伊藤涼太郎", "小久保玲央ブライアン", "後藤啓介", "新川志音", "谷口彰悟", "畑大雅", "松澤海斗", "山本理仁"],

    "AFC Ajax": ["板倉滉", "冨安健洋"],
    "Ajax": ["板倉滉", "冨安健洋"],
    "Feyenoord Rotterdam": ["上田綺世", "渡辺剛"],
    "Feyenoord": ["上田綺世", "渡辺剛"],

    "Sporting Clube de Portugal": ["守田英正"],
    "Sporting CP": ["守田英正"],
    
    "Celtic FC": ["旗手怜央", "前田大然"],
    "Celtic": ["旗手怜央", "前田大然"]
};

let allMatches = [];
let targetDate = new Date();
const TODAY = new Date(); // 基準となる「今日」を固定

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
        const info = LEAGUE_INFO[compCode] || { flag: "🏳️" };

        const dateObj = new Date(match.utcDate);
        const jstTimeStr = new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(dateObj);

        const homeNameRaw = match.homeTeam.name;
        const awayNameRaw = match.awayTeam.name;
        const homeJP = (TEAM_DISPLAYS[compCode] && TEAM_DISPLAYS[compCode][homeNameRaw]) || homeNameRaw;
        const awayJP = (TEAM_DISPLAYS[compCode] && TEAM_DISPLAYS[compCode][awayNameRaw]) || awayNameRaw;

        // 【変更箇所】略称を外し、国旗と日本語名（または元の名前）のみにフォーマット変更
        const displayHomeName = `${info.flag} ${homeJP}`;
        const displayAwayName = `${info.flag} ${awayJP}`;

        const homePlayers = JAPANESE_PLAYERS[homeNameRaw] ? JAPANESE_PLAYERS[homeNameRaw].join(', ') : '';
        const awayPlayers = JAPANESE_PLAYERS[awayNameRaw] ? JAPANESE_PLAYERS[awayNameRaw].join(', ') : '';
        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${awayPlayers}</div>` : '';

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
