import { StyleSheet } from 'react-native';
import { lightColors } from '../theme/colors';
import type { AppColors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const createStyles = (_colors?: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    card: {
      width: '90%',
      maxWidth: 480,
      maxHeight: '90%',
      borderWidth: StyleSheet.hairlineWidth,
      elevation: 12,
      shadowColor: _colors?.black ?? lightColors.black,
      shadowOpacity: 0.2,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    iconWrap: {
      width: 62,
      height: 62,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.base,
    },
    progressTrack: {
      height: spacing.s,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    stepLabel: {
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    options: {
      gap: spacing.sm,
    },
    dateLabel: {
      marginBottom: spacing.s,
    },
    dateInput: {
      minHeight: 52,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: spacing.ml,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    calendarOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    calendarCard: {
      width: '100%',
      maxWidth: 440,
      padding: spacing.base,
      borderRadius: 20,
      elevation: 12,
    },
    calendarTitle: {
      marginBottom: spacing.sm,
    },
    option: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.ml,
      borderWidth: 1,
      borderRadius: 12,
    },
    error: {
      marginTop: spacing.xxs,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    privacyNote: {
      marginTop: spacing.ml,
      marginBottom: spacing.base,
      lineHeight: 18,
    },
    primaryAction: {
      width: '100%',
    },
    skipAction: {
      width: '100%',
      marginTop: spacing.xxs,
    },
  });

export default createStyles;
