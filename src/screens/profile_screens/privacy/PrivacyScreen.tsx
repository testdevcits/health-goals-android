import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';
import {
  AppHeader,
  AppText,
  ConfirmationModal,
  ProfileCard,
  ProfileListRow,
  ProfileToggleRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';

const PrivacyScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const [leaderboards, setLeaderboards] = useState(true);
  const [activity, setActivity] = useState(true);
  const [stats, setStats] = useState(false);
  const [employer, setEmployer] = useState(true);
  const [research, setResearch] = useState(false);
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleDeleteConfirmation = () => {
    setDeleteAccount(false);
    Alert.alert(
      'Account deletion unavailable',
      'Account deletion is not connected yet. No account data has been deleted.',
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Privacy & Permissions"
        subtitle="Control who sees your data"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
        <ProfileSectionLabel>Profile Visibility</ProfileSectionLabel>
        <ProfileCard>
          <ProfileToggleRow
            icon="🏆"
            title="Show on Leaderboards"
            detail="Appear to friends and teammates"
            value={leaderboards}
            onChange={setLeaderboards}
          />
          <ProfileToggleRow
            icon="▤"
            title="Show Activity in Feed"
            detail="Let friends see workouts and milestones"
            value={activity}
            onChange={setActivity}
          />
          <ProfileToggleRow
            icon="👀"
            title="Friends Can View My Stats"
            detail="Steps, sleep, and heart-rate summaries"
            value={stats}
            onChange={setStats}
            last
          />
        </ProfileCard>
        <ProfileSectionLabel>Data Sharing</ProfileSectionLabel>
        <ProfileCard>
          <ProfileToggleRow
            icon="▦"
            title="Share with Employer (Anonymous)"
            detail="Only aggregated team data is shared"
            value={employer}
            onChange={setEmployer}
          />
          <ProfileToggleRow
            icon="🔬"
            title="Research Participation"
            detail="Contribute de-identified data to studies"
            value={research}
            onChange={setResearch}
          />
          <ProfileListRow
            icon="📤"
            title="Export My Data"
            detail="Download a copy of your health records"
            onPress={() =>
              Alert.alert(
                'Data export requested',
                'We’ll notify you when your export is ready.',
              )
            }
            last
          />
        </ProfileCard>
        <ProfileSectionLabel>App Permissions</ProfileSectionLabel>
        <ProfileCard style={styles.permissionCard}>
          <ProfileListRow
            icon="❤️"
            title="Health Data Access"
            action="Allowed"
          />
          <ProfileListRow icon="🔔" title="Notifications" action="Not set" />
          <ProfileListRow
            icon="📍"
            title="Location"
            action="While Using"
            last
          />
        </ProfileCard>
        <AppText
          onPress={() => setDeleteAccount(true)}
          variant="body2"
          bold
          style={{ color: colors.error, alignSelf: 'center', marginTop: 20 }}
        >
          Delete My Account
        </AppText>
      </ScrollView>
      <ConfirmationModal
        visible={deleteAccount}
        onClose={() => setDeleteAccount(false)}
        title="Delete Account"
        message="This permanently deletes your profile, health history, group memberships, and unredeemed points. This cannot be undone."
        position="bottom"
      >
        <Pressable
          onPress={handleDeleteConfirmation}
          accessibilityRole="button"
          style={{
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.coral,
            borderRadius: theme.radius.md,
          }}
        >
          <AppText variant="button" color="textInverse">
            Delete Forever
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => setDeleteAccount(false)}
          accessibilityRole="button"
          style={{
            marginTop: spacing.sm,
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: theme.radius.md,
          }}
        >
          <AppText variant="button" color="textPrimary">
            Keep My Account
          </AppText>
        </Pressable>
      </ConfirmationModal>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionCard: { marginBottom: 0 },
});

export default PrivacyScreen;
