import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTodayHealthData } from '../../../../hooks/useTodayHealthData';
import { useTheme } from '../../../../theme/useTheme';

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  value.toLocaleString('en-US', { maximumFractionDigits });

const formatTime = (time: string) =>
  new Date(time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

const getMostActiveHour = (values: number[] | null) => {
  if (!values?.length) {
    return 'Not available';
  }

  const maxValue = Math.max(...values);
  if (maxValue <= 0) {
    return 'No activity recorded';
  }

  const hour = values.indexOf(maxValue);
  const start = new Date();
  start.setHours(hour, 0, 0, 0);
  const end = new Date(start);
  end.setHours(hour + 1);
  return `${formatTime(start.toISOString())}–${formatTime(end.toISOString())}`;
};

const TodayUpdate: React.FC = memo(() => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const { data, error, loading } = useTodayHealthData(true);
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  let reportLines = ['Today’s workout report is not available yet.'];

  if (loading) {
    reportLines = [
      'Loading today’s workout and activity data from Health Connect.',
    ];
  } else if (error) {
    reportLines = [
      'Today’s workout report could not be loaded.',
      error,
      'Please check Health Connect access and try again.',
    ];
  } else if (data?.status === 'permission-required') {
    reportLines = [
      'Today’s workout details are not available yet.',
      'Health Connect access is required to read your activity.',
      'Open Profile > Connected Devices to connect Health Connect.',
      'Allow access to steps, distance, exercise sessions, and calories.',
      'Return here after granting access to load your daily report.',
    ];
  } else if (data?.status === 'unavailable') {
    reportLines = [
      'Health Connect is unavailable on this device.',
      'Install or update Health Connect, then try again.',
      'Today’s activity totals cannot be read until it is available.',
    ];
  } else if (data?.status === 'unsupported') {
    reportLines = [
      'Health Connect workout reports are currently supported on Android.',
      'Connect Health Connect on an Android device to view today’s activity.',
    ];
  } else if (data?.status === 'ready') {
    const workoutDetails =
      data.workouts === null
        ? 'Unavailable (exercise-session access not granted)'
        : data.workouts.length === 0
        ? 'No workout sessions recorded'
        : data.workouts
            .map(
              workout =>
                `${workout.activity}, ${formatTime(
                  workout.startTime,
                )}–${formatTime(workout.endTime)}, ${formatNumber(
                  workout.durationMinutes,
                )} min`,
            )
            .join('; ');
    const stepsGoal =
      data.steps === null
        ? 'Unavailable'
        : data.steps >= 6000
        ? '6,000 steps reached'
        : `${formatNumber(6000 - data.steps)} steps to go`;
    const exerciseGoal =
      data.exerciseMinutes === null
        ? 'Unavailable'
        : data.exerciseMinutes >= 90
        ? '90 minutes reached'
        : `${formatNumber(90 - data.exerciseMinutes)} minutes to go`;

    reportLines = [
      `Steps today: ${
        data.steps === null ? 'Not available' : formatNumber(data.steps)
      }`,
      `Step goal (6,000): ${stepsGoal}`,
      `Distance today: ${
        data.distanceMeters === null
          ? 'Not available'
          : `${formatNumber(data.distanceMeters / 1000, 2)} km`
      }`,
      `Exercise time: ${
        data.exerciseMinutes === null
          ? 'Not available'
          : `${formatNumber(data.exerciseMinutes)} minutes`
      }`,
      `Exercise goal (90 min): ${exerciseGoal}`,
      `Total calories burned: ${
        data.calories === null
          ? 'Not available'
          : `${formatNumber(data.calories)} kcal`
      }`,
      `Workout sessions: ${
        data.workouts === null ? 'Details unavailable' : data.workouts.length
      }`,
      `Workout details: ${workoutDetails}`,
      `Most active steps hour: ${getMostActiveHour(data.hourlySteps)}`,
      `Most active exercise hour: ${getMostActiveHour(
        data.hourlyExerciseMinutes,
      )}`,
      `Report date: ${today}`,
      'Source: activity synced to Health Connect today; totals may update as more records arrive.',
    ];
  }
  const report = reportLines.join('\n');

  return (
    <View
      accessibilityLabel={`Today's workout report. ${report}`}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          marginHorizontal: spacing.xl,
          marginTop: spacing.md,
          padding: spacing.base,
          borderLeftColor: colors.primary,
          shadowColor: colors.black,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <AppText variant="caption" primary bold style={styles.heading}>
          TODAY’S WORKOUT REPORT
        </AppText>
        <AppText variant="caption" secondary style={styles.date}>
          {today}
        </AppText>
      </View>

      <AppText
        variant="body2"
        style={[styles.paragraph, { color: colors.textPrimary }]}
      >
        {report}
      </AppText>
    </View>
  );
});

export default TodayUpdate;

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  heading: {
    letterSpacing: 0.5,
  },
  date: {
    marginLeft: 'auto',
  },
  paragraph: {
    lineHeight: 22,
  },
});
