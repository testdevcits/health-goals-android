import React, { Suspense, useMemo, useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronRight } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppSettingsRow, AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';
import createStyles from './styles.Profile';
import { getProfileMenuItems } from './conts';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { getCurrentUser } from '../../../services/profile';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearProfile, setProfile } from '../../../store/profileSlice';
import { AppEmptyState, AppErrorView, AppLoader } from '../../../components';
import { navigationRef } from '../../../navigations/AppNavigation';
import { logout } from '../../../services/auth';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const LogoutModal = React.lazy(
    () => import('../../../components/LogoutModal'),
  );

  const navigation = useNavigation<ProfileNavigationProp>();
  const menuItems = useMemo(() => getProfileMenuItems(colors), [colors]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.profile.user);
  const [points, setPoints] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(!user);
  const [profileError, setProfileError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setProfileLoading(true);
    setProfileError('');
    Promise.allSettled([
      getCurrentUser(),
      authenticatedRequest<{
        wallet?: { availablePoints?: number; balance?: number };
      }>('GET', '/wallet'),
    ])
      .then(([userResult, walletResult]) => {
        if (!active) return;
        const fetchedUser =
          userResult.status === 'fulfilled' ? userResult.value : null;
        const wallet =
          walletResult.status === 'fulfilled'
            ? walletResult.value.wallet
            : undefined;
        if (fetchedUser) dispatch(setProfile(fetchedUser));
        else if (userResult.status === 'rejected')
          setProfileError(
            'We could not load your profile. Check your connection and try again.',
          );
        setPoints(Number(wallet?.availablePoints ?? wallet?.balance ?? 0));
        setWalletLoading(false);
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, isFocused, reloadKey]);
  const name = user?.name ?? '';
  const profileImageUrl = user?.profileImageUrl ?? '';
  const device = user?.deviceProfile;
  const phone = device
    ? [device.brand || device.manufacturer, device.model]
        .filter(Boolean)
        .join(' ')
    : '';
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const handleMenuPress = (id: string) => {
    switch (id) {
      case 'settings':
        navigation.navigate('Settings');
        break;

      case 'devices':
        navigation.navigate('ConnectedDevices');
        break;

      case 'rewards':
        navigation.navigate('Rewards');
        break;

      case 'privacy':
        navigation.navigate('Privacy');
        break;

      case 'reports':
        navigation.navigate('HealthReports');
        break;

      case 'support':
        navigation.navigate('HelpSupport');
        break;
    }
  };
  const [modalVisible, setModalVisible] = React.useState(false);
  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      /* Clear the local session even while offline. */
    }
    dispatch(clearProfile());
    setModalVisible(false);
    navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerMain}>
          <View style={styles.headerTitle}>
            <AppText variant="h3">Profile</AppText>
            <AppText variant="caption" secondary>
              Your account, rewards, and settings
            </AppText>
          </View>

          <Pressable
            style={[
              styles.headerIcon,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={19} color={colors.warning} />
          </Pressable>

          <View style={styles.smallAvatar}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={{ width: '100%', height: '100%', borderRadius: 22 }}
              />
            ) : (
              <AppText variant="subtitle2" color="white" bold>
                {initials}
              </AppText>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        {!user && profileLoading ? (
          <AppLoader message="Loading your profile…" />
        ) : !user && profileError ? (
          <AppErrorView
            message={profileError}
            onRefresh={() => setReloadKey(value => value + 1)}
          />
        ) : !user ? (
          <AppEmptyState
            title="Profile unavailable"
            description="Sign in again to view your account details."
          />
        ) : (
          <>
            {/* Profile information */}
            <View style={styles.profileSection}>
              <View style={styles.largeAvatar}>
                {profileImageUrl ? (
                  <Image
                    source={{ uri: profileImageUrl }}
                    style={{ width: '100%', height: '100%', borderRadius: 44 }}
                  />
                ) : (
                  <AppText variant="display" color="white">
                    {initials}
                  </AppText>
                )}
              </View>

              <AppText variant="h3" center mt={spacing.md}>
                {name || 'Your profile'}
              </AppText>

              <AppText
                variant="caption"
                secondary
                center
                style={styles.emailText}
              >
                {[user?.email, phone].filter(Boolean).join(' · ') || ' '}
              </AppText>
            </View>

            {/* Rewards and activity summary */}
            <View
              style={[styles.statsCard, { backgroundColor: colors.surface }]}
            >
              {[
                {
                  value: walletLoading ? '…' : points.toLocaleString(),
                  label: 'Points',
                },
                { value: '—', label: 'Day Streak' },
                { value: '—', label: 'Badges' },
                { value: '—', label: 'Rank' },
              ].map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.statDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  )}

                  <View style={styles.statItem}>
                    <AppText variant="subtitle1" bold center>
                      {stat.value}
                    </AppText>

                    <AppText variant="caption" secondary center>
                      {stat.label}
                    </AppText>
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* Account menu */}
            <AppText variant="subtitle1" bold style={styles.sectionTitle}>
              Account
            </AppText>

            <View
              style={[styles.menuCard, { backgroundColor: colors.surface }]}
            >
              {menuItems.map((item, index) => (
                <Pressable
                  key={item?.id}
                  onPress={() => handleMenuPress(item?.id)}
                  style={({ pressed }) => [
                    styles.menuRow,
                    pressed && { backgroundColor: colors.backgroundSecondary },
                    index !== menuItems.length - 1 && {
                      borderBottomColor: colors.divider,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item?.title}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    {item.icon}
                  </View>

                  <AppText variant="subtitle2" bold style={styles.menuTitle}>
                    {item?.title}
                  </AppText>

                  <ChevronRight size={18} color={colors.textTertiary} />
                </Pressable>
              ))}
            </View>
            <AppSettingsRow
              icon="🚪"
              title="Sign Out"
              value=""
              onPress={() => setModalVisible(true)}
              showDivider={false}
            />
          </>
        )}
      </ScrollView>
      <Suspense fallback={null}>
        <LogoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSignOut={handleSignOut}
        />
      </Suspense>
    </View>
  );
};

export default ProfileScreen;
