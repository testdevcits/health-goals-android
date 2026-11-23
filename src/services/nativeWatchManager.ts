import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { VitalityWatchManager } = NativeModules;

const watchEmitter =
  VitalityWatchManager && Platform.OS === 'android'
    ? new NativeEventEmitter(VitalityWatchManager)
    : null;

export interface NativeWatchTelemetry {
  isConnected: boolean;
  macAddress: string;
  deviceName: string;
  batteryLevel: number;
  liveHeartRate: number;
  steps: number;
  calories: number;
  distanceKm: number;
  timestamp: number;
}

export interface NativeWatchState {
  state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  isConnected: boolean;
  macAddress: string;
  deviceName: string;
}

export const isNativeWatchAvailable =
  Platform.OS === 'android' && Boolean(VitalityWatchManager);

export const connectNativeWatch = async (
  macAddress: string,
): Promise<boolean> => {
  if (Platform.OS !== 'android' || !VitalityWatchManager) return false;
  try {
    const res = await VitalityWatchManager.connectWatch(macAddress);
    return Boolean(res?.success);
  } catch (err) {
    console.warn('[NativeWatch] Connect error:', err);
    return false;
  }
};

export const disconnectNativeWatch = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !VitalityWatchManager) return false;
  try {
    return await VitalityWatchManager.disconnectWatch();
  } catch {
    return false;
  }
};

export const getNativeWatchTelemetry =
  async (): Promise<NativeWatchTelemetry | null> => {
    if (Platform.OS !== 'android' || !VitalityWatchManager) return null;
    try {
      return await VitalityWatchManager.getLatestTelemetry();
    } catch {
      return null;
    }
  };

export const subscribeToNativeWatchTelemetry = (
  callback: (telemetry: NativeWatchTelemetry) => void,
) => {
  if (!watchEmitter) return { remove: () => {} };
  return watchEmitter.addListener('VitalityWatchTelemetry', callback);
};

export const subscribeToNativeWatchState = (
  callback: (state: NativeWatchState) => void,
) => {
  if (!watchEmitter) return { remove: () => {} };
  return watchEmitter.addListener('VitalityWatchState', callback);
};
