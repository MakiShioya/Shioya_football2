#!/bin/bash

# 1. Shioya_football2 ディレクトリに移動
cd ~/Documents/Shioya_football2

# 2. 環境変数の設定 (Node.jsやGitのコマンドを見つけるため)
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin:/Users/$USER/.nvm/versions/node/$(node -v 2>/dev/null)/bin

# 3. APIキーの設定
export API_SPORTS_KEY="aa2f95b0ac362f94bee0b8bfdef67dc9"

# 4. データ取得スクリプトの実行
node fetch_data.js

# 5. GitHubへのプッシュ処理
git add public/data/matches/

# 変更があった場合のみコミットとプッシュを行う
if ! git diff --staged --quiet; then
    git commit -m "Auto-update matches data from local Mac"
    git pull --rebase origin main
    git push origin main
else
    echo "変更がないためプッシュをスキップしました。"
fi

