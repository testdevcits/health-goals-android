import React, { useState } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
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
  type Challenge,
} from './useAllChallenges';
import AppIcon from '../../../assets/appicon/AppIcon';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

type ChallengeDetails = {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  metricType?: string;
  metric?: string;
  targetValue?: number;
  currentValue?: number;
  progress?: number;
  joined?: boolean;
  joinable?: boolean;
  participantCount?: number;
  participants?: number;
  leaderboard?: Array<{
    id?: string;
    name: string;
    value?: number;
    currentValue?: number;
    rank?: number;
  }>;
};

interface AllChallengesScreenProps {
  onContinue?: (challengeId: string) => void;
}

const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const navigation = useNavigation();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeDetails | null>(null);
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
    filteredChallenges,
  } = useAllChallenges();

  const styles = createStyles(colors, spacing, radius);

  const showDetails = async (challengeId: string) => {
    setDetailVisible(true);
    setDetailLoading(true);
    try {
      const result = await authenticatedRequest<{
        challenge: ChallengeDetails;
      }>(
        'GET',
        `/community/challenges/${encodeURIComponent(challengeId)}`,
      );
      setSelectedChallenge(result.challenge);
    } catch (error) {
      setDetailVisible(false);
      showAppToast('error', 'Could not load challenge', apiErrorMessage(error));
    } finally {
      setDetailLoading(false);
    }
  };

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
            style={{
              alignSelf: 'flex-end',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
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
          ) : filteredChallenges.length ? (
            filteredChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onContinue={id => {
                  if (onContinue) onContinue(id);
                  else joinChallenge(id);
                }}
                onShowDetails={showDetails}
                colors={colors}
                spacing={spacing}
                radius={radius}
              />
            ))
          ) : (
            <AppEmptyState
              title="No challenges found"
              description={
                selectedCategory === 'All'
                  ? 'New challenges will appear here when available.'
                  : `There are no ${selectedCategory.toLowerCase()} challenges right now.`
              }
              icon={
                <AppIcon
                  name="Dumbbell"
                  size={28}
                  color={colors.primary}
                  strokeWidth={1.8}
                />
              }
              actionLabel={
                selectedCategory !== 'All' ? 'Show all challenges' : undefined
              }
              onAction={
                selectedCategory !== 'All'
                  ? () => setSelectedCategory('All')
                  : undefined
              }
            />
          )}
        </View>
      </ScrollView>
      <Modal
        visible={detailVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 20,
              backgroundColor: colors.surface,
            }}
          >
            {detailLoading ? (
              <AppLoader message="Loading challenge…" />
            ) : (
              <>
                <AppText variant="h3" bold mb={8}>
                  {selectedChallenge?.title || 'Challenge details'}
                </AppText>
                <AppText variant="body2" secondary mb={12}>
                  {selectedChallenge?.description || 'No description provided.'}
                </AppText>
                <AppText variant="caption" secondary>
                  {[
                    selectedChallenge?.status,
                    selectedChallenge?.metricType || selectedChallenge?.metric,
                    selectedChallenge?.targetValue
                      ? `Target ${selectedChallenge.targetValue}`
                      : null,
                    (selectedChallenge?.participantCount ??
                      selectedChallenge?.participants) != null
                      ? `${selectedChallenge?.participantCount ?? selectedChallenge?.participants} participants`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </AppText>
                {selectedChallenge?.currentValue != null ? (
                  <AppText variant="caption" secondary mt={8}>
                    Your progress:{' '}
                    {selectedChallenge.currentValue.toLocaleString()}
                    {selectedChallenge.targetValue != null
                      ? ` / ${selectedChallenge.targetValue.toLocaleString()}`
                      : ''}
                  </AppText>
                ) : null}
                {selectedChallenge?.leaderboard?.length ? (
                  <View style={{ marginTop: 14 }}>
                    <AppText variant="label" bold mb={6}>
                      Leaderboard
                    </AppText>
                    {selectedChallenge.leaderboard.slice(0, 5).map((entry, index) => (
                      <AppText key={entry.id || `${entry.name}-${index}`} variant="caption" secondary>
                        {entry.rank ?? index + 1}. {entry.name}
                        {(entry.value ?? entry.currentValue) != null
                          ? ` · ${Number(entry.value ?? entry.currentValue).toLocaleString()}`
                          : ''}
                      </AppText>
                    ))}
                  </View>
                ) : null}
                {!selectedChallenge?.joined && selectedChallenge?.joinable ? (
                  <AppButton
                    title="Join challenge"
                    onPress={() => {
                      if (selectedChallenge.id) {
                        void joinChallenge(selectedChallenge.id);
                        setDetailVisible(false);
                      }
                    }}
                    style={{ marginTop: 16 }}
                  />
                ) : null}
                <AppButton
                  title="Close"
                  variant="outline"
                  onPress={() => setDetailVisible(false)}
                  style={{ marginTop: 18 }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={createVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <View
            style={{
              padding: 20,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: colors.surface,
            }}
          >
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
              onPress={() => void createChallenge()}
              loading={creating}
              disabled={creating}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={() => setCreateVisible(false)}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  onContinue?: (challengeId: string) => void;
  colors: any;
  spacing: any;
  radius: any;
  onShowDetails: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onContinue,
  colors,
  spacing,
  radius,
  onShowDetails,
}) => {
  const styles = createCardStyles(colors, spacing, radius);

  return (
    <View style={[styles.card, { borderLeftColor: challenge.color }]}>
      {/* Title and status */}
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <AppText style={styles.emoji}>{challenge.emoji}</AppText>

          <AppText variant="subtitle2" style={styles.title} numberOfLines={2}>
            {challenge.title}
          </AppText>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: `${challenge.color}20`,
            },
          ]}
        >
          <AppText variant="caption" style={{ color: challenge.color }} bold>
            {challenge.status}
          </AppText>
        </View>
      </View>

      {/* Challenge description */}
      <AppText variant="body2" secondary style={styles.description}>
        {challenge.description}
      </AppText>
      <Pressable
        onPress={() => onShowDetails(challenge.id)}
        style={{ paddingVertical: 8 }}
      >
        <AppText variant="caption" primary bold>
          View details
        </AppText>
      </Pressable>

      {/* Progress bar */}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: challenge.progress,
        }}
        style={styles.progressTrack}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${challenge.progress}%`,
              backgroundColor: challenge.color,
            },
          ]}
        />
      </View>

      {/* Progress labels */}
      <View style={styles.progressFooter}>
        <AppText variant="caption" secondary>
          {challenge.progressLabel}
        </AppText>

        <AppText variant="caption" style={{ color: challenge.color }} bold>
          {challenge.progress}%
        </AppText>
      </View>

      {/* Continue action */}
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          !challenge.joined &&
          challenge.joinable &&
          onContinue?.(challenge.id)
        }
        disabled={challenge.joined || !challenge.joinable}
        style={[
          styles.continueButton,
          {
            backgroundColor:
              challenge.joined || !challenge.joinable
                ? colors.textTertiary
                : colors.primary,
          },
        ]}
      >
        <AppText variant="buttonSm" color="white">
          {challenge.joined
            ? 'Joined'
            : challenge.joinable
            ? 'Join challenge'
            : 'Not available'}
        </AppText>
      </Pressable>
    </View>
  );
};

export default AllChallengesScreen;
