import React, { memo } from 'react';
import { View } from 'react-native';
import { SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createDailySummaryStyles } from './daily_summary/styles.DailySummary';
import TodayDailyActivityCard from './daily_summary/TodayDailyActivityCard';
import LiveWorkoutCard from './daily_summary/LiveWorkoutCard';

interface DailySummaryProps {
  onViewDetails: () => void;
  navigation: any;
  healthRefreshKey?: number;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  onViewDetails,
  navigation,
  healthRefreshKey = 0,
}) => {
  const { theme } = useTheme();
  const styles = createDailySummaryStyles(theme);

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
        />
        <LiveWorkoutCard navigation={navigation} />
      </View>
    </View>
  );
};

export default memo(DailySummary);
