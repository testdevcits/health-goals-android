import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  DeviceEventEmitter,
  InteractionManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import { useTheme } from '../../../theme/useTheme';
import { getNotificationPermission } from '../../../utils/AppPermissions';
import ActivityTrends from './components/ActivityTrends';
import DailySummary from './components/DailySummary';
import EnergyCard from './components/EnergyCard';
import HomeHeader from './components/HomeHeader';
import NotificationBanner from './components/NotificationBanner';
import HealthConnectPrompt from './components/HealthConnectPrompt';
import WorkoutCategories from './components/WorkoutCategories';
import RecentWorkoutsSection from './components/recent_workouts/RecentWorkoutsSection';
import { createHomeStyles } from './styles.Home';
import QuickActions from './components/QuickActions';
import { storageService } from '../../../storage/storageService';
import { syncRecentHealthData } from '../../../services/healthSync';
import useConnectedDevices from '../../profile_screens/connected_devices/useConnectedDevices';
import { ConnectedWatchCard } from '../../profile_screens/connected_devices/components';

const OnboardingModal = lazy(
  () => import('../../../components/common/OnboardingModal'),
);
const ProfileQuestionsModal = lazy(
  () =>
    import(
      '../../../components/common/profile_questions_modal/ProfileQuestionsModal'
    ),
);

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createHomeStyles(theme), [theme]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [healthRefreshKey, setHealthRefreshKey] = useState(0);
  const [isDeferredLoaded, setIsDeferredLoaded] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsDeferredLoaded(true);
    });
    return () => task.cancel();
  }, []);
  const {
    connectedDevice,
    watchMetrics,
    isWatchConnected,
    isWatchReconnecting,
    reconnectDevice,
    disconnectDevice,
    syncWatchHealthData,
  } = useConnectedDevices({ skipHealthConnectCheck: true });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const refreshNotificationPermission = async () => {
        try {
          const enabled = await getNotificationPermission();
          if (active) {
            setNotificationsEnabled(enabled);
          }
        } catch (error) {
          console.error('Unable to check notification permission:', error);
          if (active) {
            setNotificationsEnabled(false);
          }
        }
      };

      refreshNotificationPermission();
      const subscription = AppState.addEventListener('change', state => {
        if (state === 'active') {
          refreshNotificationPermission();
        }
      });

      return () => {
        active = false;
        subscription.remove();
      };
    }, []),
  );

  useEffect(() => {
    if (storageService.getString('isFirstTime') === undefined) {
      setOnboardingVisible(true);
    }
    storageService.setString('isFirstTime', 'true');
  }, []);

  const handleNotificationDismiss = useCallback(() => {
    setNotificationsEnabled(true);
  }, []);

  const handleSyncComplete = useCallback(() => {
    setHealthRefreshKey(previous => previous + 1);
  }, []);

  const handleWatchSync = useCallback(async () => {
    await syncWatchHealthData();
    handleSyncComplete();
  }, [syncWatchHealthData, handleSyncComplete]);

  const handleDailyDetails = useCallback(() => {
    navigation.navigate('DailyActivities');
  }, [navigation]);

  const handleViewAllCategories = useCallback(() => {
    navigation.navigate('Categories');
  }, [navigation]);

  const handleTrendsDetails = useCallback(() => {
    navigation.navigate('DailyActivityTrends');
  }, [navigation]);

  const handleQuickAction = useCallback(
    (action: string) => {
      if (action === 'WorkoutSession') {
        navigation.navigate('WorkoutSession');
      } else {
        navigation.getParent()?.navigate('ChallengesTab');
      }
    },
    [navigation],
  );

  const handleOnboardingDismiss = useCallback(() => {
    setOnboardingVisible(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (Platform.OS === 'android') {
        await syncRecentHealthData().catch(() => null);
      }
      if (isWatchConnected) {
        await syncWatchHealthData().catch(() => null);
      }
    } catch (error) {
      console.warn('Home refresh error:', error);
    } finally {
      setHealthRefreshKey(previous => previous + 1);
      setRefreshing(false);
    }
  }, [isWatchConnected, syncWatchHealthData]);

  const lastBottomTriggerRef = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 180;
      if (isCloseToBottom) {
        const now = Date.now();
        if (now - lastBottomTriggerRef.current > 1200) {
          lastBottomTriggerRef.current = now;
          DeviceEventEmitter.emit('homeScrolledToBottom');
        }
      }
    },
    [],
  );

  return (
    <View style={[styles.container, {}]}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {notificationsEnabled === false ? (
          <NotificationBanner onDismiss={handleNotificationDismiss} />
        ) : null}
        <HealthConnectPrompt onSyncComplete={handleSyncComplete} />
        {connectedDevice ? (
          <View
            style={{
              marginHorizontal: theme.spacing.xl,
              marginTop: theme.spacing.md,
            }}
          >
            <ConnectedWatchCard
              connectedDevice={connectedDevice}
              watchMetrics={watchMetrics}
              isConnected={isWatchConnected}
              isConnecting={isWatchReconnecting}
              onDisconnect={disconnectDevice}
              onSync={handleWatchSync}
              onReconnect={reconnectDevice}
            />
          </View>
        ) : null}
        <EnergyCard healthRefreshKey={healthRefreshKey} />
        <DailySummary
          onViewDetails={handleDailyDetails}
          navigation={navigation}
          healthRefreshKey={healthRefreshKey}
        />
        <WorkoutCategories onViewAllPress={handleViewAllCategories} />
        {isDeferredLoaded ? (
          <>
            <ActivityTrends
              onPressDetails={handleTrendsDetails}
              healthRefreshKey={healthRefreshKey}
            />
            <QuickActions onActionPress={handleQuickAction} />
            <RecentWorkoutsSection
              navigation={navigation}
              healthRefreshKey={healthRefreshKey}
            />
          </>
        ) : null}
      </ScrollView>
      {onboardingVisible && (
        <Suspense fallback={null}>
          <OnboardingModal
            visible={onboardingVisible}
            onDismiss={handleOnboardingDismiss}
          />
        </Suspense>
      )}
      {isDeferredLoaded && !onboardingVisible && (
        <Suspense fallback={null}>
          <ProfileQuestionsModal enabled={!onboardingVisible} />
        </Suspense>
      )}
    </View>
  );
};

export default HomeScreen;
