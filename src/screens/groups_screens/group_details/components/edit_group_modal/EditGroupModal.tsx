import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { AppButton, AppInput, AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { apiErrorMessage } from '../../../../../services/api';
import { showAppToast } from '../../../../../utils/appToast';
import AppIcon from '../../../../../assets/appicon/AppIcon';

interface EditGroupModalProps {
  visible: boolean;
  onClose: () => void;
  isLeader: boolean;
  groupNameDraft: string;
  setGroupNameDraft: (name: string) => void;
  groupImage?: string | null;
  currentGroupImage?: string;
  setGroupImage: (image: string | null | undefined) => void;
  saveLoading?: boolean;
  onSaveGroup: (image?: string | null) => Promise<void> | void;
  onOpenLeaveModal: () => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  visible,
  onClose,
  isLeader,
  groupNameDraft,
  setGroupNameDraft,
  groupImage,
  currentGroupImage,
  setGroupImage,
  saveLoading = false,
  onSaveGroup,
  onOpenLeaveModal,
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;

  const displayImageUri =
    groupImage !== undefined ? groupImage : currentGroupImage;

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 900,
        height: 600,
        compressImageQuality: 0.8,
        includeBase64: true,
        includeExif: false,
      });
      if (image.data) {
        setGroupImage(
          `data:${image.mime || 'image/jpeg'};base64,${image.data}`,
        );
      }
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        showAppToast(
          'error',
          'Could not choose image',
          apiErrorMessage(error),
        );
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close group options"
        />
        <View
          style={[styles.modalSheet, { backgroundColor: colors.surface }]}
        >
          {/* Header with Title and Cancel Close Icon Button */}
          <View style={styles.header}>
            <AppText variant="h3" bold>
              {isLeader ? 'Edit group' : 'Group options'}
            </AppText>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <AppIcon name="X" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {isLeader ? (
            <>
              {/* Group Image Display and Change/Remove buttons */}
              <View style={styles.imageSection}>
                <View
                  style={[
                    styles.imagePreviewContainer,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {displayImageUri ? (
                    <Image
                      source={{ uri: displayImageUri }}
                      style={[
                        styles.imagePreview,
                        { borderRadius: radius.full },
                      ]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.placeholderContainer,
                        { backgroundColor: colors.primaryLight },
                      ]}
                    >
                      <AppIcon
                        name="User"
                        size={32}
                        color={colors.primary}
                        strokeWidth={2}
                      />
                    </View>
                  )}
                  <Pressable
                    onPress={handlePickImage}
                    style={[
                      styles.cameraBadge,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Select group image"
                  >
                    <AppIcon
                      name="Camera"
                      size={15}
                      color={colors.textPrimary}
                      strokeWidth={2}
                    />
                  </Pressable>
                </View>

                <View style={styles.imageActionRow}>
                  <Pressable
                    onPress={handlePickImage}
                    hitSlop={6}
                    accessibilityRole="button"
                  >
                    <AppText variant="caption" primary bold>
                      {displayImageUri ? 'Change Image' : 'Add Image'}
                    </AppText>
                  </Pressable>
                  {displayImageUri ? (
                    <>
                      <AppText variant="caption" secondary>
                        {' '}·{' '}
                      </AppText>
                      <Pressable
                        onPress={() => setGroupImage(null)}
                        hitSlop={6}
                        accessibilityRole="button"
                      >
                        <AppText variant="caption" error bold>
                          Remove
                        </AppText>
                      </Pressable>
                    </>
                  ) : null}
                </View>
              </View>

              <AppInput
                label="Group name"
                value={groupNameDraft}
                onChangeText={setGroupNameDraft}
                maxLength={50}
                containerStyle={{ marginBottom: spacing.md }}
              />

              {/* Save changes outline button with loader */}
              <AppButton
                title="Save changes"
                variant="outline"
                loading={saveLoading}
                disabled={saveLoading}
                onPress={() => onSaveGroup(groupImage)}
                style={styles.outlineActionBtn}
              />
            </>
          ) : null}

          {/* Leave group outline button */}
          <Pressable
            onPress={onOpenLeaveModal}
            accessibilityRole="button"
            disabled={saveLoading}
            style={[
              styles.leaveOutlineBtn,
              {
                borderColor: colors.error,
                borderRadius: radius.full,
              },
            ]}
          >
            <AppText variant="button" error bold>
              Leave group
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 3,
  },
  imageActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  outlineActionBtn: {
    marginBottom: 10,
  },
  leaveOutlineBtn: {
    minHeight: 48,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
