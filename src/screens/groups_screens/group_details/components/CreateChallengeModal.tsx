import React, { memo, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import { AppInput, AppText } from '../../../../components';

interface Props {
  visible: boolean;
  challengeName: string;
  challengeGoal: string;
  duration: string;
  reward: string;
  bottomInset: number;
  colors: any;
  styles: any;
  spacing: any;
  onClose: () => void;
  onChangeName: (v: string) => void;
  onChangeGoal: (v: string) => void;
  onCycleDuration: () => void;
  onCycleReward: () => void;
  onSubmit: () => void;
}

export const CreateChallengeModal: React.FC<Props> = memo(
  ({
    visible,
    challengeName,
    challengeGoal,
    duration,
    reward,
    bottomInset,
    colors,
    styles,
    spacing,
    onClose,
    onChangeName,
    onChangeGoal,
    onCycleDuration,
    onCycleReward,
    onSubmit,
  }) => {
    const [nameError, setNameError] = useState('');
    const [goalError, setGoalError] = useState('');
    const validateName = (value: string): boolean => {
      const name = value.trim();

      if (!name) {
        setNameError('Challenge name is required');
        return false;
      }

      if (name.length < 3) {
        setNameError('Challenge name must be at least 3 characters');
        return false;
      }

      if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
        setNameError('Only letters, numbers, and spaces are allowed');
        return false;
      }

      setNameError('');
      return true;
    };

    const validateGoal = (value: string): boolean => {
      const goal = value.trim();

      if (!goal) {
        setGoalError('Goal is required');
        return false;
      }

      if (goal.length < 3) {
        setGoalError('Goal must be at least 3 characters');
        return false;
      }

      setGoalError('');
      return true;
    };

    const handleSubmit = () => {
      const isNameValid = validateName(challengeName);
      const isGoalValid = validateGoal(challengeGoal);

      if (!isNameValid || !isGoalValid) {
        return;
      }

      onChangeName(challengeName.trim());
      onChangeGoal(challengeGoal.trim());
      onSubmit();
    };
    const handleClose = () => {
      // Clear validation errors
      setNameError('');
      setGoalError('');

      // Clear all form values
      onChangeName('');
      onChangeGoal('');

      // Reset selections if needed
      // Add reset callbacks for duration and reward if their values are managed by the parent.

      // Close modal
      onClose();
    };
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboardContainer}
          >
            <View
              style={[
                styles.bottomSheet,
                { paddingBottom: Math.max(bottomInset, spacing.base) },
              ]}
            >
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <AppText variant="h3">New Group Challenge</AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <X size={18} color={colors.textPrimary} />
                </Pressable>
              </View>

              <AppText variant="caption" secondary>
                Challenge Name
              </AppText>
              <AppInput
                value={challengeName}
                onChangeText={(text: string) => {
                  onChangeName(text);
                  if (nameError) validateName(text);
                }}
                placeholder="e.g. Weekend Step Showdown"
                placeholderTextColor={colors.inputPlaceholder}
                maxLength={60}
                error={nameError}
              />

              <AppText variant="caption" secondary>
                Goal
              </AppText>
              <AppInput
                value={challengeGoal}
                onChangeText={(text: string) => {
                  onChangeGoal(text);
                  if (goalError) validateGoal(text);
                }}
                placeholder="e.g. 10,000 steps/day"
                placeholderTextColor={colors.inputPlaceholder}
                maxLength={100}
                error={goalError}
              />

              <View style={styles.modalOptionsRow}>
                <View style={styles.modalOption}>
                  <AppText variant="caption" secondary>
                    Duration
                  </AppText>
                  <Pressable
                    onPress={onCycleDuration}
                    style={styles.selectOption}
                  >
                    <AppText variant="body2">{duration}</AppText>
                    <ChevronDown size={17} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <View style={styles.modalOption}>
                  <AppText variant="caption" secondary>
                    Reward
                  </AppText>
                  <Pressable
                    onPress={onCycleReward}
                    style={styles.selectOption}
                  >
                    <AppText variant="body2">{reward}</AppText>
                    <ChevronDown size={17} color={colors.textSecondary} />
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleSubmit}
                style={styles.submitChallengeButton}
              >
                <AppText variant="button" color="white">
                  Create Challenge
                </AppText>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  },
);
