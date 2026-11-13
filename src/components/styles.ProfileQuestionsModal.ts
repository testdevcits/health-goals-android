import { StyleSheet } from 'react-native';
import type { AppColors } from '../theme/colors';

const createStyles = (_colors?: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 24,
    },
    card: {
      width: '90%',
      maxWidth: 480,
      maxHeight: '90%',
      borderWidth: StyleSheet.hairlineWidth,
      elevation: 12,
      shadowColor: '#000',
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
      marginBottom: 16,
    },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    stepLabel: {
      marginTop: 8,
      marginBottom: 20,
    },
    options: {
      gap: 8,
    },
    dateLabel: {
      marginBottom: 6,
    },
    dateInput: {
      minHeight: 52,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    calendarOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    calendarCard: {
      width: '100%',
      maxWidth: 440,
      padding: 16,
      borderRadius: 20,
      elevation: 12,
    },
    calendarTitle: {
      marginBottom: 8,
    },
    option: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      borderWidth: 1,
      borderRadius: 12,
    },
    error: {
      marginTop: 2,
      marginBottom: 8,
      textAlign: 'center',
    },
    privacyNote: {
      marginTop: 14,
      marginBottom: 16,
      lineHeight: 18,
    },
    primaryAction: {
      width: '100%',
    },
    skipAction: {
      width: '100%',
      marginTop: 2,
    },
  });

export default createStyles;
