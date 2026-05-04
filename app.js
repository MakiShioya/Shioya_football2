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
    "Arsenal": "アーセナル", "Aston Villa": "アストン・ヴィラ", "Bournemouth": "ボーンマス", 
    "Brentford": "ブレントフォード", "Brighton": "ブライトン", "Chelsea": "チェルシー", 
    "Crystal Palace": "クリスタル・パレス", "Everton": "エヴァートン", "Fulham": "フラム", 
    "Ipswich": "イプスウィッチ", "Leicester": "レスター", "Liverpool": "リヴァプール", 
    "Manchester City": "マンチェスター・C", "Manchester United": "マンチェスター・U", 
    "Newcastle": "ニューカッスル", "Nottingham Forest": "N・フォレスト", "Tottenham": "トッテナム", 
    "West Ham": "ウェストハム", "Wolves": "ウルヴズ", "Blackburn": "ブラックバーン", 
    "Burnley": "バーンリー", "Coventry": "コヴェントリー", "Derby": "ダービー", 
    "Leeds": "リーズ", "Luton": "ルートン", "Middlesbrough": "ミドルズブラ", 
    "Millwall": "ミルウォール", "Norwich": "ノリッジ", "Oxford": "オックスフォード", 
    "Plymouth": "プリマス", "Portsmouth": "ポーツマス", "Preston": "プレストン", 
    "QPR": "QPR", "Sheffield Utd": "シェフィールド・U", "Sheffield Wed": "シェフィールド・W", 
    "Stoke City": "ストーク", "Sunderland": "サンダーランド", "Swansea": "スウォンジー", 
    "Watford": "ワトフォード", "West Brom": "WBA", "Bristol City": "ブリストル・C", 
    "Hull City": "ハル・シティ", "Southampton": "サウサンプトン", "Cardiff": "カーディフ", 
    "Birmingham": "バーミンガム", "Alaves": "アラベス", "Athletic Club": "ビルバオ", 
    "Atletico Madrid": "アトレティコ", "Barcelona": "バルセロナ", "Celta Vigo": "セルタ", 
    "Espanyol": "エスパニョール", "Getafe": "ヘタフェ", "Girona": "ジローナ", 
    "Las Palmas": "ラス・パルマス", "Leganes": "レガネス", "Mallorca": "マジョルカ", 
    "Osasuna": "オサスナ", "Rayo Vallecano": "ラージョ", "Real Betis": "ベティス", 
    "Real Madrid": "レアル・マドリード", "Real Sociedad": "レアル・ソシエダ", "Sevilla": "セビージャ", 
    "Valencia": "バレンシア", "Valladolid": "バジャドリード", "Villarreal": "ビジャレアル", 
    "oviedo": "オビエド", "Bayern München": "バイエルン", "Borussia Dortmund": "ドルトムント", 
    "RB Leipzig": "ライプツィヒ", "VfB Stuttgart": "シュトゥットガルト", "1899 Hoffenheim": "ホッフェンハイム", 
    "Bayer Leverkusen": "レヴァークーゼン", "Eintracht Frankfurt": "フランクフルト", "SC Freiburg": "フライブルク", 
    "FC Augsburg": "アウクスブルク", "FSV Mainz 05": "マインツ", "Borussia Mönchengladbach": "ボルシアMG", 
    "Werder Bremen": "ブレーメン", "Union Berlin": "ウニオン・ベルリン", "FC Koln": "ケルン", 
    "Hamburger SV": "ハンブルガーSV", "FC St. Pauli": "ザンクトパウリ", "VfL Wolfsburg": "ヴォルフスブルク", 
    "1. FC Heidenheim": "ハイデンハイム", "VfL Bochum": "ボーフム", "Fortuna Dusseldorf": "デュッセルドルフ", 
    "Darmstadt 98": "ダルムシュタット", "Atalanta": "アタランタ", "Bologna": "ボローニャ", 
    "Cagliari": "カリアリ", "Como": "コモ", "Empoli": "エンポリ", "Fiorentina": "フィオレンティーナ", 
    "Genoa": "ジェノア", "Inter": "インテル", "Juventus": "ユヴェントス", "Lazio": "ラツィオ", 
    "Lecce": "レッチェ", "AC Milan": "ミラン", "Monza": "モンツァ", "Napoli": "ナポリ", 
    "Parma": "パルマ", "AS Roma": "ローマ", "Torino": "トリノ", "Udinese": "ウディネーゼ", 
    "Venezia": "ヴェネツィア", "Hellas Verona": "ヴェローナ", "Angers": "アンジェ", "Auxerre": "オセール", 
    "Stade Brestois 29": "ブレスト", "Le Havre": "ル・アーヴル", "Lens": "ランス", "Lille": "リール", 
    "Lyon": "リヨン", "Marseille": "マルセイユ", "Monaco": "モナコ", "Montpellier": "モンペリエ", 
    "Nantes": "ナント", "Nice": "ニース", "Paris Saint Germain": "パリSG", "Reims": "スタッド・ランス", 
    "Rennes": "レンヌ", "Saint Etienne": "サンテティエンヌ", "Strasbourg": "ストラスブール", 
    "Toulouse": "トゥールーズ", "Metz": "メス", "SL Benfica": "ベンフィカ", "Boavista FC": "ボアヴィスタ", 
    "SC Braga": "ブラガ", "Casa Pia AC": "カーザ・ピア", "GD Estoril Praia": "エストリル", 
    "CF Estrela da Amadora": "エストレラ", "FC Famalicão": "ファマリカン", "SC Farense": "ファレンセ", 
    "FC Porto": "ポルト", "Gil Vicente FC": "ジル・ヴィセンテ", "Moreirense FC": "モレイレンセ", 
    "CD Nacional": "ナシオナル", "Rio Ave FC": "リオ・アヴェ", "CD Santa Clara": "サンタ・クララ", 
    "Sporting CP": "スポルティング", "Vitória SC": "ヴィトーリア", "AVS Futebol SAD": "AVS", 
    "FC Arouca": "アロウカ", "AFC Ajax": "アヤックス", "Almere City FC": "アルメレ・シティ", 
    "AZ Alkmaar": "AZ", "Feyenoord": "フェイエノールト", "Fortuna Sittard": "フォルトゥナ", 
    "Go Ahead Eagles": "ゴー・アヘッド", "FC Groningen": "フローニンゲン", "SC Heerenveen": "ヘーレンフェーン", 
    "Heracles Almelo": "ヘラクレス", "NAC Breda": "NAC", "NEC Nijmegen": "NEC", "PEC Zwolle": "ズヴォレ", 
    "PSV": "PSV", "RKC Waalwijk": "RKC", "Sparta Rotterdam": "スパルタ", "FC Twente '65": "トゥウェンテ", 
    "FC Utrecht": "ユヒト", "Willem II Tilburg": "ヴィレムII", "RSC Anderlecht": "アンデルレヒト", 
    "Royal Antwerp FC": "アントワープ", "Cercle Brugge KSV": "セルクル・ブルッヘ", 
    "Sporting du Pays de Charleroi": "シャルルロワ", "Club Brugge KV": "クラブ・ブルッヘ", 
    "FCV Dender EH": "デンデル", "KRC Genk": "ヘンク", "KAA Gent": "ヘント", 
    "KV Kortrijk": "コルトレイク", "KV Mechelen": "メヘレン", "Oud-Heverlee Leuven": "OHルーヴェン", 
    "St. Truiden": "シント＝トロイデン", "Standard de Liège": "S・リエージュ", 
    "Royale Union Saint-Gilloise": "サン＝ジロワーズ", "KVC Westerlo": "ウェステルロー", 
    "SV Zulte Waregem": "ズルテ・ワレヘム", "Albirex Niigata": "新潟", "Avispa Fukuoka": "福岡", 
    "Cerezo Osaka": "C大阪", "Consadole Sapporo": "札幌", "FC Tokyo": "FC東京", 
    "Gamba Osaka": "G大阪", "Jubilo Iwata": "磐田", "Kashima Antlers": "鹿島", 
    "Kashiwa Reysol": "柏", "Kawasaki Frontale": "川崎F", "Kyoto Sanga": "京都", 
    "Machida Zelvia": "町田", "Nagoya Grampus": "名古屋", "Sagan Tosu": "鳥栖", 
    "Sanfrecce Hiroshima": "広島", "Shonan Bellmare": "湘南", "Tokyo Verdy": "東京V", 
    "Urawa Red Diamonds": "浦和", "Vissel Kobe": "神戸", "Yokohama F. Marinos": "横浜FM", 
    "Celtic": "セルティック"
};

let JAPANESE_PLAYERS = {};
let allMatches = [];
let targetDate = new Date();

const TODAY = new Date();
TODAY.setHours(TODAY.getHours() - 6); 

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
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data/matches/matches_${dateStr}.json?t=${cacheBuster}`);
        
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
        
        let displayHour = dateObj.getHours();
        const displayMinute = String(dateObj.getMinutes()).padStart(2, '0');
        
        if (dateObj.getDate() !== targetDate.getDate() && dateObj.getTime() > targetDate.getTime()) {
            displayHour += 24;
        }
        
        const timeDisplayStr = `${displayHour}:${displayMinute}`;

        const homeNameRaw = match.homeTeam.name;
        const awayNameRaw = match.awayTeam.name;
        const homeJP = TEAM_DISPLAYS[homeNameRaw] || homeNameRaw;
        const awayJP = TEAM_DISPLAYS[awayNameRaw] || awayNameRaw;

        const displayHomeName = `${info.flag} ${homeJP}`;
        const displayAwayName = `${info.flag} ${awayJP}`;

        // ★ ここで short 名が結合されて表示される
        const homePlayers = JAPANESE_PLAYERS[homeNameRaw] ? JAPANESE_PLAYERS[homeNameRaw].join(', ') : '';
        const awayPlayers = JAPANESE_PLAYERS[awayNameRaw] ? JAPANESE_PLAYERS[awayNameRaw].join(', ') : '';
        
        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${awayPlayers}</div>` : '';

        const hScore = match.score?.fullTime?.home;
        const aScore = match.score?.fullTime?.away;
        const status = match.status;

        const inPlay = ["1H", "2H", "HT", "ET", "BT", "P", "SUSP", "INT", "LIVE"];
        const finished = ["FT", "AET", "PEN"];
        const postponed = ["PST", "CANC", "ABD", "AWD", "WO"];

        let scoreDisplay = "";

        if (status === "NS" || status === "TBD" || (hScore === null && !finished.includes(status) && !inPlay.includes(status))) {
            scoreDisplay = `<div style="font-size: 1.3em; font-weight: 900; color: #432517;">VS</div>`;
        } else {
            let statusJp = "試合中";
            if (finished.includes(status)) statusJp = "終了";
            else if (postponed.includes(status)) statusJp = "延期・中止";

            scoreDisplay = `
                <div class="spoiler-btn" onclick="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    ${statusJp}<br><span>結果を見る</span>
                </div>
                <div class="actual-score">
                    ${hScore ?? 0} - ${aScore ?? 0}
                </div>
            `;
        }

        return `
            <div style="border: 3px solid #8b4513; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; border-radius: 12px; background: #fff8dc; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold;">${timeDisplayStr} (日本時間)</div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 38%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${displayHomeName}</div>
                        ${homeBadge}
                    </div>
                    <div style="width: 24%; text-align: center; margin-top: 5px; display: flex; justify-content: center; align-items: center;">
                        ${scoreDisplay}
                    </div>
                    <div style="width: 38%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${displayAwayName}</div>
                        ${awayBadge}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const cacheBuster = new Date().getTime();
        const res = await fetch(`japanese_players.json?t=${cacheBuster}`);
        if (res.ok) {
            const rawData = await res.json();
            for (const [team, playersObj] of Object.entries(rawData)) {
                // ★ ここで short 名だけを配列に入れて JAPANESE_PLAYERS に格納する
                JAPANESE_PLAYERS[team] = Object.values(playersObj).map(p => p.short);
            }
        }
    } catch (e) {
        console.error("選手辞書の読み込みに失敗しました", e);
    }

    document.getElementById('league-filter').addEventListener('change', renderMatches);
    document.getElementById('japanese-filter').addEventListener('change', renderMatches);
    document.getElementById('major-league-filter').addEventListener('change', renderMatches);
    selectTab(0, 'tab-today');
});
