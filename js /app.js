/**
 * LEAGUE_MASTERS: 指定されたリーグのチーム名を格納
 * ※Football-Data.orgのAPIが吐き出すチーム名に後で微調整が必要になる場合があります。
 */
const LEAGUE_MASTERS = {
    // 1. イングランド1部
    "premier_league": [
        "Arsenal FC", "Aston Villa FC", "AFC Bournemouth", "Brentford FC", "Brighton & Hove Albion FC", 
        "Chelsea FC", "Crystal Palace FC", "Everton FC", "Fulham FC", "Ipswich Town FC", 
        "Leicester City FC", "Liverpool FC", "Manchester City FC", "Manchester United FC", 
        "Newcastle United FC", "Nottingham Forest FC", "Tottenham Hotspur FC", 
        "West Ham United FC", "Wolverhampton Wanderers FC"
    ],
    // 2. スペイン1部
    "laliga": [
        "Deportivo Alavés", "Athletic Club", "Club Atlético de Madrid", "FC Barcelona", "RC Celta de Vigo", 
        "RCD Espanyol de Barcelona", "Getafe CF", "Girona FC", "UD Las Palmas", "CD Leganés", 
        "RCD Mallorca", "CA Osasuna", "Rayo Vallecano de Madrid", "Real Betis Balompié", "Real Madrid CF", 
        "Real Sociedad de Fútbol", "Sevilla FC", "Valencia CF", "Real Valladolid CF", "Villarreal CF"
    ],
    // 3. ドイツ1部（確定版）
    "bundesliga": [
        "FC Bayern München", "Borussia Dortmund", "RB Leipzig", "VfB Stuttgart", "TSG 1899 Hoffenheim", 
        "Bayer 04 Leverkusen", "Eintracht Frankfurt", "SC Freiburg", "FC Augsburg", "1. FSV Mainz 05", 
        "Borussia Mönchengladbach", "SV Werder Bremen", "1. FC Union Berlin", "1. FC Köln", 
        "Hamburger SV", "FC St. Pauli 1910", "VfL Wolfsburg", "1. FC Heidenheim 1846"
    ],
    // 4. イタリア1部
    "serie_a": [
        "Atalanta BC", "Bologna FC 1909", "Cagliari Calcio", "Como 1907", "Empoli FC", 
        "ACF Fiorentina", "Genoa CFC", "FC Internazionale Milano", "Juventus FC", "SS Lazio", 
        "US Lecce", "AC Milan", "AC Monza", "SSC Napoli", "Parma Calcio 1913", 
        "AS Roma", "Torino FC", "Udinese Calcio", "Venezia FC", "Hellas Verona FC"
    ],
    // 5. フランス1部
    "ligue_1": [
        "Angers SCO", "AJ Auxerre", "Stade Brestois 29", "Le Havre AC", "RC Lens", 
        "Lille OSC", "Olympique Lyonnais", "Olympique de Marseille", "AS Monaco FC", "Montpellier HSC", 
        "FC Nantes", "OGC Nice", "Paris Saint-Germain FC", "Stade de Reims", "Stade Rennais FC 1901", 
        "AS Saint-Étienne", "RC Strasbourg Alsace", "Toulouse FC"
    ],
    // 6. イングランド2部
    "championship": [
        "Blackburn Rovers FC", "Burnley FC", "Coventry City FC", "Derby County FC", "Leeds United FC", 
        "Luton Town FC", "Middlesbrough FC", "Millwall FC", "Norwich City FC", "Oxford United FC", 
        "Plymouth Argyle FC", "Portsmouth FC", "Preston North End FC", "Queens Park Rangers FC", "Sheffield United FC", 
        "Sheffield Wednesday FC", "Stoke City FC", "Sunderland AFC", "Swansea City AFC", "Watford FC", 
        "West Bromwich Albion FC", "Bristol City FC", "Hull City AFC", "Southampton FC", "Cardiff City FC", "Birmingham City FC"
    ],
    // 7. ベルギー1部
    "belgium": [
        "RSC Anderlecht", "Royal Antwerp FC", "Cercle Brugge KSV", "Sporting du Pays de Charleroi", "Club Brugge KV", 
        "FCV Dender EH", "KRC Genk", "KAA Gent", "KV Kortrijk", "KV Mechelen", 
        "Oud-Heverlee Leuven", "K. Sint-Truidense VV", "Standard de Liège", "Royale Union Saint-Gilloise", "KVC Westerlo", "SV Zulte Waregem"
    ],
    // 8. ポルトガル1部
    "portugal": [
        "SL Benfica", "Boavista FC", "SC Braga", "Casa Pia AC", "GD Estoril Praia", 
        "CF Estrela da Amadora", "FC Famalicão", "SC Farense", "FC Porto", "Gil Vicente FC", 
        "Moreirense FC", "CD Nacional", "Rio Ave FC", "CD Santa Clara", "Sporting Clube de Portugal", 
        "Vitória SC", "AVS Futebol SAD", "FC Arouca"
    ],
    // 9. オランダ1部
    "netherlands": [
        "AFC Ajax", "Almere City FC", "AZ", "Feyenoord Rotterdam", "Fortuna Sittard", 
        "Go Ahead Eagles", "FC Groningen", "SC Heerenveen", "Heracles Almelo", "NAC Breda", 
        "NEC", "PEC Zwolle", "PSV", "RKC Waalwijk", "Sparta Rotterdam", 
        "FC Twente '65", "FC Utrecht", "Willem II Tilburg"
    ],
    // 10. 日本 J1リーグ (Football-Data.orgには無い可能性がありますがそのまま残します)
    "j_league": [
        "Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "Consadole Sapporo", "FC Tokyo", 
        "Gamba Osaka", "Jubilo Iwata", "Kashima Antlers", "Kashiwa Reysol", "Kawasaki Frontale", 
        "Kyoto Sanga", "Machida Zelvia", "Nagoya Grampus", "Sagan Tosu", "Sanfrecce Hiroshima", 
        "Shonan Bellmare", "Tokyo Verdy", "Urawa Red Diamonds", "Vissel Kobe", "Yokohama F. Marinos"
    ],
    "ex": [
        "VfL Bochum 1848", "Fortuna Düsseldorf", "SV Darmstadt 98", "Hannover 96", "Karlsruher SC", 
        "SC Preußen Münster", "Real Sociedad B", "Celtic FC"
    ]
};

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
    const selectedLeague = document.getElementById('league-filter').value;
    const isJapaneseOnly = document.getElementById('japanese-filter').checked;
    
    let targetTeams = [];
    if (selectedLeague === "all") {
        Object.values(LEAGUE_MASTERS).forEach(teams => {
            targetTeams = targetTeams.concat(teams);
        });
    } else {
        targetTeams = LEAGUE_MASTERS[selectedLeague] || [];
    }

    const filtered = allMatches.filter(match => {
        // ▼変更箇所：home.name ではなく homeTeam.name
        const homeName = match.homeTeam.name;
        const awayName = match.awayTeam.name;

        const inTargetLeague = targetTeams.includes(homeName) || targetTeams.includes(awayName);
        if (!inTargetLeague) return false;

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
        // ▼変更箇所：timeTS ではなく utcDate を解析
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

        // ▼新規追加：エンブレム画像の表示
        const homeCrest = match.homeTeam.crest ? `<img src="${match.homeTeam.crest}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 5px;">` : '';
        const awayCrest = match.awayTeam.crest ? `<img src="${match.awayTeam.crest}" style="width: 24px; height: 24px; vertical-align: middle; margin-left: 5px;">` : '';

        // ▼新規追加：スコアがnullなら「VS」、数字が入っていれば「2 - 1」のように表示
        const hScore = match.score?.fullTime?.home;
        const aScore = match.score?.fullTime?.away;
        const scoreDisplay = (hScore !== null && hScore !== undefined) ? `${hScore} - ${aScore}` : 'VS';

        return `
            <div style="border: 3px solid #8b4513; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; border-radius: 12px; background: #fff8dc; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold;">${jstTimeStr} (日本時間)</div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem;">${homeCrest}<br>${displayHomeName}</div>
                        ${homeBadge}
                    </div>
                    <div style="width: 20%; text-align: center; font-size: 1.3em; font-weight: 900; margin-top: 5px; color: #432517;">
                        ${scoreDisplay}
                    </div>
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem;">${awayCrest}<br>${displayAwayName}</div>
                        ${awayBadge}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 初期化処理
window.addEventListener('DOMContentLoaded', () => {
    // フィルターの変更イベントを1回だけ登録
    document.getElementById('league-filter').addEventListener('change', renderMatches);
    document.getElementById('japanese-filter').addEventListener('change', renderMatches);

    // 「今日」を選択して開始
    selectTab(0, 'tab-today');
});
