import React, { Suspense } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import { AppSettingsRow, AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';
import createStyles from './styles.Profile';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';
import { AppEmptyState, AppErrorView, AppLoader } from '../../../components';
import useProfile from './useProfile';
import AppIcon from '../../../assets/appicon/AppIcon';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const LogoutModal = React.lazy(
    () => import('../../../components/LogoutModal'),
  );

  const navigation = useNavigation<ProfileNavigationProp>();
  const {
    menuItems,
    user,
    points,
    walletLoading,
    profileLoading,
    profileError,
    refreshProfile,
    modalVisible,
    setModalVisible,
    handleMenuPress,
    handleSignOut,
    name,
    profileImageUrl,
    phone,
    initials,
  } = useProfile(navigation, colors);

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
            <AppIcon name="Bell" size={19} color={colors.warning} />
          </Pressable>

          <View style={styles.smallAvatar}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={{ width: '100%', height: '100%', borderRadius: 22 }}
              />
            ) : (
              <AppText variant="subtitle2" color="white" bold>
                {initials}
              </AppText>
            )}
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
        {!user && profileLoading ? (
          <AppLoader message="Loading your profile…" />
        ) : !user && profileError ? (
          <AppErrorView message={profileError} onRefresh={refreshProfile} />
        ) : !user ? (
          <AppEmptyState
            title="Profile unavailable"
            description="Sign in again to view your account details."
          />
        ) : (
          <>
            {/* Profile information */}
            <View style={styles.profileSection}>
              <View style={styles.largeAvatar}>
                {profileImageUrl ? (
                  <Image
                    source={{ uri: profileImageUrl }}
                    style={{ width: '100%', height: '100%', borderRadius: 44 }}
                  />
                ) : (
                  <AppText variant="display" color="white">
                    {initials}
                  </AppText>
                )}
              </View>

              <AppText variant="h3" center mt={spacing.md}>
                {name || 'Your profile'}
              </AppText>

              <AppText
                variant="caption"
                secondary
                center
                style={styles.emailText}
              >
                {[user?.email, phone].filter(Boolean).join(' · ') || ' '}
              </AppText>
            </View>

            {/* Rewards and activity summary */}
            <View
              style={[styles.statsCard, { backgroundColor: colors.surface }]}
            >
              {[
                {
                  value: walletLoading ? '…' : points.toLocaleString(),
                  label: 'Points',
                },
                { value: '—', label: 'Day Streak' },
                { value: '—', label: 'Badges' },
                { value: '—', label: 'Rank' },
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

            <View
              style={[styles.menuCard, { backgroundColor: colors.surface }]}
            >
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

                  <AppIcon
                    name="ChevronRight"
                    size={18}
                    color={colors.textTertiary}
                  />
                </Pressable>
              ))}
            </View>
            <AppSettingsRow
              icon="🚪"
              title="Sign Out"
              value=""
              onPress={() => setModalVisible(true)}
              showDivider={false}
            />
          </>
        )}
      </ScrollView>
      <Suspense fallback={null}>
        <LogoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSignOut={handleSignOut}
        />
      </Suspense>
    </View>
  );
};

export default ProfileScreen;
