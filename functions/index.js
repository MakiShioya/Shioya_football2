const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

// 【最推し設定】アプリから呼び出す命令（第2世代）
exports.setMostFavoritePlayer = onCall(async (request) => {
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