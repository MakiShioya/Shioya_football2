import Foundation
import Capacitor

@objc(AppIconPlugin)
public class AppIconPlugin: CAPPlugin {
    
    @objc func changeIcon(_ call: CAPPluginCall) {
        // JSから渡されたアイコンの名前を受け取る
        guard let iconName = call.getString("iconName") else {
            call.reject("アイコン名が指定されていません")
            return
        }
        
        DispatchQueue.main.async {
            // この端末がアイコン変更に対応しているかチェック
            if UIApplication.shared.supportsAlternateIcons {
                // "default" が指定されたら元のアイコン（nil）に戻す
                let nameToSet = iconName == "default" ? nil : iconName
                
                UIApplication.shared.setAlternateIconName(nameToSet) { error in
                    if let error = error {
                        call.reject("アイコン変更失敗: \(error.localizedDescription)")
                    } else {
                        call.resolve([
                            "status": "success",
                            "icon": iconName
                        ])
                    }
                }
            } else {
                call.reject("この端末はアイコン変更をサポートしていません")
            }
        }
    }
}