import React from 'react';
import { Pressable, View } from 'react-native';
import { AppInput, AppText } from '../../../../../../components';
import { useTheme } from '../../../../../../theme/useTheme';
import createChallengeModalStyles from '../styles.CreateChallengeModal';

const REWARD_PRESETS = ['0', '50', '100', '250'];

interface RewardPointsSelectorProps {
  rewardPoints: string;
  onChangeRewardPoints?: (points: string) => void;
}

export const RewardPointsSelector: React.FC<RewardPointsSelectorProps> = ({
  rewardPoints,
  onChangeRewardPoints,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createChallengeModalStyles(colors, spacing, radius);

  return (
    <>
      <AppText variant="label" secondary style={styles.fieldLabel}>
        Reward Points (Optional)
      </AppText>
      <AppInput
        value={rewardPoints}
        onChangeText={text => onChangeRewardPoints?.(text.replace(/\D/g, ''))}
        placeholder="0"
        placeholderTextColor={colors.inputPlaceholder}
        keyboardType="number-pad"
        maxLength={6}
      />
      <View style={styles.presetsRow}>
        {REWARD_PRESETS.map(preset => {
          const isSelected = rewardPoints === preset;
          return (
            <Pressable
              key={preset}
              onPress={() => onChangeRewardPoints?.(preset)}
              style={[
                styles.presetChip,
                isSelected && styles.selectedPresetChip,
              ]}
            >
              <AppText
                variant="caption"
                primary={isSelected}
                secondary={!isSelected}
                bold={isSelected}
              >
                {preset === '0' ? 'No bonus' : `+${preset} pts`}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};
