// script/auth.js

// ★★★ あなたのFirebase設定 ★★★
const firebaseConfig = {
  apiKey: "AIzaSyCUjxd4L8mnnBw6RRvvimbMZ_V1BaRZxQw",
  authDomain: "shioya-shogi.firebaseapp.com",
  projectId: "shioya-shogi",
  storageBucket: "shioya-shogi.firebasestorage.app",
  messagingSenderId: "400460108408",
  appId: "1:400460108408:web:0d43db04b02cce5230538d",
  measurementId: "G-K9ZLW8L09J"
};
const capPlugins = (window.Capacitor && window.Capacitor.Plugins) ? window.Capacitor.Plugins : {};
console.log("📦 認識されているプラグイン一覧:", Object.keys(capPlugins));
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// ----------------------
// 安全なアラート・コンファーム関数（全ページ対応）
// ----------------------
function safeAlert(msg, callback) {
    if (typeof showSystemAlert === "function") {
        showSystemAlert(msg, callback); // home.html用のカッコいいポップアップ
    } else {
        alert(msg); // index.html用の標準ポップアップ
        if (callback) callback();
    }
}

function safeConfirm(msg, yesCallback) {
    if (typeof showSystemConfirm === "function") {
        showSystemConfirm(msg, yesCallback, () => {});
    } else {
        if (confirm(msg)) {
            if (yesCallback) yesCallback();
        }
    }
}

// ----------------------
// ユーザー状態監視（全ページ共通）
// ----------------------
auth.onAuthStateChanged(async (user) => {
    const authButtons = document.getElementById("authButtons");
    const emailInputArea = document.getElementById("emailInputArea");
    const tosText = document.getElementById("tosPrivacyText");
    const logoutBtn = document.getElementById("logoutBtnInModal");
    const authTitle = document.getElementById("authTitle");
    const deleteBtn = document.getElementById("deleteAccountBtnInModal");
    const loggedInStatusArea = document.getElementById("loggedInStatusArea");
    const loginProviderText = document.getElementById("loginProviderText");
    const accountIconBtn = document.getElementById("accountIconBtn");
    const pointsArea = document.getElementById("pointsArea");
    const userGoldDisplay = document.getElementById("userGoldDisplay");

    if (user) {
        // --- ログイン中 ---
        const userRef = db.collection("users").doc(user.uid);
        const userDoc = await userRef.get();
        let displayName = user.displayName;

        if (userDoc.exists) {
            const data = userDoc.data();
            if (!displayName && data.name) displayName = data.name;
            // 将棋用のアイテム救済処理はここでは行いません
            // ポイント（gold）の表示
            if (userGoldDisplay && data.gold !== undefined) {
                userGoldDisplay.innerText = data.gold;
            }
        }
        if (!displayName) displayName = user.email.split("@")[0];

        // UI表示の更新
        if (authButtons) authButtons.style.display = "none";
        if (emailInputArea) emailInputArea.style.display = "none";
        if (tosText) tosText.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "block";
        if (deleteBtn) deleteBtn.style.display = "block";
        if (pointsArea) pointsArea.style.display = "block";
        if (authTitle) authTitle.innerText = `${displayName} さんのアカウント`;
        
        // ヘッダーアイコンの変更
        if (accountIconBtn) {
            accountIconBtn.innerText = "★"; // アイコンを星に変更
            accountIconBtn.classList.add("logged-in");
        }

        if (loggedInStatusArea && loginProviderText) {
            let providerName = "しおやアカウント";
            if (user.providerData && user.providerData.length > 0) {
                const pid = user.providerData[0].providerId;
                if (pid === "google.com") providerName = "Google";
                else if (pid === "apple.com") providerName = "Apple";
            }
            loginProviderText.innerText = providerName;
            loggedInStatusArea.style.display = "block";
        }
    } else {
        // --- 未ログイン時 ---
        if (authButtons) authButtons.style.display = "flex";
        if (emailInputArea) emailInputArea.style.display = "none";
        if (tosText) tosText.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (deleteBtn) deleteBtn.style.display = "none";
        if (pointsArea) pointsArea.style.display = "none";
        if (authTitle) authTitle.innerText = "アカウント";
        if (loggedInStatusArea) loggedInStatusArea.style.display = "none";
        
        if (accountIconBtn) {
            accountIconBtn.innerText = "👤";
            accountIconBtn.classList.remove("logged-in");
        }
    }
});

// ----------------------
// 戦績・棋譜表示機能
// ----------------------
function loadUserStats(userId) {
    db.collection("users").doc(userId).onSnapshot((doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        const win = data.win || 0;
        const lose = data.lose || 0;
        const history = data.history || [];

        if (document.getElementById("statsWin")) document.getElementById("statsWin").textContent = win;
        if (document.getElementById("statsLose")) document.getElementById("statsLose").textContent = lose;

        if (typeof window.updateKifuDisplay === "function") {
            window.updateKifuDisplay(history);
        }

        const historyList = document.getElementById("statsHistory");
        if (historyList) {
            historyList.innerHTML = "";
            [...history].reverse().slice(0, 10).forEach(h => {
                const li = document.createElement("li");
                li.style.padding = "8px";
                li.style.borderBottom = "1px solid #eee";
                li.style.fontSize = "0.9rem";
                li.style.color = (h.result === "WIN") ? "#d32f2f" : "#1976d2";
                li.textContent = `[${h.result === "WIN" ? '勝' : '負'}] vs ${h.opponent || "不明"}`;
                historyList.appendChild(li);
            });
        }
    });
}

// ----------------------
// 棋譜詳細モーダル
// ----------------------
function showKifuDetails(kifuArray, opponent) {
    const modal = document.getElementById("kifuDetailsModal");
    const textDiv = document.getElementById("modalKifuText");
    const title = document.getElementById("modalTitle");

    if (!modal || !textDiv) return;

    if (title) title.textContent = "対局記録 vs " + (opponent || "CPU");
    textDiv.textContent = Array.isArray(kifuArray) ? kifuArray.join("\n") : kifuArray;
    modal.style.display = "flex";
}

function closeKifuModal() {
    const modal = document.getElementById("kifuDetailsModal");
    if (modal) modal.style.display = "none";
}

// ----------------------
// モーダル・ログイン・名前変更
// ----------------------
function showAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "flex";
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
}

function registerUser() {
    const email = document.getElementById("authEmail").value;
    const pass = document.getElementById("authPass").value;
    const tempName = "新加入選手"; 

    if (!email || !pass) { 
        safeAlert("メールとパスワードを入力してください"); 
        return; 
    }

    auth.createUserWithEmailAndPassword(email, pass).then((cred) => {
        const user = cred.user;
        
        user.updateProfile({ displayName: tempName }).then(() => {
            // ▼▼▼ フットボール用に修正：不要な将棋データを削除 ▼▼▼
            return db.collection("users").doc(user.uid).set({
                name: tempName, 
                email: email, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                gold: 100 // 共通ポイント
            }, { merge: true }); // merge:true があると既存データを上書きしません
            // ▲▲▲ 修正ここまで ▲▲▲
        }).then(() => {
            safeAlert("登録ありがとうございます！\nあなたのお名前を教えてください！", () => {
                closeAuthModal();
                setTimeout(() => {
                    const initialModal = document.getElementById("initialNameModal");
                    const editModal = document.getElementById("nameEditModal");
                    if (initialModal) initialModal.style.display = "flex";
                    else if (editModal) editModal.style.display = "flex";
                }, 300);
            });
        });
    }).catch((error) => { 
        let msg = "登録失敗: " + error.message;
        if (error.code === "auth/email-already-in-use") msg = "そのメールアドレスは既に使用されています。";
        if (error.code === "auth/weak-password") msg = "パスワードは6文字以上にしてください。";
        safeAlert(msg); 
    });
}

function loginUser() {
    const email = document.getElementById("authEmail").value;
    const pass = document.getElementById("authPass").value;
    if (!email || !pass) { safeAlert("メールとパスワードを入力してください"); return; }
    
    auth.signInWithEmailAndPassword(email, pass).then(async (cred) => {
        const doc = await db.collection("users").doc(cred.user.uid).get();
        const userName = doc.exists ? (doc.data().name || "ユーザー") : "ユーザー";
        
        safeAlert(`${userName} さんとしてログインしました！`, () => {
            closeAuthModal();
            // index.html にいる場合は自動的に home.html へ遷移
            if (!document.getElementById("userNameDisplay")) window.location.href = "home.html";
        });
    }).catch((error) => { 
        safeAlert("ログインに失敗しました。\nメールアドレスかパスワードが間違っています。"); 
    });
}

function logoutUser() {
    safeConfirm("ログアウトしますか？\n（データは保存されているので、またログインできます）", () => {
        localStorage.clear();
        auth.signOut().then(() => { 
            safeAlert("ログアウトしました。", () => {
                closeAuthModal();
                
                // ★変更：home.html にいる場合は、強制的にタイトル(index.html)へ戻す
                if (document.getElementById("userNameDisplay")) {
                    window.location.href = "index.html";
                }
            });
        });
    });
}

function showNameEditModal() {
    const user = auth.currentUser;
    if (!user) return;
    document.getElementById("newNameInput").value = document.getElementById("userNameDisplay").textContent;
    document.getElementById("nameEditModal").style.display = "flex";
}

function closeNameEditModal() { 
    const modal = document.getElementById("nameEditModal");
    if(modal) modal.style.display = "none"; 
}

// 初回登録時の名前入力（index）と、設定画面の名前変更（home）の両方に対応
function saveNewName() {
    const user = auth.currentUser;
    // index.htmlなら initialNameInput、home.htmlなら newNameInput を取得
    const inputEl = document.getElementById("newNameInput") || document.getElementById("initialNameInput");
    const newName = inputEl ? inputEl.value.trim() : "";
    
    if (!newName) {
        safeAlert("名前を入力してください"); 
        return;
    }
    if (newName.length > 8) {
        safeAlert("名前は8文字以内で入力してください"); 
        return;
    }

    user.updateProfile({ displayName: newName }).then(() => {
        return db.collection("users").doc(user.uid).set({ name: newName }, { merge: true });
    }).then(() => {
        const nameDisplay = document.getElementById("userNameDisplay");
        if(nameDisplay) nameDisplay.textContent = newName;
        
        localStorage.setItem('shogi_username', newName);
        
        closeNameEditModal();
        const initialModal = document.getElementById("initialNameModal");
        if(initialModal) initialModal.style.display = "none";
        
        safeAlert("「" + newName + "」さん、\nよろしくお願いいたします！", () => {
            // index.html にいる場合は自動的に home.html へ
            if (!document.getElementById("userNameDisplay")) window.location.href = "home.html";
        });
    });
}

function showMyStats() {
    if (!auth.currentUser) { 
        safeAlert("ログインしていません", () => {
            showAuthModal(); 
        });
        return; 
    }
    document.getElementById("statsModal").style.display = "flex";
}
function closeStatsModal() { document.getElementById("statsModal").style.display = "none"; }

function getTodayString() {
    const now = new Date();
    const jstTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
    const y = jstTime.getFullYear();
    const m = String(jstTime.getMonth() + 1).padStart(2, '0');
    const d = String(jstTime.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// --- ソーシャルログイン後の初期データ作成（共通処理） ---
async function setupSocialUser(user) {
    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        console.log("✨ 初回ログイン：初期データを追加します");
        const tempName = user.displayName || "新加入選手";
        
        // ▼▼▼ フットボール用に修正：不要な将棋データを削除 ▼▼▼
        await userRef.set({
            name: tempName,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            gold: 100 // 共通ポイント
        }, { merge: true });
        // ▲▲▲ 修正ここまで ▲▲▲
        
        safeAlert("登録ありがとうございます！\nまずはお名前を教えてください！", () => {
            closeAuthModal();
            setTimeout(() => {
                const initialModal = document.getElementById("initialNameModal");
                const editModal = document.getElementById("nameEditModal");
                if (initialModal) initialModal.style.display = "flex";
                else if (editModal) editModal.style.display = "flex";
            }, 300);
        });
    } else {
        safeAlert(`${doc.data().name || "ユーザー"} さんとしてログインしました！`, () => {
            closeAuthModal();
            // フットボールには home.html が無いので画面遷移（location.href）は削除し、リロードします
            window.location.reload(); 
        });
    }
}

// Appleでログイン
async function loginWithApple() {
    console.log(" Appleログイン開始");
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    try {
        if (isNative) {
            const result = await window.Capacitor.Plugins.AuthPlugin.signInWithApple();
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: result.idToken,
                rawNonce: result.rawNonce
            });
            const resultAuth = await auth.signInWithCredential(credential);
            await setupSocialUser(resultAuth.user);
        } else {
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const resultAuth = await auth.signInWithPopup(provider);
            await setupSocialUser(resultAuth.user);
        }
    } catch (error) {
        console.error("❌ Appleログインエラー:", error);
        if (error.message && error.message.includes("cancel")) return;
        safeAlert("Appleログインに失敗しました。");
    }
}

// Googleでログイン
async function loginWithGoogle() {
    console.log("G Googleログイン開始");
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    try {
        if (isNative) {
            const result = await window.Capacitor.Plugins.GoogleAuthPlugin.signIn();
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
            const resultAuth = await auth.signInWithCredential(credential);
            await setupSocialUser(resultAuth.user);
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            const resultAuth = await auth.signInWithPopup(provider);
            await setupSocialUser(resultAuth.user);
        }
    } catch (error) {
        // ▼▼▼ エラーの詳細をすべて強制的に表示する ▼▼▼
        console.error("❌ Googleログインエラー発生!");
        console.error("メッセージ (error.message):", error.message);
        console.error("コード (error.code):", error.code);
        console.error("エラーの全貌:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        if (error.message && error.message.includes("cancel")) return;
        safeAlert("Googleログインに失敗しました。");
    }
}

// ▼▼▼ 追加：アカウント削除（退会）処理 ▼▼▼
function deleteUserAccount() {
    safeConfirm("本当に退会（アカウント削除）しますか？\n※すべてのゲームデータ・所持アイテムが消去され、復元することはできなくなります。", async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // 1. まずFirestoreのデータベースからユーザーのデータを完全に削除
            await db.collection("users").doc(user.uid).delete();

            // 2. 次にFirebase Authからアカウント自体を削除
            await user.delete();

            safeAlert("アカウントを削除しました。\nご利用ありがとうございました。", () => {
                closeAuthModal();
                // 削除後は強制的にタイトル画面へ戻す
                window.location.href = "index.html";
            });

        } catch (error) {
            console.error("退会エラー:", error);
            // Firebaseのセキュリティ仕様（長期間ログインしたままだと退会時に再認証を求められる）への対策
            if (error.code === 'auth/requires-recent-login') {
                safeAlert("セキュリティ保護のため、退会するには一度ログアウトし、再度ログインし直してから実行してください。");
            } else {
                safeAlert("アカウントの削除に失敗しました。通信環境を確認してください。");
            }
        }
    });
}

// バナー広告の自動表示スクリプト
async function showFootballBanner() {
    // iOSアプリとして動いている時だけ実行
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();
    if (!isNative) return;

    try {
        console.log("📢 広告の初期化を開始します...");
        await window.Capacitor.Plugins.AdMobPlugin.initialize();
        
        console.log("📢 バナー広告を表示します...");
        await window.Capacitor.Plugins.AdMobPlugin.showBannerAd();
    } catch (error) {
        console.error("❌ 広告の表示に失敗しました:", error);
    }
}

// 画面の読み込みが終わったら自動で広告を出す
document.addEventListener('DOMContentLoaded', showFootballBanner);

// アカウントアイコンが押された時の処理
function handleAccountClick() {
    const user = firebase.auth().currentUser;
    if (user) {
        // ログインしている場合はマイページへ
        location.href = 'mypage.html';
    } else {
        // ログインしていない場合は警告を出して、ログイン画面（モーダル）を開く
        alert('ログインしてください。');
        showAuthModal();
    }
}