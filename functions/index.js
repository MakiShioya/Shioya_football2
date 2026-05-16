const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

// 【最推し設定】アプリから呼び出す命令（第2世代）
exports.setMostFavoritePlayer = onCall({ region: "asia-northeast1" }, async (request) => {
    // ログイン確認（第2世代では request.auth に入っています）
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "ログインが必要です。");
    }

    const uid = request.auth.uid;
    // 送られてきたデータは request.data に入っています
    const { playerId, playerName } = request.data;
    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
            throw new HttpsError("not-found", "ユーザーが見つかりません。");
        }

        const userData = userDoc.data();
        
        // 初回は0G、2回目以降は100G
        const cost = userData.mostFavoriteId ? 100 : 0;

        if (userData.gold < cost) {
            throw new HttpsError("failed-precondition", "ポイントが足りません。");
        }

        transaction.update(userRef, {
            mostFavoriteId: playerId,
            mostFavoriteName: playerName,
            gold: admin.firestore.FieldValue.increment(-cost)
        });

        return { success: true, cost: cost };
    });
});

// 【ログインボーナス】予定表を確認した時に100G付与（第2世代）
exports.claimDailyBonus = onCall({ region: "asia-northeast1" }, async (request) => {
    // 1. ログイン確認
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "ログインが必要です。");
    }

    const uid = request.auth.uid;
    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
            throw new HttpsError("not-found", "ユーザーが見つかりません。");
        }

        const userData = userDoc.data();
        
        // 2. 日付の判定（日本時間の今日を取得）
        const now = new Date();
        const todayStr = now.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

        // 既に今日受け取っているなら何もせず返す
        if (userData.lastBonusDate === todayStr) {
            return { success: false, message: "本日分は受取済みです。" };
        }

        // 3. 銀行員の記帳（ポイント加算と日付更新）
        transaction.update(userRef, {
            gold: admin.firestore.FieldValue.increment(100),
            lastBonusDate: todayStr
        });

        return { 
            success: true, 
            added: 100, 
            newGold: (userData.gold || 0) + 100 
        };
    });
});

// functions/index.js に追記

// 【ショップ】テーマを購入する（第2世代）
exports.purchaseTheme = onCall({ region: "asia-northeast1" }, async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "ログインが必要です。");

    const uid = request.auth.uid;
    const { themeId, price } = request.data;
    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new HttpsError("not-found", "ユーザーが見つかりません。");

        const userData = userDoc.data();
        const owned = userData.ownedThemes || [];

        // 既に持っているか、お金が足りるかチェック
        if (owned.includes(themeId)) {
            return { success: false, message: "既に所有しています。" };
        }
        if ((userData.gold || 0) < price) {
            return { success: false, message: "ゴールドが足りません。" };
        }

        // 銀行員の処理：Goldを減らし、所持リストに追加
        transaction.update(userRef, {
            gold: admin.firestore.FieldValue.increment(-price),
            ownedThemes: admin.firestore.FieldValue.arrayUnion(themeId)
        });

        return { success: true, newGold: (userData.gold || 0) - price };
    });
});

// functions/index.js に追加

// 【ミュージック用ショップ】アイテム購入処理（統合版）
exports.purchaseMusicIcon = onCall({ region: "asia-northeast1" }, async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "ログインが必要です。");

    const uid = request.auth.uid;
    // アプリ側から送られてくる名前（itemId, itemType）に合わせる
    const { itemId, itemType, price } = request.data;
    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new HttpsError("not-found", "ユーザーが見つかりません。");

        const userData = userDoc.data();
        
        // アイコンなら ownedMusicIcons、テーマなら ownedMusicThemes の箱を確認
        const fieldName = (itemType === 'icon') ? 'ownedMusicIcons' : 'ownedMusicThemes';
        const owned = userData[fieldName] || [];

        if (owned.includes(itemId)) {
            return { success: false, message: "既に所有しています。" };
        }
        
        // ゴールド（int64）が足りるかチェック
        const currentGold = userData.gold || 0;
        if (currentGold < price) {
            return { success: false, message: "ゴールドが足りません。" };
        }

        // 銀行員の更新処理
        transaction.update(userRef, {
            gold: admin.firestore.FieldValue.increment(-price), // ゴールドを減らす
            [fieldName]: admin.firestore.FieldValue.arrayUnion(itemId) // 適切な箱にアイテムを追加
        });

        return { success: true, newGold: currentGold - price };
    });
});

// 【ミュージック用】再生時間に応じたゴールド付与（上限3600G/日）
exports.addMusicGold = onCall({ region: "asia-northeast1" }, async (request) => {
    // 1. ログイン確認
    if (!request.auth) throw new HttpsError("unauthenticated", "ログインが必要です。");

    const uid = request.auth.uid;
    const { seconds } = request.data; // フロントから送られてくる秒数(1秒=1G)
    
    // 2. 異常値（チート）弾き：60秒ごとに送る設計なので、余裕を見て一度に100秒以上来たらエラー
    if (seconds <= 0 || seconds > 100) {
        throw new HttpsError("invalid-argument", "無効なリクエストです。");
    }

    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new HttpsError("not-found", "ユーザーが見つかりません。");

        const userData = userDoc.data();
        
        // 3. 日付の判定（日本時間の今日を取得）
        const now = new Date();
        const todayStr = now.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

        let todayGold = userData.todayMusicGold || 0;
        let lastDate = userData.lastMusicGoldDate || "";

        // 日付が変わっていたら本日の獲得をリセット
        if (lastDate !== todayStr) {
            todayGold = 0;
            lastDate = todayStr;
        }

        // 4. 上限チェック
        const MAX_DAILY_GOLD = 3600;
        if (todayGold >= MAX_DAILY_GOLD) {
            return { success: false, message: "本日の獲得上限に達しています。", currentGold: userData.gold };
        }

        // 5. 追加可能なゴールドを計算 (残りの枠か、リクエストされた秒数か、少ない方を採用)
        const remainingCapacity = MAX_DAILY_GOLD - todayGold;
        const goldToAdd = Math.min(remainingCapacity, seconds);

        // 6. 銀行員の記帳
        transaction.update(userRef, {
            gold: admin.firestore.FieldValue.increment(goldToAdd),
            todayMusicGold: todayGold + goldToAdd,
            lastMusicGoldDate: todayStr
        });

        return { 
            success: true, 
            added: goldToAdd, 
            totalToday: todayGold + goldToAdd,
            newGold: (userData.gold || 0) + goldToAdd 
        };
    });
});