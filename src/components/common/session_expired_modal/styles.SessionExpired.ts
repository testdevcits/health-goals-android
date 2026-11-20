import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 12,
  },
  iconContainer: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    maxWidth: 300,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHeight: {
    minHeight: 50,
  },
});
