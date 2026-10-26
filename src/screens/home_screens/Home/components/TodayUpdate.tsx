import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';

// Static mock for "today's update" narrative card
const TODAY = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const TodayUpdate: React.FC = memo(() => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          marginHorizontal: spacing.xl,
          marginTop: spacing.md,
          padding: spacing.base,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <AppText variant="caption" primary bold style={{ letterSpacing: 0.5 }}>
          TODAY'S UPDATE
        </AppText>
        <AppText variant="caption" secondary style={styles.date}>
          {TODAY}
        </AppText>
      </View>

      {/* Narrative paragraph */}
      <AppText
        variant="body2"
        style={[
          styles.paragraph,
          { color: colors.textPrimary, lineHeight: 22 },
        ]}
      >
        You've had a strong start today — 2,038 steps logged so far with 21
        active minutes recorded. Your heart rate has stayed in a healthy zone
        throughout your morning session, peaking at 118 bpm during your walk.
        You're currently on a{' '}
        <AppText variant="body2" primary bold>
          12-day streak
        </AppText>
        , and you need just{' '}
        <AppText variant="body2" primary bold>
          7,962 more steps
        </AppText>{' '}
        to hit your daily goal of 10,000. Keep it going — you're ahead of
        yesterday's pace! 🔥
      </AppText>

      {/* Stat pills */}
      <View style={styles.pillRow}>
        {[
          { emoji: '👟', label: '2,038 steps' },
          { emoji: '⏱️', label: '21 min' },
          { emoji: '🔥', label: '118 kcal' },
          { emoji: '💤', label: '7 h sleep' },
        ].map(pill => (
          <View
            key={pill.label}
            style={[
              styles.pill,
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: radius.full,
              },
            ]}
          >
            <AppText style={styles.pillEmoji}>{pill.emoji}</AppText>
            <AppText variant="caption" secondary>
              {pill.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
});

export default TodayUpdate;

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  date: {
    marginLeft: 'auto',
  },
  paragraph: {
    marginBottom: 14,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  pillEmoji: {
    fontSize: 13,
  },
});
