import React, { useCallback, useState } from 'react';
import { Alert, View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Dumbbell } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppHeader, AppText } from '../../../components';
import { createCardStyles, createStyles } from './styles.AllChallenges';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';

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
  joined?: boolean;
}

interface AllChallengesScreenProps {
  onContinue?: (challengeId: string) => void;
}

const categories: ChallengeCategory[] = ['All', 'Steps', 'Mind', 'Strength'];

const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onContinue,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] =
    useState<ChallengeCategory>('All');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const refresh = useCallback(async () => {
    try {
      const result = await authenticatedRequest<{ challenges: Array<{ id: string; title: string; description: string; metricType: string; targetValue: number; status: string; joined: boolean }> }>('GET', '/community/challenges');
      setChallenges((result.challenges || []).map(item => ({ id: item.id, title: item.title, description: item.description || `${item.targetValue} ${item.metricType}`, category: item.metricType === 'steps' ? 'Steps' : item.metricType === 'workout' ? 'Strength' : 'Mind', status: item.status, progress: 0, progressLabel: `${item.targetValue.toLocaleString()} target`, color: '#00C6A2', emoji: item.metricType === 'steps' ? '👟' : item.metricType === 'workout' ? '💪' : '🧘', joined: item.joined })));
    } catch (error) { Alert.alert('Could not load challenges', apiErrorMessage(error)); }
  }, []);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const joinChallenge = async (challengeId: string) => {
    try { await authenticatedRequest('POST', `/community/challenges/${encodeURIComponent(challengeId)}/join`); await refresh(); }
    catch (error) { Alert.alert('Could not join challenge', apiErrorMessage(error)); }
  };

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
              onContinue={id => { if (onContinue) onContinue(id); else void joinChallenge(id); }}
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
