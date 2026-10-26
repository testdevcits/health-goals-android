import { Pressable, View } from 'react-native';
import React, { memo } from 'react';
import { createCardStyles } from '../screens/challenges_screens/all_challenges/styles.AllChallenges';
import AppText from './AppText';

type ChallengeCategory = 'All' | 'Steps' | 'Mind' | 'Strength';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  emoji: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onContinue?: (challengeId: string) => void;
  colors: any;
  spacing: any;
  radius: any;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onContinue,
  colors,
  spacing,
  radius,
}) => {
  const styles = createCardStyles(colors, spacing, radius);

  return (
    <View style={[styles.card, { borderLeftColor: challenge.color }]}>
      {/* Title and status */}
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <AppText style={styles.emoji}>{challenge.emoji}</AppText>

          <AppText variant="subtitle2" style={styles.title} numberOfLines={2}>
            {challenge.title}
          </AppText>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: `${challenge.color}20`,
            },
          ]}
        >
          <AppText variant="caption" style={{ color: challenge.color }} bold>
            {challenge.status}
          </AppText>
        </View>
      </View>

      {/* Challenge description */}
      <AppText variant="body2" secondary style={styles.description}>
        {challenge.description}
      </AppText>

      {/* Progress bar */}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: challenge.progress,
        }}
        style={styles.progressTrack}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${challenge.progress}%`,
              backgroundColor: challenge.color,
            },
          ]}
        />
      </View>

      {/* Progress labels */}
      <View style={styles.progressFooter}>
        <AppText variant="caption" secondary>
          {challenge.progressLabel}
        </AppText>

        <AppText variant="caption" style={{ color: challenge.color }} bold>
          {challenge.progress}%
        </AppText>
      </View>

      {/* Continue action */}
      <Pressable
        accessibilityRole="button"
        onPress={() => onContinue?.(challenge.id)}
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
      >
        <AppText variant="buttonSm" color="white">
          Continue
        </AppText>
      </Pressable>
    </View>
  );
};

export default memo(ChallengeCard);
