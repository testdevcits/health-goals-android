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
import type {
  ChallengeLeaderboardGroup,
  LeaderboardPerson,
} from './data/challengesData';
import { useAppSelector } from '../../../store/hooks';

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
    joiningChallengeId,
  } = useChallenges();
  const currentUser = useAppSelector(state => state.profile.user);

  const visibleChallenges = useMemo(
    () => [...challenges, ...ruleChallenges],
    [challenges, ruleChallenges],
  );

  const leaderboardGroups = useMemo<ChallengeLeaderboardGroup[]>(() => {
    const avatarColors = [
      theme.colors.primary,
      theme.colors.primaryDark,
      theme.colors.warning,
      theme.colors.info,
      theme.colors.coral,
      theme.colors.error,
    ];

    const groups: ChallengeLeaderboardGroup[] = [];

    // 1. Process community challenges with leaderboard data
    challenges.forEach(challenge => {
      if (challenge.leaderboard && challenge.leaderboard.length > 0) {
        const metric = challenge.metricLabel || 'steps';
        const targetText = challenge.targetLabel
          ? `Goal: ${challenge.targetLabel} ${metric}`
          : metric;
        const participantCount = challenge.leaderboard.length;
        const subtitle = `${targetText} · ${participantCount} ${
          participantCount === 1 ? 'participant' : 'participants'
        }`;

        const persons: LeaderboardPerson[] = [...challenge.leaderboard]
          .sort((a, b) => a.rank - b.rank)
          .map((entry, index) => {
            const isCurrentUser = Boolean(
              (currentUser?.id &&
                (entry.id === currentUser.id ||
                  entry.userId === currentUser.id)) ||
                (currentUser?.name &&
                  entry.name.toLowerCase() === currentUser.name.toLowerCase()),
            );
            return {
              rank: entry.rank || index + 1,
              name: entry.name,
              steps: Number(entry.value || 0).toLocaleString(),
              initials:
                entry.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part: string) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || '?',
              color: avatarColors[index % avatarColors.length],
              streak: isCurrentUser ? 'Your ranking' : undefined,
              isCurrentUser,
              profileImageUrl: entry.profileImageUrl,
              unit: metric,
            };
          });

        groups.push({
          id: challenge.id,
          title: challenge.title,
          subtitle,
          metricLabel: metric,
          joined: challenge.joined,
          participantCount,
          leaderboard: persons,
        });
      }
    });

    // 2. Process competitions with leaderboard data
    competitions.forEach(comp => {
      const entries = comp.leaderboard || [];
      const myEntry = comp.myProgress?.[0];
      const merged = [
        ...entries,
        ...(myEntry &&
        !entries.some(e => e.id === myEntry.id || e.name === myEntry.name)
          ? [myEntry]
          : []),
      ];

      if (merged.length > 0) {
        const metric = comp.metric.toLowerCase().replace(/_/g, ' ');
        const subtitle = `${comp.ruleType.replace(
          /_/g,
          ' ',
        )} · ${comp.audience.toLowerCase()} ${metric}`;

        const persons: LeaderboardPerson[] = merged
          .sort((a, b) => a.rank - b.rank)
          .map((entry, index) => {
            const isCurrentUser = Boolean(
              myEntry &&
                (entry.id === myEntry.id || entry.name === myEntry.name),
            );
            return {
              rank: entry.rank || index + 1,
              name: entry.name,
              steps: Number(entry.value || 0).toLocaleString(),
              initials:
                entry.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part: string) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || '?',
              color: avatarColors[index % avatarColors.length],
              streak: isCurrentUser ? 'Your ranking' : undefined,
              isCurrentUser,
              profileImageUrl: entry.profileImageUrl,
              unit: metric,
            };
          });

        groups.push({
          id: `comp:${comp.id}`,
          title: comp.title,
          subtitle,
          metricLabel: metric,
          joined: true,
          participantCount: merged.length,
          leaderboard: persons,
        });
      }
    });

    // Sort joined challenges first
    return groups.sort((a, b) => (b.joined ? 1 : 0) - (a.joined ? 1 : 0));
  }, [challenges, competitions, currentUser, theme.colors]);
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
            leaderboardGroups.length > 0 ? (
              <LeaderBoardTab groups={leaderboardGroups} styles={styles} />
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
                joiningChallengeId={joiningChallengeId}
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
