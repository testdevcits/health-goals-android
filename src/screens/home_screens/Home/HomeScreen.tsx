import React, { useCallback, useEffect, useState } from 'react';
import { AppState, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import { OnboardingModal } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { getNotificationPermission } from '../../../utils/AppPermissions';
import ActivityTrends from './components/ActivityTrends';
import DailySummary from './components/DailySummary';
import EnergyCard from './components/EnergyCard';
import HomeHeader from './components/HomeHeader';
import NotificationBanner from './components/NotificationBanner';
import WorkoutCategories from './components/WorkoutCategories';
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

  return (
    <View style={[styles.container, {}]}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {notificationsEnabled === false ? (
          <NotificationBanner onDismiss={() => setNotificationsEnabled(true)} />
        ) : null}
        <EnergyCard />
        <DailySummary
          onViewDetails={() => navigation.navigate('DailyActivities')}
          navigation={navigation}
        />

        <WorkoutCategories
          onViewAllPress={() => navigation.navigate('Categories')}
        />
        <ActivityTrends
          onPressDetails={() => navigation.navigate('DailyActivityTrends')}
        />
        <QuickActions
          onActionPress={action => {
            if (action === 'WorkoutSession') {
              navigation.navigate('WorkoutSession');
            } else {
              navigation.getParent()?.navigate('Challenges');
            }
          }}
        />
      </ScrollView>
      <OnboardingModal
        visible={onboardingVisible}
        onDismiss={() => setOnboardingVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
