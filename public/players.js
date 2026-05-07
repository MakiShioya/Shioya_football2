let currentFavoriteId = null; // 現在の最推し選手のIDを保持する変数

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
                
                // 現在の最推し選手かどうかを判定
                const isFavorite = (key === currentFavoriteId);
                
                // カードの作成
                const card = document.createElement('div');
                // 最推しなら 'active-favorite' クラスを追加
                card.className = `player-card ${isFavorite ? 'active-favorite' : ''}`;
                
                // ボタンのHTMLを条件分岐
                const buttonHtml = isFavorite 
                    ? `<button class="fav-button current-btn">設定中</button>`
                    : `<button class="fav-button" onclick="setFavorite('${key}', '${player.full}')">最推しに設定</button>`;

                card.innerHTML = `
                    <div>
                        <div class="club-name">${club}</div>
                        <div class="player-name">${player.full}</div>
                    </div>
                    ${buttonHtml}
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

    // 処理中はボタンを連打できないようにする工夫を入れるのもありですが、今回はFunctions呼び出しを待機
    const setMostFavoritePlayer = firebase.functions().httpsCallable('setMostFavoritePlayer');

    try {
        const result = await setMostFavoritePlayer({ 
            playerId: playerId, 
            playerName: playerName 
        });

        if (result.data.success) {
            alert(`設定完了！消費ポイント: ${result.data.cost}G`);
            
            // 成功したらIDを更新して、画面を再描画（リロードなしで即座に色が変わる）
            currentFavoriteId = playerId;
            loadPlayers(); 
        }
    } catch (error) {
        alert("エラー: " + error.message);
    }
}

// 3. 初期化とユーザー情報の取得
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        try {
            // Firestoreから現在のユーザーデータを取得して、今の最推しIDを把握する
            const doc = await firebase.firestore().collection("users").doc(user.uid).get();
            if (doc.exists && doc.data().mostFavoriteId) {
                currentFavoriteId = doc.data().mostFavoriteId;
            }
        } catch (error) {
            console.error("ユーザー情報の取得エラー:", error);
        }
        
        // データの取得が終わってから選手一覧を描画する
        loadPlayers();
    } else {
        document.getElementById('player-list').innerHTML = 'ログインしてください。';
    }
});