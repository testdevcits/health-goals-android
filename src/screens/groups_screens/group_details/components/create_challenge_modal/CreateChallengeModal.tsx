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
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { AppButton, AppInput, AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import {
  ChallengeOverviewCard,
  DurationSelector,
  GoalPresetsSelector,
  METRIC_TYPE_OPTIONS,
  MetricTypeOption,
  MetricTypeSelector,
  RewardPointsSelector,
} from './components';
import createChallengeModalStyles from './styles.CreateChallengeModal';

export type { MetricTypeOption };
export { METRIC_TYPE_OPTIONS };

interface Props {
  visible: boolean;
  challengeName: string;
  challengeDescription?: string;
  challengeGoal: string;
  metricType?: string;
  duration: string;
  rewardPoints?: string;
  bottomInset: number;
  loading?: boolean;
  onClose: () => void;
  onChangeName: (v: string) => void;
  onChangeDescription?: (v: string) => void;
  onChangeGoal: (v: string) => void;
  onChangeMetricType?: (v: string) => void;
  onChangeRewardPoints?: (v: string) => void;
  onCycleDuration: () => void;
  onSelectDuration?: (v: string) => void;
  onSubmit: () => void;
}

export const CreateChallengeModal: React.FC<Props> = memo(
  ({
    visible,
    challengeName,
    challengeDescription = '',
    challengeGoal,
    metricType = 'steps',
    duration,
    rewardPoints = '0',
    bottomInset,
    loading = false,
    onClose,
    onChangeName,
    onChangeDescription,
    onChangeGoal,
    onChangeMetricType,
    onChangeRewardPoints,
    onCycleDuration,
    onSelectDuration,
    onSubmit,
  }) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = theme;
    const styles = createChallengeModalStyles(colors, spacing, radius);

    const [nameError, setNameError] = useState('');
    const [goalError, setGoalError] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const currentMetric =
      METRIC_TYPE_OPTIONS.find(m => m.id === metricType) ||
      METRIC_TYPE_OPTIONS[0];

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

    const validateName = (value: string): boolean => {
      const name = value.trim();

      if (!name) {
        setNameError('Challenge title is required');
        return false;
      }

      if (name.length < 3) {
        setNameError('Title must be at least 3 characters');
        return false;
      }

      if (name.length > 60) {
        setNameError('Title cannot exceed 60 characters');
        return false;
      }

      setNameError('');
      return true;
    };

    const validateGoal = (value: string): boolean => {
      const goal = value.trim();

      if (!goal) {
        setGoalError(`Target ${currentMetric.label.toLowerCase()} is required`);
        return false;
      }

      const num = Number(goal.replace(/[^0-9.]/g, ''));
      if (!Number.isFinite(num) || num < 1) {
        setGoalError(`Enter a valid target (at least 1 ${currentMetric.unit})`);
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
      if (loading) return;
      setNameError('');
      setGoalError('');
      onClose();
    };

    const handleSelectMetric = (metric: MetricTypeOption) => {
      onChangeMetricType?.(metric.id);
      if (!challengeGoal || currentMetric.presets.includes(challengeGoal)) {
        onChangeGoal(metric.defaultGoal);
      }
      if (goalError) setGoalError('');
    };

    const handleSelectPreset = (preset: string) => {
      onChangeGoal(preset);
      if (goalError) setGoalError('');
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
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            disabled={loading}
            accessibilityLabel="Close create challenge sheet"
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
                      : Math.max(bottomInset, spacing.base),
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
                  <AppText variant="h3">New Group Challenge</AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    onPress={handleClose}
                    disabled={loading}
                    style={styles.closeButton}
                  >
                    <AppIcon name="X" size={19} color={colors.textPrimary} />
                  </Pressable>
                </View>

                {/* Metric Type Field */}
                <MetricTypeSelector
                  selectedMetricId={metricType}
                  onSelectMetric={handleSelectMetric}
                />

                {/* Challenge Title */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Challenge Title *
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
                  returnKeyType="next"
                  error={nameError}
                />

                {/* Challenge Description */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Description (optional)
                </AppText>
                <AppInput
                  value={challengeDescription}
                  onChangeText={text => onChangeDescription?.(text)}
                  placeholder="What is this challenge about? Inspire your team!"
                  placeholderTextColor={colors.inputPlaceholder}
                  maxLength={200}
                  multiline
                />

                {/* Target Value Goal */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Target {currentMetric.label} ({currentMetric.unit}) *
                </AppText>
                <AppInput
                  value={challengeGoal}
                  onChangeText={(text: string) => {
                    onChangeGoal(text);
                    if (goalError) validateGoal(text);
                  }}
                  placeholder={`e.g. ${currentMetric.defaultGoal}`}
                  placeholderTextColor={colors.inputPlaceholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  returnKeyType="done"
                  error={goalError}
                />

                {/* Target Quick Presets */}
                <GoalPresetsSelector
                  currentMetric={currentMetric}
                  selectedGoal={challengeGoal}
                  onSelectPreset={handleSelectPreset}
                />

                {/* Challenge Duration */}
                <DurationSelector
                  duration={duration}
                  onSelectDuration={onSelectDuration}
                  onCycleDuration={onCycleDuration}
                />

                {/* Reward Points */}
                <RewardPointsSelector
                  rewardPoints={rewardPoints}
                  onChangeRewardPoints={onChangeRewardPoints}
                />

                {/* Challenge Summary Preview Card */}
                <ChallengeOverviewCard
                  currentMetric={currentMetric}
                  challengeGoal={challengeGoal}
                  duration={duration}
                  rewardPoints={rewardPoints}
                />

                {/* Submit Button */}
                <AppButton
                  title="Create Challenge"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  style={styles.submitButton}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  },
);
