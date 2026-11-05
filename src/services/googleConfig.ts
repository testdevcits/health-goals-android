import { NativeModules } from 'react-native';

// Pass -PGOOGLE_WEB_CLIENT_ID=<OAuth web client id> to the Android Gradle build.
// The same OAuth client ID must be set as GOOGLE_CLIENT_ID in backend/.env.
export const GOOGLE_WEB_CLIENT_ID = String(
  NativeModules.HealthAppConfig?.googleWebClientId || '',
).trim();
