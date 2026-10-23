import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { AppText } from '../../../../components';
import { createDailyActivityStyles } from '../styles.DailyActivities';
import { useTheme } from '../../../../theme/useTheme';


const ActivityDetail: React.FC<{
  label: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}> = ({ label, leftLabel, leftValue, rightLabel, rightValue }) => {
  const { theme } = useTheme();
  const styles = createDailyActivityStyles(theme);
  return (
    <View style={styles.detailCard}>
      <AppText variant="subtitle2" bold style={styles.detailTitle}>
        {label}
      </AppText>
      <View style={styles.detailValues}>
        <View style={styles.detailMetric}>
          <AppText variant="caption" secondary>
            {leftLabel}
          </AppText>
          <AppText variant="h3">{leftValue}</AppText>
        </View>
        <View style={styles.detailMetric}>
          <AppText variant="caption" secondary>
            {rightLabel}
          </AppText>
          <AppText variant="h3">{rightValue}</AppText>
        </View>
      </View>
    </View>
  );
};

export default memo(ActivityDetail)
 