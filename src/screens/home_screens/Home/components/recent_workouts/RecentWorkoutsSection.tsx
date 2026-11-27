import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AppShimmer, SectionHeader } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import {
  EmptyWorkoutsView,
  GroupedActivityItem,
  useRecentWorkouts,
  WeeklyWorkoutTrendChart,
} from './';
import styles from './styles.RecentWorkoutsSection';

export type { GroupedActivityItem };

interface RecentWorkoutsSectionProps {
  navigation: any;
  healthRefreshKey?: number;
}

const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  navigation,
  healthRefreshKey,
}) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const { loading, groupedActivities } = useRecentWorkouts(healthRefreshKey);

  const handleNavigateWorkout = useCallback(
    (activityId?: string) => {
      navigation.navigate(
        'WorkoutSession',
        activityId ? { activityId } : undefined,
      );
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <SectionHeader
        sectionTitle="Synced Health Activities"
        rightText="Start New"
        onRightPress={() => handleNavigateWorkout()}
        customStyles={styles.sectionHeader}
      />

      {loading ? (
        <View style={styles.list}>
          <AppShimmer>
            <View
              style={[
                styles.shimmerCard,
                {
                  borderRadius: radius.lg,
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            />
          </AppShimmer>
          <AppShimmer>
            <View
              style={[
                styles.shimmerCard,
                {
                  borderRadius: radius.lg,
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            />
          </AppShimmer>
        </View>
      ) : groupedActivities.length === 0 ? (
        <EmptyWorkoutsView
          activeTab="all"
          onStartWorkout={() => handleNavigateWorkout()}
        />
      ) : (
        <WeeklyWorkoutTrendChart
          groupedActivities={groupedActivities}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDateKey}
        />
      )}
    </View>
  );
};

export default React.memo(RecentWorkoutsSection);
