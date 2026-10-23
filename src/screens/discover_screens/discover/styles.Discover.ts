import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E7ECF1',
  },

  statusRow: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },

  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
  },

  headerTitle: {
    flex: 1,
    minWidth: 0,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#398FE2',
  },

  scrollContent: {
    padding: spacing.base,
  },

  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  programCard: {
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    minHeight: 114,
    justifyContent: 'center',
  },

  programDescription: {
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
  },

  programButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
  },

  recommendationCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },

  recommendationAccent: {
    width: 4,
    backgroundColor: '#00C6A2',
  },

  recommendationContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },

  recommendationHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },

  tag: {
    backgroundColor: '#E0FAF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },

  recommendationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },

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
    shadowColor: '#000000',
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
