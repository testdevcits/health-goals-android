import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import type createStyles from '../styles.GroupSetting';
import { GROUP_EMOJIS } from '../useGroupSetting';

interface GroupIdentitySectionProps {
  styles: ReturnType<typeof createStyles>;
  isLeader: boolean;
  displayImageUri?: string | null;
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
}

const GroupIdentitySection: React.FC<GroupIdentitySectionProps> = ({
  styles,
  isLeader,
  displayImageUri,
  selectedEmoji,
  onSelectEmoji,
  onPickImage,
  onRemoveImage,
}) => {
  const { colors } = useTheme().theme;

  return (
    <>
      <View style={styles.imageSection}>
        <Pressable
          onPress={isLeader ? onPickImage : undefined}
          disabled={!isLeader}
          style={styles.imageContainer}
          accessibilityRole={isLeader ? 'button' : 'image'}
          accessibilityLabel="Group photo"
        >
          {displayImageUri ? (
            <Image
              source={{ uri: displayImageUri }}
              style={styles.groupImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <AppText style={styles.avatarEmoji}>{selectedEmoji}</AppText>
            </View>
          )}

          {isLeader && (
            <View style={styles.cameraBadge}>
              <AppIcon name="Camera" size={14} color={colors.textPrimary} />
            </View>
          )}
        </Pressable>

        {isLeader && (
          <View style={styles.imageActions}>
            <Pressable onPress={onPickImage} hitSlop={8}>
              <AppText variant="caption" bold primary>
                {displayImageUri ? 'Change Photo' : 'Upload Photo'}
              </AppText>
            </Pressable>
            {displayImageUri ? (
              <>
                <AppText variant="caption" secondary>
                  {' '}
                  ·{' '}
                </AppText>
                <Pressable onPress={onRemoveImage} hitSlop={8}>
                  <AppText
                    variant="caption"
                    bold
                    style={{ color: colors.error }}
                  >
                    Remove
                  </AppText>
                </Pressable>
              </>
            ) : null}
          </View>
        )}
      </View>

      {isLeader && (
        <>
          <AppText style={styles.sectionLabel}>Group Icon</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emojiScrollContent}
          >
            {GROUP_EMOJIS.map(emoji => {
              const isSelected = selectedEmoji === emoji;
              return (
                <Pressable
                  key={emoji}
                  onPress={() => onSelectEmoji(emoji)}
                  style={[
                    styles.emojiChip,
                    isSelected && styles.emojiChipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${emoji} icon`}
                >
                  <AppText style={styles.emojiText}>{emoji}</AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}
    </>
  );
};

export default React.memo(GroupIdentitySection);
