/**
 * LEAGUE_MASTERS: 指定されたリーグのチーム名を格納
 * ※Football-Data.orgのAPIが吐き出すチーム名に後で微調整が必要になる場合があります。
 */
const COMPETITION_CODES = {
    "premier_league": "PL",   // イングランド1部
    "laliga": "PD",           // スペイン1部
    "bundesliga": "BL1",      // ドイツ1部
    "serie_a": "SA1",         // イタリア1部
    "ligue_1": "FL1",         // フランス1部
    "championship": "ELC",    // イングランド2部
    "belgium": "DED",         // ベルギー（※APIプランにより取得可否あり）
    "portugal": "PPL",        // ポルトガル
    "netherlands": "DED",     // オランダ
    "j_league": "J1"          // Jリーグ（※無料プランでは通常取得不可）
};
const MAJOR_LEAGUE_CODES = ["PL", "PD", "BL1", "SA1", "FL1"];
// ▼▼ チーム名表示変換辞書 ▼▼
// ※APIが吐き出す正式名称に合わせて少し調整が必要です。適宜追加・修正してください。
const TEAM_DISPLAYS = {
    // 例: "Arsenal FC": "🏴󠁧󠁢󠁥󠁮󠁧󠁿ARS アーセナル" のように、正式名称をキーに書き換える必要があります。
    // 以下は一部抜粋の修正例です
    "Arsenal FC": "🏴󠁧󠁢󠁥󠁮󠁧󠁿ARS アーセナル",
    "Liverpool FC": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LIV リヴァプール",
    "Brighton & Hove Albion FC": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BHA ブライトン",
    "Real Sociedad de Fútbol": "🇪🇸RSO レアル・ソシエダ",
    "FC Bayern München": "🇩🇪FCB バイエルン",
    "AS Monaco FC": "🇲🇨ASM モナコ",
    // 既存のものも一旦そのまま残しておきます（合致すれば変換されます）
    "Arsenal": "🏴󠁧󠁢󠁥󠁮󠁧󠁿ARS アーセナル",
    "Liverpool": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LIV リヴァプール",
    "Brighton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BHA ブライトン",
    "Real Sociedad": "🇪🇸RSO レアル・ソシエダ",
    "Bayern München": "🇩🇪FCB バイエルン・ミュンヘン",
    "Monaco": "🇲🇨ASM モナコ"
};

// ▼▼ 日本人選手マスターデータ ▼▼
const JAPANESE_PLAYERS = {
    "Crystal Palace FC": ["鎌田大地"],
    "Crystal Palace": ["鎌田大地"],
    "Liverpool FC": ["遠藤航"],
    "Liverpool": ["遠藤航"],
    "Brighton & Hove Albion FC": ["三笘薫"],
    "Brighton": ["三笘薫"],
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

// 具体的な日付表示（YYYY年MM月DD日）を更新する関数
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

// タブ切り替え処理
function selectTab(offset, tabId) {
    // 1. タブのハイライト切り替え
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    // 2. 日付の計算
    targetDate = new Date(TODAY);
    targetDate.setDate(TODAY.getDate() + offset);

    // 3. UIの日付テキスト更新とデータ取得
    updateDateUI();
    loadMatches();
}

async function loadMatches() {
    const container = document.getElementById('match-list');
    container.innerHTML = '<p style="text-align: center; color: #ECDBBF; margin-top: 40px; font-size: 1.1rem; font-weight: bold;">試合情報を読み込み中...</p>';
    
    try {
        const dateStr = getFormattedDateForAPI();
        const response = await fetch(`data/matches_${dateStr}.json`);
        
        // ファイルが存在しない（404）場合の処理
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
    const selectedLeague = document.getElementById('league-filter').value; // 例: "premier_league"
    const isJapaneseOnly = document.getElementById('japanese-filter').checked;
    const isMajorLeagueOnly = document.getElementById('major-league-filter').checked;
    
    const filtered = allMatches.filter(match => {
        const homeName = match.homeTeam.name;
        const awayName = match.awayTeam.name;
        // APIから送られてくるリーグコードを取得
        const matchCompCode = match.competition.code; 

        // 1. リーグ選択フィルタ
        if (selectedLeague !== "all") {
            const targetCode = COMPETITION_CODES[selectedLeague];
            if (matchCompCode !== targetCode) return false;
        }

        // 2. 5大リーグフィルタ
        if (isMajorLeagueOnly) {
            if (!MAJOR_LEAGUE_CODES.includes(matchCompCode)) return false;
        }

        // 3. 日本人フィルタ
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
        const dateObj = new Date(match.utcDate);
        const jstTimeStr = new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(dateObj);

        const homeNameRaw = match.homeTeam.name;
        const awayNameRaw = match.awayTeam.name;

        const displayHomeName = TEAM_DISPLAYS[homeNameRaw] || homeNameRaw;
        const displayAwayName = TEAM_DISPLAYS[awayNameRaw] || awayNameRaw;

        const homePlayers = JAPANESE_PLAYERS[homeNameRaw] ? JAPANESE_PLAYERS[homeNameRaw].join(', ') : '';
        const awayPlayers = JAPANESE_PLAYERS[awayNameRaw] ? JAPANESE_PLAYERS[awayNameRaw].join(', ') : '';

        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${awayPlayers}</div>` : '';

        // スコアがnullなら「VS」、数字が入っていれば「2 - 1」のように表示
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

// 初期化処理
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('league-filter').addEventListener('change', renderMatches);
    document.getElementById('japanese-filter').addEventListener('change', renderMatches);
    // 追加：新しいフィルタの変更を監視
    document.getElementById('major-league-filter').addEventListener('change', renderMatches);

    selectTab(0, 'tab-today');
});
