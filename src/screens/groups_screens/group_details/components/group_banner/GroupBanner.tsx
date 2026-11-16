import React, { memo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { Member, AVATAR_PALETTE } from '../../constants';
import styles from './styles.GroupBanner';

interface Props {
  groupName: string;
  groupDescription: string;
  memberCount: number;
  isPrivate: boolean;
  members: Member[];
  onSettingsPress?: () => void;
  imageUrl?: string;
}

const BannerAvatarItem: React.FC<{
  member: Member;
  index: number;
  colors: any;
}> = memo(({ member, index, colors }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = member.profileImageUrl?.trim();
  const showImage = Boolean(
    imageUrl &&
      (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
      !imageError,
  );

  return (
    <View
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
      {showImage && imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.bannerAvatarImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          onError={() => setImageError(true)}
        />
      ) : (
        <AppText style={styles.bannerAvatarText} color="white" bold>
          {member.initials}
        </AppText>
      )}
    </View>
  );
});

export const GroupBanner: React.FC<Props> = memo(
  ({
    groupName,
    groupDescription,
    memberCount,
    isPrivate,
    members,
    onSettingsPress,
    imageUrl,
  }) => {
    const { theme } = useTheme();
    const { colors } = theme;

    return (
      <View
        style={[styles.bannerContainer, { backgroundColor: colors.primary }]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: colors.whiteOverlay17 }]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 70, height: 70, borderRadius: 22 }}
              resizeMode="cover"
            />
          ) : (
            <AppText style={styles.groupIcon}>🏃</AppText>
          )}
        </View>

        <View style={styles.content}>
          <AppText variant="h3" style={{ color: colors.white }} bold>
            {groupName}
          </AppText>

          <AppText
            variant="subtitle2"
            style={[styles.description, { color: colors.white }]}
          >
            {groupDescription} · {isPrivate ? 'Private' : 'Public'} · {memberCount}/10 members
          </AppText>

          <View style={styles.bannerMemberAvatars}>
            {members.slice(0, 4).map((member, index) => (
              <BannerAvatarItem
                key={member.id}
                member={member}
                index={index}
                colors={colors}
              />
            ))}

            {memberCount > 4 && (
              <View
                style={[
                  styles.bannerMoreMembers,
                  {
                    backgroundColor: colors.primaryDark,
                    borderColor: colors.white,
                  },
                ]}
              >
                <AppText
                  style={styles.bannerMoreMembersText}
                  color="white"
                  bold
                >
                  +{memberCount - 4}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Group options"
          onPress={onSettingsPress}
          disabled={!onSettingsPress}
          style={[
            styles.settingsButton,
            { backgroundColor: colors.whiteOverlay20 },
          ]}
        >
          <AppText style={[styles.settingsIcon, { color: colors.white }]}>
            ⚙
          </AppText>
        </Pressable>
      </View>
    );
  },
);
