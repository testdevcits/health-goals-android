import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
import { HEALTH_PERMISSIONS } from '../../../services/healthConnect';
import { syncRecentHealthData } from '../../../services/healthSync';

import {
  AppHeader,
  AppText,
  ProfileCard,
  ProfileListRow,
  ProfileScreen,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';

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

type ConnectionState =
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'update-required'
  | 'error'
  | 'unsupported';

const ConnectedDevicesScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
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
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disconnectSubscription = useRef<Subscription | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('checking');
  const [grantedPermissions, setGrantedPermissions] = useState<Permission[]>(
    [],
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const subscription = bleManager.onStateChange(setBluetoothState, true);

    return () => {
      subscription.remove();
      disconnectSubscription.current?.remove();
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
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

          if (!device || !(device.name || device.localName)) {
            return;
          }

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
          setConnectedDevice(null);
          disconnectSubscription.current?.remove();
          disconnectSubscription.current = null;
          if (error) {
            setBleError(`Bluetooth connection lost: ${error.message}`);
          }
        },
      );
      setConnectedDevice(discoveredConnection);
      setDiscoveredDevices(previous =>
        previous.filter(discovered => discovered.id !== device.id),
      );
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
    if (!connectedDevice) {
      return;
    }

    try {
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

  useFocusEffect(
    useCallback(() => {
      refreshConnection();
    }, [refreshConnection]),
  );

  const requestHealthAccess = async () => {
    setIsRequesting(true);
    setErrorMessage('');
    try {
      const permissions = await requestPermission(HEALTH_PERMISSIONS);
      setGrantedPermissions(matchingHealthPermissions(permissions));
      setConnectionState('available');
      if (permissions.some(permission => permission.accessType === 'read')) {
        void syncRecentHealthData().catch(error => {
          setErrorMessage(error instanceof Error ? error.message : 'Health data could not be synced.');
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
    if (connectionState === 'error') {
      refreshConnection();
    } else if (connectionState === 'available' && hasAnyAccess) {
      openHealthConnectSettings();
    } else if (connectionState === 'available') {
      requestHealthAccess();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Connected Devices"
        subtitle="Scan and connect to nearby devices"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
        <View style={{ flex: 1 }}>
          <AppText
            variant="label"
            color="textTertiary"
            style={styles.sectionLabel}
          >
            BLUETOOTH DEVICES
          </AppText>

          {connectedDevice ? (
            <ProfileCard>
              <ProfileListRow
                icon="⌚"
                title={
                  connectedDevice.name || connectedDevice.localName || 'Device'
                }
                detail="Connected to this phone"
                action="Disconnect"
                onPress={disconnectDevice}
                last
              />
            </ProfileCard>
          ) : null}

          {discoveredDevices.map(device => (
            <ProfileCard key={device.id} style={styles.deviceCard}>
              <ProfileListRow
                icon="⌚"
                title={device.name || device.localName || 'Bluetooth device'}
                detail={
                  device.rssi === null
                    ? 'Nearby'
                    : `Signal strength ${device.rssi} dBm`
                }
                action={
                  connectingDeviceId === device.id ? 'Connecting…' : 'Connect'
                }
                onPress={
                  connectingDeviceId ? undefined : () => connectToDevice(device)
                }
                last
              />
            </ProfileCard>
          ))}

          <Pressable
            onPress={isScanning ? stopScan : scanForDevices}
            disabled={!!connectingDeviceId}
            style={[
              styles.scanButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                marginTop: spacing.md,
              },
              connectingDeviceId && styles.disabledButton,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isScanning
                ? 'Stop scanning for Bluetooth devices'
                : 'Scan for devices'
            }
          >
            <AppText variant="button" color="textInverse">
              {isScanning ? 'Stop Scan' : 'Scan for Devices'}
            </AppText>
          </Pressable>

          <AppText variant="caption" secondary style={styles.deviceNote}>
            {bluetoothState === BluetoothState.PoweredOff
              ? 'Bluetooth is off. Start a scan to turn it on and search for nearby devices.'
              : 'This creates a Bluetooth Low Energy connection, not system pairing or automatic health-data sync. Some watches require their own app or a brand-specific protocol.'}
          </AppText>

          {!isScanning && discoveredDevices.length === 0 && !connectedDevice ? (
            <AppText
              variant="caption"
              secondary
              center
              style={styles.emptyDevices}
            >
              Scan to find nearby Bluetooth devices.
            </AppText>
          ) : null}

          {bleError ? (
            <AppText variant="caption" error style={styles.errorMessage}>
              {bleError}
            </AppText>
          ) : null}

          <AppText
            variant="label"
            color="textTertiary"
            style={[styles.sectionLabel, styles.healthSectionLabel]}
          >
            HEALTH DATA
          </AppText>

          <ProfileCard>
            <ProfileListRow
              icon="❤️"
              title="Health Connect"
              detail={statusDetail}
              action={actionLabel}
              onPress={
                connectionState === 'available' || connectionState === 'error'
                  ? handleProviderAction
                  : undefined
              }
              last
            />
          </ProfileCard>

          {connectionState === 'available' ? (
            <Pressable
              onPress={openHealthConnectSettings}
              style={[
                styles.settingsButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  marginTop: spacing.md,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open Health Connect settings"
            >
              <AppText variant="buttonSm" primary>
                Open Health Connect settings
              </AppText>
            </Pressable>
          ) : null}

          {connectionState === 'unsupported' ? (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  marginTop: spacing.md,
                  padding: spacing.base,
                },
              ]}
            >
              <AppText variant="body2" secondary>
                iPhone health data connection is not configured yet. This screen
                currently connects Android devices through Health Connect.
              </AppText>
            </View>
          ) : null}

          {errorMessage && connectionState !== 'error' ? (
            <AppText variant="caption" error style={styles.errorMessage}>
              {errorMessage}
            </AppText>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoCard: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  errorMessage: {
    marginTop: 12,
    textAlign: 'center',
  },
  sectionLabel: {
    marginBottom: 8,
  },
  healthSectionLabel: {
    marginTop: 24,
  },
  deviceCard: {
    marginTop: 8,
  },
  scanButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  deviceNote: {
    marginTop: 12,
    textAlign: 'center',
  },
  emptyDevices: {
    marginTop: 12,
  },
});

export default ConnectedDevicesScreen;
