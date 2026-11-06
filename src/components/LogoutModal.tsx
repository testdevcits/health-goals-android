import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '.';
import type { AppTheme } from '../theme';
import { useTheme } from '../theme/useTheme';
import AppIcon from '../assets/appicon/AppIcon';

type LogoutModalProps = {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onSignOut,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close sign-out confirmation"
        />

        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.base) },
          ]}
        >
          <View style={styles.handle} />

          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.errorLight },
            ]}
          >
            <AppIcon name="CircleAlert" size={24} color={colors.textError} />
          </View>

          <AppText variant="h3" center bold mb={spacing.sm}>
            Sign out?
          </AppText>
          <AppText variant="body2" secondary center style={styles.message}>
            You will need to sign in again to access your health data and
            groups.
          </AppText>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={[
                styles.button,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel sign out"
            >
              <AppText variant="button" bold>
                Cancel
              </AppText>
            </Pressable>
            <Pressable
              onPress={onSignOut}
              style={[
                styles.button,
                {
                  backgroundColor: colors.errorLight,
                  borderColor: colors.error,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              accessibilityHint="Signs you out of your account"
            >
              <AppText variant="button" error bold>
                Sign Out
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

  return StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
    },
    sheet: {
      alignItems: 'center',
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      marginBottom: spacing.lg,
      borderRadius: radius.full,
      backgroundColor: colors.border,
    },
    iconContainer: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderRadius: radius.full,
    },
    message: {
      maxWidth: 320,
      marginBottom: spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      gap: spacing.sm,
    },
    button: {
      minHeight: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: radius.md,
    },
  });
};

export default LogoutModal;
