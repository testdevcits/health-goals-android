import React, { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {
  AppHeader,
  AppSettingsRow,
  AppText,
  ConfirmationModal,
} from '../../../components';
import type { AppColors } from '../../../theme/colors';
import { useTheme } from '../../../theme/useTheme';
import type { ThemeMode } from '../../../theme/ThemeProvider';
import {
  getNotificationPermission,
  openNotificationSettings,
  requestNotificationPermission,
} from '../../../utils/AppPermissions';
import createStyles from './styles.Setting';
import LogoutModal from './components/LogoutModal';
import { logout } from '../../../services/auth';
import { navigationRef } from '../../../navigations/AppNavigation';

type SettingsGroup = 'units' | 'language' | 'appearance';
type SettingsNavigation = {
  goBack: () => void;
  navigate: (screen: 'EditProfile' | 'ChangePassword') => void;
};

const groupOptions: Record<SettingsGroup, string[]> = {
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

const Settings = ({ navigation }: { navigation: SettingsNavigation }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [challengeAlerts, setChallengeAlerts] = useState(false);
  const [locationTracking, setLocationTracking] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [units, setUnits] = useState('Metric');
  const [language, setLanguage] = useState('हिन्दी');
  const [activeGroup, setActiveGroup] = useState<SettingsGroup | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const handleSignOut = async () => {
    try { await logout(); } catch { /* Clear the local session even while offline. */ }
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

  const [showLocationConfirmation, setShowLocationConfirmation] =
    React.useState(false);

  const handleLocationTrackingChange = (enabled: boolean) => {
    if (locationLoading) return;
    if (enabled) {
      setShowLocationConfirmation(true);
    } else {
      stopLocationTracking();
    }
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
    if (group === 'units') {
      setUnits(value);
    } else if (group === 'language') {
      setLanguage(value);
    } else {
      const mode: ThemeMode =
        value === 'Light' ? 'light' : value === 'Dark' ? 'dark' : 'system';
      setThemeMode(mode);
    }
    setActiveGroup(null);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      {/* <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      /> */}

      <AppHeader
        title="Settings"
        subtitle="Notifications, preferences, and account"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <SettingsSection title="Notifications" colors={colors} styles={styles}>
          <AppSettingsRow
            icon="🔔"
            title="Push Notifications"
            description={
              notificationsLoading
                ? 'Checking device permission…'
                : 'Allow Vitality notifications on this device'
            }
            switchValue={pushNotifications}
            onSwitchChange={handlePushNotificationsChange}
          />
          <AppSettingsRow
            icon="📧"
            title="Email Digests"
            description="Weekly summary and team recaps"
            switchValue={emailDigests}
            onSwitchChange={setEmailDigests}
          />
          <AppSettingsRow
            icon="🏆"
            title="Challenge Alerts"
            description="When friends pass you or a challenge ends"
            switchValue={challengeAlerts}
            onSwitchChange={setChallengeAlerts}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="Preferences" colors={colors} styles={styles}>
          <AppSettingsRow
            icon="📏"
            title="Units"
            value={units}
            onPress={() => setActiveGroup('units')}
          />
          <AppSettingsRow
            icon="🌐"
            title="Language"
            value={language}
            onPress={() => setActiveGroup('language')}
          />
          <AppSettingsRow
            icon="🌙"
            title="Appearance"
            value={selectedValues.appearance}
            onPress={() => setActiveGroup('appearance')}
          />
          <AppSettingsRow
            icon="📍"
            title="Location Tracking"
            description={
              locationLoading
                ? 'Checking location tracking…'
                : 'Continuously record location in the background'
            }
            switchValue={locationTracking}
            onSwitchChange={handleLocationTrackingChange}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="Account" colors={colors} styles={styles}>
          <AppSettingsRow
            icon="✏️"
            title="Edit Profile"
            value=""
            onPress={() => navigation.navigate('EditProfile')}
          />
          <AppSettingsRow
            icon="🔑"
            title="Change Password"
            value=""
            onPress={() => navigation.navigate('ChangePassword')}
            showDivider={false}
          />

          <AppSettingsRow
            icon="🚪"
            title="Sign Out"
            value=""
            onPress={() => setModalVisible(true)}
            showDivider={false}
          />
        </SettingsSection>
      </ScrollView>

      <Modal
        visible={activeGroup !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setActiveGroup(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setActiveGroup(null)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.xxl,
                borderTopRightRadius: radius.xxl,
                paddingBottom: Math.max(insets.bottom, spacing.xl),
              },
            ]}
            onPress={() => { }}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <AppText variant="subtitle1" bold>
                {activeGroup
                  ? activeGroup[0].toUpperCase() + activeGroup.slice(1)
                  : ''}
              </AppText>
              <Pressable
                onPress={() => setActiveGroup(null)}
                style={[
                  styles.closeButton,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close options"
              >
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
            {activeGroup
              ? groupOptions[activeGroup].map((option, index) => {
                const selected = selectedValues[activeGroup] === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => selectValue(activeGroup, option)}
                    style={[
                      styles.option,
                      { borderBottomColor: colors.border },
                      index === groupOptions[activeGroup].length - 1 &&
                      styles.lastOption,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <AppText variant="body2" bold={selected}>
                      {option}
                    </AppText>
                    {selected ? (
                      <Check size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              })
              : null}
          </Pressable>
        </Pressable>
      </Modal>

      <LogoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSignOut={handleSignOut}
      />

      <ConfirmationModal
        visible={showLocationConfirmation}
        onClose={() => setShowLocationConfirmation(false)}
        title="Enable continuous location tracking?"
        message="Vitality will record your location in the background, including when the app is closed, until you turn this off. Location data currently stays on this device."
        position="center"
        closeOnBackdropPress={false}
        showCloseButton
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setShowLocationConfirmation(false)}
            style={styles.cancelButton}
            accessibilityRole="button"
          >
            <AppText>Cancel</AppText>
          </Pressable>

          <Pressable
            onPress={handleStartLocationTracking}
            style={styles.continueButton}
            accessibilityRole="button"
          >
            <AppText style={{ color: colors.white }}>Continue</AppText>
          </Pressable>
        </View>
      </ConfirmationModal>
    </View>
  );
};

const SettingsSection = ({
  title,
  colors,
  styles,
  children,
}: {
  title: string;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textTertiary" style={styles.sectionTitle}>
        {title?.toUpperCase()}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {children}
      </View>
    </View>
  );
};

export default Settings;
