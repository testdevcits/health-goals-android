import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../../theme/useTheme';
import { useTodayHealthData } from '../../../../../hooks/useTodayHealthData';
import { createDailySummaryStyles } from './styles.DailySummary';

interface TodayDailyActivityCardProps {
  onViewDetails: () => void;
  healthRefreshKey?: number;
}

export const TodayDailyActivityCard: React.FC<TodayDailyActivityCardProps> =
  memo(({ onViewDetails, healthRefreshKey = 0 }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const styles = createDailySummaryStyles(theme);
    const healthDataState = useTodayHealthData(false, healthRefreshKey);
    const healthData = healthDataState.data;

    return (
      <TouchableOpacity
        style={styles.summaryCard}
        onPress={onViewDetails}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Daily activity, ${
          healthData?.steps?.toLocaleString('en-US') ?? 'unavailable'
        } steps, ${
          healthData?.exerciseMinutes ?? 'unavailable'
        } active minutes`}
      >
        <AppText variant="subtitle2" bold>
          Daily Activity
        </AppText>

        <View style={styles.metricRow}>
          <AppText variant="body2" bold>
            {healthDataState.loading
              ? '…'
              : healthData?.steps?.toLocaleString('en-US') ?? '—'}
          </AppText>
          <AppText variant="caption" secondary>
            {' '}
            steps
          </AppText>
        </View>

        <AppText variant="caption" secondary>
          {healthDataState.loading
            ? 'Loading health data…'
            : healthData?.status === 'permission-required'
            ? 'Connect Health Connect in Profile'
            : healthDataState.error
            ? healthDataState.error
            : healthData?.exerciseMinutes === null ||
              healthData?.exerciseMinutes === undefined
            ? 'Exercise data unavailable'
            : `${Math.round(healthData?.exerciseMinutes ?? 0)} active mins`}
        </AppText>

        <View style={styles.bottomIcon}>
          <AppIcon
            name="Heart"
            size={20}
            color={colors.coral}
            fill={colors.coral}
          />
        </View>
      </TouchableOpacity>
    );
  });

export default TodayDailyActivityCard;
