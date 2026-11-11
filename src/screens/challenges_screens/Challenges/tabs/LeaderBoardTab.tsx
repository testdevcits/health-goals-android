import React from 'react';
import { Image, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { LeaderboardPerson } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';
import PodiumCard from '../components/PodiumCard';

interface LeaderBoardTabProps {
  leaderboard: LeaderboardPerson[];
  styles: ChallengesStyles;
  title: string;
  subtitle: string;
}

const LeaderBoardTab: React.FC<LeaderBoardTabProps> = ({
  leaderboard,
  styles,
  title,
  subtitle,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.leaderboardHeading}>
        <AppText variant="subtitle1" bold>
          {title}
        </AppText>
        <AppText variant="caption" secondary>
          {subtitle}
        </AppText>
      </View>
      <PodiumCard leaderboard={leaderboard} styles={styles} />
      <View style={styles.leaderboardCard}>
        {leaderboard.slice(3).map((person, index) => {
          const isCurrentUser = Boolean(person.isCurrentUser);

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
                {person.profileImageUrl ? (
                  <Image
                    source={{ uri: person.profileImageUrl }}
                    resizeMode="cover"
                    accessibilityLabel={`${person.name} profile photo`}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                  />
                ) : (
                  <AppText variant="label" color="white" bold>
                    {person.initials}
                  </AppText>
                )}
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
                  {person.unit || 'points'}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
      <AppText variant="caption" secondary center mt={theme.spacing.md}>
        Rankings update as challenge activity syncs
      </AppText>
    </>
  );
};

export default LeaderBoardTab;
