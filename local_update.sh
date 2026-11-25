#!/bin/bash

# 1. Shioya_football2 ディレクトリに移動
cd ~/Shioya_football2

# 2. 環境変数の設定 (Node.jsやGitのコマンドを見つけるため)
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin:/Users/$USER/.nvm/versions/node/$(node -v 2>/dev/null)/bin

# 3. APIキーの設定
# APIキーは git 管理外のファイルから読み込む（公開リポジトリにキーを書かないため）
KEY_FILE="$HOME/.config/shioya_football/api_sports.env"
if [ ! -r "$KEY_FILE" ]; then
    echo "[Error] APIキーのファイルが見つかりません: $KEY_FILE"
    exit 1
fi
set -a; source "$KEY_FILE"; set +a
if [ -z "$API_SPORTS_KEY" ] || [ "$API_SPORTS_KEY" = "ここに新しいキー" ]; then
    echo "[Error] $KEY_FILE に APIキーが設定されていません"
    exit 1
fi

# 4. ネットにつながるまで待つ（スリープから起きた直後は Wi-Fi がまだのことがある。最大5分）
#    キーを付けずにつなぐだけなので、API の回数は使わない
for i in $(seq 1 30); do
    if curl -s -o /dev/null --max-time 5 https://v3.football.api-sports.io/; then
        break
    fi
    echo "[Wait] ネット接続を待っています ($i/30)"
    sleep 10
done

# 5. データ取得スクリプトの実行（取りこぼした日の取り直しも含む）
node fetch_data.js || echo "[Warn] データ取得の一部に失敗しました（翌朝に取り直します）"

# 6. Web版SEO用のHTMLファイルを自動生成
node generate_web_index.js
node generate_web_transfer.js

# 7. GitHubへのプッシュ処理 (public/index_web.html を追加)
git add public/data/matches/ public/data/transfers.json public/index_web.html public/transfer_web.html

# 変更があった場合のみコミットとプッシュを行う
if ! git diff --staged --quiet; then
    git commit -m "Auto-update matches data and index_web.html from local Mac"
    git pull --rebase origin main
    git push origin main
else
    echo "変更がないためプッシュをスキップしました。"
fi
