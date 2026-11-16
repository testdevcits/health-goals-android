import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import { createStyles } from './styles.AllChallenges';
import useAllChallenges, { challengeGroupCategories } from './useAllChallenges';
import AppIcon from '../../../assets/appicon/AppIcon';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import ChallengeCard from './components/ChallengeCard';
import ChallengeCategoryFilter from './components/ChallengeCategoryFilter';
import CreateStepChallengeModal from './components/CreateStepChallengeModal';

interface AllChallengesScreenProps {
  onContinue?: (challengeId: string) => void;
}

const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const navigation = useNavigation();
  const [createVisible, setCreateVisible] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createTarget, setCreateTarget] = useState('10000');
  const [creating, setCreating] = useState(false);

  const {
    selectedCategory,
    setSelectedCategory,
    loading,
    loadError,
    refresh,
    joinChallenge,
    joiningChallengeId,
    filteredChallenges,
  } = useAllChallenges();

  const styles = createStyles(colors, spacing, radius);
  const challengeGroups =
    selectedCategory === 'All'
      ? challengeGroupCategories.map(category => ({
          category,
          challenges: filteredChallenges.filter(
            challenge => challenge?.category === category,
          ),
        }))
      : [
          {
            category: selectedCategory,
            challenges: filteredChallenges,
          },
        ];

  const createChallenge = async () => {
    const targetValue = Number(createTarget);
    if (
      !createTitle.trim() ||
      !Number.isSafeInteger(targetValue) ||
      targetValue < 1
    ) {
      showAppToast(
        'error',
        'Check challenge details',
        'Add a title and a whole-number target.',
      );
      return;
    }
    setCreating(true);
    try {
      await authenticatedRequest('POST', API_ENDPOINTS.CHALLENGES.CREATE, {
        title: createTitle.trim(),
        description: createDescription.trim(),
        metricType: 'steps',
        targetValue,
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      setCreateVisible(false);
      setCreateTitle('');
      setCreateDescription('');
      await refresh();
      showAppToast('success', 'Challenge created');
    } catch (error) {
      showAppToast(
        'error',
        'Could not create challenge',
        apiErrorMessage(error),
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="All Challenges"
        subtitle="Browse and join new challenges"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!loading && !loadError ? (
          <ChallengeCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            styles={styles}
            colors={colors}
          />
        ) : null}

        <View style={styles.challengeList}>
          {loading ? (
            <AppLoader message="Loading challenges…" />
          ) : loadError ? (
            <AppErrorView
              message={loadError}
              onRefresh={() => {
                refresh();
              }}
            />
          ) : selectedCategory === 'All' || filteredChallenges.length ? (
            challengeGroups.map(group => (
              <View key={group.category}>
                {selectedCategory === 'All' ? (
                  <View style={styles.categoryHeading}>
                    <AppText variant="subtitle2" bold>
                      {group.category}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {group.challenges.length}{' '}
                      {group.challenges.length === 1
                        ? 'challenge'
                        : 'challenges'}
                    </AppText>
                  </View>
                ) : null}
                {group.challenges.length === 0 ? (
                  <AppText variant="caption" secondary mb={12}>
                    No challenges
                  </AppText>
                ) : null}
                {group.challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge?.id}
                    challenge={challenge}
                    isJoining={joiningChallengeId === challenge?.id}
                    onContinue={id => {
                      if (onContinue) onContinue(id);
                      else joinChallenge(id);
                    }}
                    colors={colors}
                    spacing={spacing}
                    radius={radius}
                  />
                ))}
              </View>
            ))
          ) : (
            <AppEmptyState
              title="No challenges found"
              description={`There are no ${selectedCategory.toLowerCase()} challenges right now.`}
              icon={
                <AppIcon
                  name="Dumbbell"
                  size={28}
                  color={colors.primary}
                  strokeWidth={1.8}
                />
              }
              actionLabel="Show all challenges"
              onAction={() => setSelectedCategory('All')}
            />
          )}
        </View>
      </ScrollView>

      <CreateStepChallengeModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        title={createTitle}
        onChangeTitle={setCreateTitle}
        description={createDescription}
        onChangeDescription={setCreateDescription}
        target={createTarget}
        onChangeTarget={setCreateTarget}
        creating={creating}
        onSubmit={createChallenge}
        styles={styles}
      />
    </View>
  );
};

export default AllChallengesScreen;
