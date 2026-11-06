import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { State as BluetoothState } from 'react-native-ble-plx';
import {
  AppHeader,
  AppText,
  ProfileCard,
  ProfileListRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import useConnectedDevices from './useConnectedDevices';

const styles = StyleSheet.create({
  settingsButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoCard: { borderWidth: StyleSheet.hairlineWidth },
  errorMessage: { marginTop: 12, textAlign: 'center' },
  sectionLabel: { marginBottom: 8 },
  healthSectionLabel: { marginTop: 24 },
  deviceCard: { marginTop: 8 },
  scanButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.6 },
  deviceNote: { marginTop: 12, textAlign: 'center' },
  emptyDevices: { marginTop: 12 },
});

const ConnectedDevicesScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const {
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
  } = useConnectedDevices();

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

export default ConnectedDevicesScreen;
