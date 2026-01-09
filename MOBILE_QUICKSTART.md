# Mobile App - Quick Start

## 🚀 One-Command Setup

```powershell
cd frontend
npm run cap:install
npm run cap:init
npm run cap:android
```

That's it! Android Studio will open with your mobile app ready to build.

## 📱 What You Get

- **Native Android App** - Runs on any Android phone (5.0+)
- **Native iOS App** - Runs on iPhone/iPad (Mac required for building)
- **App Store Ready** - Can be published to Google Play & Apple App Store
- **Offline Support** - Works without internet
- **Native Features** - Camera, GPS, notifications available

## ⚡ Commands

| Command | What It Does |
|---------|--------------|
| `npm run cap:install` | Install Capacitor packages |
| `npm run cap:init` | Initialize Capacitor config |
| `npm run cap:build` | Build React + sync to mobile |
| `npm run cap:android` | Open in Android Studio |
| `npm run cap:ios` | Open in Xcode (Mac only) |
| `npm run cap:sync` | Sync changes to mobile |

## 🎯 3-Step Android Build

### Step 1: Install Android Studio
Download: https://developer.android.com/studio

### Step 2: Setup Capacitor
```powershell
cd frontend
npm run cap:install
npm run cap:init
```

### Step 3: Build APK
```powershell
npm run cap:android
```

In Android Studio:
- **Build → Generate Signed Bundle / APK**
- Select **APK**
- Create keystore
- Build release APK

APK ready at: `frontend/android/app/build/outputs/apk/release/app-release.apk`

## 📲 Install on Phone

### Option 1: Direct USB Install
1. Enable **Developer Mode** on Android phone
2. Enable **USB Debugging**
3. Connect phone via USB
4. In Android Studio: **Run → Run 'app'**

### Option 2: APK File
1. Copy `app-release.apk` to phone (via USB or cloud)
2. Open APK file on phone
3. Allow installation from unknown sources
4. Install & launch!

## 🍎 iOS Build (Mac Only)

```bash
cd frontend
npm run cap:install
npm run cap:init
npm run cap:ios
```

In Xcode:
- Select your Apple Developer Team
- Choose device/simulator
- Click ▶️ Run

## 🎨 Customize App

### App Icon
Replace these files in `frontend/public/`:
- `logo192.png` (192x192)
- `logo512.png` (512x512)
- `favicon.ico` (32x32)

### App Name & ID
Edit `frontend/capacitor.config.json`:
```json
{
  "appId": "com.yourcompany.app",
  "appName": "Your App Name"
}
```

### Splash Screen
Edit `capacitor.config.json`:
```json
{
  "plugins": {
    "SplashScreen": {
      "backgroundColor": "#10b981",
      "launchShowDuration": 2000
    }
  }
}
```

## 🔄 Update App After Changes

```powershell
cd frontend
npm run cap:update
```

This rebuilds React and syncs to mobile platforms.

## 📦 App Store Submission

### Google Play Store
**Cost:** $25 (one-time)
**Time:** 1-3 days review

1. Create developer account: https://play.google.com/console
2. Build release AAB:
   ```powershell
   cd frontend/android
   .\gradlew.bat bundleRelease
   ```
3. Upload to Play Console
4. Fill app details & submit

### Apple App Store
**Cost:** $99/year
**Time:** 1-7 days review

1. Create developer account: https://developer.apple.com
2. In Xcode: **Product → Archive**
3. Upload to App Store Connect
4. Fill app details & submit

## 🛠️ Troubleshooting

### "SDK not found"
Set Android SDK path:
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
```

### "Capacitor not found"
```powershell
npm run cap:install
```

### Changes not showing
```powershell
npm run cap:update
```

### Gradle build error
```powershell
cd android
.\gradlew.bat clean
```

## 📚 Full Documentation

See [MOBILE_APP_SETUP.md](MOBILE_APP_SETUP.md) for:
- Detailed setup instructions
- Native features (camera, GPS, notifications)
- PWA alternative
- Performance optimization
- Advanced configuration

## 🎯 Recommended Approach

**For Quick Testing:**
- Use PWA (no setup needed, just deploy and visit on mobile)

**For App Store Distribution:**
- Use Capacitor (native apps, full features)

**Want Both?**
- Do both! They share the same React codebase.

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| **Install Android Studio** | 30 min |
| **Setup Capacitor** | 10 min |
| **First Build** | 15 min |
| **Subsequent Builds** | 2 min |
| **Play Store Submission** | 2 hours |
| **App Store Submission** | 3 hours |

## 💡 Pro Tips

1. **Test on real device** - Emulators can be slow
2. **Use APK for testing** - Faster than USB debugging
3. **Enable auto-signing** - Saves time in Android Studio
4. **Keep keystore safe** - You'll need it for updates
5. **Test offline mode** - Airplane mode testing

## 🤝 Need Help?

Check these resources:
- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio Guide: https://developer.android.com/studio/intro
- Stack Overflow: Search "Capacitor [your issue]"

---

**Ready to build?** Start with: `npm run cap:install`
