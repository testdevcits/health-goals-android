
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Pressable,
    Dimensions,
} from 'react-native';
import {
    ArrowLeft,
    Bell,
    Home,
    Trophy,
    Users,
    Compass,
    UserRound,
} from 'lucide-react-native';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import styles from './styles.CategoriesDetails';




const SCREEN_WIDTH = Dimensions.get('window').width;

const weeklyData = [
    { day: 'Mon', value: 42 },
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 4 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 65 },
    { day: 'Sun', value: 4 },
];

const tabs = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'challenges', label: 'Challenges', Icon: Trophy },
    { id: 'groups', label: 'Groups', Icon: Users },
    { id: 'discover', label: 'Discover', Icon: Compass },
    { id: 'profile', label: 'Profile', Icon: UserRound },
];

type Props = {
    onBack?: () => void;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
    onTabPress?: (tab: string) => void;
    activeTab?: string;
};

const RunningDetailsScreen: React.FC<Props> = ({
    onBack,
    onNotificationPress,
    onProfilePress,
    onTabPress,
    activeTab = 'home',
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.background,
                        borderBottomColor: colors.divider,
                    },
                ]}>
                <Pressable
                    onPress={onBack}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    style={[
                        styles.headerButton,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}>
                    <ArrowLeft size={20} color={colors.textPrimary} />
                </Pressable>

                <View style={styles.headerTitle}>
                    <AppText variant="h3">Running</AppText>
                    <AppText variant="caption" color="textSecondary">
                        Cardio & Endurance
                    </AppText>
                </View>

                <Pressable
                    onPress={onNotificationPress}
                    accessibilityRole="button"
                    accessibilityLabel="Notifications"
                    style={[
                        styles.headerButton,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}>
                    <Bell size={20} color={colors.textPrimary} />
                    <View style={styles.notificationDot} />
                </Pressable>

                <Pressable
                    onPress={onProfilePress}
                    accessibilityRole="button"
                    accessibilityLabel="Open profile"
                    style={styles.avatar}>
                    <AppText variant="subtitle2" style={styles.avatarText}>
                        AJ
                    </AppText>
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* Running hero card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroCircle} />
                    <AppText style={styles.runnerEmoji}>🏃</AppText>
                    <AppText variant="h2" style={styles.heroTitle}>
                        Running
                    </AppText>
                    <AppText variant="body2" style={styles.heroSubtitle}>
                        Cardio & Endurance
                    </AppText>
                </View>

                {/* Activity information */}
                <View
                    style={[
                        styles.infoCard,
                        {
                            backgroundColor: colors.surface,
                            shadowColor: colors.black,
                        },
                    ]}>
                    <AppText variant="subtitle2" bold>
                        About this activity
                    </AppText>

                    <AppText
                        variant="body2"
                        color="textSecondary"
                        style={styles.description}>
                        Standard outdoor or treadmill running. One of the most effective
                        activities for cardiovascular health and high calorie burn.
                    </AppText>

                    <AppText variant="subtitle2" bold style={styles.calculationTitle}>
                        Calculation Rates
                    </AppText>

                    <View style={styles.rateRow}>
                        <AppText variant="body2" medium>
                            Estimated Speed
                        </AppText>
                        <AppText variant="body2" bold>
                            9.6 km/h
                        </AppText>
                    </View>

                    <View style={[styles.rateRow, styles.lastRateRow]}>
                        <AppText variant="body2" medium>
                            Calorie Burn Rate
                        </AppText>
                        <AppText variant="body2" bold>
                            10 kcal/min
                        </AppText>
                    </View>
                </View>

                {/* Summary statistics */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <AppText variant="subtitle1" bold>
                            14.8
                        </AppText>
                        <AppText variant="caption" color="textSecondary">
                            Total km
                        </AppText>
                    </View>

                    <View style={styles.statItem}>
                        <AppText variant="subtitle1" bold>
                            1h 42m
                        </AppText>
                        <AppText variant="caption" color="textSecondary">
                            Time
                        </AppText>
                    </View>

                    <View style={styles.statItem}>
                        <AppText variant="subtitle1" bold>
                            1,420
                        </AppText>
                        <AppText variant="caption" color="textSecondary">
                            Calories
                        </AppText>
                    </View>
                </View>

                {/* Weekly chart */}
                <AppText variant="h3" style={styles.chartHeading}>
                    Last 7 Days
                </AppText>

                <View
                    style={[
                        styles.chartCard,
                        {
                            backgroundColor: colors.surface,
                            shadowColor: colors.black,
                        },
                    ]}>
                    <View style={styles.chart}>
                        {weeklyData.map(item => (
                            <View key={item.day} style={styles.barColumn}>
                                <View style={styles.barTrack}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${item.value}%`,
                                                backgroundColor:
                                                    item.value <= 5 ? '#F6BFC1' : '#F16F73',
                                            },
                                        ]}
                                    />
                                </View>
                                <AppText
                                    variant="caption"
                                    color="textSecondary"
                                    style={styles.dayLabel}>
                                    {item.day}
                                </AppText>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom navigation */}
            <View
                style={[
                    styles.bottomBar,
                    {
                        backgroundColor: colors.surface,
                        borderTopColor: colors.divider,
                    },
                ]}>
                {tabs.map(({ id, label, Icon }) => {
                    const selected = activeTab === id;

                    return (
                        <Pressable
                            key={id}
                            onPress={() => onTabPress?.(id)}
                            accessibilityRole="button"
                            accessibilityLabel={label}
                            accessibilityState={{ selected }}
                            style={styles.tabItem}>
                            <Icon
                                size={21}
                                strokeWidth={selected ? 2.5 : 1.8}
                                color={selected ? colors.primary : colors.textTertiary}
                            />
                            <AppText
                                variant="caption"
                                medium={selected}
                                style={{
                                    color: selected ? colors.primary : colors.textSecondary,
                                    marginTop: 2,
                                }}>
                                {label}
                            </AppText>
                            {selected && (
                                <View
                                    style={[
                                        styles.activeIndicator,
                                        { backgroundColor: colors.primary },
                                    ]}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};



export default RunningDetailsScreen;
