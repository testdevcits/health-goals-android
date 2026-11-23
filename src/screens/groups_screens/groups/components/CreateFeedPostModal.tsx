import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { apiErrorMessage } from '../../../../services/api';
import { showAppToast } from '../../../../utils/appToast';
import AppIcon, { type IconName } from '../../../../assets/appicon/AppIcon';
import createFeedPostModalStyles from './styles.CreateFeedPostModal';

export interface FeedPostActivity {
  type: 'steps' | 'workout' | 'distance' | 'calories';
  value: number;
  unit: string;
}

export interface FeedPostMedia {
  type: 'image';
  url: string;
}

export interface FeedPostPayload {
  message: string;
  emoji: string;
  groupId: string;
  visibility: 'group' | 'public';
  activity?: FeedPostActivity;
  media?: FeedPostMedia[];
}

export interface AvailableGroupItem {
  id: string;
  name: string;
  emoji?: string;
}

export interface CreateFeedPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: FeedPostPayload) => Promise<void> | void;
  loading?: boolean;
  defaultGroupId?: string;
  availableGroups?: AvailableGroupItem[];
  initialActivity?: FeedPostActivity;
  initialMediaUrl?: string;
}

const CELEBRATION_EMOJIS = [
  '🎉',
  '🔥',
  '🏆',
  '💪',
  '⚡',
  '👟',
  '🥇',
  '🎯',
  '🌟',
];

export const CreateFeedPostModal: React.FC<CreateFeedPostModalProps> = memo(
  ({
    visible,
    onClose,
    onSubmit,
    loading = false,
    defaultGroupId = '',
    availableGroups = [],
    initialActivity,
    initialMediaUrl = '',
  }) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = theme;
    const insets = useSafeAreaInsets();
    const styles = useMemo(
      () => createFeedPostModalStyles(colors, spacing, radius),
      [colors, spacing, radius],
    );

    // Form states
    const [message, setMessage] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(CELEBRATION_EMOJIS[0]);
    const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
    const [visibility, setVisibility] = useState<'group' | 'public'>('group');

    // Activity state
    const [attachActivity, setAttachActivity] = useState(true);
    const [activity, setActivity] = useState<FeedPostActivity>(
      initialActivity || {
        type: 'steps',
        value: 10000,
        unit: 'steps',
      },
    );

    // Media state
    const [mediaUrl, setMediaUrl] = useState(initialMediaUrl);
    const [showMediaInput, setShowMediaInput] = useState(false);
    const [customUrlText, setCustomUrlText] = useState('');

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Sync default group ID when opened
    useEffect(() => {
      if (defaultGroupId) {
        setSelectedGroupId(defaultGroupId);
      } else if (availableGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(availableGroups[0].id);
      }
    }, [defaultGroupId, availableGroups, selectedGroupId]);

    // Sync initial activity
    useEffect(() => {
      if (initialActivity) {
        setActivity(initialActivity);
        setAttachActivity(true);
      }
    }, [initialActivity]);

    // Keyboard listener for bottom sheet offset
    useEffect(() => {
      const showSub = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        e => {
          setKeyboardHeight(e.endCoordinates.height);
        },
      );
      const hideSub = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        },
      );

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    const handleClose = useCallback(() => {
      setMessage('');
      setSelectedEmoji(CELEBRATION_EMOJIS[0]);
      setShowMediaInput(false);
      setCustomUrlText('');
      onClose();
    }, [onClose]);

    const handleSubmit = useCallback(() => {
      const trimmed = message.trim();
      if (!trimmed) return;

      const payload: FeedPostPayload = {
        message: trimmed,
        emoji: selectedEmoji,
        groupId: selectedGroupId || defaultGroupId || 'general',
        visibility,
        ...(attachActivity && activity ? { activity } : {}),
        ...(mediaUrl.trim()
          ? {
              media: [
                {
                  type: 'image',
                  url: mediaUrl.trim(),
                },
              ],
            }
          : {}),
      };

      void onSubmit(payload);
    }, [
      activity,
      attachActivity,
      defaultGroupId,
      mediaUrl,
      message,
      onSubmit,
      selectedEmoji,
      selectedGroupId,
      visibility,
    ]);

    const handleAddMediaUrl = useCallback(() => {
      if (customUrlText.trim()) {
        setMediaUrl(customUrlText.trim());
        setCustomUrlText('');
        setShowMediaInput(false);
      }
    }, [customUrlText]);

    const handlePickFromGallery = useCallback(async () => {
      try {
        const image = await ImagePicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          compressImageQuality: 0.8,
          includeBase64: true,
          includeExif: false,
        });
        if (image.data) {
          setMediaUrl(
            `data:${image.mime || 'image/jpeg'};base64,${image.data}`,
          );
          setShowMediaInput(false);
        } else if (image.path) {
          setMediaUrl(image.path);
          setShowMediaInput(false);
        }
      } catch (error: any) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          showAppToast(
            'error',
            'Could not select photo',
            apiErrorMessage(error),
          );
        }
      }
    }, []);

    const handleRemoveMedia = useCallback(() => {
      setMediaUrl('');
    }, []);

    const selectedGroupName = useMemo(() => {
      const found = availableGroups.find(g => g.id === selectedGroupId);
      return found ? found.name : 'Group';
    }, [availableGroups, selectedGroupId]);

    const activityIconName = useMemo<IconName>(() => {
      switch (activity?.type) {
        case 'steps':
          return 'Footprints';
        case 'calories':
          return 'HeartPulse';
        case 'workout':
          return 'Dumbbell';
        default:
          return 'Trophy';
      }
    }, [activity?.type]);

    const isSubmitDisabled = !message.trim() || loading;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            accessibilityLabel="Close feed post sheet"
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardContainer}
          >
            <View
              style={[
                styles.bottomSheet,
                {
                  paddingBottom:
                    keyboardHeight > 0
                      ? keyboardHeight + spacing.sm
                      : Math.max(insets.bottom, spacing.base),
                },
              ]}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Drag Handle */}
                <View style={styles.sheetHandle} />

                {/* Header */}
                <View style={styles.headerRow}>
                  <View style={styles.headerTitleCol}>
                    <AppText variant="h3">Share Milestone</AppText>
                    <AppText style={styles.headerSubtitle}>
                      Posting to {selectedGroupName} •{' '}
                      {visibility === 'group' ? '🔒 Group only' : '🌍 Public'}
                    </AppText>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    onPress={handleClose}
                    style={styles.closeButton}
                  >
                    <AppIcon name="X" size={18} color={colors.textPrimary} />
                  </Pressable>
                </View>

                {/* Group Selector (if multiple available) */}
                {availableGroups.length > 1 ? (
                  <>
                    <AppText style={styles.sectionLabel}>Select Group</AppText>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.groupSelectorRow}
                    >
                      {availableGroups.map(grp => {
                        const isSelected = grp.id === selectedGroupId;
                        return (
                          <Pressable
                            key={grp.id}
                            onPress={() => setSelectedGroupId(grp.id)}
                            style={[
                              styles.groupChip,
                              isSelected && styles.groupChipSelected,
                            ]}
                          >
                            {grp.emoji ? (
                              <AppText style={{ fontSize: 14 }}>
                                {grp.emoji}
                              </AppText>
                            ) : null}
                            <AppText
                              style={[
                                styles.groupChipText,
                                isSelected && styles.groupChipTextSelected,
                              ]}
                            >
                              {grp.name}
                            </AppText>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </>
                ) : null}

                {/* Celebration Emoji Selector */}
                <AppText style={styles.sectionLabel}>Celebration Tag</AppText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.emojiRow}
                >
                  {CELEBRATION_EMOJIS.map(emoji => {
                    const isSelected = emoji === selectedEmoji;
                    return (
                      <Pressable
                        key={emoji}
                        onPress={() => setSelectedEmoji(emoji)}
                        style={[
                          styles.emojiChip,
                          isSelected && styles.emojiChipSelected,
                        ]}
                      >
                        <AppText style={styles.emojiText}>{emoji}</AppText>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Message Input Box */}
                <AppText style={styles.sectionLabel}>Your Message</AppText>
                <View style={styles.messageInputContainer}>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Share your fitness victory, today's workout, or inspire your group..."
                    placeholderTextColor={colors.inputPlaceholder}
                    multiline
                    maxLength={280}
                    style={styles.messageInput}
                  />
                </View>
                <View style={styles.charCounterRow}>
                  <AppText style={styles.charCounterText}>
                    {message.length}/280
                  </AppText>
                </View>

                {/* Activity Attachment Badge */}
                {activity ? (
                  <>
                    <AppText style={styles.sectionLabel}>
                      Attached Activity
                    </AppText>
                    <Pressable
                      onPress={() => setAttachActivity(prev => !prev)}
                      style={[
                        styles.activityCard,
                        attachActivity && styles.activityCardActive,
                      ]}
                    >
                      <View style={styles.activityLeftRow}>
                        <View style={styles.activityIconContainer}>
                          <AppIcon
                            name={activityIconName}
                            size={18}
                            color={
                              attachActivity
                                ? colors.primary
                                : colors.textSecondary
                            }
                          />
                        </View>
                        <View>
                          <AppText style={styles.activityValueText}>
                            {activity.value.toLocaleString()} {activity.unit}
                          </AppText>
                          <AppText style={styles.activitySubtitle}>
                            {attachActivity
                              ? 'Included with post'
                              : 'Tap to include with post'}
                          </AppText>
                        </View>
                      </View>

                      <View style={styles.activityRemoveBtn}>
                        <AppIcon
                          name={attachActivity ? 'Check' : 'Plus'}
                          size={18}
                          color={
                            attachActivity
                              ? colors.primary
                              : colors.textSecondary
                          }
                        />
                      </View>
                    </Pressable>
                  </>
                ) : null}

                {/* Media Image Attachment */}
                <AppText style={styles.sectionLabel}>Photo Attachment</AppText>
                {mediaUrl ? (
                  <View style={styles.mediaPreviewContainer}>
                    <Image
                      source={{ uri: mediaUrl }}
                      style={styles.mediaPreviewImage}
                      resizeMode="cover"
                    />
                    <Pressable
                      onPress={handleRemoveMedia}
                      style={styles.mediaRemoveBtn}
                      accessibilityLabel="Remove photo"
                    >
                      <AppIcon name="X" size={15} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                      onPress={handlePickFromGallery}
                      style={styles.mediaChangeBtn}
                      accessibilityLabel="Change photo from gallery"
                    >
                      <AppIcon name="Edit" size={12} color="#FFFFFF" />
                      <AppText style={styles.mediaChangeBtnText}>
                        Change
                      </AppText>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <Pressable
                      onPress={handlePickFromGallery}
                      style={[styles.activityCard, styles.mediaGalleryCard]}
                      accessibilityRole="button"
                      accessibilityLabel="Choose photo from gallery"
                    >
                      <View style={styles.activityLeftRow}>
                        <View
                          style={[
                            styles.activityIconContainer,
                            { backgroundColor: colors.primaryLight },
                          ]}
                        >
                          <AppIcon
                            name="Image"
                            size={20}
                            color={colors.primary}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <AppText
                            style={[
                              styles.activityValueText,
                              { color: colors.textPrimary, fontSize: 14 },
                            ]}
                          >
                            Choose Photo from Gallery
                          </AppText>
                          <AppText style={styles.activitySubtitle}>
                            Select workout snapshot, medal, or route from device
                          </AppText>
                        </View>
                      </View>
                      <AppIcon name="Upload" size={18} color={colors.primary} />
                    </Pressable>

                    {showMediaInput ? (
                      <View style={styles.mediaInputRow}>
                        <TextInput
                          value={customUrlText}
                          onChangeText={setCustomUrlText}
                          placeholder="Paste image URL (https://...)"
                          placeholderTextColor={colors.inputPlaceholder}
                          style={styles.mediaUrlInput}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <Pressable
                          onPress={handleAddMediaUrl}
                          style={styles.addMediaBtn}
                        >
                          <AppText style={styles.addMediaBtnText}>
                            Attach
                          </AppText>
                        </Pressable>
                        <Pressable
                          onPress={() => setShowMediaInput(false)}
                          style={styles.cancelUrlBtn}
                          accessibilityLabel="Cancel URL input"
                        >
                          <AppIcon
                            name="X"
                            size={14}
                            color={colors.textSecondary}
                          />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => setShowMediaInput(true)}
                        style={styles.orUrlButton}
                        accessibilityRole="button"
                      >
                        <AppText style={styles.orUrlText}>
                          🔗 Or paste an image URL
                        </AppText>
                      </Pressable>
                    )}
                  </>
                )}

                {/* Visibility Selector */}
                <AppText style={styles.sectionLabel}>Post Visibility</AppText>
                <View style={styles.visibilityRow}>
                  <Pressable
                    onPress={() => setVisibility('group')}
                    style={[
                      styles.visibilityChip,
                      visibility === 'group' && styles.visibilityChipActive,
                    ]}
                  >
                    <AppIcon
                      name="Lock"
                      size={14}
                      color={
                        visibility === 'group'
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                    <AppText
                      style={[
                        styles.visibilityText,
                        visibility === 'group' && styles.visibilityTextActive,
                      ]}
                    >
                      Group Members
                    </AppText>
                  </Pressable>

                  <Pressable
                    onPress={() => setVisibility('public')}
                    style={[
                      styles.visibilityChip,
                      visibility === 'public' && styles.visibilityChipActive,
                    ]}
                  >
                    <AppIcon
                      name="Share2"
                      size={14}
                      color={
                        visibility === 'public'
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                    <AppText
                      style={[
                        styles.visibilityText,
                        visibility === 'public' && styles.visibilityTextActive,
                      ]}
                    >
                      Public Community
                    </AppText>
                  </Pressable>
                </View>

                {/* Footer Action Buttons */}
                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={handleClose}
                    style={styles.cancelButton}
                    disabled={loading}
                  >
                    <AppText style={styles.cancelButtonText}>Cancel</AppText>
                  </Pressable>

                  <View style={styles.submitButton}>
                    <AppButton
                      title="Post to Feed"
                      onPress={handleSubmit}
                      loading={loading}
                      disabled={isSubmitDisabled}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  },
);

export default CreateFeedPostModal;
