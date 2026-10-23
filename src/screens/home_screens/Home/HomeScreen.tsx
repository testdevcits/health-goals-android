import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const HomeScreen: React.FC<{
  navigation: {
    navigate: (screen: 'DailyActivities' | 'DailyActivityTrends') => void;
  };
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createHomeStyles(theme);
  const [notificationPromptVisible, setNotificationPromptVisible] =
    useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
          onViewAllPress={() => Alert.alert('View All button pressed')}
        />
        <ActivityTrends
          onPressDetails={() => Alert.alert('View All button pressed')}
          // onPressDetails={() => navigation.navigate('DailyActivityTrends')}
        />
        <QuickActions navigation={navigation} />
      </ScrollView>
      <OnboardingModal
        visible={onboardingVisible}
        onDismiss={() => setOnboardingVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
