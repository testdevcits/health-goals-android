import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { ChallengeLeaderboardGroup } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';
import PodiumCard from '../components/PodiumCard';

interface LeaderBoardTabProps {
  groups: ChallengeLeaderboardGroup[];
  styles: ChallengesStyles;
}

const LeaderBoardTab: React.FC<LeaderBoardTabProps> = ({ groups, styles }) => {
  const { theme } = useTheme();
  const [selectedId, setSelectedId] = useState<string>(
    () => groups[0]?.id || '',
  );

  useEffect(() => {
    if (!groups.some(g => g.id === selectedId) && groups[0]) {
      setSelectedId(groups[0].id);
    }
  }, [groups, selectedId]);

  const activeGroup = groups.find(g => g.id === selectedId) || groups[0];

  if (!activeGroup) {
    return null;
  }

  const { title, subtitle, leaderboard } = activeGroup;

  return (
    <>
      {/* Challenge switcher chips when user has multiple challenges with leaderboards */}
      {groups.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.challengeChipsScroll}
          contentContainerStyle={styles.challengeChipsContainer}
        >
          {groups.map(group => {
            const isSelected = group.id === activeGroup.id;
            return (
              <Pressable
                key={group.id}
                onPress={() => setSelectedId(group.id)}
                style={[
                  styles.challengeChip,
                  isSelected && styles.activeChallengeChip,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`View leaderboard for ${group.title}`}
              >
                <AppText
                  variant="caption"
                  bold
                  style={[
                    styles.challengeChipText,
                    isSelected && styles.activeChallengeChipText,
                  ]}
                >
                  {group.title}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {/* Challenge Heading */}
      <View style={styles.leaderboardHeading}>
        <AppText variant="subtitle1" bold>
          {title}
        </AppText>
        <AppText variant="caption" secondary>
          {subtitle}
        </AppText>
      </View>

      {/* Top 3 Podium */}
      <PodiumCard leaderboard={leaderboard} styles={styles} />

      {/* 4th Place and Beyond */}
      {leaderboard.length > 3 ? (
        <View style={styles.leaderboardCard}>
          {leaderboard.slice(3).map((person, index) => {
            const isCurrentUser = Boolean(person?.isCurrentUser);

            return (
              <View
                key={`${person?.rank}-${person?.name}`}
                style={[
                  styles.leaderboardRow,
                  isCurrentUser && styles.currentUserRow,
                  index === leaderboard.length - 4 && styles.lastLeaderboardRow,
                ]}
              >
                <View style={styles.rankCircle}>
                  <AppText variant="caption" secondary bold>
                    {person?.rank}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.smallAvatar,
                    { backgroundColor: person?.color },
                  ]}
                >
                  {person?.profileImageUrl ? (
                    <Image
                      source={{ uri: person?.profileImageUrl }}
                      resizeMode="cover"
                      accessibilityLabel={`${person?.name} profile photo`}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 999,
                      }}
                    />
                  ) : (
                    <AppText variant="label" color="white" bold>
                      {person?.initials}
                    </AppText>
                  )}
                </View>

                <View style={styles.leaderboardDetails}>
                  <AppText variant="label" numberOfLines={1}>
                    {person?.name}
                  </AppText>
                  <AppText variant="caption" secondary>
                    {isCurrentUser ? '🔥 ' : ''}
                    {person?.streak}
                  </AppText>
                </View>

                <View style={styles.stepsColumn}>
                  <AppText variant="label" bold right>
                    {person?.steps}
                  </AppText>
                  <AppText variant="caption" secondary right>
                    {person?.unit || 'points'}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}

      <AppText variant="caption" secondary center mt={theme.spacing.md}>
        Rankings update as challenge activity syncs
      </AppText>
    </>
  );
};

export default LeaderBoardTab;
