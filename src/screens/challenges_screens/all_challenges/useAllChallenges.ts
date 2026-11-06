import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

export type ChallengeCategory = 'All' | 'Steps' | 'Mind' | 'Strength';

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
}

export const challengeCategories: ChallengeCategory[] = [
  'All',
  'Steps',
  'Mind',
  'Strength',
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
        challenges: Array<{
          id: string;
          title: string;
          description: string;
          metricType: string;
          targetValue: number;
          status: string;
          joined: boolean;
        }>;
      }>('GET', '/community/challenges');
      setChallenges(
        (result.challenges || []).map(item => ({
          id: item.id,
          title: item.title,
          description:
            item.description || `${item.targetValue} ${item.metricType}`,
          category:
            item.metricType === 'steps'
              ? 'Steps'
              : item.metricType === 'workout'
              ? 'Strength'
              : 'Mind',
          status: item.status,
          progress: 0,
          progressLabel: `${item.targetValue.toLocaleString()} target`,
          color: '#00C6A2',
          emoji:
            item.metricType === 'steps'
              ? '👟'
              : item.metricType === 'workout'
              ? '💪'
              : '🧘',
          joined: item.joined,
        })),
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

  const joinChallenge = async (challengeId: string) => {
    try {
      await authenticatedRequest(
        'POST',
        `/community/challenges/${encodeURIComponent(challengeId)}/join`,
      );
      await refresh();
    } catch (error) {
      showAppToast('error', 'Could not join challenge', apiErrorMessage(error));
    }
  };

  const filteredChallenges = challenges.filter(
    challenge =>
      selectedCategory === 'All' || challenge.category === selectedCategory,
  );

  return {
    selectedCategory,
    setSelectedCategory,
    loading,
    loadError,
    refresh,
    joinChallenge,
    filteredChallenges,
  };
}
