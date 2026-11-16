import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AppButton, AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { showAppToast } from '../../../../utils/appToast';
import createStyles from '../styles.EditProfile';
import {
  calendarStringToBirthDate,
  getMaxBirthDateCalendarString,
  isAtLeast18,
} from '../useEditProfile';

interface BirthDateCalendarModalProps {
  visible: boolean;
  selectedBirthDate?: string | null;
  onSelectBirthDate: (birthDate: string) => void;
  onClose: () => void;
}

export const BirthDateCalendarModal: React.FC<BirthDateCalendarModalProps> = ({
  visible,
  selectedBirthDate,
  onSelectBirthDate,
  onClose,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.calendarOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close date picker"
        />
        <View
          style={[styles.calendarCard, { backgroundColor: colors.surface }]}
        >
          <AppText variant="h3" style={styles.calendarTitle}>
            Date of Birth
          </AppText>
          <Calendar
            current={selectedBirthDate || getMaxBirthDateCalendarString()}
            maxDate={getMaxBirthDateCalendarString()}
            minDate="1900-01-01"
            markedDates={{
              ...(selectedBirthDate
                ? {
                    [selectedBirthDate]: {
                      selected: true,
                      selectedColor: colors.primary,
                    },
                  }
                : {}),
            }}
            onDayPress={day => {
              const formatted = calendarStringToBirthDate(day.dateString);
              if (!isAtLeast18(formatted)) {
                showAppToast(
                  'error',
                  'Invalid date of birth',
                  'You must be at least 18 years old.',
                );
                return;
              }
              onSelectBirthDate(formatted);
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
            enableSwipeMonths
          />
          <AppButton
            title="Close"
            variant="outline"
            onPress={onClose}
            style={styles.calendarCloseButton}
          />
        </View>
      </View>
    </Modal>
  );
};
