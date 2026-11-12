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
import { AppButton, AppInput, AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import createChallengeModalStyles from './styles.CreateChallengeModal';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { DURATION_OPTIONS } from '../../constants';

export interface MetricTypeOption {
  id: string;
  label: string;
  icon: 'Footprints' | 'MapPin' | 'HeartPulse' | 'Clock';
  unit: string;
  defaultGoal: string;
  presets: string[];
}

export const METRIC_TYPE_OPTIONS: MetricTypeOption[] = [
  {
    id: 'steps',
    label: 'Steps',
    icon: 'Footprints',
    unit: 'steps',
    defaultGoal: '10000',
    presets: ['5000', '10000', '15000', '20000'],
  },
  {
    id: 'distance',
    label: 'Distance',
    icon: 'MapPin',
    unit: 'km',
    defaultGoal: '5',
    presets: ['3', '5', '10', '21'],
  },
  {
    id: 'calories',
    label: 'Calories',
    icon: 'HeartPulse',
    unit: 'kcal',
    defaultGoal: '500',
    presets: ['300', '500', '750', '1000'],
  },
  {
    id: 'active_minutes',
    label: 'Active Mins',
    icon: 'Clock',
    unit: 'mins',
    defaultGoal: '30',
    presets: ['30', '45', '60', '90'],
  },
];

const REWARD_PRESETS = ['0', '50', '100', '250'];

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

    const days = Number.parseInt(duration, 10) || 7;
    const endsDate = new Date(Date.now() + days * 86400000);
    const endsDateFormatted = endsDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const parsedTarget = Number(challengeGoal.replace(/[^0-9.]/g, '')) || 0;
    const parsedReward = Number(rewardPoints) || 0;

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

                {/* Metric Type Field (metricType) */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Metric Type (metricType) *
                </AppText>
                <View style={styles.metricPillsRow}>
                  {METRIC_TYPE_OPTIONS.map(metric => {
                    const isSelected = (metricType || 'steps') === metric.id;
                    return (
                      <Pressable
                        key={metric.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${metric.label} metric`}
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => {
                          onChangeMetricType?.(metric.id);
                          if (!challengeGoal || currentMetric.presets.includes(challengeGoal)) {
                            onChangeGoal(metric.defaultGoal);
                          }
                          if (goalError) setGoalError('');
                        }}
                        style={[
                          styles.metricPill,
                          isSelected && styles.selectedMetricPill,
                        ]}
                      >
                        <AppIcon
                          name={metric.icon}
                          size={15}
                          color={
                            isSelected ? colors.primary : colors.textSecondary
                          }
                        />
                        <AppText
                          variant="caption"
                          bold={isSelected}
                          primary={isSelected}
                          secondary={!isSelected}
                        >
                          {metric.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Challenge Title (title) */}
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

                {/* Challenge Description (description) */}
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

                {/* Target Value Goal (targetValue) */}
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
                <View style={styles.presetsRow}>
                  {currentMetric.presets.map(preset => {
                    const isSelected = challengeGoal === preset;
                    return (
                      <Pressable
                        key={preset}
                        onPress={() => {
                          onChangeGoal(preset);
                          if (goalError) setGoalError('');
                        }}
                        style={[
                          styles.presetChip,
                          isSelected && styles.selectedPresetChip,
                        ]}
                      >
                        <AppText
                          variant="caption"
                          primary={isSelected}
                          secondary={!isSelected}
                          bold={isSelected}
                        >
                          {Number(preset).toLocaleString()} {currentMetric.unit}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Challenge Duration (endsAt) */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Challenge Duration
                </AppText>
                <View style={styles.durationPillsRow}>
                  {DURATION_OPTIONS.map(opt => {
                    const isSelected = duration === opt;
                    return (
                      <Pressable
                        key={opt}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${opt} duration`}
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => {
                          if (onSelectDuration) {
                            onSelectDuration(opt);
                          } else {
                            onCycleDuration();
                          }
                        }}
                        style={[
                          styles.durationPill,
                          isSelected && styles.selectedDurationPill,
                        ]}
                      >
                        <AppIcon
                          name="Clock"
                          size={14}
                          color={
                            isSelected ? colors.primary : colors.textSecondary
                          }
                        />
                        <AppText
                          variant="caption"
                          bold={isSelected}
                          primary={isSelected}
                          secondary={!isSelected}
                        >
                          {opt}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
                <AppText variant="caption" secondary style={styles.durationHelper}>
                  Starts today, finishes on {endsDateFormatted}
                </AppText>

                {/* Reward Points (rewardPoints) */}
                <AppText variant="label" secondary style={styles.fieldLabel}>
                  Reward Points (Optional)
                </AppText>
                <AppInput
                  value={rewardPoints}
                  onChangeText={text =>
                    onChangeRewardPoints?.(text.replace(/\D/g, ''))
                  }
                  placeholder="0"
                  placeholderTextColor={colors.inputPlaceholder}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                {/* Reward Quick Presets */}
                <View style={styles.presetsRow}>
                  {REWARD_PRESETS.map(preset => {
                    const isSelected = rewardPoints === preset;
                    return (
                      <Pressable
                        key={preset}
                        onPress={() => onChangeRewardPoints?.(preset)}
                        style={[
                          styles.presetChip,
                          isSelected && styles.selectedPresetChip,
                        ]}
                      >
                        <AppText
                          variant="caption"
                          primary={isSelected}
                          secondary={!isSelected}
                          bold={isSelected}
                        >
                          {preset === '0' ? 'No bonus' : `+${preset} pts`}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Challenge Summary Preview Card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <AppIcon name="Trophy" size={17} color={colors.primary} />
                    <AppText variant="subtitle2" bold>
                      Challenge Overview
                    </AppText>
                  </View>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <AppText style={styles.summaryItemLabel}>
                        Metric Type
                      </AppText>
                      <AppText style={styles.summaryItemValue}>
                        {currentMetric.label}
                      </AppText>
                    </View>
                    <View style={styles.summaryItem}>
                      <AppText style={styles.summaryItemLabel}>
                        Target Goal
                      </AppText>
                      <AppText style={styles.summaryItemValue}>
                        {parsedTarget > 0
                          ? `${parsedTarget.toLocaleString()} ${currentMetric.unit}`
                          : '—'}
                      </AppText>
                    </View>
                    <View style={styles.summaryItem}>
                      <AppText style={styles.summaryItemLabel}>
                        Duration
                      </AppText>
                      <AppText style={styles.summaryItemValue}>
                        {duration}
                      </AppText>
                    </View>
                    <View style={styles.summaryItem}>
                      <AppText style={styles.summaryItemLabel}>
                        Bonus Reward
                      </AppText>
                      <AppText style={styles.summaryItemValue}>
                        {parsedReward > 0 ? `${parsedReward} pts` : 'None'}
                      </AppText>
                    </View>
                  </View>
                </View>

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
