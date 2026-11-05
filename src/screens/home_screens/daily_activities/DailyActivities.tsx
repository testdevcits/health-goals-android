import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppButton,
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createDailyActivityStyles } from './styles.DailyActivities';
import ActivityChart from './components/ActivityChart';
import ActivityMetrics from './components/ActivityMetrics';
import ActivityRings from './components/ActivityRings';
import DailyTotals from './components/DailyTotals';
import type { DailyActivityNavigation } from './types';
import { useTodayHealthData } from '../../../hooks/useTodayHealthData';
import { syncRecentHealthData } from '../../../services/healthSync';

const DailyActivities: React.FC<{ navigation: DailyActivityNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createDailyActivityStyles(theme);
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [syncing, setSyncing] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState('');
  const { data, error, loading } = useTodayHealthData(true, refreshToken);
  const syncNow = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await syncRecentHealthData();
      setSyncMessage(
        result.synced === 0
          ? 'No recent Health Connect records were available to sync.'
          : `Sent ${result.synced} records · ${result.created} new · ${result.duplicates} already synced.`,
      );
      setRefreshToken(value => value + 1);
    } catch (cause) {
      setSyncMessage(
        cause instanceof Error
          ? cause.message
          : 'Could not sync with the backend. Try again.',
      );
    } finally {
      setSyncing(false);
    }
  };
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
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginBottom: theme.spacing.md,
          }}
        >
          <AppButton
            title="Sync latest data"
            onPress={() => {
              void syncNow();
            }}
            loading={syncing}
          />
          {syncMessage ? (
            <AppText
              variant="caption"
              secondary
              style={{ marginTop: theme.spacing.xs }}
            >
              {syncMessage}
            </AppText>
          ) : null}
        </View>
        {loading ? (
          <AppLoader message="Loading today’s activity…" />
        ) : error ? (
          <AppErrorView
            message={error}
            onRefresh={() => setRefreshToken(value => value + 1)}
          />
        ) : data?.status === 'permission-required' ? (
          <AppEmptyState
            title="Health access needed"
            description="Connect Health Connect in Profile → Connected Devices and allow access to the health metrics you want to see."
          />
        ) : data?.status === 'unavailable' ? (
          <AppEmptyState
            title="Health Connect unavailable"
            description="Install or update Health Connect, then return to view your activity."
          />
        ) : data?.status === 'unsupported' ? (
          <AppEmptyState
            title="Android only"
            description="Health Connect activity sync is currently available on Android."
          />
        ) : !data ||
          [
            data.steps,
            data.distanceMeters,
            data.calories,
            data.exerciseMinutes,
          ].every(value => value === null) ? (
          <AppEmptyState
            title="No activity recorded today"
            description="Your steps, workouts, distance, and calories will appear here after Health Connect records them."
          />
        ) : (
          <>
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
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DailyActivities;
