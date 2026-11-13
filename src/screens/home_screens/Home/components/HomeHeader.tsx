import React, { useEffect, useState } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { getFormattedDate, getGreeting } from '../const';
import { createHomeStyles } from '../styles.Home';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getCurrentUser } from '../../../../services/profile';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setProfile } from '../../../../store/profileSlice';
import { authenticatedRequest } from '../../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../../constants';

const HomeHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile.user);
  const fullName = profile?.name ?? '';
  const name = fullName.split(' ')[0] || '';
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [profile?.profileImageUrl]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getCurrentUser()
        .then(user => {
          if (active) dispatch(setProfile(user));
        })
        .catch(() => {});
      authenticatedRequest<{
        unread?: number;
        items?: Array<{ read: boolean }>;
      }>('GET', API_ENDPOINTS.NOTIFICATIONS.LIST(1, 50))
        .then(result => {
          if (active) {
            setUnreadNotifications(
              result.unread ??
                (result.items || []).filter(item => !item.read).length,
            );
          }
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [dispatch]),
  );
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <AppText variant="h3">
          {getGreeting()}
          {name ? `, ${name}` : ''} 👋
        </AppText>
        <AppText variant="caption" secondary mt={2}>
          {getFormattedDate()} · Let's crush your goals
        </AppText>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.bellButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Notifications${
            unreadNotifications ? `, ${unreadNotifications} unread` : ''
          }`}
          onPress={() => navigation.navigate('Notifications' as never)}
        >
          {/* <Bell size={20} color={theme.colors.textSecondary} /> */}
          <AppText
            variant="caption"
            color="warning"
            style={styles.notificationBadge}
          >
            🔔
          </AppText>
          {unreadNotifications > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                minWidth: 17,
                height: 17,
                paddingHorizontal: 3,
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.error,
              }}
            >
              <AppText variant="caption" color="textInverse" bold>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </AppText>
            </View>
          ) : null}
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate('Profile' as never)}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel={`Profile${fullName ? ` for ${fullName}` : ''}`}
        >
          {profile?.profileImageUrl && !avatarLoadFailed ? (
            <Image
              source={{ uri: profile.profileImageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <AppText variant="label" bold color="textInverse">
              {fullName
                .split(' ')
                .map(part => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'U'}
            </AppText>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;
