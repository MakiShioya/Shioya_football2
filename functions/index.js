const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 【最推し設定】アプリから呼び出す命令
exports.setMostFavoritePlayer = functions.https.onCall(async (data, context) => {
    // ログイン確認
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "ログインが必要です。");
    }

    const uid = context.auth.uid;
    const { playerId, playerName } = data;
    const userRef = admin.firestore().collection("users").doc(uid);

    return admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
            throw new functions.https.HttpsError("not-found", "ユーザーが見つかりません。");
        }

        const userData = userDoc.data();
        
        // 初回は0G、2回目以降は100G
        const cost = userData.mostFavoriteId ? 100 : 0;

        if (userData.gold < cost) {
            throw new functions.https.HttpsError("failed-precondition", "ポイントが足りません。");
        }

        transaction.update(userRef, {
            mostFavoriteId: playerId,
            mostFavoriteName: playerName,
            gold: admin.firestore.FieldValue.increment(-cost)
        });

        return { success: true, cost: cost };
    });
});