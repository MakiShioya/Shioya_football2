const fs = require('fs');
const path = require('path');

const transfersPath = path.join(__dirname, 'public', 'data', 'transfers.json');
const transferHtmlPath = path.join(__dirname, 'public', 'transfer.html');
const outputPath = path.join(__dirname, 'public', 'transfer_web.html');

if (!fs.existsSync(transfersPath) || !fs.existsSync(transferHtmlPath)) {
    console.log(`[SEO] 必要なファイルがないため、transfer_web.html の生成をスキップします。`);
    process.exit(0);
}

// データの読み込み
const transferData = JSON.parse(fs.readFileSync(transfersPath, 'utf8')).transfers || [];

// HTMLの組み立て（元の描画ロジックを忠実に再現）
let transferHtml = '';
if (transferData.length === 0) {
    transferHtml = '<p style="text-align:center; padding: 40px; color: #ECDBBF;">該当する移籍情報はありません。</p>';
} else {
    transferHtml = transferData.map(data => {
        const cardClass = data.status === "確定" ? "status-confirmed" : "status-rumor";
        const badgeClass = data.status === "確定" ? "badge-confirmed" : "badge-rumor";

        const clubsHtml = data.clubs.map(club => {
            return `<li class="club-item">➡ ${club.name}</li>`;
        }).join('');

        // クローラーにリーグとステータスを判別させるためのカスタムデータ属性(data-*)も付与して出力
        const leaguesAttr = data.clubs.map(c => c.league).join(',');

        return `
            <div class="transfer-card ${cardClass}" data-status="${data.status}" data-leagues="${leaguesAttr}">
                <div class="update-time">更新: ${data.lastUpdated}</div>
                <div class="card-header">
                    <span class="player-name">🇯🇵 ${data.player}</span>
                    <span class="status-badge ${badgeClass}">${data.status}</span>
                </div>
                <ul class="club-list">
                    ${clubsHtml}
                </ul>
            </div>
        `;
    }).join('\n');
}

// 元の transfer.html を読み込んで <main id="transfer-list"> の中身を書き換える
let baseHtml = fs.readFileSync(transferHtmlPath, 'utf8');
const regex = /(<main id="transfer-list">)[\s\S]*?(<\/main>)/i;
baseHtml = baseHtml.replace(regex, `$1\n${transferHtml}\n$2`);

// Web版専用の生成
fs.writeFileSync(outputPath, baseHtml, 'utf8');
console.log(`[SEO] Web版専用の transfer_web.html を同じ階層に生成しました。`);
