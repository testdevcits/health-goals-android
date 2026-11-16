import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../../../components';
import { useTheme } from '../../../../../../theme/useTheme';
import createChallengeModalStyles from '../styles.CreateChallengeModal';
import type { MetricTypeOption } from './MetricTypeSelector';

interface GoalPresetsSelectorProps {
  currentMetric: MetricTypeOption;
  selectedGoal: string;
  onSelectPreset: (preset: string) => void;
}

export const GoalPresetsSelector: React.FC<GoalPresetsSelectorProps> = ({
  currentMetric,
  selectedGoal,
  onSelectPreset,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createChallengeModalStyles(colors, spacing, radius);

  return (
    <View style={styles.presetsRow}>
      {currentMetric.presets.map(preset => {
        const isSelected = selectedGoal === preset;
        return (
          <Pressable
            key={preset}
            onPress={() => onSelectPreset(preset)}
            style={[styles.presetChip, isSelected && styles.selectedPresetChip]}
          >
            <AppText
              variant="caption"
              primary={isSelected}
              secondary={!isSelected}
              bold={isSelected}
            >
              {Number(preset).toLocaleString()} {currentMetric.unit}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
