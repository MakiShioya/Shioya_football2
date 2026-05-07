// 1. JSONデータの読み込みと表示
async function loadPlayers() {
    try {
        const response = await fetch('japanese_players.json');
        const data = await response.json();
        const container = document.getElementById('player-list');
        container.innerHTML = '';

        // クラブごとにループ
        for (const club in data) {
            for (const key in data[club]) {
                const player = data[club][key];
                
                // カードの作成
                const card = document.createElement('div');
                card.className = 'player-card';
                card.innerHTML = `
                    <div>
                        <div class="club-name">${club}</div>
                        <div class="player-name">${player.full}</div>
                    </div>
                    <button class="fav-button" onclick="setFavorite('${key}', '${player.full}')">
                        最推しに設定
                    </button>
                `;
                container.appendChild(card);
            }
        }
    } catch (error) {
        console.error("データの読み込み失敗:", error);
    }
}

// 2. 最推し設定（Functionsの呼び出し）
async function setFavorite(playerId, playerName) {
    if (!confirm(`${playerName}選手を「最推し」に設定しますか？\n（2回目以降の変更は100G必要です）`)) return;

    const setMostFavoritePlayer = firebase.functions().httpsCallable('setMostFavoritePlayer');

    try {
        const result = await setMostFavoritePlayer({ 
            playerId: playerId, 
            playerName: playerName 
        });

        if (result.data.success) {
            alert(`設定完了！消費ポイント: ${result.data.cost}G`);
            // 必要に応じて画面をリフレッシュ
        }
    } catch (error) {
        alert("エラー: " + error.message);
    }
}

// 初期化
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadPlayers();
    } else {
        document.getElementById('player-list').innerHTML = 'ログインしてください。';
    }
});