import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppText, PermissionModal } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';
import {
  openNotificationSettings,
  requestNotificationPermission,
} from '../../../../utils/AppPermissions';
import { LinearGradient } from 'react-native-linear-gradient';

const NotificationBanner: React.FC<{ onDismiss: () => void }> = ({
  onDismiss,
}) => {
  const [permissionModal, setPermissionModal] = React.useState<
    'rationale' | 'denied' | 'request-error' | 'settings-error' | null
  >(null);
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);

  const requestPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        onDismiss();
        return;
      }
      setPermissionModal('denied');
    } catch (error) {
      console.error('Unable to request notification permission:', error);
      setPermissionModal('request-error');
    }
  };

  const handleOpenSettings = async () => {
    try {
      await openNotificationSettings();
      setPermissionModal(null);
    } catch (error) {
      console.error('Unable to open notification settings:', error);
      setPermissionModal('settings-error');
    }
  };

  const modalContent = {
    rationale: {
      title: 'Stay in the loop',
      description:
        'Get workout reminders, challenge updates, and activity nudges. You can change notification access any time in your device settings.',
      primaryActionLabel: 'Continue',
      onPrimaryAction: () => {
        setPermissionModal(null);
        requestPermission();
      },
      secondaryActionLabel: 'Not now',
      onSecondaryAction: () => setPermissionModal(null),
      icon: 'notifications' as const,
    },
    denied: {
      title: 'Notifications are turned off',
      description:
        'You can enable Vitality notifications in your device settings to receive workout reminders and challenge updates.',
      primaryActionLabel: 'Open Settings',
      onPrimaryAction: handleOpenSettings,
      secondaryActionLabel: 'Not now',
      onSecondaryAction: () => setPermissionModal(null),
      icon: 'settings' as const,
    },
    'request-error': {
      title: 'Permission request failed',
      description:
        'Vitality could not request notification access. You can enable notifications directly in your device settings.',
      primaryActionLabel: 'Open Settings',
      onPrimaryAction: handleOpenSettings,
      secondaryActionLabel: 'Not now',
      onSecondaryAction: () => setPermissionModal(null),
      icon: 'alert' as const,
    },
    'settings-error': {
      title: 'Unable to open settings',
      description:
        'Open your device settings and enable notifications for Vitality.',
      primaryActionLabel: 'Got it',
      onPrimaryAction: () => setPermissionModal(null),
      icon: 'alert' as const,
    },
  };

  const handleNotificationPermission = () => {
    setPermissionModal('rationale');
  };

  return (
    <>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.notifBanner}
      >
        <Text style={styles.notificationEmoji}>🔔</Text>
        <View style={styles.notifBannerText}>
          <AppText variant="subtitle2" bold color="textInverse" mb={2}>
            Enable notifications
          </AppText>
          <AppText
            variant="caption"
            color="textInverse"
            style={styles.notificationDescription}
          >
            Get nudges, kudos, and challenge alerts
          </AppText>
        </View>
        <TouchableOpacity
          onPress={handleNotificationPermission}
          style={styles.notifEnableBtn}
          accessibilityRole="button"
          accessibilityLabel="Enable notifications"
        >
          <AppText
            style={styles.notifEnableBtnText}
            variant="button"
            bold
            color="textInverse"
          >
            Enable
          </AppText>
        </TouchableOpacity>
      </LinearGradient>
      <PermissionModal
        visible={permissionModal !== null}
        onClose={() => setPermissionModal(null)}
        {...(permissionModal
          ? modalContent[permissionModal]
          : modalContent.rationale)}
      />
    </>
  );
};

export default NotificationBanner;
