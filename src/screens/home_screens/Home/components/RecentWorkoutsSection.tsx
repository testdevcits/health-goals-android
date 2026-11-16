import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AppShimmer, AppText, SectionHeader } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import {
  fetchSyncedHealthRecords,
  type SyncedHealthRecord,
} from '../../../../services/healthSync';
import { getWorkoutActivity } from '../../workout_sessions/workoutActivities';

interface RecentWorkoutsSectionProps {
  navigation: any;
  healthRefreshKey?: number;
}

type FilterTab = 'all' | 'workouts' | 'daily';

export interface GroupedActivityItem {
  id: string;
  dateKey: string;
  activityKey: string;
  activityType?: string;
  metricType: string;
  isWorkout: boolean;
  title: string;
  emoji: string;
  dateLabel: string;
  latestTimestamp: number;
  totalDurationMin: number;
  totalCalories: number;
  totalDistanceKm: number;
  displayValue: string;
  source: string;
  sessions: SyncedHealthRecord[];
}

const formatWorkoutDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 min';
  if (minutes < 1) {
    const seconds = Math.max(1, Math.round(minutes * 60));
    return `${seconds}s`;
  }
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  if (secs > 0 && mins < 5) {
    return `${mins}m ${secs}s`;
  }
  return `${mins} min${mins > 1 ? 's' : ''}`;
};

const formatTimeOnly = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const getRecordDateKey = (record: SyncedHealthRecord): string => {
  if (record.activityDate && record.activityDate.includes('-')) {
    return record.activityDate.slice(0, 10);
  }
  const raw = record.startTime || record.recordedAt || record.createdAt;
  if (raw) {
    try {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      // fallback
    }
  }
  return 'unknown-date';
};

const formatGroupDateLabel = (dateKey: string): string => {
  try {
    const parts = dateKey.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d) return dateKey;

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (dateKey === todayKey) return 'Today';
    if (dateKey === yesterdayKey) return 'Yesterday';

    const targetDate = new Date(y, m - 1, d);
    return targetDate.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      ...(targetDate.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
    });
  } catch {
    return dateKey;
  }
};

const getRecordTimestamp = (record: SyncedHealthRecord): number => {
  const dateStr =
    record.startTime ||
    record.recordedAt ||
    record.createdAt ||
    record.activityDate;
  if (!dateStr) return 0;
  const time = new Date(dateStr).getTime();
  return isNaN(time) ? 0 : time;
};

const getRecordActivityKey = (record: SyncedHealthRecord): string => {
  if (record.metricType === 'workout' || record.activityType) {
    return (record.activityType || 'workout').toLowerCase();
  }
  return (record.metricType || 'general').toLowerCase();
};

const getRecordDetails = (record: SyncedHealthRecord) => {
  const isWorkout = record.metricType === 'workout' || Boolean(record.activityType);
  if (isWorkout) {
    const activity = getWorkoutActivity(record.activityType || 'running');
    return {
      title: activity.name,
      emoji: activity.emoji,
      isWorkout: true,
    };
  }

  switch (record.metricType) {
    case 'steps':
      return { title: 'Daily Steps', emoji: '👟', isWorkout: false };
    case 'calories':
      return { title: 'Calories Burned', emoji: '🔥', isWorkout: false };
    case 'distance':
      return { title: 'Distance', emoji: '📍', isWorkout: false };
    case 'active_minutes':
      return { title: 'Active Minutes', emoji: '⚡', isWorkout: false };
    case 'sleep':
      return { title: 'Sleep', emoji: '🌙', isWorkout: false };
    case 'heart_rate':
      return { title: 'Heart Rate', emoji: '❤️', isWorkout: false };
    default:
      return {
        title: record.metricType
          ? record.metricType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : 'Health Record',
        emoji: '📊',
        isWorkout: false,
      };
  }
};

const formatDailyStatValue = (
  metricType: string,
  value: number,
  unit?: string,
): string => {
  switch (metricType) {
    case 'steps':
      return `${Math.round(value).toLocaleString()} steps`;
    case 'calories':
      return `${Math.round(value).toLocaleString()} kcal`;
    case 'distance':
      return `${value.toFixed(2)} km`;
    case 'active_minutes':
      return `${Math.round(value)} min`;
    case 'sleep': {
      const hrs = Math.floor(value / 60);
      const mins = Math.round(value % 60);
      return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
    }
    case 'heart_rate':
      return `${Math.round(value)} bpm`;
    default:
      return `${value} ${unit || ''}`.trim();
  }
};

const groupRecordsByActivityAndDate = (
  records: SyncedHealthRecord[],
): GroupedActivityItem[] => {
  const groupsMap = new Map<string, GroupedActivityItem>();

  for (const record of records) {
    const isWorkout =
      record.metricType === 'workout' || Boolean(record.activityType);
    const dateKey = getRecordDateKey(record);
    const activityKey = getRecordActivityKey(record);
    const groupKey = `${dateKey}_${activityKey}`;
    const timestamp = getRecordTimestamp(record);

    let group = groupsMap.get(groupKey);
    if (!group) {
      const details = getRecordDetails(record);
      const dateLabel = formatGroupDateLabel(dateKey);

      group = {
        id: groupKey,
        dateKey,
        activityKey,
        activityType: record.activityType,
        metricType: record.metricType,
        isWorkout,
        title: details.title,
        emoji: details.emoji,
        dateLabel,
        latestTimestamp: timestamp,
        totalDurationMin: 0,
        totalCalories: 0,
        totalDistanceKm: 0,
        displayValue: '',
        source: record.source || 'app',
        sessions: [],
      };
      groupsMap.set(groupKey, group);
    }

    group.sessions.push(record);

    if (timestamp > group.latestTimestamp) {
      group.latestTimestamp = timestamp;
    }

    if (isWorkout) {
      group.totalDurationMin += Number(record.value) || 0;
      group.totalCalories += Number(record.metadata?.estimatedCalories) || 0;
      group.totalDistanceKm += Number(record.metadata?.estimatedDistanceKm) || 0;
    } else {
      const val = Number(record.value) || 0;
      if (val > group.totalDurationMin) {
        group.totalDurationMin = val;
      }
    }
  }

  const result: GroupedActivityItem[] = [];
  for (const group of groupsMap.values()) {
    group.sessions.sort(
      (a, b) => getRecordTimestamp(b) - getRecordTimestamp(a),
    );

    if (group.isWorkout) {
      group.displayValue = formatWorkoutDuration(group.totalDurationMin);
    } else {
      group.displayValue = formatDailyStatValue(
        group.metricType,
        group.totalDurationMin,
        group.sessions[0]?.unit,
      );
    }

    const allApp = group.sessions.every(s => s.source === 'app');
    const allHC = group.sessions.every(s => s.source === 'health_connect');
    group.source = allApp ? 'Vitality App' : allHC ? 'Health Connect' : 'Synced';

    result.push(group);
  }

  return result.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
};

const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  navigation,
  healthRefreshKey,
}) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const isFocused = useIsFocused();
  const [allRecords, setAllRecords] = useState<SyncedHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showAllItems, setShowAllItems] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSyncedHealthRecords();
      setAllRecords(data);
    } catch (error) {
      console.warn('Could not load synced health records:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadRecords();
    }
  }, [isFocused, loadRecords, healthRefreshKey]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'activitySyncCompleted',
      () => {
        loadRecords();
      },
    );
    return () => {
      subscription.remove();
    };
  }, [loadRecords]);

  const groupedActivities = useMemo(() => {
    return groupRecordsByActivityAndDate(allRecords);
  }, [allRecords]);

  const filteredGroups = useMemo(() => {
    if (activeTab === 'workouts') {
      return groupedActivities.filter(g => g.isWorkout);
    }
    if (activeTab === 'daily') {
      return groupedActivities.filter(g => !g.isWorkout);
    }
    return groupedActivities;
  }, [groupedActivities, activeTab]);

  const displayedGroups = useMemo(() => {
    if (showAllItems) {
      return filteredGroups.slice(0, 15);
    }
    return filteredGroups.slice(0, 4);
  }, [filteredGroups, showAllItems]);

  const workoutGroupCount = useMemo(
    () => groupedActivities.filter(g => g.isWorkout).length,
    [groupedActivities],
  );

  const dailyGroupCount = useMemo(
    () => groupedActivities.filter(g => !g.isWorkout).length,
    [groupedActivities],
  );

  return (
    <View style={styles.container}>
      <SectionHeader
        sectionTitle="Synced Health Records"
        rightText="Start New"
        onRightPress={() => navigation.navigate('WorkoutSession')}
        customStyles={styles.sectionHeader}
      />

      {/* Modern Filter Segment Control */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('all')}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === 'all'
                  ? colors.primary
                  : colors.backgroundSecondary,
              borderRadius: radius.full,
            },
          ]}
        >
          <AppText
            variant="caption"
            bold
            color={activeTab === 'all' ? 'textInverse' : 'textSecondary'}
          >
            All ({groupedActivities.length})
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('workouts')}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === 'workouts'
                  ? colors.primary
                  : colors.backgroundSecondary,
              borderRadius: radius.full,
            },
          ]}
        >
          <AppText
            variant="caption"
            bold
            color={activeTab === 'workouts' ? 'textInverse' : 'textSecondary'}
          >
            Workouts ({workoutGroupCount})
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('daily')}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === 'daily'
                  ? colors.primary
                  : colors.backgroundSecondary,
              borderRadius: radius.full,
            },
          ]}
        >
          <AppText
            variant="caption"
            bold
            color={activeTab === 'daily' ? 'textInverse' : 'textSecondary'}
          >
            Daily Stats ({dailyGroupCount})
          </AppText>
        </Pressable>
      </View>

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
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIconBadge,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <AppText variant="h2">
              {activeTab === 'workouts' ? '🏃' : '📊'}
            </AppText>
          </View>
          <AppText variant="subtitle1" bold color="textPrimary" mb={4}>
            {activeTab === 'workouts'
              ? 'No workouts synced yet'
              : 'No health records found'}
          </AppText>
          <AppText
            variant="body2"
            secondary
            center
            style={styles.emptySubtitle}
          >
            {activeTab === 'workouts'
              ? 'Start your running, walking, or cycling session to track your workouts.'
              : 'Sync your Health Connect or start an activity to see records here.'}
          </AppText>
          <Pressable
            onPress={() => navigation.navigate('WorkoutSession')}
            style={[
              styles.startButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.full,
              },
            ]}
          >
            <AppText variant="buttonSm" color="textInverse" bold>
              Start a Workout
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {displayedGroups.map(group => {
            const hasMultipleSessions = group.sessions.length > 1;
            const isExpanded = Boolean(expandedCards[group.id]);
            const firstSession = group.sessions[0];
            const singleTimeText = formatTimeOnly(
              firstSession?.startTime ||
              firstSession?.recordedAt ||
              firstSession?.createdAt,
            );

            return (
              <View
                key={group?.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.lg,
                    shadowColor: colors.black,
                  },
                ]}
              >
                {/* Card Header */}
                <Pressable
                  onPress={() => {
                    if (group.isWorkout) {
                      navigation.navigate('WorkoutSession', {
                        activityId: group.activityType,
                      });
                    }
                  }}
                  style={styles.cardHeader}
                >
                  <View style={styles.activityInfoRow}>
                    <View
                      style={[
                        styles.iconBadge,
                        {
                          backgroundColor: group.isWorkout
                            ? colors.primaryLight
                            : colors.backgroundSecondary,
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      <AppText style={styles.activityEmoji}>
                        {group?.emoji}
                      </AppText>
                    </View>
                    <View style={styles.titleCol}>
                      <View style={styles.titleRow}>
                        <AppText variant="subtitle1" bold numberOfLines={1}>
                          {group?.title}
                        </AppText>
                      </View>
                      <View style={styles.subtitleRow}>
                        <AppText variant="caption" secondary bold>
                          {group?.dateLabel}
                        </AppText>
                        <View
                          style={[
                            styles.dotDivider,
                            { backgroundColor: colors.border },
                          ]}
                        />
                        {hasMultipleSessions ? (
                          <View
                            style={[
                              styles.sessionsBadge,
                              { backgroundColor: colors.primaryLight },
                            ]}
                          >
                            <AppText
                              variant="caption"
                              bold
                              color="primary"
                              style={styles.sessionsBadgeText}
                            >
                              {group?.sessions.length} Sessions
                            </AppText>
                          </View>
                        ) : singleTimeText ? (
                          <AppText variant="caption" secondary>
                            {singleTimeText}
                          </AppText>
                        ) : (
                          <AppText variant="caption" secondary>
                            {group?.source}
                          </AppText>
                        )}
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.sourceBadge,
                      {
                        backgroundColor: colors.successLight,
                        borderColor: colors.success,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color="textSuccess"
                      bold
                      style={styles.sourceBadgeText}
                    >
                      {group?.source}
                    </AppText>
                  </View>
                </Pressable>

                {/* Primary Metrics Row */}
                <View
                  style={[
                    styles.metricsRow,
                    { borderTopColor: colors.border },
                  ]}
                >
                  {/* Duration / Main Value Pill */}
                  <View
                    style={[
                      styles.metricPill,
                      { backgroundColor: colors.backgroundSecondary },
                    ]}
                  >
                    {group?.isWorkout ? (
                      <AppIcon name="Clock" size={13} color={colors.primary} />
                    ) : null}
                    <AppText variant="caption" bold color="primary">
                      {group?.displayValue}
                    </AppText>
                  </View>

                  {/* Calories Pill */}
                  {group?.isWorkout && group?.totalCalories > 0 ? (
                    <View
                      style={[
                        styles.metricPill,
                        { backgroundColor: colors.backgroundSecondary },
                      ]}
                    >
                      <AppText variant="caption">🔥</AppText>
                      <AppText
                        variant="caption"
                        bold
                        style={{ color: colors.warning }}
                      >
                        {group?.totalCalories} kcal
                      </AppText>
                    </View>
                  ) : null}

                  {/* Distance Pill */}
                  {group?.isWorkout && group.totalDistanceKm > 0 ? (
                    <View
                      style={[
                        styles.metricPill,
                        { backgroundColor: colors.backgroundSecondary },
                      ]}
                    >
                      <AppIcon name="MapPin" size={12} color={colors.info} />
                      <AppText
                        variant="caption"
                        bold
                        style={{ color: colors.info }}
                      >
                        {group?.totalDistanceKm.toFixed(2)} km
                      </AppText>
                    </View>
                  ) : null}
                </View>

                {/* Multiple Sessions Expand Toggle */}
                {hasMultipleSessions ? (
                  <Pressable
                    onPress={() => toggleExpand(group.id)}
                    style={[
                      styles.expandToggleBtn,
                      { borderTopColor: colors.border },
                    ]}
                  >
                    <AppText variant="caption" bold secondary>
                      {isExpanded
                        ? 'Hide Session Details'
                        : `View all ${group?.sessions.length} sessions`}
                    </AppText>
                    <AppIcon
                      name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                ) : null}

                {/* Expanded Session Breakdown */}
                {hasMultipleSessions && isExpanded ? (
                  <View
                    style={[
                      styles.sessionsBreakdownContainer,
                      { borderTopColor: colors.border },
                    ]}
                  >
                    {group?.sessions.map((session, index) => {
                      const sessionDuration = formatWorkoutDuration(
                        session.value,
                      );
                      const sessionCal =
                        session.metadata?.estimatedCalories;
                      const sessionDist =
                        session.metadata?.estimatedDistanceKm;
                      const sessionTime =
                        formatTimeOnly(
                          session.startTime ||
                          session.recordedAt ||
                          session.createdAt,
                        ) || `Session #${group?.sessions.length - index}`;

                      return (
                        <View
                          key={session.id || session.sourceRecordId || `${index}`}
                          style={[
                            styles.sessionItemRow,
                            { backgroundColor: colors.backgroundSecondary },
                          ]}
                        >
                          <View style={styles.sessionItemLeft}>
                            <View
                              style={[
                                styles.sessionIndexBadge,
                                { backgroundColor: colors.primaryLight },
                              ]}
                            >
                              <AppText
                                variant="caption"
                                bold
                                color="primary"
                                style={styles.sessionIndexText}
                              >
                                #{index + 1}
                              </AppText>
                            </View>
                            <AppText variant="caption" bold color="textPrimary">
                              {sessionTime}
                            </AppText>
                          </View>

                          <View style={styles.sessionItemMetrics}>
                            <AppText variant="caption" bold color="primary">
                              {sessionDuration}
                            </AppText>
                            {sessionCal != null && sessionCal > 0 ? (
                              <AppText
                                variant="caption"
                                style={{ color: colors.warning }}
                              >
                                {sessionCal} kcal
                              </AppText>
                            ) : null}
                            {sessionDist != null && sessionDist > 0 ? (
                              <AppText
                                variant="caption"
                                style={{ color: colors.info }}
                              >
                                {sessionDist.toFixed(2)} km
                              </AppText>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}

          {filteredGroups.length > 4 ? (
            <Pressable
              onPress={() => setShowAllItems(prev => !prev)}
              style={[
                styles.showMoreButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
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

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  sectionHeader: {
    marginHorizontal: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
    marginTop: 2,
  },
  shimmerCard: {
    height: 110,
    width: '100%',
  },
  card: {
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 24,
  },
  titleCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  dotDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  sessionsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sessionsBadgeText: {
    fontSize: 10,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  sourceBadgeText: {
    fontSize: 11,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sessionsBreakdownContainer: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  sessionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sessionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionIndexBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIndexText: {
    fontSize: 10,
  },
  sessionItemMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyCard: {
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  emptyIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    maxWidth: 270,
    marginBottom: 16,
  },
  startButton: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreButton: {
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
});

export default React.memo(RecentWorkoutsSection);
