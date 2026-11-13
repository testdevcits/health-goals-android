import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Check, ChevronRight, UserRound } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import AppButton from './AppButton';
import AppInput from './AppInput';
import AppText from './AppText';
import { useTheme } from '../theme/useTheme';
import AppIcon from '../assets/appicon/AppIcon';
import { getCurrentUser } from '../services/profile';
import {
  fetchPendingProfileQuestions,
  ProfileQuestion,
  saveProfileAnswers,
} from '../services/profileQuestions';
import { apiErrorMessage } from '../services/api';
import { showAppToast } from '../utils/appToast';
import createStyles from './styles.ProfileQuestionsModal';

const isValidDateAnswer = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const dateAnswerToCalendarKey = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
};

const calendarKeyToDateAnswer = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

const getMaxBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

const maxBirthDateCalendarKey = () => {
  const max = getMaxBirthDate();
  return `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, '0')}-${String(max.getDate()).padStart(2, '0')}`;
};

const isAtLeast18 = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date <= getMaxBirthDate();
};

const ProfileQuestionsModal: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState<ProfileQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const checkedUserId = React.useRef<string | null>(null);
  const loadingRef = React.useRef(false);
  const reloadAfterLoadingRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const loadQuestionsRef = React.useRef<() => Promise<void>>(async () => { });
  const currentQuestion = questions[questionIndex];

  const loadQuestions = useCallback(async () => {
    if (!enabled || !focusedRef.current) return;
    if (loadingRef.current) {
      reloadAfterLoadingRef.current = true;
      return;
    }
    loadingRef.current = true;
    try {
      const user = await getCurrentUser();
      if (!focusedRef.current || !enabled) return;
      if (checkedUserId.current === user.id) return;
      const pendingQuestions = await fetchPendingProfileQuestions();
      if (!focusedRef.current || !enabled) return;
      checkedUserId.current = user.id;
      setUserId(user.id);
      setQuestions(pendingQuestions);
      setQuestionIndex(0);
      setAnswer('');
      setError('');
      setDatePickerVisible(false);
      setVisible(pendingQuestions.length > 0);
    } catch (cause) {
      if (focusedRef.current) {
        console.error('Unable to load pending profile questions:', cause);
        showAppToast(
          'error',
          'Could not load profile questions',
          apiErrorMessage(cause),
        );
      }
    } finally {
      loadingRef.current = false;
      if (reloadAfterLoadingRef.current) {
        reloadAfterLoadingRef.current = false;
        if (focusedRef.current) {
          loadQuestionsRef.current().catch(cause => {
            console.error('Unexpected profile-question loading failure:', cause);
          });
        }
      }
    }
  }, [enabled]);
  loadQuestionsRef.current = loadQuestions;

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      loadQuestions().catch(cause => {
        console.error('Unexpected profile-question loading failure:', cause);
      });
      return () => {
        focusedRef.current = false;
      };
    }, [loadQuestions]),
  );

  const dismiss = () => {
    if (userId) checkedUserId.current = userId;
    setVisible(false);
    setDatePickerVisible(false);
    setError('');
  };

  const validationError = useMemo(() => {
    if (!currentQuestion) return '';
    const trimmed = answer.trim();
    if (!trimmed) {
      return currentQuestion.required
        ? 'This answer is required.'
        : '';
    }
    if (
      currentQuestion.type === 'select' &&
      !currentQuestion.options.includes(trimmed)
    ) {
      return 'Select one of the available options.';
    }
    if (currentQuestion.type === 'number' && !Number.isFinite(Number(trimmed))) {
      return 'Enter a valid number.';
    }
    if (currentQuestion.type === 'date') {
      if (!isValidDateAnswer(trimmed)) {
        return 'Enter a valid date in DD/MM/YYYY format.';
      }
      if (!isAtLeast18(trimmed)) {
        return 'You must be at least 18 years old.';
      }
    }
    return '';
  }, [answer, currentQuestion]);

  const saveAndContinue = async () => {
    if (!currentQuestion || saving) return;
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmed = answer.trim();
    const value =
      trimmed.length === 0
        ? null
        : currentQuestion.type === 'number'
          ? Number(trimmed)
          : trimmed;
    setSaving(true);
    setError('');
    try {
      const pending =
        (await saveProfileAnswers({ [currentQuestion.key]: value })) ??
        (await fetchPendingProfileQuestions());
      const nextQuestions = pending.filter(
        question => question.key !== currentQuestion.key,
      );
      setQuestions(nextQuestions);
      setQuestionIndex(0);
      setAnswer('');
      setDatePickerVisible(false);
      if (nextQuestions.length === 0) {
        setVisible(false);
        showAppToast(
          'success',
          'Profile updated',
          'Your answers have been saved.',
        );
      }
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setSaving(false);
    }
  };

  if (!visible || !currentQuestion) return null;

  const step = questionIndex + 1;
  const progress = (step / questions.length) * 100;

  return (
    <>
      <Modal
        visible
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={dismiss}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
        >
          <View
            accessibilityViewIsModal
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.xxl,
                marginHorizontal: spacing.xl,
                padding: spacing.xl,
              },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: colors.primaryLight,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <UserRound size={28} color={colors.primary} />
              </View>
              <AppText variant="label" primary bold center mb={spacing.sm}>
                A LITTLE MORE ABOUT YOU
              </AppText>
              <AppText variant="h3" center bold mb={spacing.xs}>
                {currentQuestion.label}
              </AppText>
              <AppText variant="body2" secondary center mb={spacing.lg}>
                Your answer helps us personalize your wellness experience. You can
                skip for now and answer the remaining questions next time.
              </AppText>

              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: colors.surfaceElevated },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <AppText
                variant="caption"
                secondary
                center
                style={styles.stepLabel}
              >
                Question {step} of {questions.length}
              </AppText>

              {currentQuestion.type === 'select' ? (
                <View style={styles.options}>
                  {currentQuestion.options.map(option => {
                    const selected = answer === option;
                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        onPress={() => {
                          setAnswer(option);
                          setError('');
                        }}
                        style={[
                          styles.option,
                          {
                            backgroundColor: selected
                              ? colors.primaryLight
                              : colors.backgroundSecondary,
                            borderColor: selected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <AppText
                          variant="body2"
                          color={selected ? 'primary' : 'textPrimary'}
                          bold={selected}
                        >
                          {option}
                        </AppText>
                        {selected ? (
                          <Check size={18} color={colors.primary} />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : currentQuestion.type === 'date' ? (
                <View>
                  <AppText variant="caption" secondary style={styles.dateLabel}>
                    {currentQuestion.required ? 'Your answer' : 'Your answer (optional)'}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Choose date of birth"
                    onPress={() => setDatePickerVisible(true)}
                    style={[
                      styles.dateInput,
                      {
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: error ? colors.error : colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="body2"
                      color={answer ? 'textPrimary' : 'textTertiary'}
                    >
                      {answer || 'DD/MM/YYYY'}
                    </AppText>
                    <AppIcon name="Calendar" size={18} color={colors.primary} />
                  </Pressable>
                </View>
              ) : (
                <AppInput
                  label={currentQuestion.required ? 'Your answer' : 'Your answer (optional)'}
                  value={answer}
                  onChangeText={value => {
                    setAnswer(value);
                    setError('');
                  }}
                  placeholder={
                    currentQuestion.type === 'number'
                      ? 'Enter a number'
                      : 'Type your answer'
                  }
                  keyboardType={
                    currentQuestion.type === 'number'
                      ? 'numbers-and-punctuation'
                      : 'default'
                  }
                  autoCapitalize={
                    currentQuestion.type === 'text' ? 'sentences' : 'none'
                  }
                />
              )}

              {error ? (
                <AppText variant="caption" error style={styles.error}>
                  {error}
                </AppText>
              ) : null}
              <AppText
                variant="caption"
                secondary
                center
                style={styles.privacyNote}
              >
                Your answers are saved to your account profile.
              </AppText>
              <AppButton
                title={saving ? 'Saving…' : 'Save and continue'}
                onPress={saveAndContinue}
                loading={saving}
                rightIcon={
                  !saving ? (
                    <ChevronRight size={18} color={colors.textInverse} />
                  ) : undefined
                }
                style={styles.primaryAction}
              />
              <AppButton
                title="Skip for now"
                onPress={dismiss}
                disabled={saving}
                variant="ghost"
                style={styles.skipAction}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <Modal
          visible={datePickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDatePickerVisible(false)}
        >
          <View style={[styles.calendarOverlay, { backgroundColor: colors.overlay }]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setDatePickerVisible(false)}
              accessibilityLabel="Close date picker"
            />
            <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
              <AppText variant="subtitle2" bold style={styles.calendarTitle}>
                Choose date of birth
              </AppText>
              <Calendar
                current={dateAnswerToCalendarKey(answer) || maxBirthDateCalendarKey()}
                maxDate={maxBirthDateCalendarKey()}
                minDate="1900-01-01"
                markedDates={dateAnswerToCalendarKey(answer)
                  ? { [dateAnswerToCalendarKey(answer)!]: { selected: true, selectedColor: colors.primary } }
                  : {}}
                onDayPress={day => {
                  setAnswer(calendarKeyToDateAnswer(day.dateString));
                  setError('');
                  setDatePickerVisible(false);
                }}
                theme={{
                  backgroundColor: colors.surface,
                  calendarBackground: colors.surface,
                  textSectionTitleColor: colors.textSecondary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.white,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.textPrimary,
                  textDisabledColor: colors.textTertiary,
                  monthTextColor: colors.textPrimary,
                  arrowColor: colors.primary,
                }}
              />
              <AppButton
                title="Cancel"
                variant="ghost"
                onPress={() => setDatePickerVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </Modal>
    </>
  );
};

export default ProfileQuestionsModal;
