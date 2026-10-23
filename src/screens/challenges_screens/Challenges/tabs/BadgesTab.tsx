import React from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { Badge } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';

interface BadgesTabProps {
  badges: Badge[];
  styles: ChallengesStyles;
}

const BadgesTab: React.FC<BadgesTabProps> = ({ badges, styles }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { spacing } = theme;

  const badgeWidth = (width - spacing.base * 2 - spacing.sm * 2) / 3;

  return (
    <FlatList
      data={badges}
      keyExtractor={item => item.id.toString()}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={styles.badgesGrid}
      columnWrapperStyle={{ gap: spacing.sm }}
      renderItem={({ item: badge }) => (
        <View
          style={[
            styles.badgeCard,
            { width: badgeWidth },
            !badge.earned && styles.lockedBadge,
          ]}
        >
          <View
            style={[styles.badgeIcon, !badge.earned && styles.lockedBadgeIcon]}
          >
            <AppText
              variant="h3"
              style={[
                styles.badgeEmoji,
                {
                  color: badge.earned
                    ? theme.colors.textPrimary
                    : theme.colors.textTertiary,
                },
              ]}
            >
              {badge.emoji}
            </AppText>
          </View>

          <AppText
            variant="label"
            center
            numberOfLines={1}
            style={styles.badgeTitle}
          >
            {badge.title}
          </AppText>

          <AppText variant="caption" secondary center numberOfLines={2}>
            {badge.subtitle}
          </AppText>
        </View>
      )}
    />
  );
};

export default BadgesTab;
