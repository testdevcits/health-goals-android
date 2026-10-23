import React from 'react';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createDailyActivityStyles } from './styles.DailyActivities';
import ActivityChart from './components/ActivityChart';
import ActivityHeader from './components/ActivityHeader';
import ActivityMetrics from './components/ActivityMetrics';
import ActivityRings from './components/ActivityRings';
import DailyTotals from './components/DailyTotals';
import { DailyActivityNavigation } from './types';

const DailyActivities: React.FC<{ navigation: DailyActivityNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createDailyActivityStyles(theme);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <ActivityHeader navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}>
        <ActivityRings />
        <ActivityMetrics />
        <DailyTotals />
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
        <Pressable
          onPress={navigation.goBack}
          style={styles.backHome}
          accessibilityRole="button">
          <AppText variant="subtitle2" bold>
            Back to Home
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const ActivityDetail: React.FC<{
  label: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}> = ({ label, leftLabel, leftValue, rightLabel, rightValue }) => {
  const { theme } = useTheme();
  const styles = createDailyActivityStyles(theme);
  return (
    <View style={styles.detailCard}>
      <AppText variant="subtitle2" bold style={styles.detailTitle}>
        {label}
      </AppText>
      <View style={styles.detailValues}>
        <View style={styles.detailMetric}>
          <AppText variant="caption" secondary>{leftLabel}</AppText>
          <AppText variant="h3">{leftValue}</AppText>
        </View>
        <View style={styles.detailMetric}>
          <AppText variant="caption" secondary>{rightLabel}</AppText>
          <AppText variant="h3">{rightValue}</AppText>
        </View>
      </View>
    </View>
  );
};

export default DailyActivities;
