
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
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
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Challenges"
                component={ChallengesStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <ShoppingBag color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Groups"
                component={GroupsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Users color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Discover"
                component={DiscoverStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Settings color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
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
