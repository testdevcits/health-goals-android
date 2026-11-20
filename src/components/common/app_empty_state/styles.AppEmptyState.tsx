import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    maxWidth: 300,
    lineHeight: 22,
  },
  action: {
    minWidth: 140,
  },
});
