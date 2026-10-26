import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    marginLeft: 4,
    marginBottom: 8,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '65%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
});

export default styles;
