import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import {
  ProfileCard,
  ProfileListRow,
  ProfileScreen,
  ProfileScreenNavigation,
  ProfileToggleRow,
} from '../components/ProfileScreenLayout';

const devices = [
  {
    icon: '⌚',
    title: 'Apple Watch Series 9',
    detail: 'Connected · synced 2 min ago',
  },
  {
    icon: '💍',
    title: 'Oura Ring Gen 3',
    detail: 'Connected · synced 12 min ago',
  },
  { icon: '⌚', title: 'Garmin Forerunner 265', detail: 'Not connected' },
  { icon: '📱', title: 'Phone Sensors', detail: 'Step tracking paused' },
];

const ConnectedDevicesScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const [connected, setConnected] = useState([true, true, false, false]);
  const [autoSync, setAutoSync] = useState(true);

  const toggleDevice = (index: number) => {
    setConnected(current =>
      current.map((item, i) => (i === index ? !item : item)),
    );
  };

  return (
    <ProfileScreen
      navigation={navigation}
      title="Connected Devices"
      subtitle="Manage your wearables and sync"
    >
      <View style={styles.deviceList}>
        {devices.map((device, index) => (
          <ProfileCard key={device.title}>
            <ProfileListRow
              icon={device.icon}
              title={device.title}
              detail={connected[index] ? device.detail : 'Not connected'}
              action={
                connected[index] ? 'Manage' : index === 3 ? 'Enable' : 'Connect'
              }
              onPress={() => toggleDevice(index)}
              last
            />
          </ProfileCard>
        ))}
      </View>
      <Pressable
        onPress={() =>
          Alert.alert(
            'Add a device',
            'Choose a wearable from your phone’s health or Bluetooth settings to connect it.',
          )
        }
        style={[styles.addDevice, { borderColor: theme.colors.primary }]}
      >
        <AppText variant="subtitle2" primary bold>
          ＋ Add New Device
        </AppText>
      </Pressable>
      <ProfileCard style={styles.syncCard}>
        <ProfileToggleRow
          icon="🔄"
          title="Auto-Sync"
          detail="Sync data in the background every 15 min"
          value={autoSync}
          onChange={setAutoSync}
          last
        />
      </ProfileCard>
      <AppText variant="caption" secondary center style={styles.supportNote}>
        Supports Apple Health, Health Connect, Fitbit, and 40+ wearables
      </AppText>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  deviceList: { gap: 12 },
  addDevice: {
    minHeight: 48,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncCard: { marginTop: 14 },
  supportNote: { marginTop: 12 },
});

export default ConnectedDevicesScreen;
