import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

export type ChallengeCategory = 'All' | 'Steps' | 'Mind' | 'Strength' | 'Other';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  emoji: string;
  joined?: boolean;
  joinable?: boolean;
  currentValue?: number;
  targetValue?: number;
  participantCount?: number;
}

export const challengeCategories: ChallengeCategory[] = [
  'All',
  'Steps',
  'Mind',
  'Strength',
];

export const challengeGroupCategories: Exclude<ChallengeCategory, 'All'>[] = [
  'Steps',
  'Mind',
  'Strength',
  'Other',
];

export default function useAllChallenges() {
  const [selectedCategory, setSelectedCategory] =
    useState<ChallengeCategory>('All');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await authenticatedRequest<{
        challenges?: Array<{
          id: string;
          title: string;
          description?: string;
          metricType?: string;
          metric?: string;
          category?: string;
          targetValue: number;
          status: string;
          joined: boolean;
          joinable?: boolean;
          currentValue?: number;
          progress?: number;
          participantCount?: number;
          participants?: number;
          startsAt?: string;
          endsAt?: string;
        }>;
        items?: Array<{
          id: string;
          title: string;
          description?: string;
          metricType?: string;
          metric?: string;
          category?: string;
          targetValue: number;
          status: string;
          joined: boolean;
          joinable?: boolean;
          currentValue?: number;
          progress?: number;
          participantCount?: number;
          participants?: number;
          startsAt?: string;
          endsAt?: string;
        }>;
      }>('GET', '/community/challenges');
      setChallenges(
        (result.challenges || result.items || []).map(item => {
          const metric = (item.metricType || item.metric || 'steps').toLowerCase();
          const currentValue = Number(item.currentValue || 0);
          const targetValue = Number(item.targetValue || 0);
          const progress = Number(
            item.progress ??
            (targetValue > 0 ? (currentValue / targetValue) * 100 : 0),
          );
          const joined = Boolean(item.joined);
          const status = String(item.status || 'UPCOMING').toUpperCase();
          const joinable = Boolean(
            item.joinable ??
            (!joined && ['ACTIVE', 'LIVE', 'PUBLISHED'].includes(status)),
          );
          const responseCategory = String(item.category || '').toLowerCase();
          const category: ChallengeCategory =
            responseCategory === 'steps'
              ? 'Steps'
              : responseCategory === 'mind'
                ? 'Mind'
                : responseCategory === 'strength'
                  ? 'Strength'
                  : responseCategory === 'other'
                    ? 'Other'
                    : metric.includes('step')
                      ? 'Steps'
                      : metric.includes('workout')
                        ? 'Strength'
                        : 'Other';
          const participants = Number(
            item.participantCount ?? item.participants ?? 0,
          );

          return {
            id: item.id,
            title: item.title,
            description: item.description || `${targetValue} ${metric}`,
            category,
            status,
            progress: Math.min(100, Math.max(0, progress)),
            progressLabel: joined
              ? `${currentValue.toLocaleString()} / ${targetValue.toLocaleString()} · ${participants} participants`
              : `Not joined · ${participants} participants`,
            color: '#00C6A2',
            emoji:
              category === 'Steps'
                ? '👟'
                : category === 'Strength'
                  ? '💪'
                  : category === 'Mind'
                    ? '🧘'
                    : '🎯',
            joined,
            joinable,
            currentValue,
            targetValue,
            participantCount: participants,
          };
        }),
      );
    } catch (error) {
      const message = apiErrorMessage(error);
      setLoadError(message);
      showAppToast('error', 'Could not load challenges', message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const [joiningChallengeId, setJoiningChallengeId] = useState<string | null>(
    null,
  );

  const joinChallenge = async (challengeId: string) => {
    try {
      setJoiningChallengeId(challengeId);
      await authenticatedRequest(
        'POST',
        `/community/challenges/${encodeURIComponent(challengeId)}/join`,
      );
      await refresh();
      showAppToast('success', 'Joined challenge', 'You are now participating.');
    } catch (error) {
      showAppToast('error', 'Could not join challenge', apiErrorMessage(error));
    } finally {
      setJoiningChallengeId(null);
    }
  };

  const filteredChallenges = challenges.filter(
    challenge =>
      selectedCategory === 'All' || challenge?.category === selectedCategory,
  );

  return {
    selectedCategory,
    setSelectedCategory,
    loading,
    loadError,
    refresh,
    joinChallenge,
    joiningChallengeId,
    filteredChallenges,
  };
}
