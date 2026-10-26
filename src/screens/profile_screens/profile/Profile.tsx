import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronRight } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';
import styles from './styles.Profile';
import { getProfileMenuItems } from './conts';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigationProp>();
  const menuItems = useMemo(() => getProfileMenuItems(colors), [colors]);

  const profile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    membership: 'Enterprise Member',
    initials: 'AJ',
    points: '2,840',
    streak: '12',
    badges: '4',
    rank: '#4',
  };

  const handleMenuPress = (id: string) => {
    switch (id) {
      case 'settings':
        navigation.navigate('Settings');
        break;

      case 'devices':
        navigation.navigate('ConnectedDevices');
        break;

      case 'rewards':
        // navigation.navigate('Rewards');
        break;

      case 'privacy':
        // navigation.navigate('Privacy');
        break;

      case 'reports':
        // navigation.navigate('HealthReports');
        break;

      case 'support':
        // navigation.navigate('HelpSupport');
        break;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerMain}>
          <View style={styles.headerTitle}>
            <AppText variant="h3">Profile</AppText>
            <AppText variant="caption" secondary>
              Your account, rewards, and settings
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

          <View style={styles.smallAvatar}>
            <AppText variant="subtitle2" color="white" bold>
              {profile.initials}
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        {/* Profile information */}
        <View style={styles.profileSection}>
          <View style={styles.largeAvatar}>
            <AppText variant="display" color="white">
              {profile.initials}
            </AppText>
          </View>

          <AppText variant="h3" center mt={spacing.md}>
            {profile.name}
          </AppText>

          <AppText variant="caption" secondary center style={styles.emailText}>
            {profile.email} · {profile.membership}
          </AppText>
        </View>

        {/* Rewards and activity summary */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          {[
            { value: profile.points, label: 'Points' },
            { value: profile.streak, label: 'Day Streak' },
            { value: profile.badges, label: 'Badges' },
            { value: profile.rank, label: 'Rank' },
          ].map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 && (
                <View
                  style={[
                    styles.statDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}

              <View style={styles.statItem}>
                <AppText variant="subtitle1" bold center>
                  {stat.value}
                </AppText>

                <AppText variant="caption" secondary center>
                  {stat.label}
                </AppText>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Account menu */}
        <AppText variant="subtitle1" bold style={styles.sectionTitle}>
          Account
        </AppText>

        <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item?.id}
              onPress={() => handleMenuPress(item?.id)}
              style={({ pressed }) => [
                styles.menuRow,
                pressed && { backgroundColor: colors.backgroundSecondary },
                index !== menuItems.length - 1 && {
                  borderBottomColor: colors.divider,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={item?.title}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                {item.icon}
              </View>

              <AppText variant="subtitle2" bold style={styles.menuTitle}>
                {item?.title}
              </AppText>

              <ChevronRight size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';

// const Profile = () => {
//   return (
//     <View>
//       <Text>Profile</Text>
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({});
