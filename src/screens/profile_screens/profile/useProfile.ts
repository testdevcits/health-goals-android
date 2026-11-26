import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { getCurrentUser } from '../../../services/profile';
import { logout } from '../../../services/auth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearProfile, setProfile } from '../../../store/profileSlice';
import { clearNotifications } from '../../../store/notificationSlice';
import { clearWallet, getWalletData } from '../../../store/walletSlice';
import { clearActivity } from '../../../store/activitySlice';
import { navigationRef } from '../../../navigations/AppNavigation';
import { getProfileMenuItems } from './conts';
import type { AppColors } from '../../../theme/colors';
import { storageService } from '../../../storage/storageService';
import { calculateActivityStreak } from '../../../utils/activityStreak';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function useProfile(
  navigation: ProfileNavigationProp,
  colors: AppColors,
) {
  const menuItems = useMemo(() => getProfileMenuItems(colors), [colors]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.profile.user);
  const points = useAppSelector(state => state.wallet.availablePoints);
  const walletLoading = useAppSelector(state => state.wallet.loading);
  const [streak, setStreak] = useState<number>(() => {
    return (
      storageService.getObject<{ streakPeriod?: number }>('cache_energy_card')
        ?.streakPeriod ?? 0
    );
  });
  const [profileLoading, setProfileLoading] = useState(!user);
  const [profileError, setProfileError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const lastFetchedProfileRef = useRef(0);

  useEffect(() => {
    if (!isFocused) return;
    const now = Date.now();
    // Cache for 20 seconds to prevent re-fetching on quick tab switching
    if (lastFetchedProfileRef.current > 0 && now - lastFetchedProfileRef.current < 20000) {
      return;
    }
    lastFetchedProfileRef.current = now;
    let active = true;
    if (!user) setProfileLoading(true);
    setProfileError('');

    // Fetch wallet with caching
    dispatch(getWalletData());

    Promise.allSettled([
      getCurrentUser(),
      authenticatedRequest<{
        items: Array<{
          day: string;
          creditedCoins?: number;
          totals?: {
            steps?: number;
            workoutMinutes?: number;
            meditationMinutes?: number;
          };
        }>;
      }>('GET', `${API_ENDPOINTS.ACTIVITY.HISTORY}?limit=30`),
      authenticatedRequest<{
        totals?: {
          steps?: number;
          workoutMinutes?: number;
          meditationMinutes?: number;
        };
        creditedCoins?: number;
      }>('GET', API_ENDPOINTS.ACTIVITY.TODAY),
    ])
      .then(([userResult, historyResult, todayResult]) => {
        if (!active) return;
        const fetchedUser =
          userResult.status === 'fulfilled' ? userResult.value : null;
        if (fetchedUser) dispatch(setProfile(fetchedUser));
        else if (userResult.status === 'rejected') {
          setProfileError(
            'We could not load your profile. Check your connection and try again.',
          );
        }

        const historyData =
          historyResult.status === 'fulfilled' ? historyResult.value : null;
        const todayData =
          todayResult.status === 'fulfilled' ? todayResult.value : null;

        if (historyData?.items) {
          const calculatedStreak = calculateActivityStreak(
            historyData.items,
            todayData || undefined,
          );
          setStreak(calculatedStreak);
          const cached =
            storageService.getObject<Record<string, unknown>>(
              'cache_energy_card',
            ) || {};
          storageService.setObject('cache_energy_card', {
            ...cached,
            streakPeriod: calculatedStreak,
          });
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, isFocused, reloadKey, user]);

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

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // Clear the local profile even when logout cannot reach the server.
    }
    dispatch(clearProfile());
    dispatch(clearNotifications());
    dispatch(clearWallet());
    dispatch(clearActivity());
    setModalVisible(false);
    navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
  };

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

  return {
    menuItems,
    user,
    points,
    streak,
    walletLoading,
    profileLoading,
    profileError,
    refreshProfile: () => setReloadKey(value => value + 1),
    modalVisible,
    setModalVisible,
    handleMenuPress,
    handleSignOut,
    name,
    profileImageUrl,
    phone,
    initials,
  };
}
