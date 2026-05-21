const fs = require('fs');
const path = require('path');

const transfersPath = path.join(__dirname, 'public', 'data', 'transfers.json');
const transferHtmlPath = path.join(__dirname, 'public', 'transfer.html');
const outputPath = path.join(__dirname, 'public', 'transfer_web.html');

if (!fs.existsSync(transfersPath) || !fs.existsSync(transferHtmlPath)) {
    console.log(`[SEO] 必要なファイルがないため、transfer_web.html の生成をスキップします。`);
    process.exit(0);
}

const transferData = JSON.parse(fs.readFileSync(transfersPath, 'utf8')).transfers || [];

let transferHtml = '';
if (transferData.length === 0) {
    transferHtml = '<p style="text-align:center; padding: 40px; color: #ECDBBF;">該当する移籍情報はありません。</p>';
} else {
    // generate_web_transfer.js のループ処理修正案
    // generate_web_transfer.js のループ処理修正
    transferHtml = transferData.map(data => {
        const cardClass = data.status === "確定" ? "status-confirmed" : "status-rumor";
        const badgeClass = data.status === "確定" ? "badge-confirmed" : "badge-rumor";
        const clubsHtml = data.clubs.map(club => `<li class="club-item">➡ ${club.name}</li>`).join('');
        const leaguesAttr = data.clubs.map(c => c.league).join(',');

        // 移籍先の下に表示される小さめの文章欄
        const commentHtml = data.comment ? `
            <div class="transfer-comment" style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(139,69,19,0.2); font-size: 0.85rem; color: #555; line-height: 1.4; text-align: left;">
                ${data.comment}
            </div>` : '';

        return `
            <div class="transfer-card ${cardClass}" data-status="${data.status}" data-leagues="${leaguesAttr}" data-time="${data.lastUpdated}" data-player="${data.player}">
                <div class="update-time">更新: ${data.lastUpdated}</div>
                <div class="card-header">
                    <span class="player-name">🇯🇵 ${data.player}</span>
                    <span class="status-badge ${badgeClass}">${data.status}</span>
                </div>
                <ul class="club-list">
                    ${clubsHtml}
                </ul>
                ${commentHtml}
            </div>
        `;
    }).join('\n');
}

let baseHtml = fs.readFileSync(transferHtmlPath, 'utf8');
const regex = /(<main id="transfer-list">)[\s\S]*?(<\/main>)/i;
baseHtml = baseHtml.replace(regex, `$1\n${transferHtml}\n$2`);

fs.writeFileSync(outputPath, baseHtml, 'utf8');
console.log(`[SEO] Web版専用の transfer_web.html を同じ階層に生成しました。`);
