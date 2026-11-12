import React, { memo, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppInput, AppText, CustomSwitch } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from './styles.CreateGroupMOdal';
import AppIcon from '../../../../assets/appicon/AppIcon';

// const groupIcons = ['🚶', '🏃', '🚴', '💪', '🧘', '🏆', '🌳', '❤️'];

const groupIcons = ['🏃', '🚶', '🧘', '💪', '🚴', '🏋️', '🥗', '🏊'];

interface CreateGroupModalProps {
  createModalVisible: boolean;
  setCreateModalVisible: (visible: boolean) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  groupDescription: string;
  setGroupDescription: (description: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  createLoading: boolean;
  handleCreateGroup: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  createModalVisible,
  setCreateModalVisible,
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
  selectedIcon,
  setSelectedIcon,
  isPrivate,
  setIsPrivate,
  createLoading,
  handleCreateGroup,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();
  const [groupNameError, setGroupNameError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
              contentContainerStyle={styles.sheetScrollContent}
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
                  <AppIcon name="X" size={19} color={colors.textPrimary} />
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
                Description (optional)
              </AppText>
              <AppInput
                value={groupDescription}
                onChangeText={setGroupDescription}
                placeholder="What is this group about?"
                placeholderTextColor={colors.inputPlaceholder}
                maxLength={240}
                multiline
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
                  <AppIcon
                    name="LockKeyhole"
                    size={17}
                    color={colors.primaryDark}
                  />
                </View>

                <View style={styles.privateText}>
                  <AppText variant="label">Private Group</AppText>
                  <AppText variant="caption" secondary>
                    Only people with an invite can join
                  </AppText>
                </View>

                <CustomSwitch value={isPrivate} onValueChange={setIsPrivate} />
              </View>
              <AppText variant="caption" secondary style={styles.capacityNote}>
                Groups can have up to 10 members, including their creator.
              </AppText>
 
              <AppButton
                loading={createLoading}
                disabled={createLoading}
                title="Create Group"
                onPress={handleCreateGroupPress}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default memo(CreateGroupModal);
