
import {Platform, PermissionsAndroid} from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    // iOS and Android 13+
    if (Platform.OS === 'ios' || Number(Platform.Version) >= 33) {
      const settings = await notifee.requestPermission();

      return (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      );
    }

    // Android 12 and below
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      return granted;
    }

    return false;
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
};
