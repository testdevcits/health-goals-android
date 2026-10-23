import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import { OnboardingModal } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import ActivityTrends from './components/ActivityTrends';
import DailySummary from './components/DailySummary';
import EnergyCard from './components/EnergyCard';
import HomeHeader from './components/HomeHeader';
import NotificationBanner from './components/NotificationBanner';
import WorkoutCategories from './components/WorkoutCategories';
import { createHomeStyles } from './styles.Home';
import QuickActions from './components/QuickActions';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [notificationPromptVisible, setNotificationPromptVisible] =
    useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(true);

  return (
    <View style={[styles.container, {}]}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {notificationPromptVisible ? (
          <NotificationBanner
            onDismiss={() => setNotificationPromptVisible(false)}
          />
        ) : null}
        <EnergyCard energy={85} streak_period={12} />
        <DailySummary
          onViewDetails={() => navigation.navigate('DailyActivities')}
        />
        <WorkoutCategories
          onViewAllPress={() => navigation.navigate('Categories')}
        />
        {/* <ActivityTrends
          onPressDetails={() => navigation.navigate('DailyActivityTrends')}
        /> */}
        {/* <QuickActions
          onActionPress={action => {
            if (action === 'WorkoutSession') {
              navigation.navigate('WorkoutSession');
            } else {
              navigation.getParent()?.navigate('Challenges');
            }
          }}
        /> */}
      </ScrollView>
      <OnboardingModal
        visible={onboardingVisible}
        onDismiss={() => setOnboardingVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
