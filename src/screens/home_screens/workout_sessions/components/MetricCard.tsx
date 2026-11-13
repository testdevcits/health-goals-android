import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';

export interface MetricCardProps {
  emoji: string;
  value: string;
  unit?: string;
  label: string;
  tint: string;
  backgroundColor: string;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
}

const MetricCard: React.FC<MetricCardProps> = ({
  emoji,
  value,
  unit,
  label,
  tint,
  backgroundColor,
  styles,
}) => (
  <View style={[styles.metricCard, { backgroundColor }]}>
    <View style={[styles.metricIcon, { backgroundColor: tint }]}>
      <AppText style={styles.metricEmoji}>{emoji}</AppText>
    </View>

    <View style={styles.metricValueRow}>
      <AppText variant="h3">{value}</AppText>
      {unit ? (
        <AppText variant="caption" color="textSecondary">
          {unit}
        </AppText>
      ) : null}
    </View>

    <AppText variant="caption" color="textSecondary">
      {label}
    </AppText>
  </View>
);

export default memo(MetricCard);
