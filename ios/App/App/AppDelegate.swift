import UIKit
import Capacitor
import FirebaseCore // 追加：Firebaseを使うため
import GoogleSignIn // 追加：Googleログインを使うため

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // ▼▼▼ 追加：アプリ起動時にFirebaseをセットアップ ▼▼▼
        FirebaseApp.configure()
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    // ▼▼▼ 修正：Googleログイン画面からアプリに戻ってきた時の処理 ▼▼▼
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        
        // 1. まずGoogleログインがこのURLを処理するか確認
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }
        
        // 2. Googleログインでない場合は、Capacitor（ユニバーサルリンク等）に任せる
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
