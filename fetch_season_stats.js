const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_SPORTS_KEY;
const SEASON = 2025; // 欧州25-26シーズン

// チームID（API事実データ）と、英語名・日本語名の紐付けを統合した設定
const TEAM_CONFIG = {
    "Crystal Palace": { id: 52, players: { "Kamada": "鎌田大地" } },
    "Liverpool": { id: 40, players: { "Endo": "遠藤航" } },
    "Brighton": { id: 33, players: { "Mitoma": "三笘薫" } },
    "Southampton": { id: 41, players: { "Matsuki": "松木玖生" } },
    "Leeds": { id: 63, players: { "Tanaka": "田中碧" } },
    "Blackburn": { id: 65, players: { "Ohashi": "大橋祐紀", "Morishita": "森下龍矢" } },
    "Coventry": { id: 74, players: { "Sakamoto": "坂元達裕" } },
    "Hull City": { id: 67, players: { "Hirakawa": "平河悠" } },
    "QPR": { id: 71, players: { "Saito": "斉藤光毅" } },
    "Stoke City": { id: 69, players: { "Seko": "瀬古樹" } },
    "Birmingham": { id: 75, players: { "Iwata": "岩田智輝", "Fujimoto": "藤本寛也", "Furuhashi": "古橋亨梧" } },

    "Real Sociedad": { id: 548, players: { "Kubo": "久保建英" } },
    "Mallorca": { id: 533, players: { "Asano": "浅野拓磨" } },
    "Las Palmas": { id: 534, players: { "Miyashiro": "宮代大聖" } },

    "Bayern München": { id: 157, players: { "Ito": "伊藤洋輝" } },
    "SC Freiburg": { id: 160, players: { "Suzuki": "鈴木唯人" } },
    "Werder Bremen": { id: 162, players: { "Sugawara": "菅原由勢" } },
    "Eintracht Frankfurt": { id: 169, players: { "Kosugi": "小杉啓太", "Doan": "堂安律" } },
    "1899 Hoffenheim": { id: 167, players: { "Machida": "町田浩樹" } },
    "Mainz 05": { id: 164, players: { "Kawasaki": "川崎颯太", "Sano": "佐野海舟" } },
    "Borussia Monchengladbach": { id: 163, players: { "Takai": "高井幸大", "Machino": "町野修斗" } },
    "St. Pauli": { id: 186, players: { "Schmidt": "ニック・シュミット", "Ando": "安藤智哉", "Hara": "原大智", "Fujita": "藤田譲瑠チマ" } },
    "VfL Wolfsburg": { id: 161, players: { "Shiogai": "塩貝健人" } },
    "VfL Bochum": { id: 176, players: { "Miyoshi": "三好康児" } },
    "Fortuna Dusseldorf": { id: 174, players: { "Appelkamp": "アペルカンプ真大", "Tanaka": "田中聡" } },

    "Parma": { id: 523, players: { "Suzuki": "鈴木彩艶" } },
    "Monaco": { id: 91, players: { "Minamino": "南野拓実" } },
    "Le Havre": { id: 93, players: { "Seko": "瀬古歩夢" } },

    "Sint-Truiden": { id: 642, players: { "Ito": "伊藤涼太郎", "Kokubo": "小久保玲央ブライアン", "Taniguchi": "谷口彰悟", "Yamamoto": "山本理仁" } },
    "Ajax": { id: 194, players: { "Itakura": "板倉滉", "Tomiyasu": "冨安健洋" } },
    "Feyenoord": { id: 402, players: { "Ueda": "上田綺世", "Watanabe": "渡辺剛" } },
    "Sporting CP": { id: 228, players: { "Morita": "守田英正" } },
    "Celtic": { id: 252, players: { "Hatate": "旗手怜央", "Maeda": "前田大然" } }
};

async function fetchSeasonStats() {
    const allJapaneseStats = [];
    const dir = path.join(__dirname, 'data', 'season');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const [teamName, config] of Object.entries(TEAM_CONFIG)) {
        console.log(`[Season] ${teamName} の通算データを取得中...`);

        const url = `https://v3.football.api-sports.io/players?team=${config.id}&season=${SEASON}`;
        
        try {
            const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
            const data = await res.json();

            if (data.response) {
                data.response.forEach(item => {
                    const p = item.player;
                    const s = item.statistics[0]; // リーグ戦のメインデータ

                    // 英語名が含まれているかチェックし、日本語名を取得
                    for (const [engKey, jpName] of Object.entries(config.players)) {
                        if (p.name.includes(engKey)) {
                            // 評価点がnullの場合は0にするなど、データ欠損に対する処理
                            const ratingRaw = s.games.rating;
                            const finalRating = ratingRaw ? parseFloat(ratingRaw).toFixed(2) : "0.00";

                            allJapaneseStats.push({
                                id: p.id,
                                name: jpName, // 日本語名をセットしてJSONに保存
                                photo: p.photo,
                                team: teamName,
                                league: s.league.name,
                                leagueCode: s.league.country === 'Japan' ? 'J1' : 'EUR',
                                goals: s.goals.total || 0,
                                assists: s.goals.assists || 0,
                                rating: finalRating,
                                minutes: s.games.minutes || 0,
                                appearences: s.games.appearences || 0
                            });
                        }
                    }
                });
            }
        } catch (error) {
            console.error(`[Error] ${teamName} のデータ取得に失敗しました:`, error);
        }
        
        // APIのレートリミット（連続リクエスト制限）を避けるための待機処理
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // まとめたデータを保存
    fs.writeFileSync(
    path.join(dir, 'season_stats.json'),
    JSON.stringify({ updated: new Date().toISOString(), players: allJapaneseStats }),
    'utf8'
);
    console.log('通算スタッツデータの更新が完了しました。');
}

fetchSeasonStats();
