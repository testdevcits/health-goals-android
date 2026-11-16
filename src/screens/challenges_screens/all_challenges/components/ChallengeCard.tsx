import React, { memo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import { createCardStyles } from '../styles.AllChallenges';
import type { Challenge } from '../useAllChallenges';

interface ChallengeCardProps {
  challenge: Challenge;
  isJoining?: boolean;
  onContinue?: (challengeId: string) => void;
  colors: any;
  spacing: any;
  radius: any;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = memo(
  ({
    challenge,
    isJoining = false,
    onContinue,
    colors,
    spacing,
    radius,
  }) => {
    const styles = createCardStyles(colors, spacing, radius);

    return (
      <View style={[styles.card, { borderLeftColor: challenge?.color }]}>
        {/* Title and status */}
        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <AppText style={styles.emoji}>{challenge?.emoji}</AppText>

            <AppText variant="subtitle2" style={styles.title} numberOfLines={2}>
              {challenge?.title}
            </AppText>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${challenge?.color}20`,
              },
            ]}
          >
            <AppText variant="caption" style={{ color: challenge?.color }} bold>
              {challenge?.status}
            </AppText>
          </View>
        </View>

        {/* Continue action */}
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            !isJoining &&
            !challenge?.joined &&
            challenge?.joinable &&
            onContinue?.(challenge?.id)
          }
          disabled={isJoining || challenge?.joined || !challenge?.joinable}
          style={[
            styles.continueButton,
            {
              backgroundColor:
                challenge?.joined || !challenge?.joinable
                  ? colors.textTertiary
                  : colors.primary,
            },
          ]}
        >
          {isJoining ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <AppText variant="buttonSm" color="white">
              {challenge?.joined
                ? 'Joined'
                : challenge?.joinable
                  ? 'Join challenge'
                  : 'Not available'}
            </AppText>
          )}
        </Pressable>
      </View>
    );
  },
);

export default ChallengeCard;
