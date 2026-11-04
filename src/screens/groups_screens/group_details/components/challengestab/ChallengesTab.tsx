import { Pressable, View } from 'react-native';
import React from 'react';
import { AppEmptyState, AppText } from '../../../../../components';
import ChallengeCard from '../../../../../components/ChallengeCard';
import { useTheme } from '../../../../../theme/useTheme';
import createGroupOverviewStyles from '../group_overview/styles.GroupOverview';
import styles from './styles.ChallengesTab';

interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  emoji?: string;
}

interface ChallengesTabProps {
  onNewChallenge?: () => void;
  challenges: ChallengeItem[];
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({
  onNewChallenge,
  challenges,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const overviewStyles = createGroupOverviewStyles(colors, spacing, radius);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Challenges</AppText>
      </View>

      {challenges.length === 0 ? (
        <AppEmptyState
          title="No group challenges yet"
          description="Create a challenge to help your group stay motivated."
        />
      ) : challenges.map((challenge: ChallengeItem) => (
        <ChallengeCard
          key={challenge.id}
          challenge={{
            ...challenge,
            category: 'All',
            emoji: challenge.emoji ?? '🏆',
          }}
          colors={colors}
          spacing={spacing}
          radius={radius}
        />
      ))}

      <Pressable
        accessibilityRole="button"
        onPress={onNewChallenge}
        style={overviewStyles.newChallengeButton}
      >
        <AppText variant="buttonSm" primary>
          + New Challenge
        </AppText>
      </Pressable>
    </View>
  );
};

export default ChallengesTab;
