import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AppButton from '../AppButton';
import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import createStyles from '../styles.ProfileQuestionsModal';
import {
  calendarKeyToDateAnswer,
  dateAnswerToCalendarKey,
  maxBirthDateCalendarKey,
} from './useProfileQuestions';

interface QuestionDatePickerModalProps {
  visible: boolean;
  answer: string;
  onSelectDate: (formattedDate: string) => void;
  onClose: () => void;
}

export const QuestionDatePickerModal: React.FC<
  QuestionDatePickerModalProps
> = ({ visible, answer, onSelectDate, onClose }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const selectedCalendarKey = dateAnswerToCalendarKey(answer);
  const maxDate = maxBirthDateCalendarKey();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[styles.calendarOverlay, { backgroundColor: colors.overlay }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close date picker"
        />
        <View
          style={[styles.calendarCard, { backgroundColor: colors.surface }]}
        >
          <AppText variant="subtitle2" bold style={styles.calendarTitle}>
            Choose date of birth
          </AppText>
          <Calendar
            current={selectedCalendarKey || maxDate}
            maxDate={maxDate}
            minDate="1900-01-01"
            markedDates={
              selectedCalendarKey
                ? {
                    [selectedCalendarKey]: {
                      selected: true,
                      selectedColor: colors.primary,
                    },
                  }
                : {}
            }
            onDayPress={day => {
              onSelectDate(calendarKeyToDateAnswer(day.dateString));
              onClose();
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
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};
