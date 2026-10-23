import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Check, ChevronLeft, X } from 'lucide-react-native';
import { AppSettingsRow, AppText } from '../../../components';
import type { AppColors } from '../../../theme/colors';
import { useTheme } from '../../../theme/useTheme';
import type { ThemeMode } from '../../../theme/ThemeProvider';

type SettingsGroup = 'units' | 'language' | 'appearance';
type SettingsNavigation = {
  goBack: () => void;
  navigate: (screen: 'EditProfile' | 'ChangePassword') => void;
};

const groupOptions: Record<SettingsGroup, string[]> = {
  units: ['Metric', 'Imperial'],
  language: ['English', 'हिन्दी'],
  appearance: ['Light', 'Dark', 'System'],
};

const Settings = ({ navigation }: { navigation: SettingsNavigation }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailDigests, setEmailDigests] = useState(true);
  const [challengeAlerts, setChallengeAlerts] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [units, setUnits] = useState('Metric');
  const [language, setLanguage] = useState('हिन्दी');
  const [activeGroup, setActiveGroup] = useState<SettingsGroup | null>(null);

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
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        
        <View style={styles.headerMain}>
          <Pressable
            onPress={navigation.goBack}
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerCopy}>
            <AppText variant="h3">Settings</AppText>
            <AppText variant="caption" secondary>
              Notifications, preferences, and account
            </AppText>
          </View>
          <Pressable
            style={[
              styles.headerIcon,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={19} color={colors.warning} />
          </Pressable>
          <View style={[styles.avatar, { backgroundColor: colors.info }]}>
            <AppText variant="subtitle2" color="white" bold>
              AJ
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <SettingsSection title="Notifications" colors={colors}>
          <AppSettingsRow
            icon="🔔"
            title="Push Notifications"
            description="Workouts, reminders, and nudges"
            switchValue={pushNotifications}
            onSwitchChange={setPushNotifications}
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

        <SettingsSection title="Preferences" colors={colors}>
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
            description="For route and outdoor workouts"
            switchValue={locationTracking}
            onSwitchChange={setLocationTracking}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="Account" colors={colors}>
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
    </View>
  );
};

const SettingsSection = ({
  title,
  colors,
  children,
}: {
  title: string;
  colors: AppColors;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <AppText variant="label" color="textTertiary" style={styles.sectionTitle}>
      {title.toUpperCase()}
    </AppText>
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
   
  headerMain: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    marginLeft: 4,
    marginBottom: 8,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '65%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
});

export default Settings;
