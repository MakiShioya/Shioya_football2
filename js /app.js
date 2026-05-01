/**
 * LEAGUE_MASTERS: 指定された10リーグのチーム名を格納
 * ※一般的な英語/ローマ字表記です。表示されない場合はコンソールのログを確認し、
 * APIが実際に吐き出している名前に書き換えてください。
 */
const LEAGUE_MASTERS = {
    // 1. イングランド1部
    "premier_league": [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", 
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich", 
        "Leicester", "Liverpool", "Manchester City", "Manchester United", 
        "Newcastle United", "Nottingham Forest", "Tottenham Hotspur", 
        "West Ham United", "Wolverhampton"
    ],
    // 2. スペイン1部
    "laliga": [
        "Alaves", "Athletic Club", "Atletico Madrid", "Barcelona", "Celta Vigo", 
        "Espanyol", "Getafe", "Gironina", "Las Palmas", "Leganes", 
        "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", 
        "Real Sociedad", "Sevilla", "Valencia", "Valladolid", "Villarreal"
    ],
    // 3. ドイツ1部（確定版）
    "bundesliga": [
        "Bayern München", "Borussia Dortmund", "RB Leipzig", "VfB Stuttgart", "Hoffenheim", 
        "Bayer Leverkusen", "Eintracht Frankfurt", "Freiburg", "Augsburg", "Mainz 05", 
        "Borussia Mönchengladbach", "Werder Bremen", "Union Berlin", "1. FC Köln", 
        "Hamburger SV", "St. Pauli", "Wolfsburg", "FC Heidenheim"
    ],
    // 4. イタリア1部
    "serie_a": [
        "Atalanta", "Bologna", "Cagliari", "Como", "Empoli", 
        "Fiorentina", "Genoa", "Inter", "Juventus", "Lazio", 
        "Lecce", "Milan", "Monza", "Napoli", "Parma", 
        "Roma", "Torino", "Udinese", "Venezia", "Verona"
    ],
    // 5. フランス1部
    "ligue_1": [
        "Angers", "Auxerre", "Brest", "Le Havre", "Lens", 
        "Lille", "Lyon", "Marseille", "Monaco", "Montpellier", 
        "Nantes", "Nice", "PSG", "Reims", "Rennes", 
        "Saint-Etienne", "Strasbourg", "Toulouse"
    ],
    // 6. イングランド2部
    "championship": [
        "Blackburn", "Burnley", "Coventry", "Derby", "Leeds", 
        "Luton", "Middlesbrough", "Millwall", "Norwich", "Oxford", 
        "Plymouth", "Portsmouth", "Preston", "QPR", "Sheffield United", 
        "Sheffield Wednesday", "Stoke", "Sunderland", "Swansea", "Watford", 
        "West Bromwich Albion", "Bristol City", "Hull City", "Southampton", "Cardiff", "Birmingham"
    ],
    // 7. ベルギー1部
    "belgium": [
        "Anderlecht", "Antwerp", "Cercle Brugge", "Charleroi", "Club Brugge", 
        "Dender", "Genk", "Gent", "Kortrijk", "KV Mechelen", 
        "OH Leuven", "Sint-Truiden", "Standard Liege", "Union SG", "Westerlo", "Zulte Waregem"
    ],
    // 8. ポルトガル1部
    "portugal": [
        "Benfica", "Boavista", "Braga", "Casa Pia", "Estoril", 
        "Estrela da Amadora", "Famalicao", "Farense", "FC Porto", "Gil Vicente", 
        "Moreirense", "Nacional", "Rio Ave", "Santa Clara", "Sporting CP", 
        "Vitoria de Guimaraes", "AVS", "Arouca"
    ],
    // 9. オランダ1部
    "netherlands": [
        "Ajax", "Almere City", "AZ Alkmaar", "Feyenoord", "Fortuna Sittard", 
        "Go Ahead Eagles", "Groningen", "Heerenveen", "Heracles", "NAC Breda", 
        "NEC Nijmegen", "PEC Zwolle", "PSV Eindhoven", "RKC Waalwijk", "Sparta Rotterdam", 
        "Twente", "Utrecht", "Willem II"
    ],
    // 10. 日本 J1リーグ
    "j_league": [
        "Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "Consadole Sapporo", "FC Tokyo", 
        "Gamba Osaka", "Jubilo Iwata", "Kashima Antlers", "Kashiwa Reysol", "Kawasaki Frontale", 
        "Kyoto Sanga", "Machida Zelvia", "Nagoya Grampus", "Sagan Tosu", "Sanfrecce Hiroshima", 
        "Shonan Bellmare", "Tokyo Verdy", "Urawa Red Diamonds", "Vissel Kobe", "Yokohama F. Marinos"
    ],
    "ex": [
        "Bochum", "Fortuna Düsseldorf", "Darmstadt", "Hannover", "Karlsruhe", 
        "Preußen Münster", "Real Sociedad B", "Celtic"
    ]
};
// ▼▼ チーム名表示変換辞書 ▼▼
// ▼▼ チーム名表示変換辞書 ▼▼
const TEAM_DISPLAYS = {
    // 1. イングランド1部 (premier_league)
    "Arsenal": "🏴󠁧󠁢󠁥󠁮󠁧󠁿ARS アーセナル",
    "Aston Villa": "🏴󠁧󠁢󠁥󠁮󠁧󠁿AVL アストン・ヴィラ",
    "Bournemouth": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BOU ボーンマス",
    "Brentford": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BRE ブレントフォード",
    "Brighton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BHA ブライトン",
    "Chelsea": "🏴󠁧󠁢󠁥󠁮󠁧󠁿CHE チェルシー",
    "Crystal Palace": "🏴󠁧󠁢󠁥󠁮󠁧󠁿CRY クリスタル・パレス",
    "Everton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿EVE エヴァートン",
    "Fulham": "🏴󠁧󠁢󠁥󠁮󠁧󠁿FUL フラム",
    "Ipswich": "🏴󠁧󠁢󠁥󠁮󠁧󠁿IPS イプスウィッチ",
    "Leicester": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LEI レスター",
    "Liverpool": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LIV リヴァプール",
    "Manchester City": "🏴󠁧󠁢󠁥󠁮󠁧󠁿MCI マンチェスター・シティ",
    "Manchester United": "🏴󠁧󠁢󠁥󠁮󠁧󠁿MUN マンチェスター・ユナイテッド",
    "Newcastle United": "🏴󠁧󠁢󠁥󠁮󠁧󠁿NEW ニューカッスル",
    "Nottingham Forest": "🏴󠁧󠁢󠁥󠁮󠁧󠁿NFO ノッティンガム・フォレスト",
    "Tottenham Hotspur": "🏴󠁧󠁢󠁥󠁮󠁧󠁿TOT トッテナム",
    "West Ham United": "🏴󠁧󠁢󠁥󠁮󠁧󠁿WHU ウェストハム",
    "Wolverhampton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿WOL ウルヴス",

    // 2. スペイン1部 (laliga)
    "Alaves": "🇪🇸ALA アラベス",
    "Athletic Club": "🇪🇸ATH アスレティック・ビルバオ",
    "Atletico Madrid": "🇪🇸ATM アトレティコ・マドリード",
    "Barcelona": "🇪🇸BAR バルセロナ",
    "Celta Vigo": "🇪🇸CEL セルタ",
    "Espanyol": "🇪🇸ESP エスパニョール",
    "Getafe": "🇪🇸GET ヘタフェ",
    "Gironina": "🇪🇸GIR ジローナ",
    "Las Palmas": "🇪🇸LPA ラス・パルマス",
    "Leganes": "🇪🇸LEG レガネス",
    "Mallorca": "🇪🇸MLL マジョルカ",
    "Osasuna": "🇪🇸OSA オサスナ",
    "Rayo Vallecano": "🇪🇸RAY ラージョ・バジェカーノ",
    "Real Betis": "🇪🇸BET ベティス",
    "Real Madrid": "🇪🇸RMA レアル・マドリード",
    "Real Sociedad": "🇪🇸RSO レアル・ソシエダ",
    "Sevilla": "🇪🇸SEV セビージャ",
    "Valencia": "🇪🇸VAL バレンシア",
    "Valladolid": "🇪🇸VLL バジャドリード",
    "Villarreal": "🇪🇸VIL ビジャレアル",

    // 3. ドイツ1部 (bundesliga)
    "Bayern München": "🇩🇪FCB バイエルン・ミュンヘン",
    "Borussia Dortmund": "🇩🇪BVB ドルトムント",
    "RB Leipzig": "🇩🇪RBL RBライプツィヒ",
    "VfB Stuttgart": "🇩🇪VFB シュツットガルト",
    "Hoffenheim": "🇩🇪TSG ホッフェンハイム",
    "Bayer Leverkusen": "🇩🇪B04 レヴァークーゼン",
    "Eintracht Frankfurt": "🇩🇪SGE フランクフルト",
    "Freiburg": "🇩🇪SCF フライブルク",
    "Augsburg": "🇩🇪FCA アウクスブルク",
    "Mainz 05": "🇩🇪M05 マインツ",
    "Borussia Mönchengladbach": "🇩🇪BMG ボルシアMG",
    "Werder Bremen": "🇩🇪SVW ブレーメン",
    "Union Berlin": "🇩🇪FCU ウニオン・ベルリン",
    "1. FC Köln": "🇩🇪KOE ケルン",
    "Hamburger SV": "🇩🇪HSV ハンブルガーSV",
    "St. Pauli": "🇩🇪STP ザンクトパウリ",
    "Wolfsburg": "🇩🇪WOB ヴォルフスブルク",
    "FC Heidenheim": "🇩🇪FCH ハイデンハイム",

    // 4. イタリア1部 (serie_a)
    "Atalanta": "🇮🇹ATA アタランタ",
    "Bologna": "🇮🇹BOL ボローニャ",
    "Cagliari": "🇮🇹CAG カリアリ",
    "Como": "🇮🇹COM コモ",
    "Empoli": "🇮🇹EMP エンポリ",
    "Fiorentina": "🇮🇹FIO フィオレンティーナ",
    "Genoa": "🇮🇹GEN ジェノア",
    "Inter": "🇮🇹INT インテル",
    "Juventus": "🇮🇹JUV ユヴェントス",
    "Lazio": "🇮🇹LAZ ラツィオ",
    "Lecce": "🇮🇹LEC レッチェ",
    "Milan": "🇮🇹MIL ミラン",
    "Monza": "🇮🇹MON モンツァ",
    "Napoli": "🇮🇹NAP ナポリ",
    "Parma": "🇮🇹PAR パルマ",
    "Roma": "🇮🇹ROM ローマ",
    "Torino": "🇮🇹TOR トリノ",
    "Udinese": "🇮🇹UDI ウディネーゼ",
    "Venezia": "🇮🇹VEN ヴェネツィア",
    "Verona": "🇮🇹VER ヴェローナ",

    // 5. フランス1部 (ligue_1)
    "Angers": "🇫🇷ANG アンジェ",
    "Auxerre": "🇫🇷AUX オセール",
    "Brest": "🇫🇷BRE ブレスト",
    "Le Havre": "🇫🇷HAC ル・アーヴル",
    "Lens": "🇫🇷RCL ランス",
    "Lille": "🇫🇷LIL リール",
    "Lyon": "🇫🇷OL リヨン",
    "Marseille": "🇫🇷OM マルセイユ",
    "Monaco": "🇲🇨ASM モナコ",
    "Montpellier": "🇫🇷MHS モンペリエ",
    "Nantes": "🇫🇷FCN ナント",
    "Nice": "🇫🇷OGC ニース",
    "PSG": "🇫🇷PSG パリ・サンジェルマン",
    "Reims": "🇫🇷SDR スタッド・ランス",
    "Rennes": "🇫🇷REN レンヌ",
    "Saint-Etienne": "🇫🇷STE サンテティエンヌ",
    "Strasbourg": "🇫🇷STR ストラスブール",
    "Toulouse": "🇫🇷TFC トゥールーズ",

    // 6. イングランド2部 (championship)
    "Blackburn": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BLA ブラックバーン",
    "Burnley": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BUR バーンリー",
    "Coventry": "🏴󠁧󠁢󠁥󠁮󠁧󠁿COV コベントリー",
    "Derby": "🏴󠁧󠁢󠁥󠁮󠁧󠁿DER ダービー",
    "Leeds": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LEE リーズ",
    "Luton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿LUT ルートン",
    "Middlesbrough": "🏴󠁧󠁢󠁥󠁮󠁧󠁿MID ミドルズブラ",
    "Millwall": "🏴󠁧󠁢󠁥󠁮󠁧󠁿MIL ミルウォール",
    "Norwich": "🏴󠁧󠁢󠁥󠁮󠁧󠁿NOR ノリッジ",
    "Oxford": "🏴󠁧󠁢󠁥󠁮󠁧󠁿OXF オックスフォード",
    "Plymouth": "🏴󠁧󠁢󠁥󠁮󠁧󠁿PLY プリマス",
    "Portsmouth": "🏴󠁧󠁢󠁥󠁮󠁧󠁿POR ポーツマス",
    "Preston": "🏴󠁧󠁢󠁥󠁮󠁧󠁿PNE プレストン",
    "QPR": "🏴󠁧󠁢󠁥󠁮󠁧󠁿QPR QPR",
    "Sheffield United": "🏴󠁧󠁢󠁥󠁮󠁧󠁿SHU シェフィールド・U",
    "Sheffield Wednesday": "🏴󠁧󠁢󠁥󠁮󠁧󠁿SHW シェフィールド・W",
    "Stoke": "🏴󠁧󠁢󠁥󠁮󠁧󠁿STK ストーク",
    "Sunderland": "🏴󠁧󠁢󠁥󠁮󠁧󠁿SUN サンダーランド",
    "Swansea": "🏴󠁧󠁢󠁷󠁬󠁳󠁿SWA スウォンジー",
    "Watford": "🏴󠁧󠁢󠁥󠁮󠁧󠁿WAT ワトフォード",
    "West Bromwich Albion": "🏴󠁧󠁢󠁥󠁮󠁧󠁿WBA WBA",
    "Bristol City": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BRC ブリストル・C",
    "Hull City": "🏴󠁧󠁢󠁥󠁮󠁧󠁿HUL ハル・C",
    "Southampton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿SOU サウサンプトン",
    "Cardiff": "🏴󠁧󠁢󠁷󠁬󠁳󠁿CAR カーディフ",
    "Birmingham": "🏴󠁧󠁢󠁥󠁮󠁧󠁿BIR バーミンガム",

    // 7. ベルギー1部 (belgium)
    "Anderlecht": "🇧🇪AND アンデルレヒト",
    "Antwerp": "🇧🇪ANT アントワープ",
    "Cercle Brugge": "🇧🇪CER セルクル・ブルッヘ",
    "Charleroi": "🇧🇪CHA シャルルロワ",
    "Club Brugge": "🇧🇪CLU クラブ・ブルッヘ",
    "Dender": "🇧🇪DEN デンデル",
    "Genk": "🇧🇪GNK ヘンク",
    "Gent": "🇧🇪GNT ヘント",
    "Kortrijk": "🇧🇪KVK コルトレイク",
    "KV Mechelen": "🇧🇪KVM メヘレン",
    "OH Leuven": "🇧🇪OHL ルーヴェン",
    "Sint-Truiden": "🇧🇪STV シント＝トロイデン",
    "Standard Liege": "🇧🇪STA スタンダール",
    "Union SG": "🇧🇪USG サン・ジロワーズ",
    "Westerlo": "🇧🇪WES ウェステルロー",
    "Zulte Waregem": "🇧🇪ZWA ズルテ・ワレヘム",

    // 8. ポルトガル1部 (portugal)
    "Benfica": "🇵🇹SLB ベンフィカ",
    "Boavista": "🇵🇹BOA ボアヴィスタ",
    "Braga": "🇵🇹SCB ブラガ",
    "Casa Pia": "🇵🇹CAS カーザ・ピア",
    "Estoril": "🇵🇹EST エストリル",
    "Estrela da Amadora": "🇵🇹EST エストレラ",
    "Famalicao": "🇵🇹FAM ファマリカン",
    "Farense": "🇵🇹FAR ファレンセ",
    "FC Porto": "🇵🇹FCP ポルト",
    "Gil Vicente": "🇵🇹GIL ジル・ヴィセンテ",
    "Moreirense": "🇵🇹MOR モレイレンセ",
    "Nacional": "🇵🇹NAC ナシオナル",
    "Rio Ave": "🇵🇹RAV リオ・アヴェ",
    "Santa Clara": "🇵🇹SCL サンタクララ",
    "Sporting CP": "🇵🇹SCP スポルティング",
    "Vitoria de Guimaraes": "🇵🇹VSC ヴィトーリア",
    "AVS": "🇵🇹AVS AVS",
    "Arouca": "🇵🇹ARO アロウカ",

    // 9. オランダ1部 (netherlands)
    "Ajax": "🇳🇱AJA アヤックス",
    "Almere City": "🇳🇱ALM アルメレ・シティ",
    "AZ Alkmaar": "🇳🇱AZ AZ",
    "Feyenoord": "🇳🇱FEY フェイエノールト",
    "Fortuna Sittard": "🇳🇱FOR フォルトゥナ",
    "Go Ahead Eagles": "🇳🇱GAE ゴーアヘッド",
    "Groningen": "🇳🇱GRO フローニンゲン",
    "Heerenveen": "🇳🇱HEE ヘーレンフェーン",
    "Heracles": "🇳🇱HER ヘラクレス",
    "NAC Breda": "🇳🇱NAC NACブレダ",
    "NEC Nijmegen": "🇳🇱NEC NECナイメヘン",
    "PEC Zwolle": "🇳🇱PEC PECズヴォレ",
    "PSV Eindhoven": "🇳🇱PSV PSV",
    "RKC Waalwijk": "🇳🇱RKC RKCワールワイク",
    "Sparta Rotterdam": "🇳🇱SPA スパルタ・ロッテルダム",
    "Twente": "🇳🇱TWE トゥウェンテ",
    "Utrecht": "🇳🇱UTR ユトレヒト",
    "Willem II": "🇳🇱WIL ヴィレムII",

    // 10. 日本 J1リーグ (j_league)
    "Albirex Niigata": "🇯🇵ALB アルビレックス新潟",
    "Avispa Fukuoka": "🇯🇵AVI アビスパ福岡",
    "Cerezo Osaka": "🇯🇵CER セレッソ大阪",
    "Consadole Sapporo": "🇯🇵CON 北海道コンサドーレ札幌",
    "FC Tokyo": "🇯🇵FCT FC東京",
    "Gamba Osaka": "🇯🇵GAM ガンバ大阪",
    "Jubilo Iwata": "🇯🇵JUB ジュビロ磐田",
    "Kashima Antlers": "🇯🇵KAS 鹿島アントラーズ",
    "Kashiwa Reysol": "🇯🇵KSW 柏レイソル",
    "Kawasaki Frontale": "🇯🇵KAW 川崎フロンターレ",
    "Kyoto Sanga": "🇯🇵KYO 京都サンガ",
    "Machida Zelvia": "🇯🇵MAC 町田ゼルビア",
    "Nagoya Grampus": "🇯🇵NAG 名古屋グランパス",
    "Sagan Tosu": "🇯🇵SAG サガン鳥栖",
    "Sanfrecce Hiroshima": "🇯🇵SAN サンフレッチェ広島",
    "Shonan Bellmare": "🇯🇵SHO 湘南ベルマーレ",
    "Tokyo Verdy": "🇯🇵VER 東京ヴェルディ",
    "Urawa Red Diamonds": "🇯🇵URA 浦和レッズ",
    "Vissel Kobe": "🇯🇵VIS ヴィッセル神戸",
    "Yokohama F. Marinos": "🇯🇵YFM 横浜F・マリノス",

    // その他・例外チーム (ex)
    "Bochum": "🇩🇪BOC ボーフム",
    "Fortuna Düsseldorf": "🇩🇪F95 デュッセルドルフ",
    "Darmstadt": "🇩🇪SVD ダルムシュタット",
    "Hannover": "🇩🇪H96 ハノーファー",
    "Karlsruhe": "🇩🇪KSC カールスルーエ",
    "Preußen Münster": "🇩🇪PRM P・ミュンスター",
    "Real Sociedad B": "🇪🇸RSO レアル・ソシエダB",
    "Celtic": "🏴󠁧󠁢󠁳󠁣󠁴󠁿CEL セルティック"
};

// ▼▼ 日本人選手マスターデータ ▼▼

// ▼▼ 日本人選手マスターデータ（提供データからの完全抽出版） ▼▼
const JAPANESE_PLAYERS = {
    // イングランド1部・2部
    "Crystal Palace": ["鎌田大地"],
    "Liverpool": ["遠藤航"],
    "Brighton": ["三笘薫"],
    "Southampton": ["松木玖生"],
    "Leeds": ["田中碧"],
    "Blackburn": ["大橋祐紀", "森下龍矢"],
    "Coventry": ["坂元達裕"],
    "Hull City": ["平河悠"],
    "QPR": ["斉藤光毅"],
    "Stoke": ["瀬古樹"],
    "Birmingham": ["岩田智輝", "藤本寛也", "古橋亨梧"],

    // スペイン1部・2部
    "Real Sociedad": ["久保建英"],
    "Mallorca": ["浅野拓磨"],
    "Las Palmas": ["宮代大聖"],
    "Real Sociedad B": ["喜多壱也"],

    // ドイツ1部・2部
    "Bayern München": ["伊藤洋輝"],
    "Freiburg": ["鈴木唯人"],
    "Werder Bremen": ["菅原由勢"],
    "Eintracht Frankfurt": ["小杉啓太", "堂安律"],
    "Hoffenheim": ["町田浩樹"],
    "Mainz 05": ["川崎颯太", "佐野海舟"],
    "Borussia Mönchengladbach": ["高井幸大", "町野修斗"],
    "St. Pauli": ["ニック・シュミット", "安藤智哉", "原大智", "藤田譲瑠チマ"],
    "Wolfsburg": ["塩貝健人"],
    "Bochum": ["三好康児"],
    "Fortuna Düsseldorf": ["アペルカンプ真大", "田中聡"],
    "Darmstadt": ["秋山裕紀", "古川陽介"],
    "Hannover": ["松田隼風", "横田大祐"],
    "Karlsruhe": ["福田師王"],
    "Preußen Münster": ["山田新"],

    // イタリア1部
    "Parma": ["鈴木彩艶"],

    // フランス1部
    "Monaco": ["南野拓実"],
    "Le Havre": ["瀬古歩夢"],

    // ベルギー1部
    "OH Leuven": ["明本考浩", "大南拓磨"],
    "Westerlo": ["木村誠二", "齋藤俊輔", "坂本一彩"],
    "Genk": ["伊東純也", "横山歩夢", "吉永夢希"],
    "Sint-Truiden": ["伊藤涼太郎", "小久保玲央ブライアン", "後藤啓介", "新川志音", "谷口彰悟", "畑大雅", "松澤海斗", "山本理仁"],
    "Gent": ["伊藤敦樹", "橋岡大樹"],
    "Antwerp": ["綱島悠斗", "野沢大志ブランドン"],

    // オランダ1部
    "Ajax": ["板倉滉", "冨安健洋"],
    "NEC Nijmegen": ["小川航基", "佐野航大"],
    "Feyenoord": ["上田綺世", "渡辺剛"],
    "AZ Alkmaar": ["市原吏音", "毎熊晟矢"],
    "Sparta Rotterdam": ["三戸舜介"],

    // ポルトガル1部
    "Sporting CP": ["守田英正"],
    "Arouca": ["福井太智"],

    // スコットランド（10リーグ外）
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
        const response = await fetch(`/api/matches?date=${dateStr}`);
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
        const inTargetLeague = targetTeams.includes(match.home.name) || targetTeams.includes(match.away.name);
        if (!inTargetLeague) return false;

        if (isJapaneseOnly) {
            const hasJapaneseHome = JAPANESE_PLAYERS[match.home.name] !== undefined;
            const hasJapaneseAway = JAPANESE_PLAYERS[match.away.name] !== undefined;
            return hasJapaneseHome || hasJapaneseAway;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">該当する試合予定はありません。</p>';
        return;
    }

    container.innerHTML = filtered.map(match => {
        const dateObj = new Date(match.timeTS);
        const jstTimeStr = new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(dateObj);

        const displayHomeName = TEAM_DISPLAYS[match.home.name] || match.home.name;
        const displayAwayName = TEAM_DISPLAYS[match.away.name] || match.away.name;

        const homePlayers = JAPANESE_PLAYERS[match.home.name] ? JAPANESE_PLAYERS[match.home.name].join(', ') : '';
        const awayPlayers = JAPANESE_PLAYERS[match.away.name] ? JAPANESE_PLAYERS[match.away.name].join(', ') : '';

        const homeBadge = homePlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${homePlayers}</div>` : '';
        const awayBadge = awayPlayers ? `<div style="font-size: 0.75em; color: white; background: #0046A7; padding: 3px 8px; border-radius: 10px; margin-top: 8px; display: inline-block;">🇯🇵 ${awayPlayers}</div>` : '';

        return `
            <div style="border: 3px solid #8b4513; padding: 15px; margin: 15px auto; width: 95%; max-width: 500px; border-radius: 12px; background: #fff8dc; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: #333;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 10px; text-align: center; font-weight: bold;">${jstTimeStr} (日本時間)</div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem;">${displayHomeName}</div>
                        ${homeBadge}
                    </div>
                    <div style="width: 20%; text-align: center; font-size: 1.3em; font-weight: 900; margin-top: 5px; color: #432517;">
                        VS
                    </div>
                    <div style="width: 40%; text-align: center;">
                        <div style="font-weight: bold; font-size: 1rem;">${displayAwayName}</div>
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
