import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    reportCard: { padding: 16, marginBottom: 12 },
    reportHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    tabs: {
      height: 38,
      borderRadius: 12,
      padding: 3,
      flexDirection: 'row',
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    chart: {
      height: 126,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      marginBottom: 12,
    },
    chartDay: { alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
    bar: { width: 19, borderRadius: 10 },
    chartPlaceholder: {
      height: 126,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    reportActions: { flexDirection: 'row', gap: 8 },
    reportButton: {
      flex: 1,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 11,
    },
  });

export default createStyles;
