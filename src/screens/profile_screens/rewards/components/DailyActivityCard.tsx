import React from 'react';
import { View } from 'react-native';
import { AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.Rewards';

interface DailyActivityData {
  day: string;
  timezone: string;
  state: 'SETTLED' | 'RETRY' | string;
  creditedCoins: number;
  pendingCoins: number;
  entitledCoins: number;
  needsSettlement?: boolean;
  dueAt?: string;
}

interface DailyActivityCardProps {
  dailyActivity: DailyActivityData;
}

export const DailyActivityCard: React.FC<DailyActivityCardProps> = ({
  dailyActivity,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const activityStatusColor =
    dailyActivity.state === 'SETTLED'
      ? colors.success
      : dailyActivity.state === 'RETRY'
      ? colors.warning
      : colors.info;

  const activityStatusBackground =
    dailyActivity.state === 'SETTLED'
      ? colors.successLight
      : dailyActivity.state === 'RETRY'
      ? colors.warningLight
      : colors.infoLight;

  return (
    <ProfileCard style={styles.dailyActivityCard}>
      <View style={styles.dailyActivityHeading}>
        <View style={styles.dailyActivityTitle}>
          <AppText variant="subtitle2" bold>
            Today&apos;s activity
          </AppText>
          <AppText variant="caption" secondary>
            {new Date(`${dailyActivity.day}T12:00:00Z`).toLocaleDateString(
              undefined,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: dailyActivity.timezone,
              },
            )}
          </AppText>
        </View>
        <View
          style={[
            styles.activityStateBadge,
            { backgroundColor: activityStatusBackground },
          ]}
        >
          <AppText
            variant="caption"
            bold
            style={{ color: activityStatusColor }}
          >
            {dailyActivity.state.replace(/_/g, ' ')}
          </AppText>
        </View>
      </View>
      <View style={styles.dailyActivityMetrics}>
        <View style={styles.dailyActivityMetric}>
          <AppText variant="subtitle2" bold>
            {dailyActivity.creditedCoins.toLocaleString()}
          </AppText>
          <AppText variant="caption" secondary>
            Credited
          </AppText>
        </View>
        <View style={styles.dailyActivityMetric}>
          <AppText variant="subtitle2" bold>
            {dailyActivity.pendingCoins.toLocaleString()}
          </AppText>
          <AppText variant="caption" secondary>
            Pending
          </AppText>
        </View>
        <View style={styles.dailyActivityMetric}>
          <AppText variant="subtitle2" bold>
            {dailyActivity.entitledCoins.toLocaleString()}
          </AppText>
          <AppText variant="caption" secondary>
            Eligible
          </AppText>
        </View>
      </View>
      {dailyActivity.needsSettlement && dailyActivity.dueAt ? (
        <AppText variant="caption" secondary>
          Points are awaiting settlement. Expected by{' '}
          {new Date(dailyActivity.dueAt).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: dailyActivity.timezone,
          })}{' '}
          ({dailyActivity.timezone}).
        </AppText>
      ) : null}
    </ProfileCard>
  );
};
