import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';

import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import { styles as createStyles } from './AppHeader.styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type AppHeaderNavigationParamList = {
  Notifications: undefined;
  Profile: undefined;
};

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  isBack?: boolean;
  showNotifications?: boolean;
  avatarText?: string;
  showProfile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  onNotificationPress,
  isBack = true,
  showNotifications = true,
  avatarText = '',
  showProfile = true,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const componentStyles = createStyles(theme);

  const navigation =
    useNavigation<NavigationProp<AppHeaderNavigationParamList>>();

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
            hitSlop={8}
          >
            <Bell size={19} color={colors.warning} />
          </Pressable>
        )}

        {showProfile && (
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={[componentStyles.avatar, { backgroundColor: colors.info }]}
          >
            <AppText variant="subtitle2" color="white" bold>
              {avatarText}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(AppHeader);
