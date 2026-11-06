import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { openHealthConnectSettings } from 'react-native-health-connect';
import type { ThemeMode } from '../../../theme/ThemeProvider';
import { useTheme } from '../../../theme/useTheme';
import {
  getNotificationPermission,
  openNotificationSettings,
  requestNotificationPermission,
} from '../../../utils/AppPermissions';
import {
  disableBackgroundHealthSync,
  enableBackgroundHealthSync,
  isBackgroundHealthSyncEnabled,
  requestBackgroundHealthReadPermission,
} from '../../../services/backgroundHealthSync';
import { logout } from '../../../services/auth';
import { navigationRef } from '../../../navigations/AppNavigation';
import { useAppDispatch } from '../../../store/hooks';
import { clearProfile } from '../../../store/profileSlice';

export type SettingsGroup = 'units' | 'language' | 'appearance';
export type SettingsNavigation = {
  goBack: () => void;
  navigate: (screen: 'EditProfile' | 'ChangePassword') => void;
};

export const groupOptions: Record<SettingsGroup, string[]> = {
  units: ['Metric', 'Imperial'],
  language: [
    'English',
    'Español',
    'Français',
    'Deutsch',
    'हिन्दी',
    '日本語',
    'Português',
    '中文',
  ],
  appearance: ['Light', 'Dark', 'System'],
};

export default function useSettings() {
  const dispatch = useAppDispatch();
  const { themeMode, setThemeMode } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [challengeAlerts, setChallengeAlerts] = useState(false);
  const [locationTracking, setLocationTracking] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [backgroundHealthSync, setBackgroundHealthSync] = useState(false);
  const [backgroundHealthSyncLoading, setBackgroundHealthSyncLoading] =
    useState(true);
  const [units, setUnits] = useState('Metric');
  const [language, setLanguage] = useState('हिन्दी');
  const [activeGroup, setActiveGroup] = useState<SettingsGroup | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLocationConfirmation, setShowLocationConfirmation] =
    useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // Clear the local session even while offline.
    }
    dispatch(clearProfile());
    setModalVisible(false);
    navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
  };

  const refreshDeviceSettings = useCallback(async () => {
    try {
      const [notificationsGranted, locationState] = await Promise.all([
        getNotificationPermission(),
        BackgroundGeolocation.ready({
          geolocation: {
            desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
            distanceFilter: 25,
            locationAuthorizationRequest: 'Always',
          },
          app: {
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            notification: {
              title: 'Vitality location tracking',
              text: 'Background location tracking is active.',
              sticky: true,
              channelName: 'Location tracking',
              channelId: 'location-tracking',
            },
          },
        }),
      ]);
      setPushNotifications(notificationsGranted);
      setLocationTracking(locationState.enabled);
    } catch (error) {
      console.error('Unable to load device settings:', error);
      Alert.alert(
        'Settings unavailable',
        'Vitality could not read notification or location settings. Please try again.',
      );
    } finally {
      setNotificationsLoading(false);
      setLocationLoading(false);
    }

    try {
      setBackgroundHealthSync(await isBackgroundHealthSyncEnabled());
    } catch (error) {
      console.error('Unable to load background health sync settings:', error);
      Alert.alert(
        'Health sync settings unavailable',
        'Vitality could not check Health Connect background access. Your other device settings are still available.',
      );
    } finally {
      setBackgroundHealthSyncLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshDeviceSettings();
    }, [refreshDeviceSettings]),
  );

  const handlePushNotificationsChange = async (enabled: boolean) => {
    if (notificationsLoading) return;
    if (enabled) {
      setNotificationsLoading(true);
      try {
        const granted = await requestNotificationPermission();
        setPushNotifications(granted);
        if (!granted) {
          Alert.alert(
            'Notifications not allowed',
            'Allow notifications for Vitality in your device settings to turn this on.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  openNotificationSettings().catch(error => {
                    console.error(
                      'Unable to open notification settings:',
                      error,
                    );
                    Alert.alert(
                      'Could not open settings',
                      'Open Vitality’s notification settings from your device settings.',
                    );
                  });
                },
              },
            ],
          );
        }
      } catch (error) {
        console.error('Unable to request notification permission:', error);
        Alert.alert(
          'Notification permission failed',
          'Vitality could not request notification permission. Try again in device settings.',
        );
      } finally {
        setNotificationsLoading(false);
      }
      return;
    }
    Alert.alert(
      'Turn off notifications?',
      'Notification permission is managed by your device. Open Vitality’s notification settings to turn it off.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            openNotificationSettings().catch(error => {
              console.error('Unable to open notification settings:', error);
              Alert.alert(
                'Could not open settings',
                'Turn off Vitality notifications from your device settings.',
              );
            });
          },
        },
      ],
    );
  };

  const startLocationTracking = async () => {
    setLocationLoading(true);
    try {
      const authorization = await BackgroundGeolocation.requestPermission(
        BackgroundGeolocation.Permission.Location,
      );
      const hasBackgroundAuthorization =
        authorization === BackgroundGeolocation.AuthorizationStatus.Always;
      if (!hasBackgroundAuthorization) {
        Alert.alert(
          'Background location required',
          'Continuous tracking needs “Allow all the time” location access. Update Vitality’s location permission in device settings, then enable tracking again.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openSettings().catch(error => {
                  console.error('Unable to open location settings:', error);
                  Alert.alert(
                    'Could not open settings',
                    'Update Vitality’s location permission in your device settings.',
                  );
                });
              },
            },
          ],
        );
        return;
      }
      const state = await BackgroundGeolocation.start();
      setLocationTracking(state.enabled);
    } catch (error) {
      console.error('Unable to start background location tracking:', error);
      Alert.alert(
        'Location tracking could not start',
        'Check that location services are on and Vitality has background location permission, then try again.',
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const stopLocationTracking = async () => {
    setLocationLoading(true);
    try {
      const state = await BackgroundGeolocation.stop();
      setLocationTracking(state.enabled);
    } catch (error) {
      console.error('Unable to stop background location tracking:', error);
      Alert.alert(
        'Location tracking could not stop',
        'Vitality could not stop background location tracking. Please try again.',
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const requestAndEnableBackgroundHealthSync = async () => {
    setBackgroundHealthSyncLoading(true);
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
      setBackgroundHealthSync(true);
    } catch (error) {
      console.error('Unable to enable background health sync:', error);
      Alert.alert(
        'Background sync could not be enabled',
        error instanceof Error
          ? error.message
          : 'Connect Health Connect and allow background access, then try again.',
      );
    } finally {
      setBackgroundHealthSyncLoading(false);
    }
  };

  const handleBackgroundHealthSyncChange = (enabled: boolean) => {
    if (backgroundHealthSyncLoading) return;
    if (enabled) {
      Alert.alert(
        'Allow background health sync?',
        'Vitality will periodically read the Health Connect data you have approved and sync it to your account, even when the app is closed. Android may delay background runs to save battery. You can turn this off at any time.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Continue', onPress: requestAndEnableBackgroundHealthSync },
        ],
      );
      return;
    }
    setBackgroundHealthSyncLoading(true);
    disableBackgroundHealthSync()
      .then(() => setBackgroundHealthSync(false))
      .catch(error => {
        console.error('Unable to disable background health sync:', error);
        Alert.alert(
          'Could not turn off background sync',
          'Vitality could not update this setting. Please try again.',
        );
      })
      .finally(() => setBackgroundHealthSyncLoading(false));
  };

  const handleLocationTrackingChange = (enabled: boolean) => {
    if (locationLoading) return;
    if (enabled) setShowLocationConfirmation(true);
    else stopLocationTracking();
  };

  const handleStartLocationTracking = () => {
    setShowLocationConfirmation(false);
    startLocationTracking();
  };

  const selectedValues: Record<SettingsGroup, string> = {
    units,
    language,
    appearance:
      themeMode === 'system'
        ? 'System'
        : themeMode === 'dark'
        ? 'Dark'
        : 'Light',
  };

  const selectValue = (group: SettingsGroup, value: string) => {
    if (group === 'units') setUnits(value);
    else if (group === 'language') setLanguage(value);
    else {
      const mode: ThemeMode =
        value === 'Light' ? 'light' : value === 'Dark' ? 'dark' : 'system';
      setThemeMode(mode);
    }
    setActiveGroup(null);
  };

  return {
    pushNotifications,
    notificationsLoading,
    emailDigests,
    setEmailDigests,
    challengeAlerts,
    setChallengeAlerts,
    locationTracking,
    locationLoading,
    backgroundHealthSync,
    backgroundHealthSyncLoading,
    units,
    language,
    activeGroup,
    setActiveGroup,
    modalVisible,
    setModalVisible,
    showLocationConfirmation,
    setShowLocationConfirmation,
    handleSignOut,
    handlePushNotificationsChange,
    handleBackgroundHealthSyncChange,
    handleLocationTrackingChange,
    handleStartLocationTracking,
    selectedValues,
    selectValue,
  };
}
