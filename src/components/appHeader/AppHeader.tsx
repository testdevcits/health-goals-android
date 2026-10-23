import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';

import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import { styles as createStyles } from './AppHeader.styles';
import { useNavigation } from '@react-navigation/native';

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

  const navigation: any = useNavigation();

  return (
    <View style={componentStyles.header}>
      <View style={componentStyles.headerMain}>
        {isBack && (
          <Pressable
            onPress={onBackPress ? onBackPress : () => navigation.goBack()}
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
          <AppText numberOfLines={1} variant="h3">
            {title}
          </AppText>

          {!!subtitle && (
            <AppText variant="caption" secondary>
              {subtitle}
            </AppText>
          )}
        </View>

        {showNotifications && (
          <Pressable
            onPress={
              onNotificationPress
                ? onNotificationPress
                : () => navigation.navigate('Notifications')
            }
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

        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={[componentStyles.avatar, { backgroundColor: colors.info }]}
        >
          <AppText variant="subtitle2" color="white" bold>
            {avatarText}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default memo(AppHeader);
