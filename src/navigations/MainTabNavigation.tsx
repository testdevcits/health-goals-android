import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import ChallengesStack from './ChallengesStack';
import GroupsStack from './GroupsStack';
import DiscoverStack from './DiscoverStack';
import ProfileStack from './ProfileStack';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useTheme } from '../theme/useTheme';
import AppIcon from '../assets/appicon/AppIcon';

export type MainTabParamList = {
  HomeTab: undefined;
  ChallengesTab: undefined;
  GroupsTab: undefined;
  DiscoverTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = { color: string; size: number };

const HomeTabIcon = ({ color, size }: TabIconProps) => (
  <AppIcon name="House" color={color} size={size} />
);
const ChallengesTabIcon = ({ color, size }: TabIconProps) => (
  <AppIcon name="Trophy" color={color} size={size} />
);
const GroupsTabIcon = ({ color, size }: TabIconProps) => (
  <AppIcon name="UsersRound" color={color} size={size} />
);
const DiscoverTabIcon = ({ color, size }: TabIconProps) => (
  <AppIcon name="Compass" color={color} size={size} />
);
const ProfileTabIcon = ({ color, size }: TabIconProps) => (
  <AppIcon name="UserRound" color={color} size={size} />
);

const MainTabNavigation = () => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      detachInactiveScreens
      screenOptions={{
        headerShown: false,
        lazy: true,
        animation: 'none',
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeTabIcon,
        }}
      />

      <Tab.Screen
        name="ChallengesTab"
        component={ChallengesStack}
        options={{
          tabBarLabel: 'Challenges',
          tabBarIcon: ChallengesTabIcon,
        }}
      />

      <Tab.Screen
        name="GroupsTab"
        component={GroupsStack}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: GroupsTabIcon,
        }}
      />

      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverStack}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: DiscoverTabIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    tabBar: {
      height: 65,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      elevation: 8,
    },
    tabBarLabel: {
      fontSize: typography.tabLabel.fontSize,
      fontFamily: fonts.semiBold,
    },
  });

export default MainTabNavigation;
