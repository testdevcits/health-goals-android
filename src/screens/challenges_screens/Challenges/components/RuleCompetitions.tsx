import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import type { AppColors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
export type RuleRow = {
  id: string;
  name: string;
  value: number;
  rank: number;
  progress: number;
  achieved: boolean;
};
export type Competition = {
  id: string;
  title: string;
  ruleType: string;
  audience: string;
  metric: string;
  targetValue: number;
  start: string;
  end: string;
  status: string;
  leaderboard: RuleRow[];
  myProgress: RuleRow[];
};
export default function RuleCompetitions({ items }: { items: Competition[] }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.list}>
      {!items.length && (
        <AppText secondary>
          No rule competitions yet. Your eligible goals will appear here.
        </AppText>
      )}
      {items.map(item => (
        <View key={item?.id} style={styles.card}>
          <AppText bold>{item?.title}</AppText>
          <AppText variant="caption" secondary>
            {item?.audience === 'GROUP' ? 'Group' : 'Individual'} · {item?.status}{' '}
            · {item?.start} – {item?.end}
          </AppText>
          <AppText variant="body2">
            Target: {item?.targetValue.toLocaleString()}{' '}
            {item?.metric === 'STEPS'
              ? 'steps'
              : item?.metric === 'WORKOUT_HOURS'
                ? 'workout hours'
                : 'meditation hours'}
          </AppText>
          {item?.myProgress.map(row => (
            <View key={row.id} style={styles.mine}>
              <AppText bold>
                {item?.audience === 'GROUP' ? 'Your group' : 'You'}: #{row.rank}{' '}
                · {row.progress.toFixed(1)}%
                {row.achieved ? ' · Target achieved' : ''}
              </AppText>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.min(100, row.progress)}%` },
                  ]}
                />
              </View>
            </View>
          ))}
          {item?.leaderboard.map(row => (
            <View key={row.id} style={styles.row}>
              <AppText variant="body2">
                #{row.rank} {row.name}
              </AppText>
              <AppText variant="body2">
                {row.value.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
              </AppText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    list: { gap: spacing.base },
    card: {
      padding: spacing.base,
      gap: spacing.ms,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.s,
    },
    mine: {
      padding: spacing.md,
      gap: spacing.sm,
      backgroundColor: colors.successLight,
      borderRadius: 10,
    },
    track: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.divider,
      overflow: 'hidden',
    },
    fill: { height: 8, backgroundColor: colors.success },
  });
