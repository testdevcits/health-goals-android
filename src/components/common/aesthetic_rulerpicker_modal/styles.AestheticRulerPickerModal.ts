import { Dimensions, StyleSheet } from 'react-native';
import { AppColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const VERTICAL_RULER_HEIGHT = 380;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.ms,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    navTitle: {
      textAlign: 'center',
    },
    progressTrack: {
      height: spacing.xs,
      borderRadius: 2,
      marginHorizontal: spacing.xxxl,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },

    /* Height Layout */
    heightContentRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
    },
    heightLeftCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    heightValueBox: {
      marginBottom: spacing.base,
      alignSelf: 'flex-start',
      marginLeft: spacing.xl,
    },
    dashedLine: {
      position: 'absolute',
      top: 50,
      right: 0,
      width: 140,
      borderBottomWidth: 1.5,
      borderBottomColor: colors.border,
      borderStyle: 'dashed',
      zIndex: 1,
    },
    avatarWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    heightRulerWrap: {
      width: 90,
      height: VERTICAL_RULER_HEIGHT,
      position: 'relative',
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },
    redPointerHorizontal: {
      position: 'absolute',
      left: -spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10,
    },
    redDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.error,
    },
    redLineHorizontal: {
      width: 44,
      height: 2.5,
      backgroundColor: colors.error,
    },
    verticalTickRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    verticalTickLine: {
      marginRight: spacing.sm,
    },
    verticalTickLabel: {
      fontSize: typography.caption.fontSize,
    },

    /* Weight Layout */
    weightContentCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    weightAvatarWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    weightRulerWrap: {
      width: SCREEN_WIDTH,
      height: 80,
      position: 'relative',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      justifyContent: 'center',
    },
    redPointerVertical: {
      position: 'absolute',
      top: spacing.s,
      alignItems: 'center',
      zIndex: 10,
    },
    redLineVertical: {
      width: 2.5,
      height: 38,
      backgroundColor: colors.error,
    },
    horizontalTickCol: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: spacing.sm,
    },
    horizontalTickLine: {
      marginBottom: spacing.s,
    },
    horizontalTickLabel: {
      fontSize: typography.overline.fontSize,
    },
    weightValueBox: {
      marginTop: spacing.xl,
      alignItems: 'center',
    },

    /* Bottom Actions */
    bottomBar: {
      paddingVertical: spacing.md,
    },
    continueButton: {
      width: '100%',
      paddingVertical: spacing.ml,
    },
  });
