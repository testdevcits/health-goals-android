import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { AppShimmer, AppText, SectionHeader } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import {
  EmptyWorkoutsView,
  GroupedActivityCard,
  GroupedActivityItem,
  useRecentWorkouts,
  WeeklyWorkoutTrendChart,
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
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const {
    loading,
    loadingMore,
    loadMore,
    hasMore,
    activeTab,
    setActiveTab,
    expandedCards,
    toggleExpand,
    groupedActivities,
    filteredGroups,
    displayedGroups,
    workoutGroupCount,
    dailyGroupCount,
    overviewStats,
  } = useRecentWorkouts(healthRefreshKey);

  const visibleGroups = useMemo(() => {
    if (!selectedDateKey) {
      return displayedGroups;
    }
    return filteredGroups.filter(g => g.dateKey === selectedDateKey);
  }, [displayedGroups, filteredGroups, selectedDateKey]);

  const handleNavigateWorkout = useCallback(
    (activityId?: string) => {
      navigation.navigate(
        'WorkoutSession',
        activityId ? { activityId } : undefined,
      );
    },
    [navigation],
  );

  const renderActivityGroup = useCallback(
    ({ item }: { item: GroupedActivityItem }) => (
      <GroupedActivityCard
        key={item.id}
        group={item}
        isExpanded={Boolean(expandedCards[item.id])}
        onToggleExpand={() => toggleExpand(item.id)}
        onNavigateWorkout={handleNavigateWorkout}
      />
    ),
    [expandedCards, handleNavigateWorkout, toggleExpand],
  );

  const keyExtractor = useCallback(
    (item: GroupedActivityItem) => item.id,
    [],
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingVertical: theme.spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: theme.spacing.sm,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText variant="caption" color="textSecondary">
            Loading more activities...
          </AppText>
        </View>
      );
    }
    return null;
  }, [
    colors.primary,
    loadingMore,
    theme.spacing.md,
    theme.spacing.sm,
  ]);

  return (
    <View style={styles.container}>
      <SectionHeader
        sectionTitle="Synced Health Activities"
        rightText="Start New"
        onRightPress={() => handleNavigateWorkout()}
        customStyles={styles.sectionHeader}
      />

      {overviewStats.hasData && !loading ? (
        <>
          <WorkoutOverviewBanner
            activeTimeText={overviewStats.activeTimeText}
            caloriesText={overviewStats.caloriesText}
            sessionsText={overviewStats.sessionsText}
          />
          <WeeklyWorkoutTrendChart
            groupedActivities={groupedActivities}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
          />
        </>
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
        <FlatList
          data={visibleGroups}
          renderItem={renderActivityGroup}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={false}
          onEndReached={() => {
            if (hasMore && !loadingMore && !loading && !selectedDateKey) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={selectedDateKey ? null : renderFooter}
        />
      )}
    </View>
  );
};

export default React.memo(RecentWorkoutsSection);
