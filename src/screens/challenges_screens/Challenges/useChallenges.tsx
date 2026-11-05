import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Dumbbell, Footprints, Sunrise } from 'lucide-react-native';
import { apiErrorMessage } from '../../../services/api';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { showAppToast } from '../../../utils/appToast';
import type { Badge, Challenge, ChallengeTab } from './data/challengesData';

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

const useChallenges = () => {
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

    try {
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

      const failedResult = [
        challengeResult,
        badgeResult,
        competitionResult,
      ].find(result => result.status === 'rejected');
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
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
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

  return {
    activeTab,
    setActiveTab,
    challenges,
    ruleChallenges,
    badges,
    competitions,
    loading,
    loadError,
    refresh,
    joinChallenge,
  };
};

export default useChallenges;
