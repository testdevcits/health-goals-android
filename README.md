This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## App authentication and backend connection

Email/password sign-in and signup call the backend at `/api/v1/auth`. The backend sends a 6-digit email verification code for both flows. After verification, access and refresh tokens are stored in the device Keychain/Keystore; the app refreshes the session on launch and signs out through the backend. Forgot password sends an email code and updates the password after verification.

Debug builds use `http://10.0.2.2:8000/api/v1` by default for the Android emulator. For a physical phone, connect the phone and computer to the same Wi-Fi, find the computer's LAN IPv4 address, then install with that address (replace `192.168.1.20`):

```sh
cd android
./gradlew installDebug -PHEALTH_API_BASE_URL=http://192.168.1.20:8000
```

The backend listens on port `8000`; allow inbound connections to that port on the computer firewall if needed. The app appends `/api/v1` to the supplied origin.

Group chat uses Socket.IO. Local debug builds use the same origin as the API by default. Release builds require the HTTPS URL of the long-running chat server with `-PHEALTH_CHAT_SOCKET_URL=https://your-chat-service-host`.

Google sign-in setup:

1. Create OAuth credentials in Google Cloud for the Android app (`com.vitality`) using the debug/release signing SHA-1 fingerprints, and create a Web application OAuth client ID.
2. Set the Web client ID as `GOOGLE_CLIENT_ID` in the backend environment and pass it as `-PGOOGLE_WEB_CLIENT_ID=<web-client-id>` to Gradle.
3. Build a release with `./gradlew assembleRelease -PHEALTH_API_BASE_URL=https://<deployed-api-host> -PHEALTH_CHAT_SOCKET_URL=https://<long-running-chat-host> -PGOOGLE_WEB_CLIENT_ID=<web-client-id>`.

Release builds require HTTPS API and chat server origins plus a Google Web client ID. The admin dashboard continues to use its existing email OTP flow.

## Health Connect and background sync

On Android, connect Health Connect from **Profile → Connected Devices** and grant only the health data permissions you want Vitality to use. Optional background syncing on Android 14 and later is controlled separately in **Settings → Health Data → Background Health Sync**. Enabling it explains the data use and asks Health Connect for background-read access; sync runs are best-effort and Android may delay them to conserve battery. Turning the setting off stops scheduled health sync without revoking the Health Connect permissions you granted.

Background location tracking is a separate, optional setting. Vitality explains the location use and requests “Allow all the time” access only after you choose to enable continuous tracking.

App notifications use a shared theme-aware toast style for brief success, information, and error messages. Important confirmations, permission choices, and messages that need an action remain native dialogs.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Android production configuration

Debug builds use `http://10.0.2.2:8000` for the local Android emulator. Build a release with the deployed HTTPS API origin and Google OAuth web client ID supplied as Gradle properties:

```sh
cd android
./gradlew assembleRelease -PHEALTH_API_BASE_URL=https://api.example.com -PGOOGLE_WEB_CLIENT_ID=your-web-client-id
```

The same Google OAuth web client ID must be set as `GOOGLE_CLIENT_ID` in backend `.env`. Release builds fail if the HTTPS API origin or OAuth client ID is missing. Do not place Cloudinary credentials in Android configuration.
