import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createDailyActivityStyles } from './styles.DailyActivities';
import ActivityChart from './components/ActivityChart';
import ActivityMetrics from './components/ActivityMetrics';
import ActivityRings from './components/ActivityRings';
import DailyTotals from './components/DailyTotals';
import type { DailyActivityNavigation } from './types';
import { useTodayHealthData } from '../../../hooks/useTodayHealthData';

const DailyActivities: React.FC<{ navigation: DailyActivityNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createDailyActivityStyles(theme);
  const { data, error, loading } = useTodayHealthData(true);
  const steps = data?.steps ?? 0;
  const exerciseMinutes = data?.exerciseMinutes ?? 0;
  const calories = data?.calories ?? 0;
  const hourlySteps = data?.hourlySteps ?? [];
  const hourlyExerciseMinutes = data?.hourlyExerciseMinutes ?? [];
  const hourlyCalories = data?.hourlyCalories ?? [];
  const formatMostActiveHour = (values: number[]) => {
    const activeHour = values.indexOf(Math.max(...values, 0));
    if (activeHour < 0 || values[activeHour] === 0) {
      return 'No activity recorded yet';
    }

    const formatHour = (hour: number) => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
    };

    return `${formatHour(activeHour)} - ${formatHour((activeHour + 1) % 24)}`;
  };
  const connectionMessage = loading
    ? 'Loading today’s health data…'
    : error
    ? error
    : data?.status === 'permission-required'
    ? 'Connect Health Connect in Profile > Connected Devices to sync your activity.'
    : data?.status === 'unavailable'
    ? 'Health Connect is unavailable. Install or update it to sync activity.'
    : data?.status === 'unsupported'
    ? 'Health Connect activity sync is available on Android.'
    : null;

  return (
    <View style={[styles.screen, {}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <AppHeader
        title="Daily Activity"
        subtitle={new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}
      >
        {connectionMessage ? (
          <AppText
            variant="caption"
            color={error ? 'textError' : 'textSecondary'}
            style={{ marginTop: theme.spacing.md }}
          >
            {connectionMessage}
          </AppText>
        ) : null}
        <ActivityRings
          rings={[
            {
              radius: 66,
              progress: Math.min(steps / 6000, 1),
              color: theme.colors.primary,
            },
            {
              radius: 52,
              progress: Math.min(exerciseMinutes / 90, 1),
              color: theme.colors.coral,
            },
            {
              radius: 38,
              progress: Math.min(calories / 500, 1),
              color: theme.colors.warning,
            },
          ]}
        />
        <ActivityMetrics
          metrics={[
            {
              title: 'Steps',
              value: data?.steps?.toLocaleString('en-US') ?? '—',
              goal: '/ 6,000',
              color: theme.colors.primary,
            },
            {
              title: 'Exercise time',
              value: data?.exerciseMinutes
                ? String(Math.round(data.exerciseMinutes))
                : data?.exerciseMinutes === 0
                ? '0'
                : '—',
              unit: 'mins',
              goal: '/ 90',
              color: theme.colors.coral,
            },
            {
              title: 'Calories',
              value: data?.calories?.toLocaleString('en-US') ?? '—',
              unit: 'kcal',
              goal: '/ 500',
              color: theme.colors.warning,
            },
          ]}
        />
        <DailyTotals
          totals={[
            {
              label: 'Distance',
              value:
                data?.distanceMeters === null ||
                data?.distanceMeters === undefined
                  ? '—'
                  : `${(data.distanceMeters / 1000).toFixed(2)} km`,
            },
          ]}
        />
        <ActivityChart
          title="Steps"
          activePeriod={formatMostActiveHour(hourlySteps)}
          color={theme.colors.primary}
          values={hourlySteps}
        />
        <ActivityChart
          title="Exercise time"
          activePeriod={formatMostActiveHour(hourlyExerciseMinutes)}
          color={theme.colors.coral}
          values={hourlyExerciseMinutes}
        />
        <ActivityChart
          title="Calories"
          activePeriod={formatMostActiveHour(hourlyCalories)}
          color={theme.colors.warning}
          values={hourlyCalories}
        />
      </ScrollView>
    </View>
  );
};

export default DailyActivities;
