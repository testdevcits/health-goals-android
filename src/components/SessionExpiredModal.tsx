import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import AppIcon from '../assets/appicon/AppIcon';
import AppText from './AppText';

type SessionExpiredModalProps = {
  visible: boolean;
  onContinue: () => void;
};

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  visible,
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[
            styles.dialog,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              padding: spacing.xl,
              marginBottom: insets.bottom,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.warningLight,
                borderRadius: radius.full,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <AppIcon
              name="LockKeyhole"
              size={25}
              color={colors.warning}
              strokeWidth={2}
            />
          </View>
          <AppText variant="h3" center bold mb={spacing.sm}>
            Session expired
          </AppText>
          <AppText variant="body2" secondary center style={styles.message}>
            For your security, we signed you out. Please sign in again to
            continue using Vitality.
          </AppText>
          <Pressable
            onPress={onContinue}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
              },
              styles.buttonHeight,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go to login"
          >
            <AppText variant="button" bold color="textInverse">
              Sign in again
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 12,
  },
  iconContainer: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    maxWidth: 300,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHeight: {
    minHeight: 50,
  },
});

export default SessionExpiredModal;
