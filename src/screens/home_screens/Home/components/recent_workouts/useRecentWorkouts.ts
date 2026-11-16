import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  fetchSyncedHealthRecords,
  type SyncedHealthRecord,
} from '../../../../../services/healthSync';
import { getWorkoutActivity } from '../../../workout_sessions/workoutActivities';
import { storageService } from '../../../../../storage/storageService';

const CACHE_KEY_SYNCED_RECORDS = 'cache_synced_health_records';

export type FilterTab = 'all' | 'workouts' | 'daily';

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

export const formatWorkoutDuration = (minutes: number): string => {
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

export const formatTimeOnly = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const getRecordDateKey = (record: SyncedHealthRecord): string => {
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

export const formatGroupDateLabel = (dateKey: string): string => {
  try {
    const parts = dateKey.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d) return dateKey;

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(
      yesterday.getMonth() + 1,
    ).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (dateKey === todayKey) return 'Today';
    if (dateKey === yesterdayKey) return 'Yesterday';

    const targetDate = new Date(y, m - 1, d);
    return targetDate.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      ...(targetDate.getFullYear() !== now.getFullYear()
        ? { year: 'numeric' }
        : {}),
    });
  } catch {
    return dateKey;
  }
};

export const getRecordTimestamp = (record: SyncedHealthRecord): number => {
  const dateStr =
    record.startTime ||
    record.recordedAt ||
    record.createdAt ||
    record.activityDate;
  if (!dateStr) return 0;
  const time = new Date(dateStr).getTime();
  return isNaN(time) ? 0 : time;
};

export const getRecordActivityKey = (record: SyncedHealthRecord): string => {
  if (record.metricType === 'workout' || record.activityType) {
    return (record.activityType || 'workout').toLowerCase();
  }
  return (record.metricType || 'general').toLowerCase();
};

export const getRecordDetails = (record: SyncedHealthRecord) => {
  const isWorkout =
    record.metricType === 'workout' || Boolean(record.activityType);
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
      return { title: 'Distance Covered', emoji: '📍', isWorkout: false };
    case 'active_minutes':
      return { title: 'Active Minutes', emoji: '⚡', isWorkout: false };
    case 'sleep':
      return { title: 'Sleep Tracked', emoji: '🌙', isWorkout: false };
    case 'heart_rate':
      return { title: 'Heart Rate', emoji: '❤️', isWorkout: false };
    default:
      return {
        title: record.metricType
          ? record.metricType
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
          : 'Health Record',
        emoji: '📊',
        isWorkout: false,
      };
  }
};

export const formatDailyStatValue = (
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

export const groupRecordsByActivityAndDate = (
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
      group.totalDistanceKm +=
        Number(record.metadata?.estimatedDistanceKm) || 0;
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
    group.source = allApp
      ? 'Vitality App'
      : allHC
      ? 'Health Connect'
      : 'Synced';

    result.push(group);
  }

  return result.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
};

export const useRecentWorkouts = (healthRefreshKey?: number) => {
  const isFocused = useIsFocused();
  const [allRecords, setAllRecords] = useState<SyncedHealthRecord[]>(() => {
    return (
      storageService.getObject<SyncedHealthRecord[]>(
        CACHE_KEY_SYNCED_RECORDS,
      ) || []
    );
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = storageService.getObject<SyncedHealthRecord[]>(
      CACHE_KEY_SYNCED_RECORDS,
    );
    return !cached || cached.length === 0;
  });
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showAllItems, setShowAllItems] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  const toggleExpand = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const loadRecords = useCallback(async () => {
    try {
      const data = await fetchSyncedHealthRecords();
      setAllRecords(data);
      if (data && data.length > 0) {
        storageService.setObject(CACHE_KEY_SYNCED_RECORDS, data);
      }
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

  const overviewStats = useMemo(() => {
    let totalMins = 0;
    let totalCals = 0;
    let sessionCount = 0;

    for (const group of groupedActivities) {
      if (group.isWorkout) {
        totalMins += group.totalDurationMin;
        totalCals += group.totalCalories;
        sessionCount += group.sessions.length;
      }
    }
    return {
      activeTimeText: formatWorkoutDuration(totalMins),
      caloriesText: `${Math.round(totalCals)} kcal`,
      sessionsText: `${sessionCount} Sessions`,
      hasData: sessionCount > 0,
    };
  }, [groupedActivities]);

  return {
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
  };
};
