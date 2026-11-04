import Toast from 'react-native-toast-message';

export type AppToastType = 'success' | 'error' | 'info' | 'warning';

export function showAppToast(
  type: AppToastType,
  title: string,
  message?: string,
): void {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: type === 'error' ? 4500 : 3200,
    swipeable: true,
  });
}
