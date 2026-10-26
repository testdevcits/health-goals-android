import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { AppHeader, AppSettingsRow, AppText } from '../../../components';
import type { AppColors } from '../../../theme/colors';
import { useTheme } from '../../../theme/useTheme';
import type { ThemeMode } from '../../../theme/ThemeProvider';
import styles from './styles.Setting';

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

export default Settings;
