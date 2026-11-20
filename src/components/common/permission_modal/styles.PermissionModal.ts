import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    marginTop: spacing.xs,
  },
});
