import React from 'react';
import { Pressable } from 'react-native';
import { State as BluetoothState } from 'react-native-ble-plx';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.ConnectedDevices';

interface BluetoothScanControlProps {
  isScanning: boolean;
  bluetoothState: BluetoothState;
  connectingDeviceId: string | null;
  discoveredCount: number;
  hasConnectedDevice: boolean;
  bleError: string | null;
  onScanToggle: () => void;
}

export const BluetoothScanControl: React.FC<BluetoothScanControlProps> = ({
  isScanning,
  bluetoothState,
  connectingDeviceId,
  discoveredCount,
  hasConnectedDevice,
  bleError,
  onScanToggle,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);

  const isBluetoothOff = bluetoothState === BluetoothState.PoweredOff;

  return (
    <>
      <Pressable
        onPress={onScanToggle}
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
            : isBluetoothOff
            ? 'Turn on Bluetooth and scan for devices'
            : 'Scan for devices'
        }
      >
        <AppText variant="button" color="textInverse">
          {isScanning
            ? 'Stop Scan'
            : isBluetoothOff
            ? 'Turn on Bluetooth & Scan'
            : 'Scan for Devices'}
        </AppText>
      </Pressable>

      <AppText variant="caption" secondary style={styles.deviceNote}>
        {isBluetoothOff
          ? 'Bluetooth is off. Tap the button above to turn it on directly and search for devices.'
          : 'This creates a Bluetooth Low Energy connection, not system pairing or automatic health-data sync. Some watches require their own app or a brand-specific protocol.'}
      </AppText>

      {!isScanning && discoveredCount === 0 && !hasConnectedDevice ? (
        <AppText variant="caption" secondary center style={styles.emptyDevices}>
          Scan to find nearby Bluetooth devices.
        </AppText>
      ) : null}

      {bleError ? (
        <AppText variant="caption" error style={styles.errorMessage}>
          {bleError}
        </AppText>
      ) : null}
    </>
  );
};
