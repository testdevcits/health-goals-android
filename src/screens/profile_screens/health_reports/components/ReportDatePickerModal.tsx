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
        <View
          style={[styles.calendarCard, { backgroundColor: colors.surface }]}
        >
          <AppText variant="subtitle2" bold style={styles.calendarTitle}>
            Choose report period
          </AppText>
          <View
            style={[
              styles.calendarPeriodBadge,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <View>
              <AppText variant="caption" bold primary>
                {draftFrom && draftTo
                  ? `${draftFrom} – ${draftTo}`
                  : draftFrom || 'No date selected'}
              </AppText>
              <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                {draftFrom && draftTo
                  ? `${
                      Math.round(
                        (new Date(`${draftTo}T00:00:00Z`).getTime() -
                          new Date(`${draftFrom}T00:00:00Z`).getTime()) /
                          86400000,
                      ) + 1
                    } days selected`
                  : 'Tap a start date to auto-fill 7 days'}
              </AppText>
            </View>
            {draftFrom ? (
              <Pressable
                onPress={() => setSelectingEnd(!selectingEnd)}
                style={[
                  styles.calendarPresetChip,
                  {
                    borderColor: selectingEnd
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selectingEnd
                      ? colors.primaryLight
                      : colors.surface,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  bold={selectingEnd}
                  color={selectingEnd ? 'primary' : 'textSecondary'}
                  style={{ fontSize: 11 }}
                >
                  {selectingEnd ? 'Cancel Custom' : 'Custom End'}
                </AppText>
              </Pressable>
            ) : null}
          </View>
          <Calendar
            current={currentDate}
            maxDate={maxDate || localDateKey(new Date())}
            markingType="period"
            markedDates={markedDates}
            onDayPress={day => {
              const maxDateStr = maxDate || localDateKey(new Date());

              if (selectingEnd && draftFrom && day.dateString >= draftFrom) {
                setDraftTo(day.dateString);
                setSelectingEnd(false);
              } else {
                const [y, m, d] = day.dateString.split('-').map(Number);
                const start = new Date(Date.UTC(y, m - 1, d));
                start.setUTCDate(start.getUTCDate() + 6);
                const autoEndStr = start.toISOString().slice(0, 10);
                const finalEnd =
                  autoEndStr > maxDateStr ? maxDateStr : autoEndStr;

                setDraftFrom(day.dateString);
                setDraftTo(finalEnd);
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
