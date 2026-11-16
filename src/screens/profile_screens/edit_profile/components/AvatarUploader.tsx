import React from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { radius } from '../../../../theme/radius';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.EditProfile';

interface AvatarUploaderProps {
  profileImage?: string | null;
  profileImageUrl?: string | null;
  imageBusy: boolean;
  onChooseImage: () => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  profileImage,
  profileImageUrl,
  imageBusy,
  onChooseImage,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const imageSourceUri = profileImage || profileImageUrl;

  return (
    <View style={styles.profileImageContainer}>
      {imageSourceUri ? (
        <Image
          source={{ uri: imageSourceUri }}
          style={[styles.profileImage, { borderRadius: radius.full }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.profileImage,
            {
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <AppIcon name="UserRound" size={42} color={colors.textSecondary} />
        </View>
      )}

      <Pressable
        onPress={onChooseImage}
        style={[styles.cameraButton, imageBusy && { opacity: 0.6 }]}
        hitSlop={8}
        disabled={imageBusy}
        accessibilityState={{ busy: imageBusy }}
      >
        {imageBusy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <AppIcon
            name="Camera"
            size={16}
            color={colors.textPrimary}
            strokeWidth={2}
          />
        )}
      </Pressable>
    </View>
  );
};
