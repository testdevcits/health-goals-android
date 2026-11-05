import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

const styles = StyleSheet.create({
  detailContent: {
    padding: spacing.base,
  },

  detailHero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 180,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },

  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  includedCard: {
    padding: spacing.base,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  includedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  includedText: {
    flex: 1,
  },

  startButton: {
    minHeight: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  laterButton: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});

export default styles;
