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
import { spacing } from '../../../theme/spacing';

const PrivacyScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const [leaderboards, setLeaderboards] = useState(true);
  const [activity, setActivity] = useState(true);
  const [stats, setStats] = useState(false);
  const [employer, setEmployer] = useState(true);
  const [research, setResearch] = useState(false);
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleDeleteConfirmation = () => {
    setDeleteAccount(false);
    Alert.alert(
      'Account deletion unavailable',
      'Account deletion is not connected yet. No account data has been deleted.',
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <AppHeader
        title="Privacy & Permissions"
        subtitle="Control who sees your data"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileSectionLabel>Profile Visibility</ProfileSectionLabel>
        <ProfileCard>
          <ProfileToggleRow
            icon="Trophy"
            title="Show on Leaderboards"
            detail="Appear to friends and teammates"
            value={leaderboards}
            onChange={setLeaderboards}
          />
          <ProfileToggleRow
            icon="SlidersHorizontal"
            title="Show Activity in Feed"
            detail="Let friends see workouts and milestones"
            value={activity}
            onChange={setActivity}
          />
          <ProfileToggleRow
            icon="Eye"
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
            icon="UsersRound"
            title="Share with Employer (Anonymous)"
            detail="Only aggregated team data is shared"
            value={employer}
            onChange={setEmployer}
          />
          <ProfileToggleRow
            icon="Search"
            title="Research Participation"
            detail="Contribute de-identified data to studies"
            value={research}
            onChange={setResearch}
          />
          <ProfileListRow
            icon="Upload"
            title="Export My Data"
            detail="Download a copy of your health records"
            onPress={() =>
              Alert.alert(
                'Data export requested',
                'We will notify you when your export is ready.',
              )
            }
            last
          />
        </ProfileCard>

        <AppText
          onPress={() => setDeleteAccount(true)}
          variant="body2"
          bold
          style={[styles.deleteButtonText, { color: colors.error }]}
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
          style={[styles.deleteModalButton, { backgroundColor: colors.coral, borderRadius: radius.md }]}
        >
          <AppText variant="button" color="textInverse">
            Delete Forever
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => setDeleteAccount(false)}
          accessibilityRole="button"
          style={[
            styles.keepModalButton,
            {
              backgroundColor: colors.backgroundSecondary,
              borderRadius: radius.md,
            },
          ]}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.huge + spacing.xxxl,
    padding: spacing.base,
  },
  deleteButtonText: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  deleteModalButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepModalButton: {
    marginTop: spacing.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PrivacyScreen;
