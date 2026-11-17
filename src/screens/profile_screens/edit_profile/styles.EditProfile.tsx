import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundSecondary },
    form: { padding: spacing.base },
    profileImageContainer: {
      width: 80,
      height: 80,
      alignSelf: 'center',
      position: 'relative',
    },

    profileImage: {
      width: 80,
      height: 80,
      backgroundColor: colors.surfaceElevated,
    },

    cameraButton: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 3,
    },
    twoColumns: { flexDirection: 'row', gap: spacing.md },
    column: { flex: 1 },
    field: { marginBottom: spacing.base },
    pickerField: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.ml,
      borderWidth: 1.5,
      borderRadius: spacing.ms,
    },
    dateField: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.base,
      borderWidth: 1.5,
      borderRadius: spacing.ms,
    },
    calendarOverlay: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.lg,
      backgroundColor: colors.overlay,
    },
    calendarCard: {
      borderRadius: spacing.lg,
      padding: spacing.base,
      elevation: 8,
    },
    calendarTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    calendarCloseButton: {
      marginTop: spacing.md,
    },
    saveButton: { width: '100%', borderRadius: spacing.ml, marginTop: spacing.xxs },
  });

export default createStyles;
