import { useEffect, useMemo, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { getCurrentUser } from '../../../services/profile';
import { logout } from '../../../services/auth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearProfile, setProfile } from '../../../store/profileSlice';
import { navigationRef } from '../../../navigations/AppNavigation';
import { getProfileMenuItems } from './conts';
import type { AppColors } from '../../../theme/colors';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function useProfile(
  navigation: ProfileNavigationProp,
  colors: AppColors,
) {
  const menuItems = useMemo(() => getProfileMenuItems(colors), [colors]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.profile.user);
  const [points, setPoints] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(!user);
  const [profileError, setProfileError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
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
        else if (userResult.status === 'rejected') {
          setProfileError(
            'We could not load your profile. Check your connection and try again.',
          );
        }
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
