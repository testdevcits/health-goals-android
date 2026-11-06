import React, { memo } from 'react';
import { Image, Pressable, View } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import { styles as createStyles } from './AppHeader.styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import AppIcon from '../../assets/appicon/AppIcon';

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
  showProfile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  onNotificationPress,
  isBack = true,
  showNotifications = true,
  showProfile = true,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const componentStyles = createStyles(theme);
  const profile = useAppSelector(state => state.profile.user);
  const name = profile?.name?.trim() ?? '';
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

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
            <AppIcon name="ChevronLeft" size={20} color={colors.textPrimary} />
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
            <AppIcon name="Bell" size={19} color={colors.warning} />
          </Pressable>
        )}

        {showProfile && (
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={[componentStyles.avatar, { backgroundColor: colors.info }]}
            accessibilityRole="button"
            accessibilityLabel={`Profile${name ? ` for ${name}` : ''}`}
          >
            {profile?.profileImageUrl ? (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={componentStyles.avatarImage}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            ) : (
              <AppText variant="subtitle2" color="white" bold>
                {initials}
              </AppText>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(AppHeader);
