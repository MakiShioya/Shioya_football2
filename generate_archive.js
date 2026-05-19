// generate_archive.js
const fs = require('fs');
const path = require('path');

// --- 1. 設定 ---
// ここを引数や日付計算で動的にしますが、まずは手動テスト用に固定します
const TARGET_DATE = '20260517'; 
// __dirname は GitHub Actions 実行時のルートディレクトリを指します
const BASE_DIR = path.join(__dirname, 'public'); 

// --- 2. 辞書データ ---
const LEAGUE_INFO = {
    "PL":  { jp: "プレミア" },
    "PD":  { jp: "ラ・リーガ" },
    "BL1": { jp: "ブンデス" },
    "SA1": { jp: "セリエA" },
    "FL1": { jp: "リーグアン" },
    "ELC": { jp: "英2部" },
    "PPL": { jp: "ポルトガル" },
    "DED": { jp: "オランダ" },
    "BSA": { jp: "ベルギー" },
    "J1":  { jp: "Jリーグ" },
    "SPL": { jp: "スコットランド" },
    "CL":  { jp: "CL" },
    "EL":  { jp: "EL" },
    "ECL": { jp: "ECL" }
};

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
    "SC Braga": "ブラガ", "Casa Pia": "カーザ・ピア", "Estoril": "エストリル", 
    "CF Estrela da Amadora": "エストレラ", "FC Famalicão": "ファマリカン", "SC Farense": "ファレンセ", 
    "FC Porto": "ポルト", "Gil Vicente": "ジル・ヴィセンテ", "Moreirense FC": "モレイレンセ", 
    "CD Nacional": "ナシオナル", "Rio Ave": "リオ・アヴェ", "CD Santa Clara": "サンタ・クララ", 
    "Sporting CP": "スポルティング", "Vitória SC": "ヴィトーリア", "AVS Futebol SAD": "AVS", 
    "FC Arouca": "アロウカ", "AFC Ajax": "アヤックス", "Almere City FC": "アルメレ・シティ", 
    "AZ Alkmaar": "AZ", "Feyenoord": "フェイエノールト", "Fortuna Sittard": "フォルトゥナ", 
    "GO Ahead Eagles": "ゴー・アヘッド", "FC Groningen": "フローニンゲン", "Heerenveen": "ヘーレンフェーン", 
    "Heracles": "ヘラクレス", "NAC Breda": "NAC", "NEC Nijmegen": "NEC", "PEC Zwolle": "ズヴォレ", 
    "PSV": "PSV", "Waalwijk": "RKC", "Sparta Rotterdam": "スパルタ", "Twente": "トゥウェンテ", 
    "FC Utrecht": "ユヒト", "Willem II": "ヴィレムII", "Anderlecht": "アンデルレヒト", 
    "Antwerp": "アントワープ", "Cercle Brugge KSV": "セルクル・ブルッヘ", 
    "Sporting du Pays de Charleroi": "シャルルロワ", "Club Brugge KV": "クラブ・ブルッヘ", 
    "Dender": "デンデル", "Genk": "ヘンク", "Gent": "ヘント", 
    "KV Kortrijk": "コルトレイク", "KV Mechelen": "メヘレン", "Oud-Heverlee Leuven": "OHルーヴェン", 
    "St. Truiden": "シント＝トロイデン", "Standard de Liège": "S・リエージュ", 
    "Royale Union Saint-Gilloise": "サン＝ジロワーズ", "KVC Westerlo": "ウェステルロー", 
    "SV Zulte Waregem": "ズルテ・ワレヘム", "Albirex Niigata": "新潟", "Avispa Fukuoka": "福岡", 
    "Cerezo Osaka": "C大阪", "Consadole Sapporo": "札幌", "FC Tokyo": "FC東京", 
    "Gamba Osaka": "G大阪", "Jubilo Iwata": "磐田", "Kashima": "鹿島", 
    "Kashiwa Reysol": "柏", "Kawasaki Frontale": "川崎F", "Kyoto Sanga": "京都", 
    "Machida Zelvia": "町田", "Nagoya Grampus": "名古屋", "Sagan Tosu": "鳥栖", 
    "Sanfrecce Hiroshima": "広島", "Shonan Bellmare": "湘南", "Tokyo Verdy": "東京V", 
    "Urawa Red Diamonds": "浦和", "Vissel Kobe": "神戸", "Yokohama F. Marinos": "横浜FM", 
    "Celtic": "セルティック"
};

// --- 3. 全日付のパースと「有効な日付」リストの作成 ---
const MATCHES_DIR = path.join(BASE_DIR, 'data', 'matches');
const files = fs.readdirSync(MATCHES_DIR);

// "YYYYMMDD" の形式で、試合データが存在し、かつ日本人が1人でも出場している日付のリストを作る
let validDates = [];

// 全ファイルをスキャン
files.forEach(file => {
    if (file.startsWith('matches_') && file.endsWith('.json')) {
        const dateStr = file.replace('matches_', '').replace('.json', '');
        const statsPath = path.join(MATCHES_DIR, `stats_${dateStr}.json`);
        
        if (fs.existsSync(statsPath)) {
            try {
                const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8')).stats;
                // 日本人選手が1人でもいれば有効な日付として追加
                if (statsData && statsData.length > 0) {
                    validDates.push(dateStr);
                }
            } catch (e) {
                // パースエラーなどは無視
            }
        }
    }
});

// 日付順にソート
validDates.sort();

// --- 4. ターゲット日付の処理 ---
// テスト時は TARGET_DATE のみ処理しますが、後日この部分をループ化します
if (!validDates.includes(TARGET_DATE)) {
    console.log(`[スキップ] ${TARGET_DATE} は日本人選手の出場記録がありません。`);
    process.exit(0);
}

const currentIndex = validDates.indexOf(TARGET_DATE);
const prevDate = currentIndex > 0 ? validDates[currentIndex - 1] : null;
const nextDate = currentIndex < validDates.length - 1 ? validDates[currentIndex + 1] : null;

// データ読み込み
const statsData = JSON.parse(fs.readFileSync(path.join(MATCHES_DIR, `stats_${TARGET_DATE}.json`), 'utf8')).stats;
const matchesRaw = JSON.parse(fs.readFileSync(path.join(MATCHES_DIR, `matches_${TARGET_DATE}.json`), 'utf8'));
const matchesData = matchesRaw.matches || matchesRaw.response.matches;

// --- 5. ヘルパー関数 ---
function formatJST(utcDateString) {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 9);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

function getTeamName(englishName) {
    return TEAM_DISPLAYS[englishName] || englishName;
}

// 日付文字列を「YYYY年MM月DD日」に変換する関数
function displayDate(dateStr) {
    if (!dateStr) return "";
    return `${dateStr.substring(0,4)}年${dateStr.substring(4,6)}月${dateStr.substring(6,8)}日`;
}

// --- 6. HTMLの組み立て ---
const currentDisplayDate = displayDate(TARGET_DATE);

let htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content, viewport-fit=cover">
    <meta name="description" content="${currentDisplayDate}の海外日本人サッカー選手の試合結果や個人成績です。">
    <meta property="og:title" content="${currentDisplayDate} 試合結果 | しおやフットボール">
    <meta property="og:type" content="article">
    <meta name="robots" content="index, follow">
    <title>${currentDisplayDate} 試合結果 | しおやフットボール</title>
    
    <!-- Firebaseの読み込み (推し選手ハイライト用) -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    
    <!-- common.cssの読み込み -->
    <link rel="stylesheet" href="../../common.css">

    <style>
        .archive-header-nav { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; }
        .nav-btn { background: #8b4513; color: #ECDBBF; padding: 10px 15px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.9rem; }
        .nav-btn.disabled { background: #ccc; color: #666; pointer-events: none; }
        .date-title { font-size: 1.2rem; font-weight: bold; color: var(--text-color); }
        
        .archive-match-card { background: #fff8dc; border: 3px solid #8b4513; border-radius: 12px; margin: 15px auto; padding: 15px; width: 95%; max-width: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333; }
        .archive-info { font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold; }
        .archive-score-board { display: flex; justify-content: space-between; align-items: flex-start; }
        .archive-team { width: 38%; text-align: center; font-weight: bold; font-size: 1rem; line-height: 1.4; }
        .archive-score { width: 24%; text-align: center; margin-top: 5px; font-size: 1.3em; font-weight: 900; color: #432517; }
        
        .archive-players { margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 10px; }
        .player-row { display: flex; justify-content: space-between; font-size: 0.9em; padding: 4px 0; align-items: center; }
        
        /* 最推しハイライト用クラス (JSで付与) */
        .favorite-shine { background: linear-gradient(145deg, #fff3e0, #ffecb3) !important; border: 3px solid #ffd700 !important; box-shadow: 0 0 15px rgba(255, 215, 0, 0.6) !important; }
        .favorite-shine .player-name-text { color: #e91e63 !important; font-weight: bold; }
    </style>
</head>
<body class="theme-default">

    <!-- ナビゲーションバー (簡易版) -->
    <header class="top-bar">
        <a href="../../index_web.html" style="position: absolute; left: 15px; color: #ECDBBF; text-decoration: none; font-size: 1.2rem;">◀ 戻る</a>
        <h1>過去の試合結果</h1>
    </header>

    <main id="match-list">
        <!-- 前後の日付ナビゲーション -->
        <div class="archive-header-nav">
            ${prevDate ? `<a href="../${prevDate}/index.html" class="nav-btn">前の試合日</a>` : `<span class="nav-btn disabled">前の試合日</span>`}
            <div class="date-title">${currentDisplayDate}</div>
            ${nextDate ? `<a href="../${nextDate}/index.html" class="nav-btn">次の試合日</a>` : `<span class="nav-btn disabled">次の試合日</span>`}
        </div>
`;

// 試合ごとにループ
matchesData.forEach(match => {
    const japanesePlayersInThisMatch = statsData.filter(stat => stat.fixtureId === match.fixtureId);
    if (japanesePlayersInThisMatch.length === 0) return;

    const compCode = match.competition.code || "OTHER";
    const leagueName = LEAGUE_INFO[compCode] ? LEAGUE_INFO[compCode].jp : match.competition.name;
    const jstTime = formatJST(match.utcDate);
    const homeName = getTeamName(match.homeTeam.name);
    const awayName = getTeamName(match.awayTeam.name);
    
    // スコア処理
    let scoreText = "VS";
    if (match.status === "FT" || match.status === "AET" || match.status === "PEN") {
        scoreText = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
    } else if (match.status === "CANC" || match.status === "PST") {
        scoreText = "延期";
    }

    // 出場選手データの構築 (HTMLに data-name 属性を仕込んで後からJSでハイライトする)
    let playersHtml = "";
    let matchPlayerIdsStr = ""; // この試合に出場した全日本人選手のID(名前)のリスト

    japanesePlayersInThisMatch.forEach(player => {
        const pName = player.name;
        matchPlayerIdsStr += pName + ","; // クライアント側の推し判定に使う

        const statusText = player.starter ? "スタメン" : "途中出場";
        let events = [];
        if (player.goals > 0) events.push(`${player.goals}G`);
        if (player.assists > 0) events.push(`${player.assists}A`);
        const eventsHtml = events.length > 0 ? ` <span style="color:#d9534f; font-weight:bold;">${events.join(' ')}</span>` : '';

        playersHtml += `
            <div class="player-row" data-player-name="${pName}">
                <div class="player-name-text">${pName} <span style="font-size:0.7em; background:#8b4513; color:#ECDBBF; padding:2px 4px; border-radius:4px;">${statusText}</span></div>
                <div>${player.minutes}分 評価:${player.rating} ${eventsHtml}</div>
            </div>
        `;
    });

    // 試合カードの出力
    htmlContent += `
        <article class="archive-match-card" data-match-players="${matchPlayerIdsStr}">
            <div class="archive-info">${leagueName} | ${jstTime} (日本時間)</div>
            <div class="archive-score-board">
                <div class="archive-team">${homeName}</div>
                <div class="archive-score">${scoreText}</div>
                <div class="archive-team">${awayName}</div>
            </div>
            <div class="archive-players">
                ${playersHtml}
            </div>
        </article>
    `;
});

htmlContent += `
    </main>

    <!-- 下部メニュー (共通) -->
    <div class="bottom-menu">
        <button class="menu-btn btn-schedule" onclick="location.href='../../index_web.html'">予定を確認</button>
        <button class="menu-btn btn-results" onclick="location.href='../../performance.html'">昨日の日本人</button>
        <button class="menu-btn btn-calendar" onclick="location.href='../../best11.html'">今週の日本代表</button>
        <button class="menu-btn btn-transfer" onclick="location.href='../../transfer.html'">移籍</button>
        <button class="menu-btn btn-notes" onclick="location.href='../../dashboard.html'">シーズン</button>
    </div>

    <!-- クライアント側のJS: Firebaseにログインしていれば推し選手を光らせる -->
    <script>
        // auth.js と同じFirebase設定が読み込まれている前提
        document.addEventListener("DOMContentLoaded", () => {
            const savedTheme = localStorage.getItem('shioya_theme');
            if (savedTheme) document.body.className = savedTheme;

            // japanese_players.jsonを読み込んで、推しIDから名前を逆引きできるようにする
            fetch('../../japanese_players.json').then(res => res.json()).then(playerDict => {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        try {
                            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                            if (userDoc.exists) {
                                const favId = userDoc.data().mostFavoriteId;
                                if (!favId) return;

                                // favId ("Mitoma" など) に該当する日本語名 ("三笘薫" など) を探す
                                let favFullName = "";
                                for (const team in playerDict) {
                                    if (playerDict[team][favId]) {
                                        favFullName = playerDict[team][favId].full;
                                        break;
                                    }
                                }

                                if (favFullName) {
                                    // その選手が出場している試合カードを光らせる
                                    document.querySelectorAll('.archive-match-card').forEach(card => {
                                        if (card.getAttribute('data-match-players').includes(favFullName)) {
                                            card.classList.add('favorite-shine');
                                        }
                                    });
                                }
                            }
                        } catch(e) { console.error(e); }
                    }
                });
            });
        });
    </script>
</body>
</html>
`;

// --- 7. ファイルの出力 ---
const ARCHIVE_DIR = path.join(__dirname, 'public', 'archive', TARGET_DATE);
if (!fs.existsSync(ARCHIVE_DIR)){
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}
fs.writeFileSync(path.join(ARCHIVE_DIR, 'index.html'), htmlContent, 'utf8');
console.log(`[成功] ${TARGET_DATE}/index.html を生成しました。（前:${prevDate} / 次:${nextDate}）`);
