import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { Member, AVATAR_PALETTE } from '../constants';

interface Props {
  groupName: string;
  groupDescription: string;
  memberCount: number;
  members: Member[];
  colors: any;
  styles: any;
}

export const GroupBanner: React.FC<Props> = memo(
  ({ groupName, groupDescription, memberCount, members, colors, styles }) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerOverlay}>
        <AppText variant="h3" style={{ color: colors.textPrimary }} bold>
          {groupName}
        </AppText>
        <AppText variant="subtitle2" style={{ color: colors.textSecondary }}>
          {groupDescription}
        </AppText>

        <View style={styles.bannerMemberAvatars}>
          {members.slice(0, 4).map((member, index) => (
            <View
              key={member.id}
              style={[
                styles.bannerAvatar,
                {
                  backgroundColor:
                    AVATAR_PALETTE[index % AVATAR_PALETTE.length],
                },
              ]}
            >
              <AppText style={styles.bannerAvatarText} color="white" bold>
                {member.initials}
              </AppText>
            </View>
          ))}
          {memberCount > 4 && (
            <View style={styles.bannerMoreMembers}>
              <AppText style={styles.bannerMoreMembersText} color="white" bold>
                +{memberCount - 4}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  ),
);
