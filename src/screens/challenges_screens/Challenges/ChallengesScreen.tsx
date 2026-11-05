import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import {
  type Badge,
  type Challenge,
  type ChallengeTab,
} from './data/challengesData';
import BadgesTab from './tabs/BadgesTab';
import ChallengesTab from './tabs/ChallengesTab';
import createStyles from './styles.Challenges';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { Footprints, Sunrise, Dumbbell } from 'lucide-react-native';

type CompetitionEntry = {
  id: string;
  name: string;
  value: number;
  rank: number;
  progress: number;
  achieved: boolean;
};

type Competition = {
  id: string;
  title: string;
  ruleType: string;
  audience: string;
  metric: string;
  targetValue: number;
  start: string;
  end: string;
  status: string;
  leaderboard?: CompetitionEntry[];
  myProgress?: CompetitionEntry[];
};

type Achievement = {
  key: string;
  title: string;
  ruleTitle?: string;
  points: number;
  awardedAt: string;
};

type Props = NativeStackScreenProps<ChallengesStackParamList, 'Challenges'>;

const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<ChallengeTab>('Leaderboard');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ruleChallenges, setRuleChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const [challengeResult, badgeResult, competitionResult] =
      await Promise.allSettled([
        authenticatedRequest<{
          challenges: Array<{
            id: string;
            title: string;
            description: string;
            status: string;
            metricType: string;
            targetValue: number;
            participants: number;
            joined: boolean;
            progress: number;
            currentValue: number;
          }>;
        }>('GET', '/community/challenges'),
        authenticatedRequest<{ badges: Badge[] }>('GET', '/community/badges'),
        authenticatedRequest<{
          competitions: Competition[];
          achievements: Achievement[];
        }>('GET', '/rewards/competitions'),
      ]);

    if (challengeResult.status === 'fulfilled') {
      setChallenges(
        (challengeResult.value.challenges || []).map(item => ({
          id: item.id,
          title: item.title,
          description:
            item.description || `${item.targetValue} ${item.metricType}`,
          progress: Math.max(0, Math.min(100, item.progress || 0)),
          progressLabel: `${item.currentValue.toLocaleString()} / ${item.targetValue.toLocaleString()} · ${
            item.participants
          } participants`,
          status: item.status === 'ACTIVE' ? 'LIVE' : 'ENDED',
          color: '#00C6A2',
          icon:
            item.metricType === 'steps'
              ? Footprints
              : item.metricType === 'workout'
              ? Dumbbell
              : Sunrise,
          joined: item.joined,
          joinable: true,
        })),
      );
    }

    const communityBadges =
      badgeResult.status === 'fulfilled' ? badgeResult.value.badges || [] : [];
    const achievements =
      competitionResult.status === 'fulfilled'
        ? competitionResult.value.achievements || []
        : [];
    if (
      badgeResult.status === 'fulfilled' ||
      competitionResult.status === 'fulfilled'
    ) {
      const earnedBadges: Badge[] = achievements.map(achievement => ({
        id: achievement.key,
        title: achievement.title || achievement.ruleTitle || 'Achievement',
        subtitle: `${achievement.points} bonus points · ${new Date(
          achievement.awardedAt,
        ).toLocaleDateString()}`,
        emoji: '🏅',
        earned: true,
      }));
      const badgesById = new Map(
        [...communityBadges, ...earnedBadges].map(badge => [badge.id, badge]),
      );
      setBadges(Array.from(badgesById.values()));
    }

    if (competitionResult.status === 'fulfilled') {
      const result = competitionResult.value;
      const currentCompetitions = result.competitions || [];
      setCompetitions(currentCompetitions);
      setRuleChallenges(
        currentCompetitions.map(competition => {
          const progressEntries = competition.myProgress || [];
          const progress = progressEntries[0];
          const startsInFuture = Date.parse(competition.start) > Date.now();
          const metric = competition.metric.replace(/_/g, ' ');
          const progressSummary = progressEntries.length
            ? progressEntries
                .map(
                  entry =>
                    `${
                      entry.name
                    }: ${entry.value.toLocaleString()} / ${competition.targetValue.toLocaleString()} ${metric}`,
                )
                .join(' · ')
            : `Goal: ${competition.targetValue.toLocaleString()} ${metric}`;
          return {
            id: `rule:${competition.id}`,
            title: competition.title,
            description: `${competition.ruleType.replace(
              /_/g,
              ' ',
            )} · ${competition.audience.toLowerCase()} ${metric} goal`,
            progress: Math.max(0, Math.min(100, progress?.progress ?? 0)),
            progressLabel: progressSummary,
            status: startsInFuture ? 'UPCOMING' : competition.status,
            color: '#8175F5',
            icon:
              competition.metric === 'steps'
                ? Footprints
                : competition.metric === 'workout'
                ? Dumbbell
                : Sunrise,
            joined: true,
            joinable: false,
          };
        }),
      );
    }

    const failedResult = [challengeResult, badgeResult, competitionResult].find(
      result => result.status === 'rejected',
    );
    if (failedResult?.status === 'rejected') {
      showAppToast(
        'error',
        'Some challenges could not load',
        apiErrorMessage(failedResult.reason),
      );
    }
    if (
      [challengeResult, badgeResult, competitionResult].every(
        result => result.status === 'rejected',
      )
    ) {
      setLoadError(
        apiErrorMessage(
          challengeResult.status === 'rejected'
            ? challengeResult.reason
            : undefined,
        ),
      );
    }
    setLoading(false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const joinChallenge = async (id: string) => {
    try {
      await authenticatedRequest(
        'POST',
        `/community/challenges/${encodeURIComponent(id)}/join`,
      );
      await refresh();
    } catch (error) {
      showAppToast('error', 'Could not join challenge', apiErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Challenges & Leaderboard"
        subtitle="Compete, earn badges, stay motivated"
        isBack={false}
      />

      <ScrollView
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
            <View>
              {competitions.length === 0 ? (
                <AppEmptyState
                  title="No competitions yet"
                  description="Active leaderboards and rule competitions will appear here when available."
                />
              ) : (
                competitions.map(competition => (
                  <View key={competition.id} style={styles.competitionCard}>
                    <AppText variant="subtitle1" bold>
                      {competition.title}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {competition.audience.toLowerCase()}{' '}
                      {competition.ruleType.toLowerCase().replace(/_/g, ' ')} ·{' '}
                      {competition.metric.replace(/_/g, ' ')} · target{' '}
                      {competition.targetValue.toLocaleString()} ·{' '}
                      {Date.parse(competition.start) > Date.now()
                        ? 'UPCOMING'
                        : competition.status}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {new Date(competition.start).toLocaleDateString()} –{' '}
                      {new Date(competition.end).toLocaleDateString()}
                    </AppText>
                    {(competition.myProgress || []).map((entry, index) => (
                      <View
                        key={`${entry.id}:${index}`}
                        style={styles.competitionEntry}
                      >
                        <AppText variant="body2" bold>
                          {entry.name}
                          {entry.rank > 0 ? `: #${entry.rank}` : ''} ·{' '}
                          {entry.value.toLocaleString()}
                        </AppText>
                        <AppText variant="caption" secondary>
                          {Math.round(entry.progress)}% progress
                          {entry.achieved ? ' · target reached' : ''}
                        </AppText>
                      </View>
                    ))}
                    {(competition.leaderboard || []).map(entry => (
                      <View key={entry.id} style={styles.competitionEntry}>
                        <AppText variant="body2">
                          {entry.rank}. {entry.name}
                        </AppText>
                        <AppText variant="caption" secondary>
                          {entry.value.toLocaleString()} ·{' '}
                          {Math.round(entry.progress)}%
                        </AppText>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </View>
          ) : null}
          {!loading && !loadError && activeTab === 'Challenges' ? (
            challenges.length || ruleChallenges.length ? (
              <ChallengesTab
                challenges={[...challenges, ...ruleChallenges]}
                onJoin={id => void joinChallenge(id)}
                onBrowseAll={() => navigation.navigate('AllChallenges')}
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
