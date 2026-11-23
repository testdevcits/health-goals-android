import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
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
  exportPdf: () => void;
  onViewPdf?: () => void;
}

const formatMetricValue = (value: number, tab: HealthReportTab): string => {
  if (value === 0) {
    if (tab === 'Steps') return '0 steps';
    if (tab === 'Sleep') return '0h 0m';
    return '0 mins';
  }
  if (tab === 'Steps') return `${value.toLocaleString()} steps`;
  if (tab === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return `${hours}h ${mins}m`;
  }
  return `${value.toLocaleString()} mins`;
};

const formatShortTooltipValue = (
  value: number,
  tab: HealthReportTab,
): string => {
  if (value === 0) return '0';
  if (tab === 'Steps') {
    if (value >= 1000) {
      const k = (value / 1000)
        .toFixed(value >= 10000 ? 0 : 1)
        .replace(/\.0$/, '');
      return `${k}k`;
    }
    return value.toLocaleString();
  }
  if (tab === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
  }
  return `${value}m`;
};

const formatDayLabel = (dateStr: string): string => {
  try {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
};

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
  exportPdf,
  onViewPdf,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const chartHistory = history.slice(-7);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const effectiveIndex =
    selectedIndex !== null &&
    selectedIndex >= 0 &&
    selectedIndex < chartHistory.length
      ? selectedIndex
      : Math.max(0, chartHistory.length - 1);
  const chartMaxValue = Math.max(...chartHistory.map(item => item?.value), 1);
  const tabColor =
    activeTab === 'Steps'
      ? colors.primary
      : activeTab === 'Sleep'
      ? colors.primaryDark
      : colors.coral || colors.warning;

  return (
    <ProfileCard style={styles.reportCard}>
      <View style={styles.reportHeading}>
        <AppText variant="subtitle2" bold>
          Report Period
        </AppText>
        <Pressable
          onPress={openDatePicker}
          style={[
            styles.dateRangeButton,
            { backgroundColor: colors.primaryLight },
          ]}
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
            onPress={() => {
              setActiveTab(tab);
              setSelectedIndex(null);
            }}
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
        <>
          {chartHistory.length > 0 && (
            <View style={styles.chartInspectRow}>
              <View style={styles.chartInspectLeft}>
                <View
                  style={[
                    styles.chartInspectDot,
                    { backgroundColor: tabColor },
                  ]}
                />
                <AppText variant="caption" color="textSecondary">
                  {formatDayLabel(chartHistory[effectiveIndex]?.date || '')}
                </AppText>
              </View>
              <View
                style={[
                  styles.chartInspectBadge,
                  {
                    backgroundColor: `${tabColor}1F`,
                    borderColor: tabColor,
                  },
                ]}
              >
                <AppText variant="caption" bold style={{ color: tabColor }}>
                  {formatMetricValue(
                    chartHistory[effectiveIndex]?.value ?? 0,
                    activeTab,
                  )}
                </AppText>
              </View>
            </View>
          )}
          <View style={styles.chart}>
            {chartHistory.map((item, index) => {
              const isSelected = effectiveIndex === index;
              return (
                <TouchableOpacity
                  key={item?.date || index}
                  activeOpacity={0.7}
                  onPress={() => setSelectedIndex(index)}
                  style={styles.barTouchable}
                  accessibilityRole="button"
                  accessibilityLabel={`${formatDayLabel(
                    item?.date,
                  )}: ${formatMetricValue(item?.value, activeTab)}`}
                >
                  {isSelected && (
                    <View
                      style={[
                        styles.barTooltip,
                        {
                          backgroundColor: theme.colors.surfaceElevated,
                          borderColor: tabColor,
                        },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        bold
                        style={{ fontSize: 10, color: tabColor }}
                      >
                        {formatShortTooltipValue(item?.value, activeTab)}
                      </AppText>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(
                          6,
                          Math.min(
                            90,
                            Math.round((item?.value / chartMaxValue) * 90),
                          ),
                        ),
                        backgroundColor: tabColor,
                        opacity: isSelected ? 1 : 0.45,
                      },
                      isSelected && {
                        borderWidth: 1.5,
                        borderColor: theme.colors.surface,
                        elevation: 4,
                        shadowColor: tabColor,
                        shadowOpacity: 0.35,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                      },
                    ]}
                  />
                  <AppText
                    variant="caption"
                    bold={isSelected}
                    color={isSelected ? undefined : 'textTertiary'}
                    style={isSelected ? { color: tabColor } : undefined}
                  >
                    {new Date(`${item?.date}T12:00:00`).toLocaleDateString([], {
                      weekday: 'short',
                    })}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.chartPlaceholder}>
          <AppText variant="h3" primary>
            {history
              .reduce((sum, item) => sum + item?.value, 0)
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
                    .reduce((sum, item) => sum + item?.value, 0)
                    .toLocaleString(),
                  'Total Steps',
                ],
                [
                  history.length
                    ? Math.round(
                        history.reduce((sum, item) => sum + item?.value, 0) /
                          history.length,
                      ).toLocaleString()
                    : '—',
                  'Daily Avg',
                ],
                [
                  history
                    .filter(item => item?.value >= 10000)
                    .length.toString(),
                  'Days >10K',
                ],
              ]
            : activeTab === 'Sleep'
            ? [
                [
                  history.length
                    ? `${Math.floor(
                        history.reduce((sum, item) => sum + item?.value, 0) /
                          history.length /
                          60,
                      )}h ${Math.round(
                        (history.reduce((sum, item) => sum + item?.value, 0) /
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
                    .reduce((sum, item) => sum + item?.count, 0)
                    .toString(),
                  'Workouts',
                ],
                [
                  history
                    .reduce((sum, item) => sum + item?.value, 0)
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
            onPress={onViewPdf || exportPdf}
            style={styles.reportButton}
          />
        </View>
      ) : null}
    </ProfileCard>
  );
};
