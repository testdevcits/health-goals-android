import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: spacing.md,
    maxHeight: '55%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
