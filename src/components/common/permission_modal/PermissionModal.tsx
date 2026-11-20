import React, { memo } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Bell, CircleAlert, Settings } from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';
import { spacing } from '../../../theme/spacing';
import AppButton from '../AppButton';
import AppText from '../AppText';
import AppIcon from '../../../assets/appicon/AppIcon';
import { styles } from './styles.PermissionModal';

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
  const { colors, radius } = theme;
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
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View
          accessibilityViewIsModal
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.textPrimary,
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
            <AppIcon name="X" color={colors.textSecondary} size={18} />
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

export default memo(PermissionModal);
