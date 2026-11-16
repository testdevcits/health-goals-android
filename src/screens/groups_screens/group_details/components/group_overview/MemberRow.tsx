import React, { memo } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { AppText } from '../../../../../components';
import { Member, formatSteps } from '../../constants';
import { MemberAvatar } from './MemberAvatar';

interface MemberRowProps {
  member: Member;
  index: number;
  colors: any;
  styles: any;
}

export const MemberRow: React.FC<MemberRowProps> = memo(
  ({ member, index, colors, styles }) => {
    const isCurrentUser = false;
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          Alert.alert(
            member.name,
            `${formatSteps(member.steps)} steps · ${
              member.streak
            } active days this week`,
          )
        }
        style={[styles.memberRow, isCurrentUser && styles.currentMemberRow]}
      >
        <View
          style={[
            styles.rankBadge,
            index === 0 && styles.firstRankBadge,
            index === 2 && styles.thirdRankBadge,
          ]}
        >
          <AppText
            variant="caption"
            style={{
              color:
                index === 0
                  ? colors.warning
                  : index === 2
                    ? colors.coral
                    : colors.textSecondary,
            }}
            bold
          >
            {index + 1}
          </AppText>
        </View>

        <MemberAvatar member={member} styles={styles} />

        <View style={styles.memberInfo}>
          <AppText variant="label" numberOfLines={1}>
            {member.name}
          </AppText>
          <AppText variant="caption" secondary>
            {member.streak} active days this week
          </AppText>
        </View>

        <View style={styles.memberSteps}>
          <AppText variant="label" bold right>
            {formatSteps(member.steps)}
          </AppText>
          <AppText variant="caption" secondary right>
            steps
          </AppText>
        </View>
      </Pressable>
    );
  },
);

export default MemberRow;
