import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import ChallengesStack from './ChallengesStack';
import GroupsStack from './GroupsStack';
import DiscoverStack from './DiscoverStack';
import ProfileStack from './ProfileStack';
import { fonts } from '../theme/fonts';
import { useTheme } from '../theme/useTheme';
import AppIcon from '../assets/appicon/AppIcon';

type MainTabParamList = {
  Home: undefined;
  Challenges: undefined;
  Groups: undefined;
  Discover: undefined;
  Profile: undefined;
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
  const styles = createStyles(theme.colors);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: HomeTabIcon,
        }}
      />

      <Tab.Screen
        name="Challenges"
        component={ChallengesStack}
        options={{
          tabBarIcon: ChallengesTabIcon,
        }}
      />

      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          tabBarIcon: GroupsTabIcon,
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverStack}
        options={{
          tabBarIcon: DiscoverTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
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
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      elevation: 8,
    },
    tabBarLabel: {
      fontSize: 10,
      fontFamily: fonts.semiBold,
    },
  });

export default MainTabNavigation;
