import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios' || Number(Platform.Version) >= 33) {
    const settings = await notifee.requestPermission();

    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  if (Platform.OS === 'android') {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  return false;
};

export const openNotificationSettings = async (): Promise<void> => {
  await notifee.openNotificationSettings();
};
