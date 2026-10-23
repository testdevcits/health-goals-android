import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { Member } from '../constants';
import { MemberRow } from './GroupOverview';

interface Props {
  members: Member[];
  colors: any;
  styles: any;
}

export const GroupLeaderboard: React.FC<Props> = memo(({ members, colors, styles }) => (
  <>
    <View style={styles.leaderboardIntro}>
      <AppText variant="caption" secondary center>
        Group ranking · This week
      </AppText>
    </View>

    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Top Contributors</AppText>
      </View>
      <View style={styles.contributorsCard}>
        {members.map((m, i) => (
          <MemberRow key={m.id} member={m} index={i} colors={colors} styles={styles} />
        ))}
      </View>
    </View>
  </>
));
