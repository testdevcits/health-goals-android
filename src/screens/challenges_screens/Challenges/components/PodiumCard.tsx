import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import type { LeaderboardPerson } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';

interface PodiumCardProps {
  leaderboard: LeaderboardPerson[];
  styles: ChallengesStyles;
}

const PodiumCard: React.FC<PodiumCardProps> = ({ leaderboard, styles }) => {
  const topThree = [leaderboard[1], leaderboard[0], leaderboard[2]];

  return (
    <View style={styles.podium}>
      {topThree.map(person => {
        const isFirst = person.rank === 1;
        const podiumColor =
          person.rank === 1
            ? '#FFD500'
            : person.rank === 2
            ? '#B8B8B8'
            : '#C17A36';

        return (
          <View
            key={person.rank}
            style={[styles.podiumPerson, isFirst && styles.firstPlacePerson]}
          >
            <View
              style={[
                styles.podiumAvatar,
                isFirst ? styles.firstPlaceAvatar : styles.otherPlaceAvatar,
                {
                  backgroundColor: person.color,
                },
              ]}
            >
              <AppText
                variant={isFirst ? 'h2' : 'h3'}
                color="white"
                bold
                center
              >
                {person.initials}
              </AppText>
            </View>

            <AppText variant="label" center>
              {person.name}
            </AppText>
            <AppText variant="caption" secondary center>
              {person.steps}
            </AppText>

            <View
              style={[
                styles.podiumBase,
                person.rank === 1
                  ? styles.firstPlaceBase
                  : person.rank === 2
                  ? styles.secondPlaceBase
                  : styles.thirdPlaceBase,
                {
                  backgroundColor: podiumColor,
                },
              ]}
            >
              <AppText variant="h3" color="white" bold center>
                {person.rank}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(PodiumCard);
