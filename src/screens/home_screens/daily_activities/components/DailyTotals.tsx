import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { createDailyActivityStyles } from '../styles.DailyActivities';
import { useTheme } from '../../../../theme/useTheme';

const totals = [
  { label: 'Total burnt calories', value: '1,273 kcal' },
  { label: 'Distance while active', value: '1.58 km' },
];

const DailyTotals: React.FC = () => {
  const styles = createDailyActivityStyles(useTheme().theme);

  return (
    <View style={styles.totals}>
      {totals.map(total => (
        <View key={total.label} style={styles.totalRow}>
          <AppText variant="subtitle2" bold>
            {total.label}
          </AppText>
          <AppText variant="subtitle2" bold>
            {total.value}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default DailyTotals;
