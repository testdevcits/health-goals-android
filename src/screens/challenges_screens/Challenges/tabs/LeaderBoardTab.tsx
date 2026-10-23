import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { LeaderboardPerson } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';
import PodiumCard from '../components/PodiumCard';

interface LeaderBoardTabProps {
  leaderboard: LeaderboardPerson[];
  styles: ChallengesStyles;
}

const LeaderBoardTab: React.FC<LeaderBoardTabProps> = ({
  leaderboard,
  styles,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <PodiumCard leaderboard={leaderboard} styles={styles} />
      <View style={styles.leaderboardCard}>
        {leaderboard.slice(3).map((person, index) => {
          const isCurrentUser = person.rank === 4;

          return (
            <View
              key={person.rank}
              style={[
                styles.leaderboardRow,
                isCurrentUser && styles.currentUserRow,
                index === leaderboard.length - 4 && styles.lastLeaderboardRow,
              ]}
            >
              <View style={styles.rankCircle}>
                <AppText variant="caption" secondary bold>
                  {person.rank}
                </AppText>
              </View>

              <View
                style={[styles.smallAvatar, { backgroundColor: person.color }]}
              >
                <AppText variant="label" color="white" bold>
                  {person.initials}
                </AppText>
              </View>

              <View style={styles.leaderboardDetails}>
                <AppText variant="label" numberOfLines={1}>
                  {person.name}
                </AppText>
                <AppText variant="caption" secondary>
                  {isCurrentUser ? '🔥 ' : ''}
                  {person.streak}
                </AppText>
              </View>

              <View style={styles.stepsColumn}>
                <AppText variant="label" bold right>
                  {person.steps}
                </AppText>
                <AppText variant="caption" secondary right>
                  steps
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
      <AppText variant="caption" secondary center mt={theme.spacing.md}>
        Friends Leaderboard · resets in 9h 20m
      </AppText>
    </>
  );
};

export default LeaderBoardTab;
