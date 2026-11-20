import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppIcon from '../../../assets/appicon/AppIcon';
import { useTheme } from '../../../theme/useTheme';
import AppButton from '../AppButton';
import AppInput from '../AppInput';
import AppText from '../AppText';
import {
  QuestionDatePickerModal,
  QuestionHeader,
  QuestionOptionsSelector,
  useProfileQuestions,
} from '../profile_questions';
import createStyles from './styles.ProfileQuestionsModal';

const ProfileQuestionsModal: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);

  const {
    visible,
    questions,
    questionIndex,
    currentQuestion,
    answer,
    setAnswer,
    saving,
    error,
    setError,
    datePickerVisible,
    setDatePickerVisible,
    dismiss,
    saveAndContinue,
  } = useProfileQuestions(enabled);

  if (!visible || !currentQuestion) return null;

  const step = questionIndex + 1;

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
              <QuestionHeader
                questionLabel={currentQuestion.label}
                step={step}
                totalQuestions={questions.length}
              />

              {currentQuestion.type === 'select' ? (
                <QuestionOptionsSelector
                  options={currentQuestion.options}
                  selectedAnswer={answer}
                  onSelectOption={option => {
                    setAnswer(option);
                    setError('');
                  }}
                />
              ) : currentQuestion.type === 'date' ? (
                <View>
                  <AppText variant="caption" secondary style={styles.dateLabel}>
                    {currentQuestion.required
                      ? 'Your answer'
                      : 'Your answer (optional)'}
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
                  label={
                    currentQuestion.required
                      ? 'Your answer'
                      : 'Your answer (optional)'
                  }
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

        <QuestionDatePickerModal
          visible={datePickerVisible}
          answer={answer}
          onSelectDate={formattedDate => {
            setAnswer(formattedDate);
            setError('');
          }}
          onClose={() => setDatePickerVisible(false)}
        />
      </Modal>
    </>
  );
};

export default ProfileQuestionsModal;
