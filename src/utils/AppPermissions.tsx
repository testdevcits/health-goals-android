import { Platform } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

const hasNotificationAuthorization = (
  authorizationStatus: AuthorizationStatus,
): boolean =>
  authorizationStatus === AuthorizationStatus.AUTHORIZED ||
  authorizationStatus === AuthorizationStatus.PROVISIONAL;

export const getNotificationPermission = async (): Promise<boolean> => {
  const settings = await notifee.getNotificationSettings();
  return hasNotificationAuthorization(settings.authorizationStatus);
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  const settings = await notifee.requestPermission();
  return hasNotificationAuthorization(settings.authorizationStatus);
};

export const openNotificationSettings = async (): Promise<void> => {
  await notifee.openNotificationSettings();
};
