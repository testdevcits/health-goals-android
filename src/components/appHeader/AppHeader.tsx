import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';

import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import { styles as createStyles } from './AppHeader.styles';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  isBack?: boolean;
  showNotifications?: boolean;
  avatarText?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  onNotificationPress,
  isBack = true,
  showNotifications = true,
  avatarText = 'AJ',
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const componentStyles = createStyles(theme);

  return (
    <View style={componentStyles.header}>
      <View style={componentStyles.headerMain}>
        {isBack && (
          <Pressable
            onPress={onBackPress}
            style={[
              componentStyles.backButton,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            disabled={!onBackPress}
            hitSlop={8}
          >
            <ChevronLeft size={20} color={colors.textPrimary} />
          </Pressable>
        )}

        <View style={componentStyles.headerCopy}>
          <AppText variant="h3">{title}</AppText>

          {!!subtitle && (
            <AppText variant="caption" secondary>
              {subtitle}
            </AppText>
          )}
        </View>

        {showNotifications && (
          <Pressable
            onPress={onNotificationPress}
            style={[
              componentStyles.headerIcon,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            disabled={!onNotificationPress}
            hitSlop={8}
          >
            <Bell size={19} color={colors.warning} />
          </Pressable>
        )}

        <View
          style={[componentStyles.avatar, { backgroundColor: colors.info }]}
        >
          <AppText variant="subtitle2" color="white" bold>
            {avatarText}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default memo(AppHeader);
