import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dumbbell } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import { createCardStyles, createStyles } from './styles.AllChallenges';
import useAllChallenges, {
  challengeCategories,
  type Challenge,
} from './useAllChallenges';

interface AllChallengesScreenProps {
  onContinue?: (challengeId: string) => void;
}

const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const navigation = useNavigation();

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
                <Dumbbell size={28} color={colors.primary} strokeWidth={1.8} />
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
    </View>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  onContinue?: (challengeId: string) => void;
  colors: any;
  spacing: any;
  radius: any;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onContinue,
  colors,
  spacing,
  radius,
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
        onPress={() => !challenge.joined && onContinue?.(challenge.id)}
        disabled={challenge.joined}
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
      >
        <AppText variant="buttonSm" color="white">
          {challenge.joined ? 'Joined' : 'Join challenge'}
        </AppText>
      </Pressable>
    </View>
  );
};

export default AllChallengesScreen;
