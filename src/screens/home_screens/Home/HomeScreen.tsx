import React, { useCallback, useEffect, useState } from 'react';
import { AppState, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import {
  OnboardingModal,
  ProfileQuestionsModal,
} from '../../../components';
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

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [healthRefreshKey, setHealthRefreshKey] = useState(0);

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
        navigation.getParent()?.navigate('Challenges');
      }
    },
    [navigation],
  );

  const handleOnboardingDismiss = useCallback(() => {
    setOnboardingVisible(false);
  }, []);

  return (
    <View style={[styles.container, {}]}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {notificationsEnabled === false ? (
          <NotificationBanner onDismiss={handleNotificationDismiss} />
        ) : null}
        <HealthConnectPrompt onSyncComplete={handleSyncComplete} />
        <EnergyCard healthRefreshKey={healthRefreshKey} />
        <DailySummary
          onViewDetails={handleDailyDetails}
          navigation={navigation}
          healthRefreshKey={healthRefreshKey}
        />

        <WorkoutCategories onViewAllPress={handleViewAllCategories} />
        <ActivityTrends
          onPressDetails={handleTrendsDetails}
          healthRefreshKey={healthRefreshKey}
        />
        <QuickActions onActionPress={handleQuickAction} />
        <RecentWorkoutsSection
          navigation={navigation}
          healthRefreshKey={healthRefreshKey}
        />
      </ScrollView>
      <OnboardingModal
        visible={onboardingVisible}
        onDismiss={handleOnboardingDismiss}
      />
      <ProfileQuestionsModal enabled={!onboardingVisible} />
    </View>
  );
};

export default HomeScreen;
