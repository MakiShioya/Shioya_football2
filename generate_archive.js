// generate_archive.js
const fs = require('fs');
const path = require('path');

// --- 1. 設定 ---
const TARGET_DATE = '20260517'; 
const BASE_DIR = path.join(__dirname, 'public');
const ARCHIVE_DIR = path.join(BASE_DIR, 'archive', TARGET_DATE);

// --- 2. 辞書データ ---
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
    "SPL": { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", jp: "スコットランド" },
    "CL":  { flag: "🇪🇺", jp: "CL" },
    "EL":  { flag: "🇪🇺", jp: "EL" },
    "ECL": { flag: "🇪🇺", jp: "ECL" }
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

// --- 3. データの読み込み ---
const statsPath = path.join(BASE_DIR, 'data', 'matches', `stats_${TARGET_DATE}.json`);
const matchesPath = path.join(BASE_DIR, 'data', 'matches', `matches_${TARGET_DATE}.json`);

if (!fs.existsSync(statsPath) || !fs.existsSync(matchesPath)) {
    console.log(`[スキップ] ${TARGET_DATE} のデータが見つかりません。`);
    process.exit(0);
}

const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8')).stats;
const matchesData = JSON.parse(fs.readFileSync(matchesPath, 'utf8')).matches || JSON.parse(fs.readFileSync(matchesPath, 'utf8')).response.matches;

// --- 4. 便利なヘルパー関数 ---
// UTC日時を日本時間（YYYY/MM/DD HH:mm）に変換
function formatJST(utcDateString) {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 9); // JSTに変換
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

// チーム名の日本語化（辞書にない場合は英語そのまま）
function getTeamName(englishName) {
    return TEAM_DISPLAYS[englishName] || englishName;
}

// --- 5. HTMLの組み立て ---
const displayYear = TARGET_DATE.substring(0,4);
const displayMonth = TARGET_DATE.substring(4,6);
const displayDay = TARGET_DATE.substring(6,8);

let htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayYear}年${displayMonth}月${displayDay}日 海外日本人選手 試合結果 | しおやフットボール</title>
    <meta name="description" content="${displayYear}年${displayMonth}月${displayDay}日に行われた海外日本人サッカー選手の試合結果と個人成績（スタメン、ゴール、アシスト、評価点）です。">
    <link rel="stylesheet" href="../../common.css">
    <style>
        /* アーカイブ用の追加スタイル */
        .archive-match-card { background: #fff8dc; border: 3px solid #8b4513; border-radius: 12px; margin: 15px auto; padding: 15px; width: 95%; max-width: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        .archive-header { display: flex; justify-content: space-between; font-size: 0.85em; color: #666; margin-bottom: 10px; font-weight: bold; border-bottom: 1px dashed #ccc; padding-bottom: 5px; }
        .archive-score-board { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .archive-team { width: 40%; text-align: center; font-weight: bold; font-size: 1rem; }
        .archive-score { width: 20%; text-align: center; font-size: 1.4em; font-weight: 900; color: #432517; }
        .archive-players { background: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; font-size: 0.9em; }
        .player-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 4px 0; }
        .player-row:last-child { border-bottom: none; }
        .status-badge { font-size: 0.7em; padding: 2px 6px; border-radius: 4px; color: white; margin-left: 5px; }
        .starter-badge { background-color: #d9534f; }
        .sub-badge { background-color: #5bc0de; }
        .goal-assist { color: #d9534f; font-weight: bold; }
    </style>
</head>
<body>
    <header class="top-bar">
        <h1>${displayYear}年${displayMonth}月${displayDay}日<br>日本人選手 試合結果</h1>
    </header>
    <main id="match-list">
`;

let renderedMatchCount = 0;

// 試合ごとにループ
matchesData.forEach(match => {
    // この試合に出場した日本人選手を抽出
    const japanesePlayersInThisMatch = statsData.filter(stat => stat.fixtureId === match.fixtureId);

    // 日本人がいない試合はスキップ（SEO対策）
    if (japanesePlayersInThisMatch.length === 0) return;

    renderedMatchCount++;

    const compCode = match.competition.code || "OTHER";
    const leagueInfo = LEAGUE_INFO[compCode] || { flag: "⚽", jp: match.competition.name };
    const jstTime = formatJST(match.utcDate);
    const homeName = getTeamName(match.homeTeam.name);
    const awayName = getTeamName(match.awayTeam.name);
    
    // スコアの処理（試合前や中止の場合はスコアが入っていないため）
    let scoreText = "VS";
    if (match.status === "FT" || match.status === "AET" || match.status === "PEN") {
        scoreText = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
    } else if (match.status === "CANC" || match.status === "PST") {
        scoreText = "延期";
    }

    // 選手情報のHTMLを組み立て
    let playersHtml = "";
    japanesePlayersInThisMatch.forEach(player => {
        const statusBadge = player.starter 
            ? `<span class="status-badge starter-badge">スタメン</span>` 
            : `<span class="status-badge sub-badge">途中出場</span>`;
            
        let events = [];
        if (player.goals > 0) events.push(`⚽ ${player.goals}G`);
        if (player.assists > 0) events.push(`👟 ${player.assists}A`);
        const eventsHtml = events.length > 0 ? `<span class="goal-assist">${events.join(' ')}</span>` : '';

        playersHtml += `
            <div class="player-row">
                <div><strong>${player.name}</strong> ${statusBadge}</div>
                <div>⏱${player.minutes}分 📊${player.rating} ${eventsHtml}</div>
            </div>
        `;
    });

    // 試合カードHTMLを追記
    htmlContent += `
        <article class="archive-match-card">
            <div class="archive-header">
                <span>${leagueInfo.flag} ${leagueInfo.jp}</span>
                <span>${jstTime}</span>
            </div>
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

// もし1試合も日本人が出場していなかった場合のメッセージ
if (renderedMatchCount === 0) {
    htmlContent += `<p style="text-align:center; padding: 40px; color: #888;">この日に出場した日本人選手の記録はありません。</p>`;
}

htmlContent += `
        <div style="text-align: center; margin: 30px 0;">
            <a href="../../index_web.html" style="padding: 10px 20px; background: #8b4513; color: white; text-decoration: none; border-radius: 8px;">トップページへ戻る</a>
        </div>
    </main>
</body>
</html>
`;

// --- 6. ファイルの出力 ---
if (!fs.existsSync(ARCHIVE_DIR)){
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}
fs.writeFileSync(path.join(ARCHIVE_DIR, 'index.html'), htmlContent, 'utf8');
console.log(`[成功] ${TARGET_DATE}/index.html に ${renderedMatchCount} 試合の記録を生成しました！`);
