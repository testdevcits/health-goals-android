import { BleManager, State as BluetoothState } from 'react-native-ble-plx';
import type { Device, Subscription } from 'react-native-ble-plx';
import type { Permission } from 'react-native-health-connect';
import { HEALTH_PERMISSIONS } from '../../../services/healthConnect';

export const SAVED_WATCH_KEY = 'vitality:connected_watch';
export const SAVED_WATCH_METRICS_KEY = 'vitality:saved_watch_metrics';

export interface WatchMetrics {
  batteryLevel: number | null;
  liveHeartRate: number | null;
  steps: number;
  calories: number;
  distanceKm: number;
  exerciseMinutes: number;
  lastSyncedAt: string;
  dataDate: string;
  isSyncing: boolean;
}

export const INITIAL_WATCH_METRICS: WatchMetrics = {
  batteryLevel: null,
  liveHeartRate: null,
  steps: 0,
  calories: 0,
  distanceKm: 0,
  exerciseMinutes: 0,
  lastSyncedAt: '',
  dataDate: '',
  isSyncing: false,
};

export type ConnectionState =
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'update-required'
  | 'error'
  | 'unsupported';

export interface SavedWatchInfo {
  id: string;
  name?: string | null;
  localName?: string | null;
}

const WATCH_KEYWORDS = [
  'watch',
  'band',
  'fit',
  'gear',
  'tracker',
  'wrist',
  'pulse',
  'garmin',
  'fitbit',
  'galaxy',
  'pixel',
  'apple',
  'amazfit',
  'huawei',
  'honor',
  'mi band',
  'noise',
  'fire-boltt',
  'boat',
  'titan',
  'fastrack',
  'polar',
  'whoop',
  'suunto',
  'coros',
  'withings',
  'fossil',
  'smartwatch',
];

const NON_WATCH_KEYWORDS = [
  'buds',
  'airpods',
  'headphone',
  'earphone',
  'headset',
  'speaker',
  'soundbar',
  'tv',
  'laptop',
  'macbook',
  'desktop',
  'keyboard',
  'mouse',
  'printer',
  'car',
  'audi',
  'bmw',
  'echo',
  'alexa',
  'nest',
  'roku',
];

const WEARABLE_SERVICE_UUIDS = [
  '180d', // Heart Rate
  '1814', // Running Speed & Cadence
  '1816', // Cycling
  '1826', // Fitness Machine
  '1805', // Current Time
  'fee0', // Mi Band / Amazfit
  'fee7',
];

export const isSmartWatchOrWearable = (device: Device): boolean => {
  const name = (device.name || device.localName || '').toLowerCase().trim();
  if (!name) return false;

  if (NON_WATCH_KEYWORDS.some(kw => name.includes(kw))) {
    return false;
  }

  if (WATCH_KEYWORDS.some(kw => name.includes(kw))) {
    return true;
  }

  if (device.serviceUUIDs && device.serviceUUIDs.length > 0) {
    const hasWearableService = device.serviceUUIDs.some(uuid =>
      WEARABLE_SERVICE_UUIDS.some(wearableId =>
        uuid.toLowerCase().includes(wearableId),
      ),
    );
    if (hasWearableService) return true;
  }

  return false;
};

export const decodeBase64ToBytes = (b64: string): number[] => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i);
    if (c === '=') break;
    const idx = chars.indexOf(c);
    if (idx >= 0) {
      buffer = (buffer << 6) | idx;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((buffer >> bits) & 0xff);
      }
    }
  }
  return bytes;
};

export const parsePedometerSteps = (bytes: number[]): number => {
  if (!bytes || bytes.length < 3) return 0;
  if (bytes.length >= 4) {
    const valLE =
      (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) >>> 0;
    if (valLE > 0 && valLE < 300000) return valLE;
    const valBE =
      ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    if (valBE > 0 && valBE < 300000) return valBE;
    const valFlag = (bytes[1] | (bytes[2] << 8) | (bytes[3] << 16)) >>> 0;
    if (valFlag > 0 && valFlag < 300000) return valFlag;
  } else if (bytes.length === 3) {
    const val3 = (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16)) >>> 0;
    if (val3 > 0 && val3 < 300000) return val3;
  }
  return 0;
};

export const matchingHealthPermissions = (
  permissions: Array<{ accessType: string; recordType: string }>,
): Permission[] =>
  HEALTH_PERMISSIONS.filter(requested =>
    permissions.some(
      granted =>
        granted.accessType === requested.accessType &&
        granted.recordType === requested.recordType,
    ),
  );

let sharedBleManager: BleManager | null = null;
export const getBleManager = () => {
  if (!sharedBleManager) {
    sharedBleManager = new BleManager();
  }
  return sharedBleManager;
};

export const waitForBluetoothPoweredOn = (
  manager: BleManager,
  timeoutMs = 8000,
): Promise<boolean> => {
  return new Promise(resolve => {
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let subscription: Subscription | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (pollInterval) clearInterval(pollInterval);
      if (subscription) subscription.remove();
    };

    manager
      .state()
      .then(state => {
        if (state === BluetoothState.PoweredOn) {
          cleanup();
          resolve(true);
        }
      })
      .catch(() => {});

    subscription = manager.onStateChange(state => {
      if (state === BluetoothState.PoweredOn) {
        cleanup();
        resolve(true);
      }
    }, true);

    pollInterval = setInterval(async () => {
      try {
        const state = await manager.state();
        if (state === BluetoothState.PoweredOn) {
          cleanup();
          resolve(true);
        }
      } catch {
        // ignore error during state check
      }
    }, 400);

    timeoutHandle = setTimeout(async () => {
      cleanup();
      try {
        const finalState = await manager.state();
        resolve(finalState === BluetoothState.PoweredOn);
      } catch {
        resolve(false);
      }
    }, timeoutMs);
  });
};
