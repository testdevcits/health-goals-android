import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
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
  readTodayHealthData,
} from '../../../services/healthConnect';
import { syncRecentHealthData } from '../../../services/healthSync';

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

export interface WatchMetrics {
  batteryLevel: number | null;
  liveHeartRate: number | null;
  steps: number;
  calories: number;
  distanceKm: number;
  exerciseMinutes: number;
  lastSyncedAt: string;
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

export default function useConnectedDevices() {
  const [bleManager] = useState(() => new BleManager());
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>(
    BluetoothState.Unknown,
  );
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );
  const [isScanning, setIsScanning] = useState(false);
  const [bleError, setBleError] = useState('');
  const [onlyWatches, setOnlyWatches] = useState(true);
  const [watchMetrics, setWatchMetrics] = useState<WatchMetrics>(
    INITIAL_WATCH_METRICS,
  );
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disconnectSubscription = useRef<Subscription | null>(null);
  const hrSubscription = useRef<Subscription | null>(null);
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

  useEffect(() => {
    const subscription = bleManager.onStateChange(setBluetoothState, true);
    return () => {
      subscription.remove();
      disconnectSubscription.current?.remove();
      hrSubscription.current?.remove();
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      bleManager.stopDeviceScan().catch(error => {
        console.warn('Could not stop Bluetooth scan during cleanup:', error);
      });
      bleManager.destroy().catch(error => {
        console.warn('Could not release Bluetooth manager:', error);
      });
    };
  }, [bleManager]);

  const stopScan = useCallback(async () => {
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
      scanTimeout.current = null;
    }
    await bleManager.stopDeviceScan();
    setIsScanning(false);
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
      if (currentState === BluetoothState.PoweredOff) {
        if (Platform.OS === 'android') {
          await bleManager.enable();
          currentState = await bleManager.state();
        } else {
          setBleError('Turn on Bluetooth in your device settings, then retry.');
          return;
        }
      }
      if (currentState !== BluetoothState.PoweredOn) {
        setBleError(
          currentState === BluetoothState.Unsupported
            ? 'This device does not support Bluetooth Low Energy.'
            : 'Bluetooth is not ready. Check Bluetooth and app permissions.',
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
      await syncRecentHealthData();
      const todayData = await readTodayHealthData();
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      setWatchMetrics(prev => ({
        ...prev,
        steps: todayData.steps ?? prev.steps,
        calories: todayData.calories ?? prev.calories,
        distanceKm: todayData.distanceMeters
          ? Number((todayData.distanceMeters / 1000).toFixed(2))
          : prev.distanceKm,
        exerciseMinutes: todayData.exerciseMinutes ?? prev.exerciseMinutes,
        lastSyncedAt: timeStr,
        isSyncing: false,
      }));
    } catch (err) {
      console.warn('Could not sync watch health data:', err);
      setWatchMetrics(prev => ({ ...prev, isSyncing: false }));
    }
  }, []);

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
            const readChar = await batteryChar.read();
            if (readChar.value) {
              const bytes = decodeBase64ToBytes(readChar.value);
              if (bytes.length > 0 && bytes[0] >= 0 && bytes[0] <= 100) {
                setWatchMetrics(prev => ({ ...prev, batteryLevel: bytes[0] }));
              }
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
            hrSubscription.current?.remove();
            hrSubscription.current = hrChar.monitor((error, characteristic) => {
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
      } catch (telemetryError) {
        console.warn('Optional BLE telemetry read skipped:', telemetryError);
      }
      void syncWatchHealthData();
    },
    [syncWatchHealthData],
  );

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
      disconnectSubscription.current?.remove();
      disconnectSubscription.current = bleManager.onDeviceDisconnected(
        device.id,
        error => {
          hrSubscription.current?.remove();
          hrSubscription.current = null;
          setWatchMetrics(INITIAL_WATCH_METRICS);
          setConnectedDevice(null);
          disconnectSubscription.current?.remove();
          disconnectSubscription.current = null;
          if (error) setBleError(`Bluetooth connection lost: ${error.message}`);
        },
      );
      setConnectedDevice(discoveredConnection);
      setDiscoveredDevices(previous =>
        previous.filter(discovered => discovered.id !== device.id),
      );
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
    if (!connectedDevice) return;
    try {
      hrSubscription.current?.remove();
      hrSubscription.current = null;
      setWatchMetrics(INITIAL_WATCH_METRICS);
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      disconnectSubscription.current?.remove();
      disconnectSubscription.current = null;
      setConnectedDevice(null);
      setDiscoveredDevices(previous => [...previous, connectedDevice]);
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
      refreshConnection();
      refreshAutoSyncState();
    }, [refreshAutoSyncState, refreshConnection]),
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

  return {
    bluetoothState,
    discoveredDevices,
    connectedDevice,
    connectingDeviceId,
    isScanning,
    bleError,
    connectionState,
    errorMessage,
    statusDetail,
    actionLabel,
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
