import React, { Suspense } from 'react';
import { Modal, Pressable, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppSettingsRow, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.Setting';
import SettingsSection from './components/SettingsSection';
import useSettings, {
  groupOptions,
  type SettingsNavigation,
} from './useSettings';
import AppIcon from '../../../assets/appicon/AppIcon';

const LogoutModal = React.lazy(() => import('../../../components/LogoutModal'));
const ConfirmationModal = React.lazy(
  () => import('../../../components/ConfirmationModal'),
);

const Settings = ({ navigation }: { navigation: SettingsNavigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const {
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
  } = useSettings();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
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

        {Platform.OS === 'android' && Number(Platform.Version) >= 34 ? (
          <SettingsSection title="Health Data" colors={colors} styles={styles}>
            <AppSettingsRow
              icon="❤️"
              title="Background Health Sync"
              description={
                backgroundHealthSyncLoading
                  ? 'Checking background access…'
                  : backgroundHealthSync
                  ? 'Periodically sync approved Health Connect data'
                  : 'Sync approved health data while the app is closed'
              }
              switchValue={backgroundHealthSync}
              onSwitchChange={handleBackgroundHealthSyncChange}
              showDivider={false}
            />
          </SettingsSection>
        ) : null}

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
            onPress={() => {}}
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
                <AppIcon name="X" size={18} color={colors.textSecondary} />
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
                        <AppIcon
                          name="Check"
                          size={18}
                          color={colors.primary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })
              : null}
          </Pressable>
        </Pressable>
      </Modal>

      <Suspense fallback={null}>
        <LogoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSignOut={handleSignOut}
        />
      </Suspense>
      <Suspense fallback={null}>
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
      </Suspense>
    </View>
  );
};

export default Settings;
