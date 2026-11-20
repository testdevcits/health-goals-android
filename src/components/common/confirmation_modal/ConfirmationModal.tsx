import React, { memo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import AppText from '../AppText';
import AppIcon from '../../../assets/appicon/AppIcon';
import { createStyles } from './styles.ConfirmationModal';

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  position?: 'bottom' | 'center';
  maxWidth?: number;
  containerStyle?: ViewStyle;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  title,
  message,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
  position = 'bottom',
  maxWidth = 480,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          position === 'center' ? styles.centerOverlay : styles.bottomOverlay,
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdropPress ? onClose : undefined}
          accessible={closeOnBackdropPress}
          accessibilityRole={closeOnBackdropPress ? 'button' : undefined}
          accessibilityLabel="Close modal"
        />

        <View
          accessibilityViewIsModal
          style={[
            styles.container,
            {
              maxWidth,
              paddingHorizontal: spacing.base,
              paddingTop: spacing.base,
              paddingBottom: Math.max(insets.bottom, spacing.base),
              borderRadius: radius.xxl,
            },
            position === 'center' && styles.centerContainer,
            containerStyle,
          ]}
        >
          {position === 'bottom' && <View style={styles.handle} />}

          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title ? (
                <AppText variant="h3" bold>
                  {title}
                </AppText>
              ) : (
                <View />
              )}

              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                  style={styles.closeButton}
                >
                  <AppIcon name="X" size={20} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          )}

          {message ? (
            <AppText
              variant="body2"
              secondary
              style={{ marginBottom: spacing.md }}
            >
              {message}
            </AppText>
          ) : null}

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default memo(ConfirmationModal);
