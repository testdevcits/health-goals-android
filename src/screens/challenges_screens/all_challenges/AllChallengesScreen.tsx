import React, { useState } from 'react';
import { View, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Footprints, Droplets, Sunrise, Dumbbell } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppHeader, AppText } from '../../../components';
import { createCardStyles, createStyles } from './styles.AllChallenges';

type ChallengeCategory = 'All' | 'Steps' | 'Mind' | 'Strength';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  emoji: string;
}

interface AllChallengesScreenProps {
  onContinue?: (challengeId: string) => void;
}

const categories: ChallengeCategory[] = ['All', 'Steps', 'Mind', 'Strength'];

const challenges: Challenge[] = [
  {
    id: 'step-sprint',
    title: '30-Day Step Sprint',
    description:
      'Walk 10,000 steps daily with your team. Top 3 win gift cards.',
    category: 'Steps',
    status: 'LIVE',
    progress: 68,
    progressLabel: '20 of 30 days',
    color: '#00C6A2',
    emoji: '👟',
  },
  {
    id: 'morning-yoga',
    title: 'Morning Yoga Streak',
    description: 'Complete a 15-min yoga session before 9 AM for 7 days.',
    category: 'Mind',
    status: '5/7 days',
    progress: 71,
    progressLabel: '2 days left',
    color: '#7563FF',
    emoji: '🧘',
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Hero',
    description: 'Log 8 glasses of water every day this week.',
    category: 'Mind',
    status: 'Daily',
    progress: 50,
    progressLabel: '4 of 8 today',
    color: '#FF9B38',
    emoji: '💧',
  },
  {
    id: '100k-steps',
    title: '100K Steps Month',
    description: 'Hit 100,000 total steps before the month ends.',
    category: 'Steps',
    status: 'Monthly',
    progress: 62,
    progressLabel: '62,000 / 100,000',
    color: '#00C6A2',
    emoji: '🚶',
  },
  {
    id: 'strength-builder',
    title: 'Strength Builder',
    description: 'Complete 3 strength workouts every week.',
    category: 'Strength',
    status: 'Weekly',
    progress: 33,
    progressLabel: '1 of 3 workouts',
    color: '#F97365',
    emoji: '💪',
  },
];

const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [selectedCategory, setSelectedCategory] =
    useState<ChallengeCategory>('All');

  const filteredChallenges = challenges.filter(
    challenge =>
      selectedCategory === 'All' || challenge.category === selectedCategory,
  );

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
        <View style={styles.categoryContainer}>
          {categories.map(category => {
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

        <View style={styles.challengeList}>
          {filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onContinue={onContinue}
              colors={colors}
              spacing={spacing}
              radius={radius}
            />
          ))}

          {filteredChallenges.length === 0 && (
            <View style={styles.emptyState}>
              <Dumbbell size={36} color={colors.textTertiary} />

              <AppText variant="subtitle1" center mt={spacing.md}>
                No challenges yet
              </AppText>

              <AppText variant="body2" secondary center mt={spacing.xs}>
                Check back later for new challenges.
              </AppText>
            </View>
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
  const Icon =
    challenge.category === 'Steps'
      ? Footprints
      : challenge.category === 'Strength'
      ? Dumbbell
      : challenge.category === 'Mind'
      ? Sunrise
      : Droplets;

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
        onPress={() => onContinue?.(challenge.id)}
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
      >
        <AppText variant="buttonSm" color="white">
          Continue
        </AppText>
      </Pressable>
    </View>
  );
};

export default AllChallengesScreen;
