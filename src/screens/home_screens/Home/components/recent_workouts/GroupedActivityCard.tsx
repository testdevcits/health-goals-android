import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { getActivityThemeColors } from './getActivityThemeColors';
import styles from './styles.RecentWorkoutsSection';
import {
  formatTimeOnly,
  formatWorkoutDuration,
  type GroupedActivityItem,
} from './useRecentWorkouts';

interface GroupedActivityCardProps {
  group: GroupedActivityItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigateWorkout: (activityId?: string) => void;
}

export const GroupedActivityCard: React.FC<GroupedActivityCardProps> = ({
  group,
  isExpanded,
  onToggleExpand,
  onNavigateWorkout,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const hasMultipleSessions = group.sessions.length > 1;
  const firstSession = group.sessions[0];
  const singleTimeText = formatTimeOnly(
    firstSession?.startTime ||
      firstSession?.recordedAt ||
      firstSession?.createdAt,
  );
  const themeAccents = getActivityThemeColors(
    group.activityKey,
    group.metricType,
    colors,
  );

  const isSteps = group.metricType === 'steps';
  const stepGoal = 10000;
  const stepProgress = isSteps
    ? Math.min(1, Math.max(0, group.totalDurationMin / stepGoal))
    : 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.black,
        },
      ]}
    >
      {/* Card Header */}
      <Pressable
        onPress={() => {
          if (group.isWorkout) {
            onNavigateWorkout(group.activityType);
          }
        }}
        style={styles.cardHeader}
      >
        <View style={styles.activityInfoRow}>
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: themeAccents.bg,
                borderColor: themeAccents.accent,
              },
            ]}
          >
            <AppText>{group.emoji}</AppText>
          </View>
          <View style={styles.titleCol}>
            <View style={styles.titleRow}>
              <AppText variant="subtitle1" bold numberOfLines={1}>
                {group.title}
              </AppText>
            </View>
            <View style={styles.subtitleRow}>
              <AppText variant="caption" secondary bold>
                {group.dateLabel}
              </AppText>
              <View
                style={[styles.dotDivider, { backgroundColor: colors.border }]}
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
                    {group.sessions.length} Sessions
                  </AppText>
                </View>
              ) : singleTimeText ? (
                <AppText variant="caption" secondary>
                  {singleTimeText}
                </AppText>
              ) : (
                <AppText variant="caption" secondary>
                  {group.source}
                </AppText>
              )}
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
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
              {group.source}
            </AppText>
          </View>

          {/* Quick Start Activity Action */}
          {group.isWorkout ? (
            <Pressable
              onPress={() => onNavigateWorkout(group.activityType)}
              style={[
                styles.quickStartBtn,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <AppIcon name="ArrowRight" size={13} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
      </Pressable>

      {/* Primary Metrics Row */}
      <View
        style={[styles.metricsRow, { borderTopColor: colors.border }]}
      >
        {/* Duration / Main Value Pill */}
        <View
          style={[
            styles.metricPill,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          {group.isWorkout ? (
            <AppIcon name="Clock" size={13} color={colors.primary} />
          ) : null}
          <AppText variant="caption" bold color="primary">
            {group.displayValue}
          </AppText>
        </View>

        {/* Calories Pill */}
        {group.isWorkout && group.totalCalories > 0 ? (
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
              {group.totalCalories} kcal
            </AppText>
          </View>
        ) : null}

        {/* Distance Pill */}
        {group.isWorkout && group.totalDistanceKm > 0 ? (
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
              {group.totalDistanceKm.toFixed(2)} km
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Interactive Steps Progress Visual */}
      {isSteps ? (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.round(stepProgress * 100)}%`,
                  backgroundColor: themeAccents.accent,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabelsRow}>
            <AppText variant="caption" secondary>
              Goal: 10,000 steps
            </AppText>
            <AppText variant="caption" bold color="primary">
              {Math.round(stepProgress * 100)}%
            </AppText>
          </View>
        </View>
      ) : null}

      {/* Multiple Sessions Expand Toggle */}
      {hasMultipleSessions ? (
        <Pressable
          onPress={onToggleExpand}
          style={[
            styles.expandToggleBtn,
            { borderTopColor: colors.border },
          ]}
        >
          <AppText variant="caption" bold secondary>
            {isExpanded
              ? 'Hide session details'
              : `View all ${group.sessions.length} sessions`}
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
          {group.sessions.map((session, index) => {
            const sessionDuration = formatWorkoutDuration(session.value);
            const sessionCal = session.metadata?.estimatedCalories;
            const sessionDist = session.metadata?.estimatedDistanceKm;
            const sessionTime =
              formatTimeOnly(
                session.startTime ||
                  session.recordedAt ||
                  session.createdAt,
              ) || `Session #${group.sessions.length - index}`;

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
};
