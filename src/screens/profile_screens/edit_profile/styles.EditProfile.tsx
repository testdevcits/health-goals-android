import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    backgroundColor: '#DDDDDD',
  },

  cameraButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  twoColumns: { flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  field: { marginBottom: 16 },
  saveButton: { width: '100%', borderRadius: 14, marginTop: 2 },
});

export default styles;
