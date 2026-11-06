import storage from "./mmkv";

 
export const storageService = {
  // Save string
  setString: (key: string, value: string) => {
    storage.set(key, value);
  },

  // Get string
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  // Save object
  setObject: (key: string, value: object) => {
    storage.set(key, JSON.stringify(value));
  },

  // Get object
  getObject: <T>(key: string): T | null => {
    const value = storage.getString(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  // Save boolean
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value);
  },

  // Get boolean
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  // Save number
  setNumber: (key: string, value: number) => {
    storage.set(key, value);
  },

  // Get number
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  // Remove specific key
  remove: (key: string) => {
    storage.remove(key);
  },

  // Clear all stored keys
  clearAll: () => {
    storage.clearAll();
  },
};