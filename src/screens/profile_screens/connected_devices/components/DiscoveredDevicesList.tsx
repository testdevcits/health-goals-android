import React from 'react';
import { Pressable, View } from 'react-native';
import type { Device } from 'react-native-ble-plx';
import { AppText, ProfileCard, ProfileListRow } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.ConnectedDevices';

interface DiscoveredDevicesListProps {
  discoveredDevices: Device[];
  connectingDeviceId: string | null;
  onlyWatches: boolean;
  onToggleOnlyWatches: () => void;
  onConnectDevice: (device: Device) => void;
}

export const DiscoveredDevicesList: React.FC<DiscoveredDevicesListProps> = ({
  discoveredDevices,
  connectingDeviceId,
  onlyWatches,
  onToggleOnlyWatches,
  onConnectDevice,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <>
      <View style={styles.filterRow}>
        <AppText variant="caption" secondary style={{ width: '50%' }}>
          {onlyWatches
            ? 'Showing smartwatches & fitness bands'
            : 'Showing all nearby Bluetooth devices'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle device filter"
          onPress={onToggleOnlyWatches}
          style={[
            styles.filterChip,
            {
              backgroundColor: onlyWatches ? colors.primary : colors.primary,
              borderColor: onlyWatches ? colors.primary : colors.border,
            },
          ]}
        >
          <AppText
            variant="caption"
            // color={onlyWatches ? 'primary' : 'textSecondary'}
            bold
          >
            {onlyWatches ? '⌚ Watches Only' : 'All Devices'}

            <AppText variant="label">⟳</AppText>
          </AppText>
        </Pressable>
      </View>

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
              connectingDeviceId ? undefined : () => onConnectDevice(device)
            }
            last
          />
        </ProfileCard>
      ))}
    </>
  );
};
