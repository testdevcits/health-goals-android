import React from 'react';
import { Alert, View } from 'react-native';
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
  AppLoader,
  AppText,
  ProfileCard,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.HealthReport';
import type { DailyActivityHistoryItem } from '../useHealthReports';

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

interface ActivityRewardsCardProps {
  from: Date;
  to: Date;
  loading: boolean;
  error: string;
  refresh: () => void;
  dailyCoins: DailyActivityHistoryItem[];
  totalCoins: number;
  shareReport: (title: string) => void;
}

export const ActivityRewardsCard: React.FC<ActivityRewardsCardProps> = ({
  from,
  to,
  loading,
  error,
  refresh,
  dailyCoins,
  totalCoins,
  shareReport,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

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

  return (
    <ProfileCard style={styles.rewardsCard}>
      <View style={styles.rewardsHeading}>
        <AppText variant="subtitle2" bold>
          Activity Rewards
        </AppText>
        <View
          style={[styles.periodBadge, { backgroundColor: colors.primaryLight }]}
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
                ? item.state.charAt(0) + item.state.slice(1).toLowerCase()
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
                    (breakdown?.waterCheckin ?? 0) > 0 ? 'Checked in' : '—',
                  coins: breakdown?.waterCheckin ?? 0,
                  icon: Droplets,
                  color: colors.info,
                  backgroundColor: colors.infoLight,
                },
                {
                  label: 'Sleep Check-in',
                  value:
                    (breakdown?.sleepCheckin ?? 0) > 0 ? 'Checked in' : '—',
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
  );
};
