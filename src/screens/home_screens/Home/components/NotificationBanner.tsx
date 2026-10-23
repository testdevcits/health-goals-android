import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';
import { requestNotificationPermission } from '../../../../utils/AppPermissions';
import { LinearGradient } from 'react-native-linear-gradient';

const NotificationBanner: React.FC<{ onDismiss: () => void }> = ({
  onDismiss,
}) => {
  const styles = createHomeStyles(useTheme().theme);
  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      onDismiss();
    }
  };

  return (
    <LinearGradient
      colors={[
        useTheme().theme.colors.primary,
        useTheme().theme.colors.primaryDark,
      ]}
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
        accessibilityLabel="Dismiss notification prompt"
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
  );
};

export default NotificationBanner;
