import { Pressable, View } from 'react-native';
import React from 'react';
import { AppText } from '../../../../components';
import ChallengeCard from '../../../../components/ChallengeCard';
import { useTheme } from '../../../../theme/useTheme';

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
  styles: any;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({
  onNewChallenge,
  challenges,
  styles,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Challenges</AppText>
      </View>

      {challenges?.map((challenge: ChallengeItem) => (
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
        style={styles.newChallengeButton}
      >
        <AppText variant="buttonSm" primary>
          + New Challenge
        </AppText>
      </Pressable>
    </View>
  );
};

export default ChallengesTab;
