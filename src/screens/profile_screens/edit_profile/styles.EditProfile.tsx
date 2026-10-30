import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) => StyleSheet.create({
  form: { padding: 16 },
  profileImageContainer: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    position: 'relative',
  },

  profileImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.surfaceElevated,
  },

  cameraButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
  },
  twoColumns: { flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  field: { marginBottom: 16 },
  saveButton: { width: '100%', borderRadius: 14, marginTop: 2 },
});

export default createStyles;
