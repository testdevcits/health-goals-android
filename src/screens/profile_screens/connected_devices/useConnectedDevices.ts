import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  BleManager,
  ScanMode,
  State as BluetoothState,
} from 'react-native-ble-plx';
import type { Device, Subscription } from 'react-native-ble-plx';
import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  openHealthConnectSettings,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import type { Permission } from 'react-native-health-connect';
import {
  disableBackgroundHealthSync,
  enableBackgroundHealthSync,
  isBackgroundHealthSyncEnabled,
  requestBackgroundHealthReadPermission,
} from '../../../services/backgroundHealthSync';
import {
  HEALTH_PERMISSIONS,
  readLatestHeartRate,
  readTodayHealthData,
} from '../../../services/healthConnect';
import { syncRecentHealthData } from '../../../services/healthSync';
import { istDateKey } from '../../../utils/healthDates';
import {
  connectNativeWatch,
  disconnectNativeWatch,
  subscribeToNativeWatchTelemetry,
  isNativeWatchAvailable,
} from '../../../services/nativeWatchManager';

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

  // Exclude obvious non-wearable audio, TV, and PC accessories
  if (NON_WATCH_KEYWORDS.some(kw => name.includes(kw))) {
    return false;
  }

  // Check if name matches smartwatch or wearable keywords
  if (WATCH_KEYWORDS.some(kw => name.includes(kw))) {
    return true;
  }

  // Check if advertising standard wearable/health BLE service UUIDs
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

const decodeBase64ToBytes = (b64: string): number[] => {
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

const parsePedometerSteps = (bytes: number[]): number => {
  if (!bytes || bytes.length < 3) return 0;
  // 1. Standard 4-byte Little Endian
  if (bytes.length >= 4) {
    const valLE =
      (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) >>> 0;
    if (valLE > 0 && valLE < 300000) return valLE;
    // 2. 4-byte Big Endian
    const valBE =
      ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    if (valBE > 0 && valBE < 300000) return valBE;
    // 3. Command/flag prefix (bytes[0] = 0x01/0x02, bytes 1-3 = steps)
    const valFlag = (bytes[1] | (bytes[2] << 8) | (bytes[3] << 16)) >>> 0;
    if (valFlag > 0 && valFlag < 300000) return valFlag;
  } else if (bytes.length === 3) {
    const val3 = (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16)) >>> 0;
    if (val3 > 0 && val3 < 300000) return val3;
  }
  return 0;
};

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

const INITIAL_WATCH_METRICS: WatchMetrics = {
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

const matchingHealthPermissions = (
  permissions: Awaited<ReturnType<typeof requestPermission>>,
): Permission[] =>
  HEALTH_PERMISSIONS.filter(requested =>
    permissions.some(
      granted =>
        granted.accessType === requested.accessType &&
        granted.recordType === requested.recordType,
    ),
  );

const SAVED_WATCH_KEY = 'vitality:connected_watch';
const SAVED_WATCH_METRICS_KEY = 'vitality:saved_watch_metrics';

export interface SavedWatchInfo {
  id: string;
  name?: string | null;
  localName?: string | null;
}

let sharedBleManager: BleManager | null = null;
const getBleManager = () => {
  if (!sharedBleManager) {
    sharedBleManager = new BleManager();
  }
  return sharedBleManager;
};

const waitForBluetoothPoweredOn = (
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

let sharedConnectedDevice: Device | null = null;
let sharedSavedWatch: SavedWatchInfo | null = null;
let sharedWatchMetrics: WatchMetrics = INITIAL_WATCH_METRICS;
let sharedIsReconnecting = false;
const sharedWatchListeners = new Set<() => void>();
let sharedDisconnectSubscription: Subscription | null = null;
let sharedHrSubscription: Subscription | null = null;
let sharedBatterySubscription: Subscription | null = null;
let sharedStepSubscription: Subscription | null = null;
let sharedNativeTelemetrySub: { remove: () => void } | null = null;

const notifyWatchListeners = () => {
  sharedWatchListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.warn('Watch listener error:', e);
    }
  });
};

export default function useConnectedDevices(options?: { skipHealthConnectCheck?: boolean }) {
  const skipHealthConnect = options?.skipHealthConnectCheck ?? false;
  const bleManager = useMemo(() => getBleManager(), []);
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>(
    BluetoothState.Unknown,
  );
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDeviceState] = useState<Device | null>(
    sharedConnectedDevice,
  );
  const [savedWatch, setSavedWatch] = useState<SavedWatchInfo | null>(
    sharedSavedWatch,
  );
  const [isReconnecting, setIsReconnecting] = useState(sharedIsReconnecting);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );
  const [isScanning, setIsScanning] = useState(false);
  const [bleError, setBleError] = useState('');
  const [onlyWatches, setOnlyWatches] = useState(false);
  const [watchMetrics, setWatchMetricsState] =
    useState<WatchMetrics>(sharedWatchMetrics);

  useEffect(() => {
    let mounted = true;
    const loadStoredWatch = async () => {
      try {
        const [savedJson, metricsJson] = await Promise.all([
          AsyncStorage.getItem(SAVED_WATCH_KEY),
          AsyncStorage.getItem(SAVED_WATCH_METRICS_KEY),
        ]);
        if (savedJson && mounted) {
          const parsed: SavedWatchInfo = JSON.parse(savedJson);
          if (parsed?.id) {
            sharedSavedWatch = parsed;
            setSavedWatch(parsed);
          }
        }
        if (metricsJson && mounted) {
          const parsedMetrics = JSON.parse(metricsJson);
          if (parsedMetrics && typeof parsedMetrics === 'object') {
            const storedMetrics =
              parsedMetrics.dataDate === istDateKey(new Date())
                ? parsedMetrics
                : INITIAL_WATCH_METRICS;
            sharedWatchMetrics = {
              ...INITIAL_WATCH_METRICS,
              ...storedMetrics,
              isSyncing: false,
            };
            setWatchMetricsState(sharedWatchMetrics);
          }
        }
      } catch (err) {
        console.warn('Failed to load saved watch info:', err);
      }
    };
    void loadStoredWatch();

    const syncState = () => {
      setConnectedDeviceState(sharedConnectedDevice);
      setSavedWatch(sharedSavedWatch);
      setWatchMetricsState(sharedWatchMetrics);
      setIsReconnecting(sharedIsReconnecting);
    };
    sharedWatchListeners.add(syncState);
    syncState();
    return () => {
      mounted = false;
      sharedWatchListeners.delete(syncState);
    };
  }, []);

  const setConnectedDevice = useCallback((device: Device | null) => {
    sharedConnectedDevice = device;
    if (device) {
      const info: SavedWatchInfo = {
        id: device.id,
        name: device.name || device.localName || 'Smartwatch',
      };
      sharedSavedWatch = info;
      setSavedWatch(info);
    }
    notifyWatchListeners();
  }, []);

  const setWatchMetrics = useCallback(
    (updater: WatchMetrics | ((prev: WatchMetrics) => WatchMetrics)) => {
      if (typeof updater === 'function') {
        sharedWatchMetrics = updater(sharedWatchMetrics);
      } else {
        sharedWatchMetrics = updater;
      }
      notifyWatchListeners();
      AsyncStorage.setItem(
        SAVED_WATCH_METRICS_KEY,
        JSON.stringify(sharedWatchMetrics),
      ).catch(() => {});
    },
    [],
  );

  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('checking');
  const [grantedPermissions, setGrantedPermissions] = useState<Permission[]>(
    [],
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [autoSyncLoading, setAutoSyncLoading] = useState(false);
  const [showAutoSyncConfirm, setShowAutoSyncConfirm] = useState(false);

  const stopScan = useCallback(async () => {
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
      scanTimeout.current = null;
    }
    await bleManager.stopDeviceScan();
    setIsScanning(false);
  }, [bleManager]);

  const enableBluetooth = useCallback(async (): Promise<boolean> => {
    setBleError('');
    if (Platform.OS !== 'android') {
      try {
        await Linking.openURL('App-Prefs:Bluetooth').catch(() =>
          Linking.openSettings(),
        );
      } catch {
        await Linking.openSettings();
      }
      return false;
    }

    try {
      if (Number(Platform.Version) >= 31) {
        const requiredPermissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ];
        const results = await PermissionsAndroid.requestMultiple(
          requiredPermissions,
        );
        const granted = requiredPermissions.every(
          perm => results[perm] === PermissionsAndroid.RESULTS.GRANTED,
        );
        if (!granted) {
          setBleError('Bluetooth permission is required to turn on Bluetooth.');
          return false;
        }
      }

      await bleManager.enable();
      const ready = await waitForBluetoothPoweredOn(bleManager, 8000);
      if (ready) {
        setBluetoothState(BluetoothState.PoweredOn);
        setBleError('');
        return true;
      }
      setBleError('Bluetooth was not turned on. Check your device settings.');
      return false;
    } catch {
      setBleError(
        'Could not turn on Bluetooth. Please enable it in device settings.',
      );
      return false;
    }
  }, [bleManager]);

  const scanForDevices = async () => {
    setBleError('');
    try {
      if (Platform.OS === 'android') {
        const requiredPermissions =
          Number(Platform.Version) >= 31
            ? [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              ]
            : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const permissionResults = await PermissionsAndroid.requestMultiple(
          requiredPermissions,
        );
        const permissionsGranted = requiredPermissions.every(
          permission =>
            permissionResults[permission] ===
            PermissionsAndroid.RESULTS.GRANTED,
        );
        if (!permissionsGranted) {
          setBleError(
            'Bluetooth permission is required to scan for nearby devices.',
          );
          return;
        }
      }

      let currentState = await bleManager.state();
      if (
        currentState === BluetoothState.PoweredOff ||
        currentState === BluetoothState.Resetting
      ) {
        if (Platform.OS === 'android') {
          try {
            await bleManager.enable();
          } catch (enableError) {
            console.warn('Bluetooth enable request:', enableError);
          }
          const isPoweredOn = await waitForBluetoothPoweredOn(bleManager, 8000);
          if (isPoweredOn) {
            currentState = BluetoothState.PoweredOn;
            setBluetoothState(BluetoothState.PoweredOn);
          } else {
            currentState = await bleManager.state();
          }
        } else {
          setBleError('Turn on Bluetooth in your device settings, then retry.');
          return;
        }
      }
      if (currentState !== BluetoothState.PoweredOn) {
        setBleError(
          currentState === BluetoothState.Unsupported
            ? 'This device does not support Bluetooth Low Energy.'
            : 'Bluetooth is not ready. Turn on Bluetooth and retry.',
        );
        return;
      }

      await stopScan();
      setDiscoveredDevices([]);
      setIsScanning(true);
      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false, scanMode: ScanMode.Balanced },
        (error, device) => {
          if (error) {
            setBleError(error.message);
            setIsScanning(false);
            if (scanTimeout.current) {
              clearTimeout(scanTimeout.current);
              scanTimeout.current = null;
            }
            return;
          }
          if (!device || !(device.name || device.localName)) return;
          if (onlyWatches && !isSmartWatchOrWearable(device)) return;
          setDiscoveredDevices(previous => {
            const updatedDevices = new Map(
              previous.map(discovered => [discovered.id, discovered]),
            );
            updatedDevices.set(device.id, device);
            return [...updatedDevices.values()].sort(
              (first, second) => (second.rssi ?? -100) - (first.rssi ?? -100),
            );
          });
        },
      );
      scanTimeout.current = setTimeout(() => {
        stopScan().catch(error => {
          setBleError('Could not stop the Bluetooth scan.');
          console.warn('Bluetooth scan stop failed:', error);
        });
      }, 12000);
    } catch (error) {
      setIsScanning(false);
      setBleError(
        error instanceof Error
          ? error.message
          : 'Could not start Bluetooth scanning.',
      );
    }
  };

  const syncWatchHealthData = useCallback(async () => {
    setWatchMetrics(prev => ({ ...prev, isSyncing: true }));
    try {
      syncRecentHealthData().catch(cloudErr => {
        console.log('[HealthSync] Background cloud sync skipped:', cloudErr);
      });

      let todayData = await readTodayHealthData().catch(() => ({
        status: 'unavailable' as const,
        steps: null,
        distanceMeters: null,
        calories: null,
        exerciseMinutes: null,
        workouts: null,
        hourlySteps: null,
        hourlyCalories: null,
        hourlyExerciseMinutes: null,
      }));

      // If Health Connect needs permission, attempt request
      if (todayData.status === 'permission-required') {
        try {
          await requestPermission(HEALTH_PERMISSIONS);
          const recheck = await readTodayHealthData().catch(() => null);
          if (
            recheck &&
            (recheck.status === 'ready' ||
              (typeof recheck.steps === 'number' && recheck.steps > 0))
          ) {
            todayData = recheck;
          }
        } catch {
          // Ignore if user dismisses prompt
        }
      }

      const latestBpm = await readLatestHeartRate().catch(() => null);
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
      const timeStr = `${formattedHours}:${minutes} ${ampm}`;

      setWatchMetrics(prev => {
        // Direct BLE / Native watch telemetry provides the watch hardware's true metrics.
        // We MUST NOT overwrite actual smartwatch steps with mobile phone accelerometer steps!
        const hasDirectWatchSteps =
          typeof prev.steps === 'number' && prev.steps > 0;
        const nextSteps = hasDirectWatchSteps
          ? prev.steps
          : todayData.status === 'ready' && typeof todayData.steps === 'number'
          ? todayData.steps
          : prev.steps;
        const nextDistKm =
          hasDirectWatchSteps && prev.distanceKm > 0
            ? prev.distanceKm
            : typeof todayData.distanceMeters === 'number'
            ? Number((todayData.distanceMeters / 1000).toFixed(2))
            : prev.distanceKm;
        const nextCalories =
          hasDirectWatchSteps && prev.calories > 0
            ? prev.calories
            : typeof todayData.calories === 'number'
            ? todayData.calories
            : prev.calories;

        return {
          ...prev,
          steps: nextSteps,
          calories: nextCalories,
          distanceKm: nextDistKm,
          exerciseMinutes: todayData.exerciseMinutes ?? prev.exerciseMinutes,
          liveHeartRate: prev.liveHeartRate || latestBpm,
          lastSyncedAt: timeStr,
          dataDate: istDateKey(now),
          isSyncing: false,
        };
      });
    } catch (err) {
      console.warn('Could not sync watch health data:', err);
      setWatchMetrics(prev => ({ ...prev, isSyncing: false }));
    }
  }, [setWatchMetrics]);

  const readWatchTelemetry = useCallback(
    async (device: Device) => {
      try {
        const services = await device.services();
        // 1. Battery service (0x180F) -> characteristic (0x2A19)
        const batteryService = services.find(s =>
          s.uuid.toLowerCase().includes('180f'),
        );
        if (batteryService) {
          const characteristics = await batteryService.characteristics();
          const batteryChar = characteristics.find(c =>
            c.uuid.toLowerCase().includes('2a19'),
          );
          if (batteryChar) {
            try {
              const readChar = await batteryChar.read();
              if (readChar.value) {
                const bytes = decodeBase64ToBytes(readChar.value);
                if (bytes.length > 0 && bytes[0] >= 0 && bytes[0] <= 100) {
                  setWatchMetrics(prev => ({
                    ...prev,
                    batteryLevel: bytes[0],
                  }));
                }
              }
            } catch (bErr) {
              console.log('[BLE] Battery initial read:', bErr);
            }
            try {
              sharedBatterySubscription?.remove();
              sharedBatterySubscription = batteryChar.monitor((bErr, bChar) => {
                if (!bErr && bChar?.value) {
                  const bytes = decodeBase64ToBytes(bChar.value);
                  if (bytes.length > 0 && bytes[0] >= 0 && bytes[0] <= 100) {
                    setWatchMetrics(prev => ({
                      ...prev,
                      batteryLevel: bytes[0],
                    }));
                  }
                }
              });
            } catch (bMonErr) {
              console.log('[BLE] Battery monitor:', bMonErr);
            }
          }
        }

        // 2. Heart Rate service (0x180D) -> characteristic (0x2A37)
        const hrService = services.find(s =>
          s.uuid.toLowerCase().includes('180d'),
        );
        if (hrService) {
          const characteristics = await hrService.characteristics();
          const hrChar = characteristics.find(c =>
            c.uuid.toLowerCase().includes('2a37'),
          );
          if (hrChar) {
            sharedHrSubscription?.remove();
            sharedHrSubscription = hrChar.monitor((error, characteristic) => {
              if (!error && characteristic?.value) {
                const bytes = decodeBase64ToBytes(characteristic.value);
                if (bytes.length >= 2) {
                  const is16Bit = (bytes[0] & 0x01) !== 0;
                  const bpm =
                    is16Bit && bytes.length >= 3
                      ? bytes[1] | (bytes[2] << 8)
                      : bytes[1];
                  if (bpm > 30 && bpm < 240) {
                    setWatchMetrics(prev => ({ ...prev, liveHeartRate: bpm }));
                  }
                }
              }
            });
          }
        }

        // 3. WeChat/Tencent Step Service (0xFEE7) -> Characteristic 0xFEC7 (steps), 0xFEC9 (dist/cal)
        const fee7Service = services.find(s =>
          s.uuid.toLowerCase().includes('fee7'),
        );
        if (fee7Service) {
          const fee7Chars = await fee7Service.characteristics();
          const stepChar = fee7Chars.find(c =>
            c.uuid.toLowerCase().includes('fec7'),
          );
          if (stepChar) {
            try {
              const readChar = await stepChar.read();
              if (readChar.value) {
                const bytes = decodeBase64ToBytes(readChar.value);
                const steps = parsePedometerSteps(bytes);
                if (steps > 0) {
                  setWatchMetrics(prev => ({
                    ...prev,
                    steps,
                    distanceKm: Number(((steps * 0.75) / 1000).toFixed(2)),
                    calories: Number((steps * 0.04).toFixed(1)),
                  }));
                }
              }
            } catch (stepErr) {
              console.log('[BLE] FEE7 step read error:', stepErr);
            }

            try {
              sharedStepSubscription?.remove();
              sharedStepSubscription = stepChar.monitor((sErr, sChar) => {
                if (!sErr && sChar?.value) {
                  const bytes = decodeBase64ToBytes(sChar.value);
                  const steps = parsePedometerSteps(bytes);
                  if (steps > 0) {
                    setWatchMetrics(prev => ({
                      ...prev,
                      steps,
                      distanceKm: Number(((steps * 0.75) / 1000).toFixed(2)),
                      calories: Number((steps * 0.04).toFixed(1)),
                    }));
                  }
                }
              });
            } catch (monErr) {
              console.log('[BLE] FEE7 step monitor error:', monErr);
            }
          }

          const calChar = fee7Chars.find(c =>
            c.uuid.toLowerCase().includes('fec9'),
          );
          if (calChar) {
            try {
              const readCal = await calChar.read();
              if (readCal.value) {
                const bytes = decodeBase64ToBytes(readCal.value);
                if (bytes.length >= 4) {
                  const distMeters =
                    (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16)) >>> 0;
                  const cals =
                    bytes.length >= 6
                      ? (bytes[3] | (bytes[4] << 8)) >>> 0
                      : bytes[3] >>> 0;
                  if (distMeters > 0 || cals > 0) {
                    setWatchMetrics(prev => ({
                      ...prev,
                      ...(distMeters > 0
                        ? { distanceKm: Number((distMeters / 1000).toFixed(2)) }
                        : {}),
                      ...(cals > 0 ? { calories: cals } : {}),
                    }));
                  }
                }
              }
            } catch {
              // Optional
            }
          }
        }

        // 4. RSC Service (0x1814) -> Characteristic 0x2A53 (RSC Measurement)
        const rscService = services.find(s =>
          s.uuid.toLowerCase().includes('1814'),
        );
        if (rscService) {
          const rscChars = await rscService.characteristics();
          const rscChar = rscChars.find(c =>
            c.uuid.toLowerCase().includes('2a53'),
          );
          if (rscChar) {
            try {
              rscChar.monitor((rErr, rChar) => {
                if (!rErr && rChar?.value) {
                  const bytes = decodeBase64ToBytes(rChar.value);
                  if (bytes.length >= 4) {
                    const flags = bytes[0];
                    const hasStride = (flags & 0x01) !== 0;
                    const hasDistance = (flags & 0x02) !== 0;
                    let offset = 4;
                    if (hasStride) offset += 2;
                    if (hasDistance && bytes.length >= offset + 4) {
                      const distDeci =
                        (bytes[offset] |
                          (bytes[offset + 1] << 8) |
                          (bytes[offset + 2] << 16) |
                          (bytes[offset + 3] << 24)) >>>
                        0;
                      const distMeters = distDeci / 10;
                      const estSteps = Math.round(distMeters / 0.75);
                      if (estSteps > 0) {
                        setWatchMetrics(prev => ({
                          ...prev,
                          steps: Math.max(prev.steps, estSteps),
                          distanceKm: Number((distMeters / 1000).toFixed(2)),
                          calories: Number((estSteps * 0.04).toFixed(1)),
                        }));
                      }
                    }
                  }
                }
              });
            } catch {
              // Optional
            }
          }
        }
      } catch (telemetryError) {
        console.warn('Optional BLE telemetry read skipped:', telemetryError);
      }
      void syncWatchHealthData();
    },
    [syncWatchHealthData, setWatchMetrics],
  );

  const autoReconnectSavedWatch = useCallback(async () => {
    if (sharedIsReconnecting) return;

    try {
      const savedJson = await AsyncStorage.getItem(SAVED_WATCH_KEY);
      if (!savedJson) return;
      const saved: SavedWatchInfo = JSON.parse(savedJson);
      if (!saved?.id) return;

      sharedSavedWatch = saved;
      setSavedWatch(saved);

      if (sharedConnectedDevice && sharedConnectedDevice.id === saved.id) {
        return;
      }

      setIsReconnecting(true);
      sharedIsReconnecting = true;
      notifyWatchListeners();

      const isPoweredOn = await waitForBluetoothPoweredOn(bleManager, 10000);
      if (!isPoweredOn) {
        setIsReconnecting(false);
        sharedIsReconnecting = false;
        notifyWatchListeners();
        return;
      }

      const isConnected = await bleManager.isDeviceConnected(saved.id);
      let activeConnection: Device;

      if (isConnected) {
        const known = await bleManager.devices([saved.id]);
        if (known.length > 0) {
          activeConnection = known[0];
        } else {
          activeConnection = await bleManager.connectToDevice(saved.id, {
            autoConnect: false,
            timeout: 10000,
          });
        }
      } else {
        // Direct connection with autoConnect: false connects in 1-2s
        activeConnection = await bleManager.connectToDevice(saved.id, {
          autoConnect: false,
          timeout: 12000,
        });
      }

      const discoveredConnection =
        await activeConnection.discoverAllServicesAndCharacteristics();
      sharedDisconnectSubscription?.remove();
      sharedDisconnectSubscription = bleManager.onDeviceDisconnected(
        saved.id,
        async () => {
          sharedHrSubscription?.remove();
          sharedHrSubscription = null;
          sharedBatterySubscription?.remove();
          sharedBatterySubscription = null;
          sharedStepSubscription?.remove();
          sharedStepSubscription = null;
          sharedNativeTelemetrySub?.remove();
          sharedNativeTelemetrySub = null;
          if (isNativeWatchAvailable) {
            void disconnectNativeWatch();
          }
          sharedConnectedDevice = null;
          notifyWatchListeners();
          sharedDisconnectSubscription?.remove();
          sharedDisconnectSubscription = null;

          // Check if still saved in storage to auto-reconnect when back in range
          const stillSaved = await AsyncStorage.getItem(SAVED_WATCH_KEY);
          if (stillSaved && !sharedIsReconnecting) {
            setTimeout(() => {
              void autoReconnectRef.current();
            }, 3000);
          }
        },
      );
      setConnectedDevice(discoveredConnection);
      setIsReconnecting(false);
      sharedIsReconnecting = false;
      notifyWatchListeners();
      if (isNativeWatchAvailable) {
        void connectNativeWatch(saved.id);
        if (!sharedNativeTelemetrySub) {
          sharedNativeTelemetrySub = subscribeToNativeWatchTelemetry(
            telemetry => {
              setWatchMetrics(prev => ({
                ...prev,
                batteryLevel:
                  telemetry.batteryLevel >= 0
                    ? telemetry.batteryLevel
                    : prev.batteryLevel,
                liveHeartRate:
                  telemetry.liveHeartRate > 0
                    ? telemetry.liveHeartRate
                    : prev.liveHeartRate,
                steps:
                  telemetry.steps > 0
                    ? Math.max(prev.steps, telemetry.steps)
                    : prev.steps,
                calories:
                  telemetry.calories > 0 ? telemetry.calories : prev.calories,
                distanceKm:
                  telemetry.distanceKm > 0
                    ? telemetry.distanceKm
                    : prev.distanceKm,
              }));
            },
          );
        }
      }
      void readWatchTelemetry(discoveredConnection);
    } catch (reconnectError) {
      setIsReconnecting(false);
      sharedIsReconnecting = false;
      notifyWatchListeners();
      console.log(
        '[BLE] Watch auto-reconnect attempt ended (will retry on next trigger):',
        reconnectError,
      );
    }
  }, [bleManager, readWatchTelemetry, setConnectedDevice, setWatchMetrics]);

  const autoReconnectRef = useRef(autoReconnectSavedWatch);
  autoReconnectRef.current = autoReconnectSavedWatch;

  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      setBluetoothState(state);
      if (state === BluetoothState.PoweredOn) {
        void autoReconnectRef.current();
      }
    }, true);

    void autoReconnectRef.current();

    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        void autoReconnectRef.current();
      }
    });

    return () => {
      subscription.remove();
      appStateSub.remove();
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      bleManager.stopDeviceScan().catch(() => {});
    };
  }, [bleManager]);

  const connectToDevice = async (device: Device) => {
    setBleError('');
    setConnectingDeviceId(device.id);
    try {
      await stopScan();
      const connection = await bleManager.connectToDevice(device.id, {
        timeout: 15000,
      });
      const discoveredConnection =
        await connection.discoverAllServicesAndCharacteristics();
      sharedDisconnectSubscription?.remove();
      sharedDisconnectSubscription = bleManager.onDeviceDisconnected(
        device.id,
        async error => {
          sharedHrSubscription?.remove();
          sharedHrSubscription = null;
          sharedBatterySubscription?.remove();
          sharedBatterySubscription = null;
          sharedConnectedDevice = null;
          notifyWatchListeners();
          sharedDisconnectSubscription?.remove();
          sharedDisconnectSubscription = null;
          if (error) setBleError(`Bluetooth connection lost: ${error.message}`);
          const stillSaved = await AsyncStorage.getItem(SAVED_WATCH_KEY);
          if (stillSaved) {
            setTimeout(() => {
              void autoReconnectSavedWatch();
            }, 3000);
          }
        },
      );
      setConnectedDevice(discoveredConnection);
      setDiscoveredDevices(previous =>
        previous.filter(discovered => discovered.id !== device.id),
      );
      if (isNativeWatchAvailable) {
        void connectNativeWatch(device.id);
        if (!sharedNativeTelemetrySub) {
          sharedNativeTelemetrySub = subscribeToNativeWatchTelemetry(
            telemetry => {
              setWatchMetrics(prev => ({
                ...prev,
                batteryLevel:
                  telemetry.batteryLevel >= 0
                    ? telemetry.batteryLevel
                    : prev.batteryLevel,
                liveHeartRate:
                  telemetry.liveHeartRate > 0
                    ? telemetry.liveHeartRate
                    : prev.liveHeartRate,
                steps:
                  telemetry.steps > 0
                    ? Math.max(prev.steps, telemetry.steps)
                    : prev.steps,
                calories:
                  telemetry.calories > 0 ? telemetry.calories : prev.calories,
                distanceKm:
                  telemetry.distanceKm > 0
                    ? telemetry.distanceKm
                    : prev.distanceKm,
              }));
            },
          );
        }
      }
      // Persist paired watch so it auto-reconnects if app is killed
      const watchInfo: SavedWatchInfo = {
        id: device.id,
        name: device.name || device.localName || 'Smartwatch',
      };
      sharedSavedWatch = watchInfo;
      setSavedWatch(watchInfo);
      await AsyncStorage.setItem(SAVED_WATCH_KEY, JSON.stringify(watchInfo));
      void readWatchTelemetry(discoveredConnection);
    } catch (error) {
      try {
        await bleManager.cancelDeviceConnection(device.id);
      } catch (disconnectError) {
        console.warn(
          'Could not clean up the failed Bluetooth connection:',
          disconnectError,
        );
      }
      setBleError(
        error instanceof Error
          ? `Could not connect. ${error.message}`
          : 'Could not connect to this device.',
      );
    } finally {
      setConnectingDeviceId(null);
    }
  };

  const disconnectDevice = async () => {
    try {
      // Clear saved watch from storage so it does NOT auto-reconnect
      await AsyncStorage.removeItem(SAVED_WATCH_KEY);
      await AsyncStorage.removeItem(SAVED_WATCH_METRICS_KEY);
      sharedSavedWatch = null;
      setSavedWatch(null);
      sharedHrSubscription?.remove();
      sharedHrSubscription = null;
      sharedBatterySubscription?.remove();
      sharedBatterySubscription = null;
      sharedStepSubscription?.remove();
      sharedStepSubscription = null;
      sharedNativeTelemetrySub?.remove();
      sharedNativeTelemetrySub = null;
      if (isNativeWatchAvailable) {
        void disconnectNativeWatch();
      }
      setWatchMetrics(INITIAL_WATCH_METRICS);
      if (sharedConnectedDevice) {
        await bleManager.cancelDeviceConnection(sharedConnectedDevice.id);
      }
      sharedDisconnectSubscription?.remove();
      sharedDisconnectSubscription = null;
      setConnectedDevice(null);
      if (connectedDevice) {
        setDiscoveredDevices(previous => [...previous, connectedDevice]);
      }
    } catch (error) {
      setBleError(
        error instanceof Error
          ? `Could not disconnect. ${error.message}`
          : 'Could not disconnect from this device.',
      );
    }
  };

  const refreshConnection = useCallback(async () => {
    setErrorMessage('');
    if (Platform.OS !== 'android') {
      setConnectionState('unsupported');
      setGrantedPermissions([]);
      return;
    }
    setConnectionState('checking');
    try {
      const sdkStatus = await getSdkStatus();
      if (sdkStatus === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        setConnectionState('unavailable');
        setGrantedPermissions([]);
        return;
      }
      if (
        sdkStatus ===
        SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
      ) {
        setConnectionState('update-required');
        setGrantedPermissions([]);
        return;
      }
      const initialized = await initialize();
      if (!initialized) {
        setConnectionState('error');
        setErrorMessage('Health Connect could not be initialized.');
        return;
      }
      const permissions = await getGrantedPermissions();
      setGrantedPermissions(matchingHealthPermissions(permissions));
      setConnectionState('available');
    } catch {
      setConnectionState('error');
      setErrorMessage(
        'Could not check Health Connect. Try again or check your device settings.',
      );
    }
  }, []);

  const refreshAutoSyncState = useCallback(async () => {
    if (Platform.OS !== 'android' || Number(Platform.Version) < 34) {
      setAutoSyncEnabled(false);
      return;
    }

    try {
      setAutoSyncEnabled(await isBackgroundHealthSyncEnabled());
    } catch (error) {
      console.warn('Unable to load auto-sync setting:', error);
      setAutoSyncEnabled(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!skipHealthConnect) {
        refreshConnection();
        refreshAutoSyncState();
      }
      void autoReconnectRef.current();
    }, [skipHealthConnect, refreshAutoSyncState, refreshConnection]),
  );

  const requestAndEnableAutoSync = async () => {
    setAutoSyncLoading(true);
    try {
      const granted = await requestBackgroundHealthReadPermission();
      if (!granted) {
        Alert.alert(
          'Background health access is off',
          'Allow background access for Vitality in Health Connect settings to sync health data while the app is closed.',
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'Open Health Connect',
              onPress: () => {
                try {
                  openHealthConnectSettings();
                } catch (error) {
                  console.error(
                    'Unable to open Health Connect settings:',
                    error,
                  );
                  Alert.alert(
                    'Could not open Health Connect',
                    'Open Health Connect from your device settings to manage Vitality’s access.',
                  );
                }
              },
            },
          ],
        );
        return;
      }

      await enableBackgroundHealthSync();
      setAutoSyncEnabled(true);
    } catch (error) {
      console.error('Unable to enable auto-sync:', error);
      Alert.alert(
        'Auto-sync could not be enabled',
        error instanceof Error
          ? error.message
          : 'Connect Health Connect and allow background access, then try again.',
      );
    } finally {
      setAutoSyncLoading(false);
    }
  };

  const confirmAutoSync = () => {
    setShowAutoSyncConfirm(false);
    void requestAndEnableAutoSync();
  };

  const cancelAutoSync = () => {
    setShowAutoSyncConfirm(false);
  };

  const handleAutoSyncToggle = (enabled: boolean) => {
    if (autoSyncLoading) return;

    if (enabled) {
      setShowAutoSyncConfirm(true);
      return;
    }

    setAutoSyncLoading(true);
    disableBackgroundHealthSync()
      .then(() => setAutoSyncEnabled(false))
      .catch(error => {
        console.error('Unable to disable auto-sync:', error);
        Alert.alert(
          'Could not turn off auto-sync',
          'Vitality could not update this setting. Please try again.',
        );
      })
      .finally(() => setAutoSyncLoading(false));
  };

  const requestHealthAccess = async () => {
    setIsRequesting(true);
    setErrorMessage('');
    try {
      const permissions = await requestPermission(HEALTH_PERMISSIONS);
      setGrantedPermissions(matchingHealthPermissions(permissions));
      setConnectionState('available');
      if (permissions.some(permission => permission.accessType === 'read')) {
        syncRecentHealthData().catch(error => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Health data could not be synced.',
          );
        });
      }
    } catch {
      setErrorMessage('Health permissions were not updated. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const hasAnyAccess = grantedPermissions.some(
    permission => permission.accessType === 'read',
  );
  const grantedCount = HEALTH_PERMISSIONS.filter(requested =>
    grantedPermissions.some(
      granted =>
        granted.accessType === requested.accessType &&
        granted.recordType === requested.recordType,
    ),
  ).length;
  const statusDetail =
    connectionState === 'checking'
      ? 'Checking Health Connect availability…'
      : connectionState === 'unsupported'
      ? 'Health Connect is available on Android. HealthKit is not configured in this app for iOS.'
      : connectionState === 'unavailable'
      ? 'Health Connect is not available on this device.'
      : connectionState === 'update-required'
      ? 'Update or install Health Connect to connect your health data.'
      : connectionState === 'error'
      ? errorMessage
      : hasAnyAccess
      ? `${grantedCount} of ${HEALTH_PERMISSIONS.length} health data permissions granted`
      : 'Allow access to import health and activity data';
  const actionLabel =
    connectionState === 'available'
      ? hasAnyAccess
        ? 'Manage'
        : isRequesting
        ? 'Requesting…'
        : 'Connect'
      : connectionState === 'checking'
      ? 'Checking…'
      : connectionState === 'error'
      ? 'Retry'
      : 'Unavailable';

  const handleProviderAction = () => {
    if (connectionState === 'error') refreshConnection();
    else if (connectionState === 'available' && hasAnyAccess) {
      openHealthConnectSettings();
    } else if (connectionState === 'available') {
      requestHealthAccess();
    }
  };

  const displayDevice = connectedDevice || savedWatch;

  return {
    bluetoothState,
    discoveredDevices,
    connectedDevice: displayDevice,
    isWatchConnected: Boolean(connectedDevice),
    isWatchReconnecting: isReconnecting,
    reconnectDevice: autoReconnectSavedWatch,
    connectingDeviceId,
    isScanning,
    bleError,
    connectionState,
    errorMessage,
    statusDetail,
    actionLabel,
    enableBluetooth,
    stopScan,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    handleProviderAction,
    openHealthConnectSettings,
    autoSyncEnabled,
    autoSyncLoading,
    handleAutoSyncToggle,
    showAutoSyncConfirm,
    confirmAutoSync,
    cancelAutoSync,
    watchMetrics,
    syncWatchHealthData,
    onlyWatches,
    setOnlyWatches,
  };
}
