import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    section: {
      marginBottom: 18,
    },
    sectionTitle: {
      marginLeft: 4,
      marginBottom: 8,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      paddingTop: 12,
      paddingHorizontal: 20,
      maxHeight: '65%',
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 8,
    },
    closeButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    option: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    cancelButton: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    continueButton: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: colors.info,
    },
  });

export default createStyles;
