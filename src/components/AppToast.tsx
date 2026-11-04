import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from 'lucide-react-native';
import type {
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

type AppToastType = 'success' | 'error' | 'info' | 'warning';
type ToastColors = {
  accent: string;
  background: string;
  Icon: typeof Info;
};

const AppToastCard: React.FC<ToastConfigParams<unknown>> = ({
  text1,
  text2,
  type,
  onPress,
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;
  const variants: Record<AppToastType, ToastColors> = {
    success: {
      accent: colors.success,
      background: colors.successLight,
      Icon: CheckCircle2,
    },
    error: {
      accent: colors.error,
      background: colors.errorLight,
      Icon: AlertCircle,
    },
    info: {
      accent: colors.info,
      background: colors.infoLight,
      Icon: Info,
    },
    warning: {
      accent: colors.warning,
      background: colors.warningLight,
      Icon: TriangleAlert,
    },
  };
  const variant = variants[type as AppToastType] ?? variants.info;
  const Icon = variant.Icon;

  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityLabel={[text1, text2].filter(Boolean).join('. ')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          marginHorizontal: spacing.base,
          padding: spacing.md,
          opacity: pressed ? 0.96 : 1,
          shadowColor: colors.black,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: variant.background, borderRadius: radius.full },
        ]}
      >
        <Icon size={20} color={variant.accent} strokeWidth={2.2} />
      </View>
      <View style={styles.content}>
        {text1 ? (
          <AppText variant="subtitle2" bold numberOfLines={1}>
            {text1}
          </AppText>
        ) : null}
        {text2 ? (
          <AppText
            variant="caption"
            secondary
            numberOfLines={2}
            style={text1 ? { marginTop: spacing.xxs } : undefined}
          >
            {text2}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.accent, { backgroundColor: variant.accent }]} />
    </Pressable>
  );
};

const MemoizedAppToastCard = memo(AppToastCard);

const appToastConfig: ToastConfig = {
  success: props => <MemoizedAppToastCard {...props} />,
  error: props => <MemoizedAppToastCard {...props} />,
  info: props => <MemoizedAppToastCard {...props} />,
  warning: props => <MemoizedAppToastCard {...props} />,
};

export { appToastConfig };

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
});
