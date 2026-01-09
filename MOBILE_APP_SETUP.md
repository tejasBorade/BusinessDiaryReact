# Mobile App Build Guide - Business Directory

## Overview
Convert your React web app into native Android and iOS mobile apps using Capacitor.

## Prerequisites

### For Android:
- **Node.js** (already installed)
- **Android Studio** - Download from https://developer.android.com/studio
- **Java JDK 17** - Comes with Android Studio

### For iOS (Mac only):
- **Xcode** - Download from Mac App Store
- **CocoaPods** - Run: `sudo gem install cocoapods`
- **Mac computer** (iOS builds require macOS)

## Quick Setup (5 Steps)

### Step 1: Install Capacitor

```powershell
cd frontend
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

### Step 2: Initialize Capacitor

```powershell
npx cap init
```

When prompted:
- **App name**: `Business Directory`
- **App ID**: `com.businessdiary.app` (or your domain in reverse)
- **Web asset directory**: `build`

### Step 3: Build React App

```powershell
npm run build
```

### Step 4: Add Platforms

```powershell
# For Android
npx cap add android

# For iOS (Mac only)
npx cap add ios
```

### Step 5: Open in IDE

```powershell
# Open Android Studio
npx cap open android

# Open Xcode (Mac only)
npx cap open ios
```

## Detailed Android Build

### 1. Install Android Studio

Download from: https://developer.android.com/studio

During installation:
- ✅ Android SDK
- ✅ Android SDK Platform
- ✅ Android Virtual Device (for testing)

### 2. Configure Android Studio

1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. Install:
   - **Android 13.0 (Tiramisu)** or latest
   - **Android SDK Build-Tools**
   - **Android SDK Platform-Tools**

### 3. Set Environment Variables

Add to your system PATH:
```
C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools
C:\Users\YourName\AppData\Local\Android\Sdk\tools
```

### 4. Build APK

```powershell
cd frontend
npm run build
npx cap sync
npx cap open android
```

In Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Create a **new keystore** (save it securely!)
4. Build APK
5. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Install on Android Phone

**Via USB:**
1. Enable **Developer Options** on phone
2. Enable **USB Debugging**
3. Connect phone to PC
4. Run in Android Studio: **Run** → **Run 'app'**

**Via APK:**
1. Copy `app-release.apk` to phone
2. Install (allow unknown sources)
3. Done!

## iOS Build (Mac Required)

### 1. Install Xcode

Download from Mac App Store (free, ~12GB)

### 2. Install CocoaPods

```bash
sudo gem install cocoapods
```

### 3. Build iOS App

```bash
cd frontend
npm run build
npx cap sync
npx cap open ios
```

### 4. Configure in Xcode

1. Select your **Team** (Apple Developer account)
2. Set **Bundle Identifier**: `com.businessdiary.app`
3. Choose device/simulator
4. Click **Run** (Play button)

### 5. Publish to App Store

1. **Archive** the app
2. **Upload** to App Store Connect
3. Submit for review

## Native Features Available

Capacitor provides access to native device features:

### Camera
```javascript
import { Camera } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: 'uri'
  });
};
```

### Geolocation
```javascript
import { Geolocation } from '@capacitor/geolocation';

const getCurrentPosition = async () => {
  const position = await Geolocation.getCurrentPosition();
  console.log(position.coords.latitude, position.coords.longitude);
};
```

### Push Notifications
```javascript
import { PushNotifications } from '@capacitor/push-notifications';

await PushNotifications.register();
```

### Local Storage (Already works!)
Your existing localStorage code works natively.

## Configuration Files

### capacitor.config.json

Create this file in `frontend/`:

```json
{
  "appId": "com.businessdiary.app",
  "appName": "Business Directory",
  "webDir": "build",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#10b981",
      "showSpinner": false
    }
  }
}
```

### Update package.json

Add these scripts to `frontend/package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "cap:build": "npm run build && npx cap sync",
    "cap:android": "npm run cap:build && npx cap open android",
    "cap:ios": "npm run cap:build && npx cap open ios",
    "cap:serve": "npm run build && npx cap copy && npx cap sync"
  }
}
```

## PWA Alternative (Quick Win!)

If you want a simpler approach, make it a Progressive Web App:

### 1. Update manifest.json

In `frontend/public/manifest.json`:

```json
{
  "short_name": "Business Dir",
  "name": "Business Directory",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#10b981",
  "background_color": "#ffffff",
  "orientation": "portrait"
}
```

### 2. Add Service Worker

Already included in Create React App! Just build:

```powershell
npm run build
```

### 3. Deploy and Install

1. Visit your site on mobile
2. Browser prompts: **"Add to Home Screen"**
3. Icon appears on home screen
4. Opens like a native app!

## Comparison

| Feature | Capacitor | PWA |
|---------|-----------|-----|
| **Setup Time** | 1-2 hours | 5 minutes |
| **App Stores** | ✅ Yes | ❌ No |
| **Native Features** | ✅ Full access | ⚠️ Limited |
| **Offline** | ✅ Yes | ✅ Yes |
| **Camera** | ✅ Native | ⚠️ Browser API |
| **Push Notifications** | ✅ Full | ⚠️ Limited |
| **File System** | ✅ Full | ❌ No |
| **App Icon** | ✅ Yes | ✅ Yes |
| **Splash Screen** | ✅ Yes | ❌ No |
| **Distribution** | App Stores | Web link |

## Building for Production

### Android Production APK

```powershell
cd frontend/android
./gradlew assembleRelease

# Or in PowerShell:
.\gradlew.bat assembleRelease
```

APK location: `android/app/build/outputs/apk/release/`

### Android App Bundle (for Play Store)

```powershell
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/`

### iOS Production (Mac)

In Xcode:
1. **Product** → **Archive**
2. **Distribute App**
3. Choose **App Store Connect**
4. Upload

## App Store Submission

### Google Play Store

**Requirements:**
- Google Play Developer account ($25 one-time)
- App icon (512x512px)
- Screenshots (phone + tablet)
- Privacy policy URL
- App description

**Process:**
1. Create app in Play Console
2. Upload AAB file
3. Fill app details
4. Submit for review (1-3 days)

### Apple App Store

**Requirements:**
- Apple Developer account ($99/year)
- App icon (1024x1024px)
- Screenshots (various sizes)
- Privacy policy URL
- App description

**Process:**
1. Create app in App Store Connect
2. Upload via Xcode
3. Fill app details
4. Submit for review (1-7 days)

## Testing

### Android Emulator

In Android Studio:
1. **Tools** → **AVD Manager**
2. **Create Virtual Device**
3. Select device (e.g., Pixel 5)
4. Download system image
5. Start emulator

### iOS Simulator (Mac)

```bash
npx cap run ios
```

Simulator opens automatically.

### Physical Device Testing

**Android:**
- USB debugging enabled
- Run from Android Studio

**iOS:**
- Added device to provisioning profile
- Run from Xcode

## Troubleshooting

### Android Build Errors

**Error: SDK not found**
```powershell
# Set ANDROID_HOME environment variable
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
```

**Error: Gradle build failed**
- Update Android Studio
- Sync Gradle files
- Clean build: `./gradlew clean`

### iOS Build Errors

**Error: CocoaPods not installed**
```bash
sudo gem install cocoapods
cd ios && pod install
```

**Error: Provisioning profile**
- Sign in to Xcode with Apple ID
- Select Team in project settings

## Performance Optimization

### 1. Enable Production Build

Already using `npm run build` ✅

### 2. Image Optimization

Use WebP format and lazy loading (already implemented)

### 3. Code Splitting

React Router already does this ✅

### 4. Minification

Built-in with Create React App ✅

## Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio**: https://developer.android.com/studio
- **Xcode**: https://developer.apple.com/xcode/
- **Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com

## Next Steps

1. ✅ Install Android Studio
2. ✅ Run `npm install @capacitor/core @capacitor/cli`
3. ✅ Run `npx cap init`
4. ✅ Run `npx cap add android`
5. ✅ Open in Android Studio
6. ✅ Build APK
7. ✅ Test on device
8. ✅ Submit to Play Store

## Cost Summary

| Item | Cost |
|------|------|
| **Development** | Free |
| **Android Studio** | Free |
| **Xcode** | Free |
| **Play Store Account** | $25 (one-time) |
| **Apple Developer** | $99/year |
| **Total (Android only)** | **$25** |
| **Total (Both)** | **$124/year** |

## Support

For issues:
1. Check Capacitor docs
2. Stack Overflow
3. Capacitor GitHub Issues
4. Android/iOS specific forums
