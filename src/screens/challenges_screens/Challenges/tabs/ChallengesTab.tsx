import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { Challenge } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';

interface ChallengesTabProps {
  challenges: Challenge[];
  onBrowseAll: () => void;
  styles: ChallengesStyles;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({
  challenges,
  onBrowseAll,
  styles,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      {challenges.map(challenge => {
        const Icon = challenge.icon;

        return (
          <View
            key={challenge.id}
            style={[styles.challengeCard, { borderLeftColor: challenge.color }]}
          >
            <View style={styles.challengeHeading}>
              <View style={styles.challengeTitleRow}>
                <Icon size={19} color={challenge.color} strokeWidth={2.5} />
                <AppText variant="subtitle2" style={styles.challengeTitle}>
                  {challenge.title}
                </AppText>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${challenge.color}20` },
                ]}
              >
                <AppText
                  variant="caption"
                  style={{ color: challenge.color }}
                  bold
                >
                  {challenge.status}
                </AppText>
              </View>
            </View>

            <AppText variant="body2" secondary>
              {challenge.description}
            </AppText>

            <View style={styles.progressTrack}>
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

            <View style={styles.progressFooter}>
              <AppText variant="caption" secondary>
                {challenge.progressLabel}
              </AppText>
              <AppText
                variant="caption"
                style={{ color: challenge.color }}
                bold
              >
                {challenge.progress}%
              </AppText>
            </View>
          </View>
        );
      })}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Browse all challenges"
        // onPress={onBrowseAll}
        style={styles.browseButton}
      >
        <AppText variant="buttonSm" primary>
          + Browse all challenges
        </AppText>
        <ChevronRight size={18} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};

export default ChallengesTab;
