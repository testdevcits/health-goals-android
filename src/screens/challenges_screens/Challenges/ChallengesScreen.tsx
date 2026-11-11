import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import type { ChallengesStackParamList } from '../../../navigations/ChallengesStack';
import { useTheme } from '../../../theme/useTheme';
import ChallengeTabs from './components/ChallengeTabs';
import BadgesTab from './tabs/BadgesTab';
import ChallengesTab from './tabs/ChallengesTab';
import LeaderBoardTab from './tabs/LeaderBoardTab';
import createStyles from './styles.Challenges';
import useChallenges from './useChallenges';
import { spacing } from '../../../theme/spacing';
import type { LeaderboardPerson } from './data/challengesData';

type Props = NativeStackScreenProps<ChallengesStackParamList, 'Challenges'>;

const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    activeTab,
    setActiveTab,
    challenges,
    ruleChallenges,
    badges,
    competitions,
    loading,
    loadError,
    walletPoints,
    unreadNotifications,
    refresh,
    joinChallenge,
  } = useChallenges();
  const visibleChallenges = useMemo(
    () => [...challenges, ...ruleChallenges],
    [challenges, ruleChallenges],
  );
  const leaderboardCompetition = useMemo(
    () =>
      competitions.find(
        item => item.leaderboard?.length || item.myProgress?.length,
      ),
    [competitions],
  );
  const leaderboardChallenge = useMemo(
    () => challenges.find(item => item.leaderboard?.length),
    [challenges],
  );
  const leaderboard = useMemo<LeaderboardPerson[]>(() => {
    const competitionEntries = leaderboardCompetition?.leaderboard || [];
    const myEntry = leaderboardCompetition?.myProgress?.[0];
    const entries = competitionEntries.length
      ? [
          ...competitionEntries,
          ...(myEntry &&
          !competitionEntries.some(
            entry => entry.id === myEntry.id || entry.name === myEntry.name,
          )
            ? [myEntry]
            : []),
        ]
      : leaderboardChallenge?.leaderboard?.length
      ? leaderboardChallenge.leaderboard
      : myEntry
      ? [myEntry]
      : [];
    const currentUser = myEntry;
    const avatarColors = [
      '#00BFA5',
      '#6C63FF',
      '#FF9B38',
      '#4F9CF9',
      '#E879F9',
      '#F97373',
    ];

    return [...entries]
      .sort((a, b) => a.rank - b.rank)
      .map((entry, index) => {
        const isCurrentUser = Boolean(
          currentUser &&
            (entry.id === currentUser.id || entry.name === currentUser.name),
        );
        return {
          rank: entry.rank || index + 1,
          name: entry.name,
          steps: Number(entry.value || 0).toLocaleString(),
          initials:
            entry.name
              .split(/\s+/)
              .filter(Boolean)
              .map(part => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || '?',
          color: avatarColors[index % avatarColors.length],
          streak: isCurrentUser ? 'Your ranking' : undefined,
          isCurrentUser,
          profileImageUrl: entry.profileImageUrl,
          unit:
            leaderboardCompetition?.metric?.replace(/_/g, ' ') ||
            leaderboardChallenge?.metricLabel ||
            'points',
        };
      });
  }, [leaderboardChallenge, leaderboardCompetition]);
  const browseAllChallenges = useCallback(
    () => navigation.navigate('AllChallenges'),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Challenges & Leaderboard"
        subtitle="Compete, earn badges, stay motivated"
        isBack={false}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: theme.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ChallengeTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          styles={styles}
          theme={theme}
        />

        <View
          style={[styles.competitionEntry, { marginHorizontal: spacing.base }]}
        >
          <AppText variant="caption" secondary>
            Available points:{' '}
            {walletPoints === null ? '—' : walletPoints.toLocaleString()}
            {unreadNotifications > 0
              ? ` · ${unreadNotifications} unread notifications`
              : ''}
          </AppText>
        </View>

        <View style={styles.content}>
          {loading ? (
            <AppLoader message="Loading your challenges and badges…" />
          ) : loadError ? (
            <AppErrorView
              message={loadError}
              onRefresh={() => {
                refresh();
              }}
            />
          ) : null}
          {!loading && !loadError && activeTab === 'Leaderboard' ? (
            leaderboard.length > 0 ? (
              <LeaderBoardTab
                leaderboard={leaderboard}
                styles={styles}
                title={
                  leaderboardCompetition?.title ||
                  leaderboardChallenge?.title ||
                  'Challenge leaderboard'
                }
                subtitle={
                  leaderboardCompetition?.metric ||
                  leaderboardChallenge?.metricLabel ||
                  'Ranked by challenge progress'
                }
              />
            ) : (
              <AppEmptyState
                title="No leaderboard yet"
                description="Rankings will appear here when a challenge has participants."
              />
            )
          ) : null}
          {!loading && !loadError && activeTab === 'Challenges' ? (
            challenges.length || ruleChallenges.length ? (
              <ChallengesTab
                challenges={visibleChallenges}
                onJoin={joinChallenge}
                onBrowseAll={browseAllChallenges}
                styles={styles}
              />
            ) : (
              <AppEmptyState
                title="No challenges yet"
                description="Challenges will appear here when they are available."
              />
            )
          ) : null}
          {!loading && !loadError && activeTab === 'Badges' ? (
            badges.length ? (
              <BadgesTab badges={badges} styles={styles} />
            ) : (
              <AppEmptyState
                title="No badges yet"
                description="Complete activities and challenges to earn badges."
              />
            )
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChallengesScreen;
