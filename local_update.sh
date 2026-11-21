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

# 4. データ取得スクリプトの実行
node fetch_data.js

# 5. Web版SEO用のHTMLファイルを自動生成
node generate_web_index.js
node generate_web_transfer.js

# 6. GitHubへのプッシュ処理 (public/index_web.html を追加)
git add public/data/matches/ public/data/transfers.json public/index_web.html public/transfer_web.html

# 変更があった場合のみコミットとプッシュを行う
if ! git diff --staged --quiet; then
    git commit -m "Auto-update matches data and index_web.html from local Mac"
    git pull --rebase origin main
    git push origin main
else
    echo "変更がないためプッシュをスキップしました。"
fi
