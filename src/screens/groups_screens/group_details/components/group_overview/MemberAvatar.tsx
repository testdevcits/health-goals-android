import React, { memo, useState } from 'react';
import { View, Image } from 'react-native';
import { AppText } from '../../../../../components';
import { Member } from '../../constants';

interface MemberAvatarProps {
  member: Member;
  styles: any;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = memo(
  ({ member, styles }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = member.profileImageUrl?.trim();
    const showImage = Boolean(
      imageUrl &&
        (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
        !imageError,
    );

    return (
      <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
        {showImage && imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.memberAvatarImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            onError={() => setImageError(true)}
          />
        ) : (
          <AppText variant="subtitle2" color="white" bold>
            {member.initials}
          </AppText>
        )}
      </View>
    );
  },
);

export default MemberAvatar;
