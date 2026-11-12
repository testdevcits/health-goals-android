import React from 'react';
import { Pressable, View } from 'react-native';
import {
  AppButton,
  AppEmptyState,
  AppErrorView,
  AppLoader,
  AppText,
  ProfileCard,
  ProfileMetric,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.HealthReport';
import type { DailyValue, HealthReportTab } from '../useHealthReports';

interface MetricReportCardProps {
  from: Date;
  to: Date;
  openDatePicker: () => void;
  activeTab: HealthReportTab;
  setActiveTab: (tab: HealthReportTab) => void;
  loading: boolean;
  error: string;
  refresh: () => void;
  history: DailyValue[];
  totalCoins: number;
  shareReport: (title: string) => void;
}

export const MetricReportCard: React.FC<MetricReportCardProps> = ({
  from,
  to,
  openDatePicker,
  activeTab,
  setActiveTab,
  loading,
  error,
  refresh,
  history,
  totalCoins,
  shareReport,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const chartHistory = history.slice(-7);
  const chartMaxValue = Math.max(...chartHistory.map(item => item.value), 1);

  return (
    <ProfileCard style={styles.reportCard}>
      <View style={styles.reportHeading}>
        <AppText variant="subtitle2" bold>
          Report Period
        </AppText>
        <Pressable
          onPress={openDatePicker}
          style={[styles.dateRangeButton, { backgroundColor: colors.primaryLight }]}
          accessibilityRole="button"
          accessibilityLabel={`Choose report date range, ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`}
          accessibilityHint="Opens a calendar to choose the report start and end dates"
        >
          <AppText variant="caption" primary bold>
            {from.toLocaleDateString()} – {to.toLocaleDateString()}
          </AppText>
        </Pressable>
      </View>

      <View
        style={[
          styles.tabs,
          { backgroundColor: theme.colors.backgroundSecondary },
        ]}
      >
        {(['Steps', 'Sleep', 'Workouts'] as HealthReportTab[]).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <AppText
              variant="caption"
              bold={activeTab === tab}
              color={activeTab === tab ? 'textPrimary' : 'textTertiary'}
            >
              {tab}
            </AppText>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <AppLoader message="Loading your health report…" />
      ) : error ? (
        <AppErrorView message={error} onRefresh={refresh} />
      ) : history.length === 0 ? (
        <AppEmptyState
          title="No health data for this period"
          description="Connect Health Connect and allow access to this metric to see your report."
        />
      ) : activeTab === 'Steps' ? (
        <View style={styles.chart}>
          {chartHistory.map((item, index) => (
            <View key={index} style={styles.chartDay}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(
                      7,
                      Math.min(
                        100,
                        Math.round((item.value / chartMaxValue) * 100),
                      ),
                    ),
                    backgroundColor:
                      index === chartHistory.length - 1
                        ? theme.colors.primary
                        : theme.colors.primaryDark,
                  },
                ]}
              />
              <AppText variant="caption" color="textTertiary">
                {new Date(`${item.date}T12:00:00`).toLocaleDateString([], {
                  weekday: 'short',
                })}
              </AppText>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.chartPlaceholder}>
          <AppText variant="h3" primary>
            {history
              .reduce((sum, item) => sum + item.value, 0)
              .toLocaleString()}{' '}
            {history[0]?.unit}
          </AppText>
          <AppText variant="caption" secondary>
            {activeTab === 'Sleep'
              ? 'Sleep recorded this period'
              : 'Workout minutes recorded this period'}
          </AppText>
        </View>
      )}

      {!loading && !error && history.length > 0 ? (
        <View style={styles.metricsRow}>
          {(activeTab === 'Steps'
            ? [
                [
                  history
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString(),
                  'Total Steps',
                ],
                [
                  history.length
                    ? Math.round(
                        history.reduce((sum, item) => sum + item.value, 0) /
                          history.length,
                      ).toLocaleString()
                    : '—',
                  'Daily Avg',
                ],
                [
                  history
                    .filter(item => item.value >= 10000)
                    .length.toString(),
                  'Days >10K',
                ],
              ]
            : activeTab === 'Sleep'
            ? [
                [
                  history.length
                    ? `${Math.floor(
                        history.reduce((sum, item) => sum + item.value, 0) /
                          history.length /
                          60,
                      )}h ${Math.round(
                        (history.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        ) /
                          history.length) %
                          60,
                      )}m`
                    : '—',
                  'Avg Sleep',
                ],
                [history.length.toString(), 'Days Recorded'],
                [totalCoins.toString(), 'Coins Earned'],
              ]
            : [
                [
                  history
                    .reduce((sum, item) => sum + item.count, 0)
                    .toString(),
                  'Workouts',
                ],
                [
                  history
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString(),
                  'Total Minutes',
                ],
                [totalCoins.toString(), 'Coins Earned'],
              ]
          ).map(([value, label]) => (
            <ProfileMetric key={label} value={value} label={label} />
          ))}
        </View>
      ) : null}

      {!loading && !error && history.length > 0 ? (
        <View style={styles.reportActions}>
          <AppButton
            title="Share"
            variant="ghost"
            onPress={() => shareReport('Health report')}
            style={[
              styles.reportButton,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          />
          <AppButton
            title="View PDF"
            onPress={() => shareReport('Health report')}
            style={styles.reportButton}
          />
        </View>
      ) : null}
    </ProfileCard>
  );
};
