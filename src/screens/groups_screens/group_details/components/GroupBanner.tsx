import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { Member, AVATAR_PALETTE } from '../constants';

interface Props {
  groupName: string;
  groupDescription: string;
  memberCount: number;
  members: Member[];
}

export const GroupBanner: React.FC<Props> = memo(
  ({ groupName, groupDescription, memberCount, members }) => {
    const { theme } = useTheme();
    const { colors } = theme;

    return (
      <View style={[styles.bannerContainer, { backgroundColor: colors.primary }]}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.17)' }]}>
          <AppText style={styles.groupIcon}>🏃</AppText>
        </View>

        <View style={styles.content}>
          <AppText variant="h3" style={{ color: colors.white }} bold>
            {groupName}
          </AppText>

          <AppText variant="subtitle2" style={[styles.description, { color: colors.white }]}>
            {groupDescription} · {memberCount} members
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
                    borderColor: colors.white,
                    zIndex: 10 - index,
                  },
                ]}
              >
                <AppText style={styles.bannerAvatarText} color="white" bold>
                  {member.initials}
                </AppText>
              </View>
            ))}

            {memberCount > 4 && (
              <View style={[styles.bannerMoreMembers, { backgroundColor: colors.primaryDark, borderColor: colors.white }]}>
                <AppText style={styles.bannerMoreMembersText} color="white" bold>
                  +{memberCount - 4}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.settingsButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <AppText style={[styles.settingsIcon, { color: colors.white }]}>⚙</AppText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    padding: 20,
    minHeight: 132,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 15,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  groupIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginTop: 3,
  },
  bannerMemberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bannerAvatar: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -7,
  },
  bannerAvatarText: {
    fontSize: 11,
  },
  bannerMoreMembers: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  bannerMoreMembersText: {
    fontSize: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 19,
  },
});
