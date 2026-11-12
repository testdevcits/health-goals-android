import React, { memo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { Challenge } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';
import AppIcon from '../../../../assets/appicon/AppIcon';

interface ChallengesTabProps {
  challenges: Challenge[];
  onBrowseAll: () => void;
  styles: ChallengesStyles;
  onJoin?: (id: string) => void;
  joiningChallengeId?: string | null;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({
  challenges,
  onBrowseAll,
  styles,
  onJoin,
  joiningChallengeId,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      {challenges.map(challenge => {
        const Icon = challenge?.icon;

        return (
          <View
            key={challenge?.id}
            style={[styles.challengeCard, { borderLeftColor: challenge?.color }]}
          >
            <View style={styles.challengeHeading}>
              <View style={styles.challengeTitleRow}>
                <Icon size={19} color={challenge?.color} strokeWidth={2.5} />
                <AppText variant="subtitle2" style={styles.challengeTitle}>
                  {challenge?.title}
                </AppText>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${challenge?.color}20` },
                ]}
              >
                <AppText
                  variant="caption"
                  style={{ color: challenge?.color }}
                  bold
                >
                  {challenge?.status}
                </AppText>
              </View>
            </View>

            <AppText variant="body2" secondary>
              {challenge?.description}
            </AppText>

            {(challenge?.metricLabel ||
              challenge?.targetLabel ||
              challenge?.dateLabel) && (
                <AppText variant="caption" secondary>
                  {[
                    challenge?.metricLabel,
                    challenge?.targetLabel
                      ? `Target ${challenge?.targetLabel}`
                      : undefined,
                    challenge?.dateLabel,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </AppText>
              )}

            {challenge?.joined ? (
              <>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          100,
                          Math.max(0, challenge?.progress),
                        )}%`,
                        backgroundColor: challenge?.color,
                      },
                    ]}
                  />
                </View>

                <View style={styles.progressFooter}>
                  <AppText variant="caption" secondary>
                    {challenge?.progressLabel}
                  </AppText>
                  <AppText
                    variant="caption"
                    style={{ color: challenge?.color }}
                    bold
                  >
                    {challenge?.progress}%
                  </AppText>
                </View>
              </>
            ) : (
              <AppText variant="caption" secondary>
                {challenge?.progressLabel}
              </AppText>
            )}

            {challenge?.leaderboard?.length ? (
              <View>
                {challenge?.leaderboard.map(entry => (
                  <View key={entry.id} style={styles.progressFooter}>
                    <AppText variant="caption" secondary>
                      #{entry.rank} {entry.name}
                      {entry.winner ? ' · Winner' : ''}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {entry.value.toLocaleString()} {challenge?.metricLabel}
                    </AppText>
                  </View>
                ))}
              </View>
            ) : null}
            {onJoin && !challenge?.joined ? (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled:
                    !challenge?.joinable ||
                    joiningChallengeId === challenge?.id,
                }}
                onPress={() =>
                  challenge?.joinable &&
                  joiningChallengeId !== challenge?.id &&
                  onJoin(challenge?.id)
                }
                disabled={
                  !challenge?.joinable || joiningChallengeId === challenge?.id
                }
                style={[
                  styles.browseButton,
                  {
                    marginTop: 12,
                    opacity:
                      challenge?.joinable &&
                        joiningChallengeId !== challenge?.id
                        ? 1
                        : 0.55,
                  },
                ]}
              >
                {joiningChallengeId === challenge?.id ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                ) : (
                  <AppText variant="buttonSm" primary>
                    {challenge?.joinable ? 'Join challenge' : 'Not open to join'}
                  </AppText>
                )}
              </Pressable>
            ) : null}
          </View>
        );
      })}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Browse all challenges"
        onPress={onBrowseAll}
        style={styles.browseButton}
      >
        <AppText variant="buttonSm" primary>
          + Browse all challenges
        </AppText>
        <AppIcon name="ChevronRight" size={18} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};

export default memo(ChallengesTab);
