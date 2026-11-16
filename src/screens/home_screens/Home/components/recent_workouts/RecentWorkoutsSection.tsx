import React from 'react';
import { Pressable, View } from 'react-native';
import { AppShimmer, AppText, SectionHeader } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import {
  EmptyWorkoutsView,
  GroupedActivityCard,
  GroupedActivityItem,
  useRecentWorkouts,
  WorkoutFilterTabs,
  WorkoutOverviewBanner,
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

  const {
    loading,
    activeTab,
    setActiveTab,
    showAllItems,
    setShowAllItems,
    expandedCards,
    toggleExpand,
    groupedActivities,
    filteredGroups,
    displayedGroups,
    workoutGroupCount,
    dailyGroupCount,
    overviewStats,
  } = useRecentWorkouts(healthRefreshKey);

  const handleNavigateWorkout = (activityId?: string) => {
    navigation.navigate(
      'WorkoutSession',
      activityId ? { activityId } : undefined,
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        sectionTitle="Synced Health Activities"
        rightText="Start New"
        onRightPress={() => handleNavigateWorkout()}
        customStyles={styles.sectionHeader}
      />

      {overviewStats.hasData && !loading ? (
        <WorkoutOverviewBanner
          activeTimeText={overviewStats.activeTimeText}
          caloriesText={overviewStats.caloriesText}
          sessionsText={overviewStats.sessionsText}
        />
      ) : null}

      <WorkoutFilterTabs
        activeTab={activeTab}
        allCount={groupedActivities.length}
        workoutCount={workoutGroupCount}
        dailyCount={dailyGroupCount}
        onSelectTab={setActiveTab}
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
      ) : filteredGroups.length === 0 ? (
        <EmptyWorkoutsView
          activeTab={activeTab}
          onStartWorkout={() => handleNavigateWorkout()}
        />
      ) : (
        <View style={styles.list}>
          {displayedGroups.map(group => (
            <GroupedActivityCard
              key={group.id}
              group={group}
              isExpanded={Boolean(expandedCards[group.id])}
              onToggleExpand={() => toggleExpand(group.id)}
              onNavigateWorkout={handleNavigateWorkout}
            />
          ))}

          {filteredGroups.length > 4 ? (
            <Pressable
              onPress={() => setShowAllItems(prev => !prev)}
              style={[
                styles.showMoreButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <AppText variant="caption" bold color="primary">
                {showAllItems
                  ? 'Show Less'
                  : `Show All (${filteredGroups.length} days / activities)`}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default React.memo(RecentWorkoutsSection);
