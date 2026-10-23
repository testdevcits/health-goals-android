import React, { memo } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Bell, CircleAlert, Settings, X } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import AppButton from './AppButton';
import AppText from './AppText';

interface PermissionModalProps {
  visible: boolean;
  title: string;
  description: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onClose: () => void;
  icon?: 'notifications' | 'settings' | 'alert';
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  onClose,
  icon = 'notifications',
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;
  const Icon =
    icon === 'settings' ? Settings : icon === 'alert' ? CircleAlert : Bell;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.xxl,
              marginHorizontal: spacing.xl,
              padding: spacing.xl,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close permission dialog"
            onPress={onClose}
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.full,
              },
            ]}
          >
            <X color={colors.textSecondary} size={18} />
          </TouchableOpacity>

          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primaryLight,
                borderRadius: radius.full,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <Icon color={colors.primary} size={30} strokeWidth={2} />
          </View>

          <AppText variant="h3" center bold mb={spacing.sm}>
            {title}
          </AppText>
          <AppText
            variant="body2"
            secondary
            center
            style={[
              styles.description,
              { marginBottom: spacing.xl, paddingHorizontal: spacing.xs },
            ]}
          >
            {description}
          </AppText>

          <AppButton
            title={primaryActionLabel}
            onPress={onPrimaryAction}
            style={styles.actionButton}
          />
          {secondaryActionLabel && onSecondaryAction ? (
            <AppButton
              title={secondaryActionLabel}
              onPress={onSecondaryAction}
              variant="ghost"
              style={styles.secondaryButton}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
  },
  card: {
    width: '90%',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 4,
  },
});

export default memo(PermissionModal);
