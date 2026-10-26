import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User, Settings, ShoppingBag, Users } from 'lucide-react-native';
import HomeStack from './HomeStack';
import ChallengesStack from './ChallengesStack';
import GroupsStack from './GroupsStack';
import DiscoverStack from './DiscoverStack';
import ProfileStack from './ProfileStack';

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
  <Home color={color} size={size} />
);
const ChallengesTabIcon = ({ color, size }: TabIconProps) => (
  <ShoppingBag color={color} size={size} />
);
const GroupsTabIcon = ({ color, size }: TabIconProps) => (
  <Users color={color} size={size} />
);
const DiscoverTabIcon = ({ color, size }: TabIconProps) => (
  <Settings color={color} size={size} />
);
const ProfileTabIcon = ({ color, size }: TabIconProps) => (
  <User color={color} size={size} />
);

const MainTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
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

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default MainTabNavigation;
