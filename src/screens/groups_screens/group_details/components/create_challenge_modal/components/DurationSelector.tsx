import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '../../../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../../../components';
import { useTheme } from '../../../../../../theme/useTheme';
import { DURATION_OPTIONS } from '../../../constants';
import createChallengeModalStyles from '../styles.CreateChallengeModal';

interface DurationSelectorProps {
  duration: string;
  onSelectDuration?: (opt: string) => void;
  onCycleDuration: () => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  onSelectDuration,
  onCycleDuration,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createChallengeModalStyles(colors, spacing, radius);

  const days = Number.parseInt(duration, 10) || 7;
  const endsDate = new Date(Date.now() + days * 86400000);
  const endsDateFormatted = endsDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <AppText variant="label" secondary style={styles.fieldLabel}>
        Challenge Duration
      </AppText>
      <View style={styles.durationPillsRow}>
        {DURATION_OPTIONS.map(opt => {
          const isSelected = duration === opt;
          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt} duration`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                if (onSelectDuration) {
                  onSelectDuration(opt);
                } else {
                  onCycleDuration();
                }
              }}
              style={[
                styles.durationPill,
                isSelected && styles.selectedDurationPill,
              ]}
            >
              <AppIcon
                name="Clock"
                size={14}
                color={isSelected ? colors.primary : colors.textSecondary}
              />
              <AppText
                variant="caption"
                bold={isSelected}
                primary={isSelected}
                secondary={!isSelected}
              >
                {opt}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" secondary style={styles.durationHelper}>
        Starts today, finishes on {endsDateFormatted}
      </AppText>
    </>
  );
};
