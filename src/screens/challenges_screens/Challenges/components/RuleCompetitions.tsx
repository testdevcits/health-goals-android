import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components';
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
  return (
    <View style={styles.list}>
      {!items.length && (
        <AppText secondary>
          No rule competitions yet. Your eligible goals will appear here.
        </AppText>
      )}
      {items.map(item => (
        <View key={item.id} style={styles.card}>
          <AppText bold>{item.title}</AppText>
          <AppText variant="caption" secondary>
            {item.audience === 'GROUP' ? 'Group' : 'Individual'} · {item.status}{' '}
            · {item.start} – {item.end}
          </AppText>
          <AppText variant="body2">
            Target: {item.targetValue.toLocaleString()}{' '}
            {item.metric === 'STEPS'
              ? 'steps'
              : item.metric === 'WORKOUT_HOURS'
              ? 'workout hours'
              : 'meditation hours'}
          </AppText>
          {item.myProgress.map(row => (
            <View key={row.id} style={styles.mine}>
              <AppText bold>
                {item.audience === 'GROUP' ? 'Your group' : 'You'}: #{row.rank}{' '}
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
          {item.leaderboard.map(row => (
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
const styles = StyleSheet.create({
  list: { gap: 16 },
  card: {
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#dce5d7',
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 7,
  },
  mine: { padding: 12, gap: 9, backgroundColor: '#eaf3e5', borderRadius: 10 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dbe5d5',
    overflow: 'hidden',
  },
  fill: { height: 8, backgroundColor: '#315b40' },
});
