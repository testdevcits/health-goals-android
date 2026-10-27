import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { X, LockKeyhole } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppInput, AppText, CustomSwitch } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';

// const groupIcons = ['🚶', '🏃', '🚴', '💪', '🧘', '🏆', '🌳', '❤️'];

const groupIcons = ['🏃', '🚶', '🧘', '💪', '🚴', '🏋️', '🥗', '🏊'];

interface CreateGroupModalProps {
  createModalVisible: boolean;
  setCreateModalVisible: (visible: boolean) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  handleCreateGroup: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  createModalVisible,
  setCreateModalVisible,
  groupName,
  setGroupName,
  selectedIcon,
  setSelectedIcon,
  isPrivate,
  setIsPrivate,
  handleCreateGroup,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();
  const [groupNameError, setGroupNameError] = useState('');

  const styles = createStyles(colors, spacing, radius);

  const validateGroupName = (name: string): boolean => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setGroupNameError('Group name is required');
      return false;
    }

    if (trimmedName.length < 3) {
      setGroupNameError('Group name must be at least 3 characters');
      return false;
    }

    if (trimmedName.length > 50) {
      setGroupNameError('Group name cannot exceed 50 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(trimmedName)) {
      setGroupNameError('Only letters, numbers, and spaces are allowed');
      return false;
    }

    setGroupNameError('');
    return true;
  };

  const handleCreateGroupPress = () => {
    if (!validateGroupName(groupName)) {
      return;
    }

    setGroupName(groupName.trim());
    handleCreateGroup();
  };

  return (
    <Modal
      visible={createModalVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => setCreateModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setCreateModalVisible(false)}
          accessibilityLabel="Close create group sheet"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboardContainer}
        >
          <View
            style={[
              styles.bottomSheet,
              { paddingBottom: Math.max(insets.bottom, spacing.base) },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <AppText variant="h3">Create New Group</AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setCreateModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={19} color={colors.textPrimary} />
              </Pressable>
            </View>

            <AppText variant="label" secondary style={styles.fieldLabel}>
              Group Name
            </AppText>

            <AppInput
              value={groupName}
              onChangeText={(text: string) => {
                setGroupName(text);

                if (groupNameError) {
                  validateGroupName(text);
                }
              }}
              placeholder="e.g. Lunchtime Walkers"
              placeholderTextColor={colors.inputPlaceholder}
              maxLength={50}
              returnKeyType="done"
              error={groupNameError}
            />

            <AppText variant="label" secondary style={styles.fieldLabel}>
              Choose an Icon
            </AppText>

            <View style={styles.iconGrid}>
              {groupIcons.map(emoji => {
                const selected = selectedIcon === emoji;

                return (
                  <Pressable
                    key={emoji}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${emoji} group icon`}
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedIcon(emoji)}
                    style={[
                      styles.iconOption,
                      selected && styles.selectedIconOption,
                    ]}
                  >
                    <AppText style={styles.iconEmoji}>{emoji}</AppText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.privateRow}>
              <View style={styles.lockIcon}>
                <LockKeyhole size={17} color={colors.primaryDark} />
              </View>

              <View style={styles.privateText}>
                <AppText variant="label">Private Group</AppText>
                <AppText variant="caption" secondary>
                  Only people with an invite can join
                </AppText>
              </View>

              <CustomSwitch value={isPrivate} onValueChange={setIsPrivate} />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleCreateGroupPress}
              style={styles.submitButton}
            >
              <AppText variant="button" color="white">
                Create Group
              </AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateGroupModal;

const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.48)',
      justifyContent: 'flex-end',
    },

    modalKeyboardContainer: {
      width: '100%',
      justifyContent: 'flex-end',
    },

    bottomSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
    },

    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.md,
    },

    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },

    closeButton: {
      width: 34,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    fieldLabel: {
      marginBottom: spacing.xs,
    },

    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },

    iconOption: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    selectedIconOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    iconEmoji: {
      fontSize: 22,
    },

    privateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },

    lockIcon: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    privateText: {
      flex: 1,
    },

    submitButton: {
      minHeight: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });
