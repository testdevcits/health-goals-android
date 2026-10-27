// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { ChevronRight } from 'lucide-react-native';
// import { AppText, SectionHeader } from '../../../../components';
// import { useTheme } from '../../../../theme/useTheme';
// // import { createHomeStyles } from '../styles.Home';

// const DailySummary: React.FC<{ onViewDetails: () => void }> = ({
//   onViewDetails,
// }) => {
//   const { theme } = useTheme();
//   // const styles = createHomeStyles(theme);

//   return (
//     <>
//       <SectionHeader
//         sectionTitle="Today's Summary"
//         rightText="View Details"
//         onRightPress={onViewDetails}
//       />
//       <TouchableOpacity
//         onPress={onViewDetails}
//         activeOpacity={0.85}
//         style={styles.summaryCard}
//         accessibilityRole="button"
//         accessibilityLabel="Daily activity: 2,038 steps and 21 active minutes"
//       >
//         <View style={styles.summaryIconBox}>
//           <Text style={styles.summaryEmoji}>❤️</Text>
//         </View>
//         <View style={styles.summaryText}>
//           <AppText variant="subtitle2" bold mb={2}>
//             Daily Activity
//           </AppText>
//           <AppText variant="caption" secondary>
//             2,038 steps · 21 active mins
//           </AppText>
//         </View>
//         <ChevronRight size={18} color={theme.colors.textTertiary} />
//       </TouchableOpacity>
//     </>
//   );
// };

// export default DailySummary;
// const { theme } = useTheme();

// const { spacing, radius, colors } = theme;
// const styles = StyleSheet.create({
//   // ── Today's Summary card ───────────────────────
//   summaryCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: spacing.xl,
//     borderRadius: radius.lg,
//     padding: spacing.base,
//     backgroundColor: colors.surface,
//     gap: spacing.md,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   summaryIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: radius.md,
//     backgroundColor: '#FFE8E8',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   summaryEmoji: {
//     fontSize: 24,
//   },
//   summaryText: {
//     flex: 1,
//   },
// });

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Heart, Play, Footprints } from 'lucide-react-native';

import { AppText, SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';

const DailySummary: React.FC<{
  onViewDetails: () => void;
  navigation: any;
}> = ({ onViewDetails, navigation }) => {
  const { theme } = useTheme();
  const { spacing, radius, colors } = theme;

  const styles = StyleSheet.create({
    summaryContainer: {
      marginHorizontal: spacing.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    summaryCard: {
      flex: 1,
      minHeight: 135,
      padding: spacing.base,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    runningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: spacing.xs,
    },
    bottomIcon: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
    },
    playButton: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
      width: 24,
      height: 24,
      borderRadius: 17,
      backgroundColor: '#FF6268',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.summaryContainer}>
      <SectionHeader
        sectionTitle="Today's Summary"
        rightText="View Details"
        onRightPress={onViewDetails}
        customStyles={{ marginHorizontal: 0 }}
      />

      <View style={styles.summaryRow}>
        {/* Daily Activity */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={onViewDetails}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Daily activity, 2038 steps, 21 active minutes"
        >
          <AppText variant="subtitle2" bold>
            Daily Activity
          </AppText>

          <View style={styles.metricRow}>
            <AppText variant="body2" bold>
              2,038
            </AppText>
            <AppText variant="caption" secondary>
              {' '}
              steps
            </AppText>
          </View>

          <AppText variant="caption" secondary>
            21 active mins
          </AppText>

          <View style={styles.bottomIcon}>
            <Heart size={20} color="#FF454F" fill="#FF454F" />
          </View>
        </TouchableOpacity>

        {/* Running Activity */}
        <TouchableOpacity
          activeOpacity={0.85}
          accessibilityRole="button"
          onPress={() => navigation.navigate('WorkoutSession')}
          style={styles.summaryCard}
        >
          <View style={styles.runningHeader}>
            <AppText variant="subtitle2" secondary>
              Paused
            </AppText>
            <Footprints size={16} color="#F59E0B" />
          </View>

          <View style={styles.metricRow}>
            <AppText variant="body2" bold>
              0
            </AppText>
            <AppText variant="caption" secondary>
              {' '}
              kcal
            </AppText>
          </View>

          <AppText variant="caption" secondary>
            0.00 km · Running
          </AppText>

          <TouchableOpacity
            style={styles.playButton}
            onPress={onViewDetails}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View running details"
          >
            <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailySummary;
