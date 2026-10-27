import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';
import {
  ProfileCard,
  ProfileListRow,
  ProfileScreen,
  ProfileToggleRow,
} from '../../../components';

const PrivacyScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const [leaderboards, setLeaderboards] = useState(true);
  const [activity, setActivity] = useState(true);
  const [stats, setStats] = useState(false);
  const [employer, setEmployer] = useState(true);
  const [research, setResearch] = useState(false);

  return (
    <ProfileScreen
      navigation={navigation}
      title="Privacy & Permissions"
      subtitle="Control who sees your data"
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
        <ProfileListRow icon="❤️" title="Health Data Access" action="Allowed" />
        <ProfileListRow icon="🔔" title="Notifications" action="Not set" />
        <ProfileListRow icon="📍" title="Location" action="While Using" last />
      </ProfileCard>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  permissionCard: { marginBottom: 0 },
});

export default PrivacyScreen;
