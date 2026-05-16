const fs = require('fs');
const path = require('path');

// 今日の日付文字列を取得 (JST)
const d = new Date();
d.setUTCHours(d.getUTCHours() + 9);
const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');

const matchesPath = path.join(__dirname, 'public', 'data', 'matches', `matches_${dateStr}.json`);
const indexPath = path.join(__dirname, 'public', 'index.html');
const outputPath = path.join(__dirname, 'public', 'index_web.html');
const playerDictionaryPath = path.join(__dirname, 'public', 'japanese_players.json');

if (!fs.existsSync(matchesPath) || !fs.existsSync(indexPath)) {
    console.log(`[SEO] 必要なファイルがないため、index_web.html の生成をスキップします。`);
    process.exit(0);
}

const allMatches = JSON.parse(fs.readFileSync(matchesPath, 'utf8')).response.matches || [];
const JP_TEAM_PLAYERS = JSON.parse(fs.readFileSync(playerDictionaryPath, 'utf8'));

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

const MAJOR_LEAGUE_CODES = ["PL", "PD", "BL1", "SA1", "FL1", "CL", "EL", "ECL"]; 

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
    "Lyon": "リヨン", "Marseille": "マルセイ修", "Monaco": "モナコ", "Montpellier": "モンペリエ", 
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

// 五大リーグ＆日本人所属チームの試合のみに絞り込んでHTMLを組み立てる
const filtered = allMatches.filter(match => {
    if (!MAJOR_LEAGUE_CODES.includes(match.competition.code)) return false;
    return JP_TEAM_PLAYERS[match.homeTeam.name] !== undefined || JP_TEAM_PLAYERS[match.awayTeam.name] !== undefined;
});

let matchHtml = '\n <h2>今日の試合一覧</h2>\n';
if (filtered.length === 0) {
    matchHtml += '<p style="text-align:center; padding: 40px; color: #888;">該当する試合予定はありません。</p>\n';
} else {
    matchHtml += filtered.map(match => {
        const info = LEAGUE_INFO[match.competition.code] || { flag: "🏳️" };
        
        // タイムゾーン（JST）の計算を厳密に処理
        const dateObj = new Date(match.utcDate);
        const jstTime = new Date(dateObj.getTime() + 9 * 60 * 60 * 1000);
        
        let displayHour = jstTime.getUTCHours();
        const displayMinute = String(jstTime.getUTCMinutes()).padStart(2, '0');
        
        const todayObj = new Date();
        todayObj.setUTCHours(todayObj.getUTCHours() + 9);
        
        if (jstTime.getUTCDate() !== todayObj.getUTCDate() && jstTime.getTime() > todayObj.getTime()) {
            displayHour += 24;
        }
        const timeStr = `${displayHour}:${displayMinute}`;
        
        const homeJP = TEAM_DISPLAYS[match.homeTeam.name] || match.homeTeam.name;
        const awayJP = TEAM_DISPLAYS[match.awayTeam.name] || match.awayTeam.name;
        
        const homePlayers = Object.values(JP_TEAM_PLAYERS[match.homeTeam.name] || {}).map(p => p.short).join(', ');
        const awayPlayers = Object.values(JP_TEAM_PLAYERS[match.awayTeam.name] || {}).map(p => p.short).join(', ');

        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">${awayPlayers}</div>` : '';

        const hScore = match.score?.fullTime?.home;
        const aScore = match.score?.fullTime?.away;
        const status = match.status;
        const finished = ["FT", "AET", "PEN"];
        const inPlay = ["1H", "2H", "HT", "ET", "BT", "P", "SUSP", "INT", "LIVE"];
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
                </div>`;
        }

        return `
            <div class="" style="border: 3px solid #8b4513; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; border-radius: 12px; background: #fff8dc; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold;">${timeStr} (日本時間)</div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 38%; text-align: center;">
                        <div class="player-name" style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${info.flag} ${homeJP}</div>
                        ${homeBadge}
                    </div>
                    <div style="width: 24%; text-align: center; margin-top: 5px; display: flex; justify-content: center; align-items: center;">
                        ${scoreDisplay}
                    </div>
                    <div style="width: 38%; text-align: center;">
                        <div class="player-name" style="font-weight: bold; font-size: 1rem; line-height: 1.4;">${info.flag} ${awayJP}</div>
                        ${awayBadge}
                    </div>
                </div>
            </div>`;
    }).join('\n');
}

// 元の index.html を読み込んで <main id="match-list"> の中身を書き換えて index_web.html として保存する
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const regex = /(<main id="match-list">)[\s\S]*?(<\/main>)/i;
indexHtml = indexHtml.replace(regex, `$1${matchHtml}$2`);

fs.writeFileSync(outputPath, indexHtml, 'utf8');
console.log(`[SEO] Web版専用の index_web.html を同じ階層に生成しました。`);