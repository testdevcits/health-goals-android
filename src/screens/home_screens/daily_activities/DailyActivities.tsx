import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createDailyActivityStyles } from './styles.DailyActivities';
import ActivityChart from './components/ActivityChart';
import ActivityMetrics from './components/ActivityMetrics';
import ActivityRings from './components/ActivityRings';
import DailyTotals from './components/DailyTotals';
import { DailyActivityNavigation } from './types';
import ActivityDetail from './components/ActivityDetail';

const DailyActivities: React.FC<{ navigation: DailyActivityNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createDailyActivityStyles(theme);

  return (
    <View style={[styles.screen, {}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <AppHeader
        title="Daily Activity"
        subtitle="Today, October 23"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}
      >
        <ActivityRings
          rings={[
            { radius: 66, progress: 0.68, color: '#D5E84E' },
            { radius: 52, progress: 0.52, color: '#42C9D9' },
            { radius: 38, progress: 0.34, color: '#B23CC2' },
          ]}
        />
        <ActivityMetrics
          metrics={[
            {
              title: 'Steps',
              value: '2,038',
              goal: '/ 6,000',
              color: '#B9C92D',
            },
            {
              title: 'Active time',
              value: '21',
              unit: 'mins',
              goal: '/ 90',
              color: '#42C9D9',
            },
            {
              title: 'Activity cals',
              value: '70',
              unit: 'kcal',
              goal: '/ 500',
              color: '#B23CC2',
            },
          ]}
        />
        <DailyTotals
          totals={[
            { label: 'Total burnt calories', value: '1,273 kcal' },
            { label: 'Distance while active', value: '1.58 km' },
          ]}
        />
        <ActivityChart
          title="Steps"
          activePeriod="6:00 pm - Now"
          color="#D5E84E"
          values={[1, 0, 0, 0, 0, 0, 0.4, 0, 0, 2, 4, 0, 5, 0, 0, 11]}
        />
        <ActivityChart
          title="Active time"
          activePeriod="6:00 pm - Now"
          color="#42C9D9"
          values={[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 0, 7, 0, 0, 13]}
        />
        <ActivityChart
          title="Activity calories"
          activePeriod="6:00 pm - Now"
          color="#B23CC2"
          values={[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 0, 8, 0, 0, 13]}
        />
        <ActivityDetail
          label="Motion"
          leftLabel="Floors"
          leftValue="0"
          rightLabel="Active hours"
          rightValue="7"
        />
        <ActivityDetail
          label="Time"
          leftLabel="Exercise time"
          leftValue="21m"
          rightLabel="Raised HR activity time"
          rightValue="0m"
        />
      </ScrollView>
    </View>
  );
};

export default DailyActivities;
