import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { AppText } from '../../../../components';
import type { LeaderboardPerson } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';

interface PodiumCardProps {
  leaderboard: LeaderboardPerson[];
  styles: ChallengesStyles;
}

const PodiumCard: React.FC<PodiumCardProps> = ({ leaderboard, styles }) => {
  const ranked = [...leaderboard].sort((a, b) => a.rank - b.rank);
  const topThree = [
    ranked.find(person => person.rank === 2),
    ranked.find(person => person.rank === 1),
    ranked.find(person => person.rank === 3),
  ].filter((person): person is LeaderboardPerson => Boolean(person));

  if (topThree.length === 0) return null;

  return (
    <View style={styles.podium}>
      {topThree.map(person => {
        const isFirst = person.rank === 1;
        const podiumColor =
          person.rank === 1
            ? '#F4C400'
            : person.rank === 2
            ? '#B8BEC6'
            : '#B76E2B';

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
              {person.profileImageUrl ? (
                <Image
                  source={{ uri: person.profileImageUrl }}
                  resizeMode="cover"
                  accessibilityLabel={`${person.name} profile photo`}
                  style={{ width: '100%', height: '100%', borderRadius: 999 }}
                />
              ) : (
                <AppText
                  variant={isFirst ? 'h2' : 'h3'}
                  color="white"
                  bold
                  center
                >
                  {person.initials}
                </AppText>
              )}
            </View>

            <AppText variant="label" center numberOfLines={1}>
              {person.name}
            </AppText>
            <AppText variant="caption" secondary center>
              {person.steps}
            </AppText>
            <AppText variant="caption" secondary center>
              {person.unit || 'points'}
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
