import { Pressable, View } from 'react-native';
import React, { useMemo } from 'react';
import { AppEmptyState, AppText } from '../../../../../components';
import ChallengeCard from '../../../../../components/cards/ChallengeCard';
import { useTheme } from '../../../../../theme/useTheme';
import { ChallengesShimmer } from '../group_detail_shimmer/GroupDetailShimmer';
import { createGroupDetailShimmerStyles } from '../group_detail_shimmer/styles.GroupDetailShimmer';
import { createChallengesTabStyles } from './styles.ChallengesTab';

interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  emoji?: string;
  joined?: boolean;
  joinable?: boolean;
  participantCount?: number;
}

interface ChallengesTabProps {
  onNewChallenge?: () => void;
  challenges: ChallengeItem[];
  onJoin?: (challengeId: string) => void;
  joiningChallengeId?: string | null;
  loading?: boolean;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({
  onNewChallenge,
  challenges,
  onJoin,
  joiningChallengeId,
  loading = false,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = useMemo(() => createChallengesTabStyles(theme), [theme]);
  const shimmerStyles = useMemo(
    () => createGroupDetailShimmerStyles(colors, spacing),
    [colors, spacing],
  );

  if (loading) {
    return <ChallengesShimmer styles={shimmerStyles} />;
  }

  return (
    <View style={styles.section}>
      {challenges.length === 0 ? (
        <AppEmptyState
          title="No group challenges yet"
          description="Create a challenge to help your group stay motivated."
        />
      ) : (
        challenges.map((challenge: ChallengeItem) => (
          <ChallengeCard
            key={challenge?.id}
            challenge={{
              ...challenge,
              category: 'All',
              emoji: challenge?.emoji ?? '🏆',
            }}
            onContinue={onJoin}
            loading={joiningChallengeId === challenge?.id}
            colors={colors}
            spacing={spacing}
            radius={radius}
          />
        ))
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create New Challenge"
        onPress={onNewChallenge}
        style={styles.newChallengeButton}
      >
        <AppText style={styles.newChallengeText}>+ New Challenge</AppText>
      </Pressable>
    </View>
  );
};

export default ChallengesTab;
