import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  Brain,
  Coins,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
  Trophy,
} from 'lucide-react-native';
import {
  AppButton,
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
  ProfileCard,
  ProfileMetric,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { localDateKey } from '../../../utils/healthDates';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import createStyles from './styles.HealthReport';
import useHealthReports, {
  type DailyActivityHistoryItem,
  type HealthReportTab,
} from './useHealthReports';

const calendarStringToDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

const formatActivityDay = (day: string, timezone = 'UTC') =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });

const formatSettlementDue = (item: DailyActivityHistoryItem) =>
  item.dueAt
    ? new Date(item.dueAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: item.timezone || 'UTC',
      })
    : null;

const HealthReportsScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const {
    activeTab,
    setActiveTab,
    history,
    loading,
    error,
    refresh,
    dailyCoins,
    activityRecords,
    activityRecordsLoading,
    activityRecordsLoadingMore,
    activityRecordsError,
    hasMoreActivityRecords,
    loadMoreActivityRecords,
    healthSummary,
    healthSummaryLoading,
    healthSummaryError,
    from,
    to,
    setFrom,
    setTo,
    shareReport,
    totalCoins,
  } = useHealthReports();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [selectingEnd, setSelectingEnd] = useState(false);

  const openDatePicker = () => {
    setDraftFrom(localDateKey(from));
    setDraftTo(localDateKey(to));
    setSelectingEnd(false);
    setDatePickerVisible(true);
  };
  const markedDates: Record<
    string,
    {
      startingDay?: boolean;
      endingDay?: boolean;
      color?: string;
      textColor?: string;
      selected?: boolean;
      selectedColor?: string;
    }
  > = {};
  if (draftFrom && draftTo) {
    const cursor = new Date(`${draftFrom}T00:00:00.000Z`);
    const lastDate = new Date(`${draftTo}T00:00:00.000Z`);
    while (cursor <= lastDate) {
      const dateString = cursor.toISOString().slice(0, 10);
      markedDates[dateString] = {
        startingDay: dateString === draftFrom,
        endingDay: dateString === draftTo,
        color: colors.primaryLight,
        textColor: colors.textPrimary,
      };
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    markedDates[draftFrom] = {
      ...markedDates[draftFrom],
      startingDay: true,
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
    markedDates[draftTo] = {
      ...markedDates[draftTo],
      endingDay: true,
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
  } else if (draftFrom) {
    markedDates[draftFrom] = {
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
  }
  const chartHistory = history.slice(-7);
  const chartMaxValue = Math.max(...chartHistory.map(item => item.value), 1);
  const pendingCoins = dailyCoins.reduce(
    (sum, item) => sum + (item.pendingCoins ?? 0),
    0,
  );
  const allPeriodCoins = totalCoins + pendingCoins;
  const activeDays = dailyCoins.filter(
    item =>
      (item.totals?.steps ?? 0) > 0 ||
      (item.totals?.workoutMinutes ?? 0) > 0 ||
      (item.totals?.meditationMinutes ?? 0) > 0 ||
      (item.totals?.sleepMinutes ?? 0) > 0 ||
      (item.entitledCoins ?? 0) > 0,
  ).length;
  const allTimeMetric =
    activeTab === 'Workouts' ? 'workout' : activeTab === 'Sleep' ? 'sleep' : 'steps';
  const allTimeValue = healthSummary?.[allTimeMetric];
  const allTimeValueLabel =
    allTimeValue === undefined
      ? '—'
      : activeTab === 'Sleep'
      ? `${(allTimeValue / 60).toFixed(1)} h`
      : activeTab === 'Workouts'
      ? `${allTimeValue.toLocaleString()} min`
      : `${allTimeValue.toLocaleString()} steps`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Health Reports"
        subtitle="Your weekly and monthly summaries"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
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
            {['Steps', 'Sleep', 'Workouts'].map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as HealthReportTab)}
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

        <ProfileCard style={styles.summaryCard}>
          <AppText variant="subtitle2" bold>
            All-time {activeTab.toLowerCase()}
          </AppText>
          {healthSummaryLoading ? (
            <AppLoader message="Loading all-time summary…" />
          ) : healthSummaryError ? (
            <AppErrorView
              message={healthSummaryError}
              onRefresh={refresh}
            />
          ) : (
            <AppText variant="h3" primary>
              {allTimeValueLabel}
            </AppText>
          )}
        </ProfileCard>

        <ProfileCard style={styles.recordsCard}>
          <View style={styles.recordsHeading}>
            <AppText variant="subtitle2" bold>
              Synced {activeTab.toLowerCase()} records
            </AppText>
            {!activityRecordsLoading && !activityRecordsError ? (
              <AppText variant="caption" secondary>
                {activityRecords.length}
                {hasMoreActivityRecords ? '+' : ''} shown
              </AppText>
            ) : null}
          </View>
          {activityRecordsLoading ? (
            <AppLoader message="Loading synced records…" />
          ) : activityRecordsError ? (
            <AppErrorView
              message={activityRecordsError}
              onRefresh={refresh}
            />
          ) : activityRecords.length === 0 ? (
            <AppEmptyState
              title="No synced records for this period"
              description="Records from your connected health sources will appear here."
            />
          ) : (
            <>
              {activityRecords.map(record => (
                <View key={record.id} style={styles.recordRow}>
                  <View style={styles.recordCopy}>
                    <AppText variant="subtitle2" bold>
                      {record.activityType ||
                        record.metricType.replace(/_/g, ' ')}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {new Date(record.recordedAt).toLocaleString()} ·{' '}
                      {record.source}
                    </AppText>
                  </View>
                  <AppText variant="subtitle2" primary bold>
                    {record.value.toLocaleString()} {record.unit}
                  </AppText>
                </View>
              ))}
              {hasMoreActivityRecords ? (
                <Pressable
                  onPress={loadMoreActivityRecords}
                  disabled={activityRecordsLoadingMore}
                  style={styles.loadMoreRecords}
                  accessibilityRole="button"
                >
                  <AppText variant="caption" primary bold>
                    {activityRecordsLoadingMore
                      ? 'Loading…'
                      : 'Load more records'}
                  </AppText>
                </Pressable>
              ) : null}
            </>
          )}
        </ProfileCard>

        <ProfileCard style={styles.rewardsCard}>
          <View style={styles.rewardsHeading}>
            <AppText variant="subtitle2" bold>
              Activity Rewards
            </AppText>
            <View
              style={[
                styles.periodBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <AppText variant="caption" primary bold>
                {from.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                –{' '}
                {to.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </AppText>
            </View>
          </View>
          {loading ? (
            <AppLoader message="Loading daily activity history…" />
          ) : error ? (
            <AppErrorView message={error} onRefresh={refresh} />
          ) : dailyCoins.length === 0 ? (
            <AppEmptyState
              title="No daily activity history"
              description="Activity and reward details for this period will appear here when available."
            />
          ) : (
            <>
              <View style={styles.rewardMetrics}>
                <View
                  style={[
                    styles.rewardMetric,
                    { borderRightColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.rewardIconWrap,
                      { backgroundColor: colors.warningLight },
                    ]}
                  >
                    <Coins size={21} color={colors.warning} />
                  </View>
                  <AppText variant="subtitle2" bold>
                    {totalCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary center>
                    Earned Coins
                  </AppText>
                </View>
                <View
                  style={[
                    styles.rewardMetric,
                    { borderRightColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.rewardIconWrap,
                      { backgroundColor: colors.infoLight },
                    ]}
                  >
                    <Coins size={21} color={colors.info} />
                  </View>
                  <AppText variant="subtitle2" bold>
                    {pendingCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary center>
                    Pending Coins
                  </AppText>
                </View>
                <View style={styles.rewardMetric}>
                  <View
                    style={[
                      styles.rewardIconWrap,
                      { backgroundColor: colors.successLight },
                    ]}
                  >
                    <Trophy size={21} color={colors.success} />
                  </View>
                  <AppText variant="subtitle2" bold>
                    {allPeriodCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary center>
                    Total Coins
                  </AppText>
                </View>
              </View>
              <View style={styles.dailyHistoryHeading}>
                <AppText variant="subtitle2" bold>
                  Daily History
                </AppText>
                <AppText variant="caption" secondary>
                  {activeDays} active {activeDays === 1 ? 'day' : 'days'}
                </AppText>
              </View>
              <View style={styles.activityList}>
                {dailyCoins.map(item => {
                  const settled = item.state === 'SETTLED';
                  const settlementDue = formatSettlementDue(item);
                  const breakdown = item.totals?.breakdown;
                  const statusLabel = item.state
                    ? item.state.charAt(0) +
                      item.state.slice(1).toLowerCase()
                    : item.needsSettlement
                    ? 'Pending'
                    : 'Recorded';
                  const activityRows = [
                    {
                      label: 'Workout',
                      value:
                        item.totals?.workoutMinutes !== undefined
                          ? `${Math.round(item.totals.workoutMinutes)} min`
                          : '—',
                      coins: breakdown?.workout ?? 0,
                      icon: Dumbbell,
                      color: colors.info,
                      backgroundColor: colors.infoLight,
                    },
                    {
                      label: 'Steps',
                      value:
                        item.totals?.steps !== undefined
                          ? `${item.totals.steps.toLocaleString()} steps`
                          : '—',
                      coins: breakdown?.steps ?? 0,
                      icon: Footprints,
                      color: colors.success,
                      backgroundColor: colors.successLight,
                    },
                    {
                      label: 'Meditation',
                      value:
                        item.totals?.meditationMinutes !== undefined
                          ? `${Math.round(item.totals.meditationMinutes)} min`
                          : '—',
                      coins: breakdown?.meditation ?? 0,
                      icon: Brain,
                      color: colors.primary,
                      backgroundColor: colors.primaryLight,
                    },
                    {
                      label: 'Water Check-in',
                      value:
                        (breakdown?.waterCheckin ?? 0) > 0
                          ? 'Checked in'
                          : '—',
                      coins: breakdown?.waterCheckin ?? 0,
                      icon: Droplets,
                      color: colors.info,
                      backgroundColor: colors.infoLight,
                    },
                    {
                      label: 'Sleep Check-in',
                      value:
                        (breakdown?.sleepCheckin ?? 0) > 0
                          ? 'Checked in'
                          : '—',
                      coins: breakdown?.sleepCheckin ?? 0,
                      icon: Moon,
                      color: colors.textLink,
                      backgroundColor: colors.primaryLight,
                    },
                  ];
                  return (
                    <View
                      key={item.day}
                      style={[
                        styles.activityDay,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <View style={styles.activityDayHeading}>
                        <AppText variant="body2" bold>
                          {formatActivityDay(item.day, item.timezone)}
                        </AppText>
                        <View
                          style={[
                            styles.activityStatus,
                            {
                              backgroundColor: settled
                                ? colors.successLight
                                : colors.warningLight,
                            },
                          ]}
                        >
                          <AppText
                            variant="caption"
                            style={{
                              color: settled
                                ? colors.textSuccess
                                : colors.warning,
                            }}
                            bold
                          >
                            {statusLabel}
                          </AppText>
                        </View>
                      </View>
                      {activityRows.map(row => {
                        const Icon = row.icon;
                        return (
                          <View key={row.label} style={styles.activityRow}>
                            <View
                              style={[
                                styles.activityIconWrap,
                                { backgroundColor: row.backgroundColor },
                              ]}
                            >
                              <Icon size={15} color={row.color} />
                            </View>
                            <AppText
                              variant="caption"
                              secondary
                              style={styles.activityLabel}
                            >
                              {row.label}
                            </AppText>
                            <AppText
                              variant="caption"
                              bold
                              style={styles.activityValue}
                            >
                              {row.value}
                            </AppText>
                            <AppText
                              variant="caption"
                              bold
                              style={[
                                styles.activityCoins,
                                { color: colors.textSuccess },
                              ]}
                            >
                              +{row.coins} coins
                            </AppText>
                          </View>
                        );
                      })}
                      <View
                        style={[
                          styles.rewardBreakdown,
                          { borderTopColor: colors.border },
                        ]}
                      >
                        <View style={styles.rewardBreakdownItem}>
                          <AppText variant="caption" secondary>
                            Credited
                          </AppText>
                          <AppText variant="caption" bold>
                            {(item.creditedCoins ?? 0).toLocaleString()} coins
                          </AppText>
                        </View>
                        <View
                          style={[
                            styles.rewardBreakdownItem,
                            styles.rewardBreakdownMiddle,
                            { borderColor: colors.border },
                          ]}
                        >
                          <AppText variant="caption" secondary>
                            Pending
                          </AppText>
                          <AppText variant="caption" bold>
                            {(item.pendingCoins ?? 0).toLocaleString()} coins
                          </AppText>
                        </View>
                        <View style={styles.rewardBreakdownItem}>
                          <AppText variant="caption" secondary>
                            Total Reward
                          </AppText>
                          <AppText
                            variant="caption"
                            bold
                            style={{ color: colors.primary }}
                          >
                            {(
                              (item.creditedCoins ?? 0) +
                              (item.pendingCoins ?? 0)
                            ).toLocaleString()}{' '}
                            coins
                          </AppText>
                        </View>
                      </View>
                      {item.needsSettlement && settlementDue ? (
                        <AppText variant="caption" secondary>
                          Settlement due {settlementDue}
                        </AppText>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </>
          )}
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
              onPress={() =>
                Alert.alert('PDF report', 'PDF export is not available yet.')
              }
              style={styles.reportButton}
            />
          </View>
        </ProfileCard>
      </ScrollView>
      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View
          style={[
            styles.calendarOverlay,
            { backgroundColor: colors.overlay },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDatePickerVisible(false)}
            accessibilityLabel="Close date range picker"
          />
          <View
            style={[
              styles.calendarCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <AppText variant="subtitle2" bold style={styles.calendarTitle}>
              Choose report period
            </AppText>
            <AppText variant="caption" secondary style={styles.calendarHint}>
              {selectingEnd
                ? 'Select an end date'
                : 'Select a start date; then choose an end date'}
            </AppText>
            <Calendar
              current={draftFrom || localDateKey(to)}
              maxDate={localDateKey(new Date())}
              markingType="period"
              markedDates={markedDates}
              onDayPress={day => {
                if (!selectingEnd) {
                  setDraftFrom(day.dateString);
                  setDraftTo('');
                  setSelectingEnd(true);
                } else if (day.dateString < draftFrom) {
                  setDraftFrom(day.dateString);
                  setDraftTo('');
                } else {
                  setDraftTo(day.dateString);
                  setSelectingEnd(false);
                }
              }}
              theme={{
                backgroundColor: colors.surface,
                calendarBackground: colors.surface,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textTertiary,
                monthTextColor: colors.textPrimary,
                arrowColor: colors.primary,
              }}
            />
            <View style={styles.calendarActions}>
              <AppButton
                title="Cancel"
                variant="ghost"
                onPress={() => setDatePickerVisible(false)}
                style={styles.calendarAction}
              />
              <AppButton
                title="Apply"
                onPress={() => {
                  if (!draftFrom || !draftTo) return;
                  setFrom(calendarStringToDate(draftFrom));
                  setTo(calendarStringToDate(draftTo));
                  setDatePickerVisible(false);
                }}
                disabled={!draftFrom || !draftTo}
                style={styles.calendarAction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HealthReportsScreen;
