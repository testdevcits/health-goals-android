import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AppButton, AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { localDateKey } from '../../../../utils/healthDates';
import createStyles from '../styles.HealthReport';

interface ReportDatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  draftFrom: string;
  setDraftFrom: (date: string) => void;
  draftTo: string;
  setDraftTo: (date: string) => void;
  selectingEnd: boolean;
  setSelectingEnd: (selecting: boolean) => void;
  markedDates: Record<string, any>;
  onApply: () => void;
  maxDate?: string;
  currentDate?: string;
}

export const ReportDatePickerModal: React.FC<ReportDatePickerModalProps> = ({
  visible,
  onClose,
  draftFrom,
  setDraftFrom,
  draftTo,
  setDraftTo,
  selectingEnd,
  setSelectingEnd,
  markedDates,
  onApply,
  maxDate,
  currentDate,
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
      <View
        style={[styles.calendarOverlay, { backgroundColor: colors.overlay }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close date range picker"
        />
        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <AppText variant="subtitle2" bold style={styles.calendarTitle}>
            Choose report period
          </AppText>
          <AppText variant="caption" secondary style={styles.calendarHint}>
            {selectingEnd
              ? 'Select an end date'
              : 'Select a start date; then choose an end date'}
          </AppText>
          <Calendar
            current={currentDate}
            maxDate={maxDate || localDateKey(new Date())}
            markingType="period"
            markedDates={markedDates}
            onDayPress={day => {
              if (!selectingEnd) {
                setDraftFrom(day.dateString);
                setDraftTo('');
                setSelectingEnd(true);
              } else if (day.dateString < draftFrom) {
                setDraftFrom(day.dateString);
                setDraftTo('');
              } else {
                setDraftTo(day.dateString);
                setSelectingEnd(false);
              }
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
          <View style={styles.calendarActions}>
            <AppButton
              title="Cancel"
              variant="ghost"
              onPress={onClose}
              style={styles.calendarAction}
            />
            <AppButton
              title="Apply"
              onPress={onApply}
              disabled={!draftFrom || !draftTo}
              style={styles.calendarAction}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
