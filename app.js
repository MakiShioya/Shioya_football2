const LEAGUE_INFO = {
    "PL":  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", jp: "プレミア" },
    "PD":  { flag: "🇪🇸", jp: "ラ・リーガ" },
    "BL1": { flag: "🇩🇪", jp: "ブンデス" },
    "SA1": { flag: "🇮🇹", jp: "セリエA" },
    "FL1": { flag: "🇫🇷", jp: "リーグアン" },
    "ELC": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿❷", jp: "英2部" },
    "PPL": { flag: "🇵🇹", jp: "ポルトガル" },
    "DED": { flag: "🇳🇱", jp: "オランダ" },
    "BSA": { flag: "🇧🇪", jp: "ベルギー" },
    "J1":  { flag: "🇯🇵", jp: "Jリーグ" },
    "SPL": { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", jp: "スコットランド" }
};

const COMPETITION_CODES = {
    "premier_league": "PL",
    "laliga": "PD",
    "bundesliga": "BL1",
    "serie_a": "SA1",
    "ligue_1": "FL1",
    "championship": "ELC",
    "belgium": "BSA",     
    "portugal": "PPL",
    "netherlands": "DED",
    "j_league": "J1"
};
const MAJOR_LEAGUE_CODES = ["PL", "PD", "BL1", "SA1", "FL1"];

const TEAM_DISPLAYS = {
    // イングランド
    "Arsenal": "アーセナル",
    "Aston Villa": "アストン・ヴィラ",
    "Bournemouth": "ボーンマス",
    "Brentford": "ブレントフォード",
    "Brighton": "ブライトン",
    "Chelsea": "チェルシー",
    "Crystal Palace": "クリスタル・パレス",
    "Everton": "エヴァートン",
    "Fulham": "フラム",
    "Ipswich": "イプスウィッチ",
    "Leicester": "レスター",
    "Liverpool": "リヴァプール",
    "Manchester City": "マンチェスター・C",
    "Manchester United": "マンチェスター・U",
    "Newcastle": "ニューカッスル",
    "Nottingham Forest": "N・フォレスト",
    "Tottenham": "トッテナム",
    "West Ham": "ウェストハム",
    "Wolves": "ウルヴズ",
    "Blackburn": "ブラックバーン",
    "Burnley": "バーンリー",
    "Coventry": "コヴェントリー",
    "Derby": "ダービー",
    "Leeds": "リーズ",
    "Luton": "ルートン",
    "Middlesbrough": "ミドルズブラ",
    "Millwall": "ミルウォール",
    "Norwich": "ノリッジ",
    "Oxford": "オックスフォード",
    "Plymouth": "プリマス",
    "Portsmouth": "ポーツマス",
    "Preston": "プレストン",
    "QPR": "QPR",
    "Sheffield Utd": "シェフィールド・U",
    "Sheffield Wed": "シェフィールド・W",
    "Stoke City": "ストーク",
    "Sunderland": "サンダーランド",
    "Swansea": "スウォンジー",
    "Watford": "ワトフォード",
    "West Brom": "WBA",
    "Bristol City": "ブリストル・C",
    "Hull City": "ハル・シティ",
    "Southampton": "サウサンプトン",
    "Cardiff": "カーディフ",
    "Birmingham": "バーミンガム",

    // スペイン
    "Alaves": "アラベス",
    "Athletic Club": "ビルバオ",
    "Atletico Madrid": "アトレティコ",
    "Barcelona": "バルセロナ",
    "Celta Vigo": "セルタ",
    "Espanyol": "エスパニョール",
    "Getafe": "ヘタフェ",
    "Girona": "ジローナ",
    "Las Palmas": "ラス・パルマス",
    "Leganes": "レガネス",
    "Mallorca": "マジョルカ",
    "Osasuna": "オサスナ",
    "Rayo Vallecano": "ラージョ",
    "Real Betis": "ベティス",
    "Real Madrid": "レアル・マドリード",
    "Real Sociedad": "レアル・ソシエダ",
    "Sevilla": "セビージャ",
    "Valencia": "バレンシア",
    "Valladolid": "バジャドリード",
    "Villarreal": "ビジャレアル",

    // ドイツ
    "Bayern München": "バイエルン",
    "Borussia Dortmund": "ドルトムント",
    "RB Leipzig": "ライプツィヒ",
    "VfB Stuttgart": "シュトゥットガルト",
    "1899 Hoffenheim": "ホッフェンハイム",
    "Bayer Leverkusen": "レヴァークーゼン",
    "Eintracht Frankfurt": "フランクフルト",
    "SC Freiburg": "フライブルク",
    "FC Augsburg": "アウクスブルク",
    "Mainz 05": "マインツ",
    "Borussia Monchengladbach": "ボルシアMG",
    "Werder Bremen": "ブレーメン",
    "Union Berlin": "ウニオン・ベルリン",
    "FC Koln": "ケルン",
    "Hamburger SV": "ハンブルガーSV",
    "St. Pauli": "ザンクトパウリ",
    "VfL Wolfsburg": "ヴォルフスブルク",
    "1. FC Heidenheim": "ハイデンハイム",
    "VfL Bochum": "ボーフム",
    "Fortuna Dusseldorf": "デュッセルドルフ",
    "Darmstadt 98": "ダルムシュタット",

    // イタリア
    "Atalanta": "アタランタ",
    "Bologna": "ボローニャ",
    "Cagliari": "カリアリ",
    "Como": "コモ",
    "Empoli": "エンポリ",
    "Fiorentina": "フィオレンティーナ",
    "Genoa": "ジェノア",
    "Inter": "インテル",
    "Juventus": "ユヴェントス",
    "Lazio": "ラツィオ",
    "Lecce": "レッチェ",
    "AC Milan": "ミラン",
    "Monza": "モンツァ",
    "Napoli": "ナポリ",
    "Parma": "パルマ",
    "AS Roma": "ローマ",
    "Torino": "トリノ",
    "Udinese": "ウディネーゼ",
    "Venezia": "ヴェネツィア",
    "Verona": "ヴェローナ",

    // フランス
    "Angers": "アンジェ",
    "Auxerre": "オセール",
    "Brest": "ブレスト",
    "Le Havre": "ル・アーヴル",
    "Lens": "ランス",
    "Lille": "リール",
    "Lyon": "リヨン",
    "Marseille": "マルセイユ",
    "Monaco": "モナコ",
    "Montpellier": "モンペリエ",
    "Nantes": "ナント",
    "Nice": "ニース",
    "Paris Saint Germain": "パリSG",
    "Reims": "スタッド・ランス",
    "Rennes": "レンヌ",
    "Saint Etienne": "サンテティエンヌ",
    "Strasbourg": "ストラスブール",
    "Toulouse": "トゥールーズ",
    "Metz": "メス",

    // ポルトガル
    "SL Benfica": "ベンフィカ",
    "Boavista FC": "ボアヴィスタ",
    "SC Braga": "ブラガ",
    "Casa Pia AC": "カーザ・ピア",
    "GD Estoril Praia": "エストリル",
    "CF Estrela da Amadora": "エストレラ",
    "FC Famalicão": "ファマリカン",
    "SC Farense": "ファレンセ",
    "FC Porto": "ポルト",
    "Gil Vicente FC": "ジル・ヴィセンテ",
    "Moreirense FC": "モレイレンセ",
    "CD Nacional": "ナシオナル",
    "Rio Ave FC": "リオ・アヴェ",
    "CD Santa Clara": "サンタ・クララ",
    "Sporting Clube de Portugal": "スポルティング",
    "Vitória SC": "ヴィトーリア",
    "AVS Futebol SAD": "AVS",
    "FC Arouca": "アロウカ",

    // オランダ
    "AFC Ajax": "アヤックス",
    "Almere City FC": "アルメレ・シティ",
    "AZ": "AZ",
    "Feyenoord Rotterdam": "フェイエノールト",
    "Fortuna Sittard": "フォルトゥナ",
    "Go Ahead Eagles": "ゴー・アヘッド",
    "FC Groningen": "フローニンゲン",
    "SC Heerenveen": "ヘーレンフェーン",
    "Heracles Almelo": "ヘラクレス",
    "NAC Breda": "NAC",
    "NEC": "NEC",
    "PEC Zwolle": "ズヴォレ",
    "PSV": "PSV",
    "RKC Waalwijk": "RKC",
    "Sparta Rotterdam": "スパルタ",
    "FC Twente '65": "トゥウェンテ",
    "FC Utrecht": "ユトレヒト",
    "Willem II Tilburg": "ヴィレムII",

    // ベルギー
    "RSC Anderlecht": "アンデルレヒト",
    "Royal Antwerp FC": "アントワープ",
    "Cercle Brugge KSV": "セルクル・ブルッヘ",
    "Sporting du Pays de Charleroi": "シャルルロワ",
    "Club Brugge KV": "クラブ・ブルッヘ",
    "FCV Dender EH": "デンデル",
    "KRC Genk": "ヘンク",
    "KAA Gent": "ヘント",
    "KV Kortrijk": "コルトレイク",
    "KV Mechelen": "メヘレン",
    "Oud-Heverlee Leuven": "OHルーヴェン",
    "K. Sint-Truidense VV": "シント＝トロイデン",
    "Standard de Liège": "S・リエージュ",
    "Royale Union Saint-Gilloise": "サン＝ジロワーズ",
    "KVC Westerlo": "ウェステルロー",
    "SV Zulte Waregem": "ズルテ・ワレヘム",

    // Jリーグ
    "Albirex Niigata": "新潟",
    "Avispa Fukuoka": "福岡",
    "Cerezo Osaka": "C大阪",
    "Consadole Sapporo": "札幌",
    "FC Tokyo": "FC東京",
    "Gamba Osaka": "G大阪",
    "Jubilo Iwata": "磐田",
    "Kashima Antlers": "鹿島",
    "Kashiwa Reysol": "柏",
    "Kawasaki Frontale": "川崎F",
    "Kyoto Sanga": "京都",
    "Machida Zelvia": "町田",
    "Nagoya Grampus": "名古屋",
    "Sagan Tosu": "鳥栖",
    "Sanfrecce Hiroshima": "広島",
    "Shonan Bellmare": "湘南",
    "Tokyo Verdy": "東京V",
    "Urawa Red Diamonds": "浦和",
    "Vissel Kobe": "神戸",
    "Yokohama F. Marinos": "横浜FM",

    // その他
    "Celtic FC": "セルティック"
};

// 日本人選手データ
const JAPANESE_PLAYERS = {
    "Crystal Palace": ["鎌田大地"],
    "Liverpool": ["遠藤航"],
    "Brighton": ["三笘薫"],
    "Southampton": ["松木玖生"],
    "Leeds": ["田中碧"],
    "Blackburn": ["大橋祐紀", "森下龍矢"],
    "Coventry": ["坂元達裕"],
    "Hull City": ["平河悠"],
    "QPR": ["斉藤光毅"],
    "Stoke City": ["瀬古樹"],
    "Birmingham": ["岩田智輝", "藤本寛也", "古橋亨梧"],

    "Real Sociedad": ["久保建英"],
    "Mallorca": ["浅野拓磨"],
    "Las Palmas": ["宮代大聖"],

    "Bayern München": ["伊藤洋輝"],
    "SC Freiburg": ["鈴木唯人"],
    "Werder Bremen": ["菅原由勢"],
    "Eintracht Frankfurt": ["小杉啓太", "堂安律"],
    "1899 Hoffenheim": ["町田浩樹"],
    "Mainz 05": ["川崎颯太", "佐野海舟"],
    "Borussia Monchengladbach": ["高井幸大", "町野修斗"],
    "St. Pauli": ["ニック・シュミット", "安藤智哉", "原大智", "藤田譲瑠チマ"],
    "VfL Wolfsburg": ["塩貝健人"],
    "VfL Bochum": ["三好康児"],
    "Fortuna Dusseldorf": ["アペルカンプ真大", "田中聡"],

    "Parma": ["鈴木彩艶"],
    "Monaco": ["南野拓実"],
    "Le Havre": ["瀬古歩夢"],

    "Sint-Truiden": ["伊藤涼太郎", "小久保玲央ブライアン", "谷口彰悟", "山本理仁"],
    "Ajax": ["板倉滉", "冨安健洋"],
    "Feyenoord": ["上田綺世", "渡辺剛"],
    "Sporting CP": ["守田英正"],
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
        const homeJP = TEAM_DISPLAYS[homeNameRaw] || homeNameRaw;
        const awayJP = TEAM_DISPLAYS[awayNameRaw] || awayNameRaw;

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
