import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { createDailyActivityStyles } from '../styles.DailyActivities';
import { useTheme } from '../../../../theme/useTheme';

interface DailyTotalsProps {
  totals: {
    label: string;
    value: string;
  }[];
}

const DailyTotals: React.FC<DailyTotalsProps> = ({ totals }) => {
  const styles = createDailyActivityStyles(useTheme().theme);

  return (
    <View style={styles.totals}>
      {totals.map(total => (
        <View key={total?.label} style={styles.totalRow}>
          <AppText variant="subtitle2" bold>
            {total?.label}
          </AppText>
          <AppText variant="subtitle2" bold>
            {total?.value}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default memo(DailyTotals);
