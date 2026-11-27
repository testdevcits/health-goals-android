import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { HealthDataState } from '../../../../hooks/useTodayHealthData';
import { createDailySummaryStyles } from './daily_summary/styles.DailySummary';
import TodayDailyActivityCard from './daily_summary/TodayDailyActivityCard';
import LiveWorkoutCard from './daily_summary/LiveWorkoutCard';

interface DailySummaryProps {
  onViewDetails: () => void;
  navigation: any;
  healthRefreshKey?: number;
  healthDataState?: HealthDataState;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  onViewDetails,
  navigation,
  healthRefreshKey = 0,
  healthDataState,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createDailySummaryStyles(theme), [theme]);

  return (
    <View style={styles.summaryContainer}>
      <SectionHeader
        sectionTitle="Today's Summary"
        rightText="View Details"
        onRightPress={onViewDetails}
        customStyles={{ marginHorizontal: 0 }}
      />

      <View style={styles.summaryRow}>
        <TodayDailyActivityCard
          onViewDetails={onViewDetails}
          healthRefreshKey={healthRefreshKey}
          healthDataState={healthDataState}
        />
        <LiveWorkoutCard navigation={navigation} />
      </View>
    </View>
  );
};

export default memo(DailySummary);
