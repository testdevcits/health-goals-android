import React, { memo } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import { AppText } from '../../../../components';

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

export const CreateChallengeModal: React.FC<Props> = memo(({
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
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    statusBarTranslucent
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalKeyboardContainer}
      >
        <View style={[styles.bottomSheet, { paddingBottom: Math.max(bottomInset, spacing.base) }]}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <AppText variant="h3">New Group Challenge</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          <AppText variant="caption" secondary>Challenge Name</AppText>
          <TextInput
            value={challengeName}
            onChangeText={onChangeName}
            placeholder="e.g. Weekend Step Showdown"
            placeholderTextColor={colors.inputPlaceholder}
            style={styles.modalInput}
            maxLength={60}
          />

          <AppText variant="caption" secondary>Goal</AppText>
          <TextInput
            value={challengeGoal}
            onChangeText={onChangeGoal}
            placeholder="e.g. 10,000 steps/day"
            placeholderTextColor={colors.inputPlaceholder}
            style={styles.modalInput}
            maxLength={100}
          />

          <View style={styles.modalOptionsRow}>
            <View style={styles.modalOption}>
              <AppText variant="caption" secondary>Duration</AppText>
              <Pressable onPress={onCycleDuration} style={styles.selectOption}>
                <AppText variant="body2">{duration}</AppText>
                <ChevronDown size={17} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.modalOption}>
              <AppText variant="caption" secondary>Reward</AppText>
              <Pressable onPress={onCycleReward} style={styles.selectOption}>
                <AppText variant="body2">{reward}</AppText>
                <ChevronDown size={17} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onSubmit}
            style={styles.submitChallengeButton}
          >
            <AppText variant="button" color="white">Create Challenge</AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
));
