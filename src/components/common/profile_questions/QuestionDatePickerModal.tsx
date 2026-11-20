import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AppIcon from '../../../assets/appicon/AppIcon';
import AppButton from '../AppButton';
import AppText from '../AppText';
import { useTheme } from '../../../theme/useTheme';
import { spacing } from '../../../theme/spacing';
import createStyles from '../profile_questions_modal/styles.ProfileQuestionsModal';
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

const MIN_BIRTH_YEAR = 1920;

export const QuestionDatePickerModal: React.FC<
  QuestionDatePickerModalProps
> = ({ visible, answer, onSelectDate, onClose }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const selectedCalendarKey = dateAnswerToCalendarKey(answer);
  const maxDate = maxBirthDateCalendarKey();
  const maxYear = useMemo(() => {
    return Number(maxDate.split('-')[0]) || new Date().getFullYear() - 18;
  }, [maxDate]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= MIN_BIRTH_YEAR; y--) {
      list.push(y);
    }
    return list;
  }, [maxYear]);

  const [activeDate, setActiveDate] = useState<string>(
    selectedCalendarKey || maxDate,
  );
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setActiveDate(selectedCalendarKey || maxDate);
      setIsYearPickerOpen(false);
    }
  }, [visible, selectedCalendarKey, maxDate]);

  const currentYear = Number(activeDate.split('-')[0]) || maxYear;
  const currentMonthDay = activeDate.slice(4) || '-01-01';

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
          {/* Header row with Title and Year Selector Pill */}
          <View style={localStyles.headerRow}>
            <View>
              <AppText variant="subtitle2" bold style={styles.calendarTitle}>
                Choose date of birth
              </AppText>
              <AppText variant="caption" secondary>
                {isYearPickerOpen
                  ? 'Tap a year to jump directly'
                  : 'Pick your month & day'}
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change year"
              onPress={() => setIsYearPickerOpen(prev => !prev)}
              style={[
                localStyles.yearTogglePill,
                {
                  backgroundColor: isYearPickerOpen
                    ? colors.primary
                    : colors.backgroundSecondary,
                  borderColor: isYearPickerOpen
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <AppText
                variant="subtitle2"
                bold
                color={isYearPickerOpen ? 'textInverse' : 'primary'}
              >
                {currentYear}
              </AppText>
              <AppIcon
                name={isYearPickerOpen ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                color={isYearPickerOpen ? colors.textInverse : colors.primary}
              />
            </Pressable>
          </View>

          {isYearPickerOpen ? (
            /* Direct Year Grid Selector */
            <ScrollView
              style={localStyles.yearScrollContainer}
              contentContainerStyle={localStyles.yearGrid}
              showsVerticalScrollIndicator
            >
              {years.map(y => {
                const isSelected = y === currentYear;
                return (
                  <Pressable
                    key={y}
                    accessibilityRole="button"
                    accessibilityLabel={`Year ${y}`}
                    onPress={() => {
                      const newDate = `${y}${currentMonthDay}`;
                      setActiveDate(newDate);
                      setIsYearPickerOpen(false);
                    }}
                    style={[
                      localStyles.yearGridItem,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.backgroundSecondary,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="subtitle2"
                      bold={isSelected}
                      color={isSelected ? 'textInverse' : 'textPrimary'}
                    >
                      {y}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            /* Standard Day Calendar */
            <Calendar
              key={activeDate.slice(0, 7)}
              current={activeDate}
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
              onMonthChange={month => {
                setActiveDate(
                  `${month.year}-${String(month.month).padStart(2, '0')}-01`,
                );
              }}
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
              enableSwipeMonths
            />
          )}

          {isYearPickerOpen ? (
            <AppButton
              title="Back to Calendar"
              variant="ghost"
              onPress={() => setIsYearPickerOpen(false)}
            />
          ) : (
            <AppButton title="Cancel" variant="ghost" onPress={onClose} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  yearTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
  },
  yearScrollContainer: {
    maxHeight: 330,
    marginVertical: spacing.xs,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  yearGridItem: {
    width: '31%',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.ms,
    borderWidth: 1,
  },
});
