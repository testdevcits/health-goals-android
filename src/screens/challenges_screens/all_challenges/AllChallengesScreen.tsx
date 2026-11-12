import React, { useState } from 'react';
import { View, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../theme/useTheme';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
  AppInput,
  AppButton,
} from '../../../components';
import { createCardStyles, createStyles } from './styles.AllChallenges';
import useAllChallenges, {
  challengeCategories,
  challengeGroupCategories,
  type Challenge,
} from './useAllChallenges';
import AppIcon from '../../../assets/appicon/AppIcon';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

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
      await authenticatedRequest('POST', '/community/challenges', {
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
    <View style={[styles.container]}>
      {/* Screen header */}

      <AppHeader
        title="All Challenges"
        subtitle={'Browse and join new challenges'}
        onBackPress={() => navigation.goBack()}
      />

      {/* Category filter and challenge list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!loading && !loadError ? (
          <Pressable
            onPress={() => setCreateVisible(true)}
            style={styles.createChallengeLink}
          >
            <AppText variant="label" primary bold>
              + Create challenge
            </AppText>
          </Pressable>
        ) : null}
        {!loading && !loadError ? (
          <View style={styles.categoryContainer}>
            {challengeCategories.map(category => {
              const isSelected = selectedCategory === category;

              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  accessibilityRole="tab"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  style={[
                    styles.categoryTab,
                    isSelected && styles.selectedCategoryTab,
                  ]}
                >
                  <AppText
                    variant="label"
                    center
                    style={{
                      color: isSelected
                        ? colors.textPrimary
                        : colors.textSecondary,
                    }}
                    medium={isSelected}
                  >
                    {category}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
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
                      {group.challenges.length === 1 ? 'challenge' : 'challenges'}
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
      <Modal
        visible={createVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateVisible(false)}
      >
        <View style={styles.createModalOverlay}>
          <View style={styles.createModalSheet}>
            <AppText variant="h3" bold mb={12}>
              Create a steps challenge
            </AppText>
            <AppInput
              label="Title"
              value={createTitle}
              onChangeText={setCreateTitle}
              maxLength={80}
            />
            <AppInput
              label="Description"
              value={createDescription}
              onChangeText={setCreateDescription}
              maxLength={240}
            />
            <AppInput
              label="Target steps"
              value={createTarget}
              onChangeText={setCreateTarget}
              keyboardType="numeric"
            />
            <AppButton
              title="Create challenge"
              onPress={createChallenge}
              loading={creating}
              disabled={creating}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={() => setCreateVisible(false)}
              style={styles.cancelCreateButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  isJoining?: boolean;
  onContinue?: (challengeId: string) => void;
  colors: any;
  spacing: any;
  radius: any;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  isJoining = false,
  onContinue,
  colors,
  spacing,
  radius,
}) => {
  const styles = createCardStyles(colors, spacing, radius);

  return (
    <View style={[styles.card, { borderLeftColor: challenge?.color }]}>
      {/* Title and status */}
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <AppText style={styles.emoji}>{challenge?.emoji}</AppText>

          <AppText variant="subtitle2" style={styles.title} numberOfLines={2}>
            {challenge?.title}
          </AppText>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: `${challenge?.color}20`,
            },
          ]}
        >
          <AppText variant="caption" style={{ color: challenge?.color }} bold>
            {challenge?.status}
          </AppText>
        </View>
      </View>

      {/* Continue action */}
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          !isJoining &&
          !challenge?.joined &&
          challenge?.joinable &&
          onContinue?.(challenge?.id)
        }
        disabled={isJoining || challenge?.joined || !challenge?.joinable}
        style={[
          styles.continueButton,
          {
            backgroundColor:
              challenge?.joined || !challenge?.joinable
                ? colors.textTertiary
                : colors.primary,
          },
        ]}
      >
        {isJoining ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <AppText variant="buttonSm" color="white">
            {challenge?.joined
              ? 'Joined'
              : challenge?.joinable
                ? 'Join challenge'
                : 'Not available'}
          </AppText>
        )}
      </Pressable>
    </View>
  );
};

export default AllChallengesScreen;
