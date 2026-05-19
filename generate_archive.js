// generate_archive.js
const fs = require('fs');
const path = require('path');

// --- 1. 基本設定 ---
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

// --- 3. ヘルパー関数 ---
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

function displayDate(dateStr) {
    if (!dateStr) return "";
    return `${dateStr.substring(0,4)}年${dateStr.substring(4,6)}月${dateStr.substring(6,8)}日`;
}

// --- 4. 全日付のパースと「有効な日付」リストの作成 ---
const MATCHES_DIR = path.join(BASE_DIR, 'data', 'matches');
const files = fs.readdirSync(MATCHES_DIR);

let validDates = [];

// stats_*.json が存在する日だけをリストアップする
files.forEach(file => {
    if (file.startsWith('stats_') && file.endsWith('.json')) {
        const dateStr = file.replace('stats_', '').replace('.json', '');
        validDates.push(dateStr);
    }
});

// 古い日付順にソート（前後のリンク計算に必須）
validDates.sort();

if (validDates.length === 0) {
    console.log("対象となるデータが存在しません。処理を終了します。");
    process.exit(0);
}

// --- 5. 全日付のループ処理とHTML生成 ---
let generatedCount = 0;
let skippedCount = 0;

validDates.forEach((targetDate, index) => {
    
    // 【重要】出力先ディレクトリとファイルの確認（すでにあればスキップ）
    const ARCHIVE_DIR = path.join(BASE_DIR, 'archive', targetDate);
    const OUT_FILE = path.join(ARCHIVE_DIR, 'index.html');
    
    if (fs.existsSync(OUT_FILE)) {
        console.log(`[スキップ] ${targetDate} は既に作成されています。`);
        skippedCount++;
        return; // 次のループへ
    }

    // データの読み込み
    const statsPath = path.join(MATCHES_DIR, `stats_${targetDate}.json`);
    const matchesPath = path.join(MATCHES_DIR, `matches_${targetDate}.json`);

    // matchファイルがない異常データの場合はスキップ
    if (!fs.existsSync(matchesPath)) return; 

    const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8')).stats;
    const matchesRaw = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
    const matchesData = matchesRaw.matches || matchesRaw.response.matches;

    // 前後の日付を取得
    const prevDate = index > 0 ? validDates[index - 1] : null;
    const nextDate = index < validDates.length - 1 ? validDates[index + 1] : null;

    const currentDisplayDate = displayDate(targetDate);

    // 【SEO対策】構造化データ
    const breadcrumbJsonLD = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "しおやフットボール TOP",
          "item": "https://football.shioya-soft.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "試合結果アーカイブ",
          "item": "https://football.shioya-soft.com/archive/index.html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${currentDisplayDate}の試合結果`,
          "item": `https://football.shioya-soft.com/archive/${targetDate}/index.html`
        }
      ]
    };

    let htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content, viewport-fit=cover">
    <meta name="description" content="${currentDisplayDate}に行われた海外日本人サッカー選手の試合結果と個人成績（スタメン・出場時間・評価点・得点・アシスト）の一覧です。">
    
    <meta property="og:title" content="${currentDisplayDate} 海外日本人選手 試合結果・成績 | しおやフットボール">
    <meta property="og:description" content="${currentDisplayDate}に行われた海外日本人サッカー選手の試合結果と個人成績一覧です。">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://football.shioya-soft.com/archive/${targetDate}/index.html">
    <meta name="robots" content="index, follow">
    
    <link rel="canonical" href="https://football.shioya-soft.com/archive/${targetDate}/index.html">
    
    <title>${currentDisplayDate} 海外日本人選手 試合結果・成績 | しおやフットボール</title>
    
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbJsonLD)}
    </script>
    
    <link rel="stylesheet" href="../../common.css">

    <style>
        .breadcrumb-nav { width: 95%; max-width: 500px; margin: 10px auto 0; font-size: 0.8rem; color: #666; }
        .breadcrumb-nav a { color: #8b4513; text-decoration: underline; }
        
        .archive-header-nav { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin: 5px auto 15px; width: 95%; max-width: 500px; }
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
        
        .status-badge { font-size: 0.7em; color: #ECDBBF; padding: 2px 4px; border-radius: 4px; }
        .badge-starter { background: #8b4513; }
        .badge-sub { background: #4facfe; }
        .badge-none { background: #6c757d; }

        .favorite-shine { background: linear-gradient(145deg, #fff3e0, #ffecb3) !important; border: 3px solid #ffd700 !important; box-shadow: 0 0 15px rgba(255, 215, 0, 0.6) !important; }
        .favorite-shine .player-name-text { color: #e91e63 !important; font-weight: bold; }
        
        .static-back-link { text-align: center; margin: 20px auto 40px; }
        .static-back-link a { color: #8b4513; font-weight: bold; text-decoration: underline; font-size: 0.95rem; }
    </style>
</head>
<body class="theme-default">

    <header class="top-bar">
        <h1>過去の試合結果</h1>
    </header>

    <nav class="breadcrumb-nav" aria-label="パンくずリスト">
        <a href="../../index_web.html">TOP</a> ＞ <a href="../index.html">試合結果アーカイブ</a> ＞ <span>${targetDate}</span>
    </nav>

    <main id="match-list">
        <div class="archive-header-nav">
            ${prevDate ? `<a href="../${prevDate}/index.html" class="nav-btn">前の試合日</a>` : `<span class="nav-btn disabled">前の試合日</span>`}
            <h2 class="date-title" style="margin:0; font-size:1.2rem;">${currentDisplayDate}</h2>
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
        
        let scoreText = "VS";
        if (match.status === "FT" || match.status === "AET" || match.status === "PEN") {
            scoreText = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
        } else if (match.status === "CANC" || match.status === "PST") {
            scoreText = "延期";
        }

        let playersHtml = "";
        let matchPlayerIdsStr = ""; 

        japanesePlayersInThisMatch.forEach(player => {
            const pName = player.name;
            matchPlayerIdsStr += pName + ","; 

            let statusText = "途中出場";
            let badgeClass = "badge-sub";
            
            if (player.minutes === 0) {
                statusText = "出場なし";
                badgeClass = "badge-none";
            } else if (player.starter) {
                statusText = "スタメン";
                badgeClass = "badge-starter";
            }

            let events = [];
            if (player.goals > 0) events.push(`${player.goals}G`);
            if (player.assists > 0) events.push(`${player.assists}A`);
            const eventsHtml = events.length > 0 ? ` <span style="color:#d9534f; font-weight:bold;">${events.join(' ')}</span>` : '';

            playersHtml += `
                <div class="player-row" data-player-name="${pName}">
                    <div class="player-name-text">${pName} <span class="status-badge ${badgeClass}">${statusText}</span></div>
                    <div>${player.minutes}分 評価:${player.rating} ${eventsHtml}</div>
                </div>
            `;
        });

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
        <div class="static-back-link">
            <a href="../../index_web.html">海外日本人サッカー選手 試合日程予定表トップへ戻る</a>
        </div>
    </main>

    <div class="bottom-menu">
        <button class="menu-btn btn-schedule" onclick="location.href='../../index_web.html'">予定を確認</button>
        <button class="menu-btn btn-results" onclick="location.href='../../performance.html'">昨日の日本人</button>
        <button class="menu-btn btn-calendar" onclick="location.href='../../best11.html'">今週の日本代表</button>
        <button class="menu-btn btn-transfer" onclick="location.href='../../transfer.html'">移籍</button>
        <button class="menu-btn btn-notes" onclick="location.href='../../dashboard.html'">シーズン</button>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const savedTheme = localStorage.getItem('shioya_theme');
            if (savedTheme) document.body.className = savedTheme;

            fetch('../../japanese_players.json').then(res => res.json()).then(playerDict => {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        try {
                            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                            if (userDoc.exists) {
                                const favId = userDoc.data().mostFavoriteId;
                                if (!favId) return;

                                let favFullName = "";
                                for (const team in playerDict) {
                                    if (playerDict[team][favId]) {
                                        favFullName = playerDict[team][favId].full;
                                        break;
                                    }
                                }

                                if (favFullName) {
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

    // フォルダの作成と書き出し
    if (!fs.existsSync(ARCHIVE_DIR)){
        fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }
    fs.writeFileSync(OUT_FILE, htmlContent, 'utf8');
    console.log(`[成功] ${targetDate} のHTMLを生成しました。`);
    generatedCount++;

}); // loop終了

// 最終結果の表示
console.log(`\n============================`);
console.log(`【完了】 全処理が終了しました。`);
console.log(`新規作成: ${generatedCount} 件`);
console.log(`スキップ済: ${skippedCount} 件`);
console.log(`============================\n`);

// --- (ここから追加) 6. カレンダーページ（アーカイブ一覧）の自動生成 ---

console.log("カレンダー用一覧ページ (archive/index.html) を生成中...");

// 日付ごとに「出場した全日本人選手」をリスト化するマッピングデータを作成
// (例: { "20260517": ["鎌田大地", "遠藤航"], ... })
const playerAppearanceMap = {};

validDates.forEach(dateStr => {
    const statsPath = path.join(MATCHES_DIR, `stats_${dateStr}.json`);
    if (fs.existsSync(statsPath)) {
        try {
            const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8')).stats;
            playerAppearanceMap[dateStr] = statsData.map(p => p.name);
        } catch (e) {
            playerAppearanceMap[dateStr] = [];
        }
    }
});

// カレンダーページのHTML組み立て
const calendarHtmlPath = path.join(BASE_DIR, 'archive', 'index.html');

let calendarHtmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content, viewport-fit=cover">
    <meta name="description" content="海外で活躍する日本人サッカー選手の過去の試合結果・成績をカレンダーから確認できます。">
    <title>試合結果アーカイブカレンダー | しおやフットボール</title>
    
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    
    <link rel="stylesheet" href="../common.css">

    <style>
        .calendar-container { width: 95%; max-width: 600px; margin: 20px auto 40px; background: rgba(255,255,255,0.8); border: 4px solid #8b4513; border-radius: 12px; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .month-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-weight: bold; color: #432517; font-size: 1.3rem; }
        .month-btn { background: #8b4513; color: #ECDBBF; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; }
        .month-btn:active { transform: scale(0.95); }
        
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center; margin-bottom: 10px; }
        .day-header { font-weight: bold; color: #8b4513; padding: 5px 0; border-bottom: 2px dashed #8b4513; margin-bottom: 5px; }
        
        .day-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; color: #333; position: relative; }
        .day-empty { background: transparent; }
        
        /* 試合がある日のボタン（クリック可能） */
        .day-active { background: #fff8dc; border: 2px solid #8b4513; color: #432517; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-decoration: none; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
        .day-active:hover { background: #ffecb3; }
        .day-active:active { transform: scale(0.95); }
        
        /* 試合がない日（クリック不可） */
        .day-inactive { background: rgba(0,0,0,0.05); color: #999; border: 1px dashed #ccc; }

        /* ★ 最推し選手が出場した日の特別ハイライト */
        .favorite-shine-day { background: linear-gradient(145deg, #fff3e0, #ffecb3) !important; border: 3px solid #ffd700 !important; color: #e91e63 !important; font-weight: 900 !important; box-shadow: 0 0 10px rgba(255, 215, 0, 0.8) !important; z-index: 10; transform: scale(1.05); }
        .favorite-shine-day::after { content: '★'; position: absolute; top: -8px; right: -5px; font-size: 0.8rem; color: #e91e63; text-shadow: 1px 1px 0 #ffd700; }
    </style>
</head>
<body class="theme-default">

    <header class="top-bar">
        <h1>試合結果アーカイブ</h1>
    </header>

    <main>
        <div class="calendar-container">
            <div class="month-header">
                <button id="prevMonthBtn" class="month-btn">◀ 前月</button>
                <div id="currentMonthLabel">2026年5月</div>
                <button id="nextMonthBtn" class="month-btn">次月 ▶</button>
            </div>
            
            <div class="calendar-grid" id="calendarGrid">
                <!-- ここにJSでカレンダーのマスが生成されます -->
            </div>
        </div>
    </main>

    <div class="bottom-menu">
        <button class="menu-btn btn-schedule" onclick="location.href='../index_web.html'">予定を確認</button>
        <button class="menu-btn btn-results" onclick="location.href='../performance.html'">昨日の日本人</button>
        <button class="menu-btn btn-calendar" onclick="location.href='../best11.html'">今週の日本代表</button>
        <button class="menu-btn btn-transfer" onclick="location.href='../transfer.html'">移籍</button>
        <button class="menu-btn btn-notes" onclick="location.href='../dashboard.html'">シーズン</button>
    </div>

    <script>
        // Node.jsから渡されたデータをJS変数として埋め込み
        const validDates = ${JSON.stringify(validDates)};
        const playerAppearanceMap = ${JSON.stringify(playerAppearanceMap)};
        
        // 描画用の状態管理
        let currentYear = 0;
        let currentMonth = 0; // 0-11
        let favoritePlayerName = ""; // 推し選手の名前（日本語）

        // 初期化処理
        document.addEventListener("DOMContentLoaded", () => {
            const savedTheme = localStorage.getItem('shioya_theme');
            if (savedTheme) document.body.className = savedTheme;

            // リストの最後（最新）の日付の月を初期表示とする
            if (validDates.length > 0) {
                const latestDateStr = validDates[validDates.length - 1];
                currentYear = parseInt(latestDateStr.substring(0, 4), 10);
                currentMonth = parseInt(latestDateStr.substring(4, 6), 10) - 1;
            } else {
                const today = new Date();
                currentYear = today.getFullYear();
                currentMonth = today.getMonth();
            }

            // ボタンのイベント
            document.getElementById('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
            document.getElementById('nextMonthBtn').addEventListener('click', () => changeMonth(1));

            // Firebase等からの推し選手判定
            fetch('../japanese_players.json').then(res => res.json()).then(playerDict => {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        try {
                            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                            if (userDoc.exists) {
                                const favId = userDoc.data().mostFavoriteId;
                                if (favId) {
                                    for (const team in playerDict) {
                                        if (playerDict[team][favId]) {
                                            favoritePlayerName = playerDict[team][favId].full;
                                            break;
                                        }
                                    }
                                }
                            }
                        } catch(e) { console.error(e); }
                    }
                    renderCalendar(); // 推しの判定が終わってから（または非ログイン確定後に）描画
                });
            }).catch(() => {
                renderCalendar(); // 辞書読み込み失敗時もとにかく描画
            });
        });

        function changeMonth(offset) {
            currentMonth += offset;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar();
        }

        function renderCalendar() {
            document.getElementById('currentMonthLabel').textContent = \`\${currentYear}年\${currentMonth + 1}月\`;
            
            const grid = document.getElementById('calendarGrid');
            grid.innerHTML = '';

            // 曜日のヘッダー
            const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
            dayNames.forEach(day => {
                const el = document.createElement('div');
                el.className = 'day-header';
                el.textContent = day;
                grid.appendChild(el);
            });

            // 月の最初の日と日数
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            // 空白のセル（月の始まりまで）
            for (let i = 0; i < firstDay; i++) {
                const el = document.createElement('div');
                el.className = 'day-cell day-empty';
                grid.appendChild(el);
            }

            // 日付のセル
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = \`\${currentYear}\${String(currentMonth + 1).padStart(2, '0')}\${String(day).padStart(2, '0')}\`;
                
                const cell = document.createElement('div');
                cell.className = 'day-cell';
                
                // その日が有効な日付リストに存在するか
                if (validDates.includes(dateStr)) {
                    const link = document.createElement('a');
                    link.href = \`\${dateStr}/index.html\`;
                    link.className = 'day-active';
                    link.textContent = day;

                    // 最推し選手が出場している日ならハイライトクラスを付与
                    if (favoritePlayerName && playerAppearanceMap[dateStr] && playerAppearanceMap[dateStr].includes(favoritePlayerName)) {
                        link.classList.add('favorite-shine-day');
                    }

                    cell.appendChild(link);
                } else {
                    // データなし
                    const div = document.createElement('div');
                    div.className = 'day-inactive day-cell';
                    div.style.width = '100%';
                    div.textContent = day;
                    cell.appendChild(div);
                }
                grid.appendChild(cell);
            }
        }
    </script>
</body>
</html>
`;

// カレンダーファイルの書き出し（すでに存在していても常に最新に上書き）
fs.writeFileSync(calendarHtmlPath, calendarHtmlContent, 'utf8');
console.log(`[成功] アーカイブカレンダー (public/archive/index.html) の生成が完了しました！`);
