import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'vitality-storage',
});

export default storage;
