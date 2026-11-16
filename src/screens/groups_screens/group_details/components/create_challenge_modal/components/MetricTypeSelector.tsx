import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '../../../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../../../components';
import { useTheme } from '../../../../../../theme/useTheme';
import createChallengeModalStyles from '../styles.CreateChallengeModal';

export interface MetricTypeOption {
  id: string;
  label: string;
  icon: 'Footprints' | 'MapPin' | 'HeartPulse' | 'Clock';
  unit: string;
  defaultGoal: string;
  presets: string[];
}

export const METRIC_TYPE_OPTIONS: MetricTypeOption[] = [
  {
    id: 'steps',
    label: 'Steps',
    icon: 'Footprints',
    unit: 'steps',
    defaultGoal: '10000',
    presets: ['5000', '10000', '15000', '20000'],
  },
  {
    id: 'distance',
    label: 'Distance',
    icon: 'MapPin',
    unit: 'km',
    defaultGoal: '5',
    presets: ['3', '5', '10', '21'],
  },
  {
    id: 'calories',
    label: 'Calories',
    icon: 'HeartPulse',
    unit: 'kcal',
    defaultGoal: '500',
    presets: ['300', '500', '750', '1000'],
  },
  {
    id: 'active_minutes',
    label: 'Active Mins',
    icon: 'Clock',
    unit: 'mins',
    defaultGoal: '30',
    presets: ['30', '45', '60', '90'],
  },
];

interface MetricTypeSelectorProps {
  selectedMetricId: string;
  onSelectMetric: (metric: MetricTypeOption) => void;
}

export const MetricTypeSelector: React.FC<MetricTypeSelectorProps> = ({
  selectedMetricId,
  onSelectMetric,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createChallengeModalStyles(colors, spacing, radius);

  return (
    <>
      <AppText variant="label" secondary style={styles.fieldLabel}>
        Metric Type (metricType) *
      </AppText>
      <View style={styles.metricPillsRow}>
        {METRIC_TYPE_OPTIONS.map(metric => {
          const isSelected = (selectedMetricId || 'steps') === metric.id;
          return (
            <Pressable
              key={metric.id}
              accessibilityRole="button"
              accessibilityLabel={`Select ${metric.label} metric`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectMetric(metric)}
              style={[
                styles.metricPill,
                isSelected && styles.selectedMetricPill,
              ]}
            >
              <AppIcon
                name={metric.icon}
                size={15}
                color={isSelected ? colors.primary : colors.textSecondary}
              />
              <AppText
                variant="caption"
                bold={isSelected}
                primary={isSelected}
                secondary={!isSelected}
              >
                {metric.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};
