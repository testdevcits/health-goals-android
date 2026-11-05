import React, { memo } from 'react';
import { View } from 'react-native';
import { AppEmptyState, AppText } from '../../../../../components';
import { Member } from '../../constants';
import { MemberRow } from '../group_overview/GroupOverview';
import { useTheme } from '../../../../../theme/useTheme';
import createGroupOverviewStyles from '../group_overview/styles.GroupOverview';
import styles from './styles.GroupLeaderboard';

interface Props {
  members: Member[];
}

export const GroupLeaderboard: React.FC<Props> = memo(({ members }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const overviewStyles = createGroupOverviewStyles(colors, spacing, radius);

  return (
    <>
      <View style={styles.leaderboardIntro}>
        <AppText variant="caption" secondary center>
          Group ranking · This week
        </AppText>
      </View>

      <View style={overviewStyles.section}>
        <View style={overviewStyles.sectionHeading}>
          <AppText variant="subtitle1">Top Contributors</AppText>
        </View>
        <View style={overviewStyles.contributorsCard}>
          {members.length === 0 ? (
            <AppEmptyState
              title="No leaderboard data yet"
              description="Member activity will appear here after it syncs."
            />
          ) : (
            members.map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                index={i}
                colors={colors}
                styles={overviewStyles}
              />
            ))
          )}
        </View>
      </View>
    </>
  );
});
