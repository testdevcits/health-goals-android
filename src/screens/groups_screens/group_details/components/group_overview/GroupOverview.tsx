import React, { memo, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../../../../../components';
import { Member, GroupChallenge } from '../../constants';
import { useTheme } from '../../../../../theme/useTheme';
import createGroupOverviewStyles from './styles.GroupOverview';
import { OverviewShimmer } from '../group_detail_shimmer/GroupDetailShimmer';
import { createGroupDetailShimmerStyles } from '../group_detail_shimmer/styles.GroupDetailShimmer';
import { GoalCard } from './GoalCard';
import { WeeklyChart } from './WeeklyChart';
import { MemberRow } from './MemberRow';
import { MemberAvatar } from './MemberAvatar';

interface Props {
  members: Member[];
  challenges?: GroupChallenge[];
  onNewChallenge?: () => void;
  isLeader: boolean;
  onArchiveGroup: () => void;
  loading?: boolean;
}

export const GroupOverview: React.FC<Props> = memo(
  ({ members, isLeader, onArchiveGroup, loading = false }) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = theme;
    const styles = createGroupOverviewStyles(colors, spacing, radius);
    const shimmerStyles = useMemo(
      () => createGroupDetailShimmerStyles(colors, spacing),
      [colors, spacing],
    );

    if (loading) {
      return <OverviewShimmer styles={shimmerStyles} />;
    }

    return (
      <>
        <GoalCard styles={styles} members={members} />

        <WeeklyChart styles={styles} members={members} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <AppText variant="subtitle1">Top Contributors</AppText>
          </View>
          <View style={styles.contributorsCard}>
            {members.slice(0, 3).map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                index={i}
                colors={colors}
                styles={styles}
              />
            ))}
          </View>
          <AppText variant="caption" secondary center mt={spacing.sm}>
            View the leaderboard to see all members
          </AppText>
        </View>

        {isLeader ? (
          <View style={styles.section}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Exit group"
              onPress={onArchiveGroup}
              style={styles.archiveGroupButton}
            >
              <AppText variant="label" error bold>
                Exit group
              </AppText>
              <AppText variant="caption" secondary center>
                This group will be removed from active groups and cannot be
                restored in the app.
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </>
    );
  },
);

export { GoalCard, WeeklyChart, MemberRow, MemberAvatar };
export default GroupOverview;
