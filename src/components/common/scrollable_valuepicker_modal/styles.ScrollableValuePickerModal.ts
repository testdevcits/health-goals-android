import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.ml,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  stepperButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  presetsContainer: {
    marginBottom: spacing.md,
  },
  presetsList: {
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  presetChip: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
  listContainer: {
    height: 200,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
  },
  footerRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
});
