import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceEventEmitter } from 'react-native';
import { Dumbbell, Footprints, Sunrise } from 'lucide-react-native';
import { apiErrorMessage } from '../../../services/api';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { showAppToast } from '../../../utils/appToast';
import type { Badge, Challenge, ChallengeTab } from './data/challengesData';

type CompetitionEntry = {
  id: string;
  name: string;
  profileImageUrl?: string;
  value: number;
  rank: number;
  progress: number;
  achieved: boolean;
};

type CommunityChallenge = {
  id: string;
  title: string;
  description?: string;
  status: string;
  metric?: string;
  metricType?: string;
  targetValue: number;
  participantCount?: number;
  participants?: number;
  joined: boolean;
  joinable?: boolean;
  currentValue?: number;
  progress?: number;
  startsAt?: string;
  endsAt?: string;
  month?: string;
  leaderboard?: Array<{
    id: string;
    name: string;
    profileImageUrl?: string;
    value: number;
    rank: number;
    winner?: boolean;
    isWinner?: boolean;
  }>;
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

const useChallenges = () => {
  const [activeTab, setActiveTab] = useState<ChallengeTab>('Challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ruleChallenges, setRuleChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [walletPoints, setWalletPoints] = useState<number | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const [
        challengeResult,
        badgeResult,
        competitionResult,
        notificationResult,
        walletResult,
      ] = await Promise.allSettled([
        authenticatedRequest<{
          challenges?: CommunityChallenge[];
          items?: CommunityChallenge[];
        }>('GET', '/community/challenges'),
        authenticatedRequest<{ badges: Badge[] }>('GET', '/community/badges'),
        authenticatedRequest<{
          competitions: Competition[];
          achievements: Achievement[];
        }>('GET', '/rewards/competitions'),
        authenticatedRequest<{
          items?: Array<{ read: boolean }>;
          unread?: number;
        }>('GET', '/notifications?page=1&limit=50'),
        authenticatedRequest<{
          wallet?: { availablePoints?: number; balance?: number };
        }>('GET', '/wallet'),
      ]);

      if (challengeResult.status === 'fulfilled') {
        setChallenges(
          (
            challengeResult.value.challenges ||
            challengeResult.value.items ||
            []
          ).map(item => {
            const metric = item.metric || item.metricType || 'steps';
            const currentValue = Number(item.currentValue || 0);
            const targetValue = Number(item.targetValue || 0);
            const progress = Number(item.progress ?? 0);
            const startsInFuture =
              !!item.startsAt && Date.parse(item.startsAt) > Date.now();
            const status = String(item.status || 'UPCOMING').toUpperCase();
            const joined = Boolean(item.joined);
            const joinable = Boolean(
              item.joinable ??
                (!joined &&
                  !startsInFuture &&
                  ['ACTIVE', 'LIVE', 'PUBLISHED'].includes(status)),
            );
            const metricLabel = metric.replace(/_/g, ' ');
            const dateLabel = item.month
              ? item.month
              : item.startsAt && item.endsAt
              ? `${new Date(item.startsAt).toLocaleDateString()} – ${new Date(
                  item.endsAt,
                ).toLocaleDateString()}`
              : undefined;

            return {
              id: item.id,
              title: item.title,
              description: item.description || `${targetValue} ${metric}`,
              progress: Math.max(0, progress),
              progressLabel: item.joined
                ? `Joined · ${currentValue.toLocaleString()} / ${targetValue.toLocaleString()} · ${
                    item.participantCount ?? item.participants ?? 0
                  } participants`
                : `Not joined · ${
                    item.participantCount ?? item.participants ?? 0
                  } participants`,
              metricLabel,
              targetLabel: targetValue.toLocaleString(),
              dateLabel,
              leaderboard: (item.leaderboard || []).map(entry => ({
                id: entry.id,
                name: entry.name,
                profileImageUrl: entry.profileImageUrl,
                value: Number(entry.value) || 0,
                rank: Number(entry.rank) || 0,
                winner: entry.winner ?? entry.isWinner,
              })),
              status: startsInFuture
                ? 'UPCOMING'
                : status === 'ACTIVE' || status === 'PUBLISHED'
                ? 'LIVE'
                : status,
              color: '#00C6A2',
              icon: metric.toLowerCase().includes('step')
                ? Footprints
                : metric.toLowerCase().includes('workout')
                ? Dumbbell
                : Sunrise,
              joined,
              joinable,
            };
          }),
        );
      }

      const communityBadges =
        badgeResult.status === 'fulfilled'
          ? badgeResult.value.badges || []
          : [];
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
        const currentCompetitions = competitionResult.value.competitions || [];
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
              progress: Math.max(0, progress?.progress ?? 0),
              progressLabel: progressSummary,
              status: startsInFuture ? 'UPCOMING' : competition.status,
              color: '#8175F5',
              icon: competition.metric.toLowerCase().includes('step')
                ? Footprints
                : competition.metric.toLowerCase().includes('workout')
                ? Dumbbell
                : Sunrise,
              joined: true,
              joinable: false,
            };
          }),
        );
      }

      if (notificationResult.status === 'fulfilled') {
        setUnreadNotifications(
          notificationResult.value.unread ??
            (notificationResult.value.items || []).filter(item => !item.read)
              .length,
        );
      }
      if (walletResult.status === 'fulfilled') {
        setWalletPoints(
          Number(
            walletResult.value.wallet?.availablePoints ??
              walletResult.value.wallet?.balance ??
              0,
          ),
        );
      }

      const failedResult = [
        challengeResult,
        badgeResult,
        competitionResult,
        notificationResult,
        walletResult,
      ].find(result => result.status === 'rejected');
      if (failedResult?.status === 'rejected') {
        showAppToast(
          'error',
          'Some challenges could not load',
          apiErrorMessage(failedResult.reason),
        );
      }

      if (
        [
          challengeResult,
          badgeResult,
          competitionResult,
          notificationResult,
          walletResult,
        ].every(result => result.status === 'rejected')
      ) {
        setLoadError(
          apiErrorMessage(
            challengeResult.status === 'rejected'
              ? challengeResult.reason
              : undefined,
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'activitySyncCompleted',
      refresh,
    );
    return () => subscription.remove();
  }, [refresh]);

  const joinChallenge = useCallback(
    async (id: string) => {
      try {
        await authenticatedRequest(
          'POST',
          `/community/challenges/${encodeURIComponent(id)}/join`,
        );
        await refresh();
      } catch (error) {
        showAppToast(
          'error',
          'Could not join challenge',
          apiErrorMessage(error),
        );
      }
    },
    [refresh],
  );

  return {
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
  };
};

export default useChallenges;
