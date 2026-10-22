
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
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
import styles from './styles.WorkoutSession';
import { useTheme } from '../../../theme/useTheme';



type Activity = {
    id: string;
    name: string;
    emoji: string;
    color: string;
};

const activities: Activity[] = [
    { id: 'running', name: 'Running', emoji: '🏃', color: '#FF666B' },
    { id: 'walking', name: 'Walking', emoji: '🚶', color: '#14B8A6' },
    { id: 'cycling', name: 'Cycling', emoji: '🚴', color: '#4389E8' },
    { id: 'strength', name: 'Strength', emoji: '🏋️', color: '#8B73ED' },
    { id: 'yoga', name: 'Yoga', emoji: '🧘', color: '#F5A84D' },
    { id: 'hiit', name: 'HIIT', emoji: '🔥', color: '#FF7043' },
    { id: 'swimming', name: 'Swimming', emoji: '🏊', color: '#38A5E8' },
    { id: 'stretch', name: 'Stretch', emoji: '🤸', color: '#13B8A6' },
    { id: 'hiking', name: 'Hiking', emoji: '🥾', color: '#8B7355' },
    { id: 'machines', name: 'Weight machines', emoji: '🏋🏻', color: '#64748B' },
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
    onFinish?: (session: {
        activity: Activity;
        durationSeconds: number;
        distanceKm: number;
        calories: number;
    }) => void;
    onTabPress?: (tab: string) => void;
    activeTab?: string;
};

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const WorkoutSessionScreen: React.FC<Props> = ({
    onBack,
    onNotificationPress,
    onProfilePress,
    onFinish,
    onTabPress,
    activeTab = 'home',
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const [selectedActivity, setSelectedActivity] = useState(activities[0]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const startedAtRef = useRef<number | null>(null);
    const elapsedBeforePauseRef = useRef(0);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const interval = setInterval(() => {
            if (startedAtRef.current !== null) {
                setElapsedSeconds(
                    elapsedBeforePauseRef.current +
                    Math.floor((Date.now() - startedAtRef.current) / 1000),
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    // Basic estimates for running/walking/cycling.
    // Replace with GPS or activity-specific calculations when implemented.
    const speedKmh =
        selectedActivity.id === 'running'
            ? 9.6
            : selectedActivity.id === 'walking'
                ? 5
                : selectedActivity.id === 'cycling'
                    ? 18
                    : 0;

    const distanceKm = Number(
        ((speedKmh * elapsedSeconds) / 3600).toFixed(2),
    );

    const caloriesPerMinute =
        selectedActivity.id === 'running'
            ? 10
            : selectedActivity.id === 'walking'
                ? 4
                : selectedActivity.id === 'cycling'
                    ? 8
                    : selectedActivity.id === 'strength'
                        ? 5
                        : selectedActivity.id === 'hiit'
                            ? 12
                            : 3;

    const calories = Math.floor(
        (elapsedSeconds / 60) * caloriesPerMinute,
    );

    const handleStartPause = () => {
        if (isRunning) {
            elapsedBeforePauseRef.current = elapsedSeconds;
            startedAtRef.current = null;
            setIsRunning(false);
            return;
        }

        startedAtRef.current = Date.now();
        setHasStarted(true);
        setIsRunning(true);
    };

    const handleSelectActivity = (activity: Activity) => {
        if (hasStarted) {
            Alert.alert(
                'Change activity?',
                'Changing activity will reset the current workout.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Reset and change',
                        onPress: () => {
                            setSelectedActivity(activity);
                            setElapsedSeconds(0);
                            elapsedBeforePauseRef.current = 0;
                            startedAtRef.current = null;
                            setIsRunning(false);
                            setHasStarted(false);
                        },
                    },
                ],
            );
            return;
        }

        setSelectedActivity(activity);
    };

    const handleFinish = () => {
        if (!hasStarted || elapsedSeconds === 0) {
            Alert.alert(
                'No workout to save',
                'Start your activity and exercise for some time before saving.',
            );
            return;
        }

        Alert.alert(
            'Finish workout?',
            `Save your ${selectedActivity.name.toLowerCase()} session?`,
            [
                { text: 'Continue workout', style: 'cancel' },
                {
                    text: 'Finish & Save',
                    onPress: () => {
                        setIsRunning(false);
                        startedAtRef.current = null;

                        onFinish?.({
                            activity: selectedActivity,
                            durationSeconds: elapsedSeconds,
                            distanceKm,
                            calories,
                        });

                        setHasStarted(false);
                        setElapsedSeconds(0);
                        elapsedBeforePauseRef.current = 0;
                    },
                },
            ],
        );
    };

    const handleBack = () => {
        if (hasStarted && elapsedSeconds > 0) {
            Alert.alert(
                'Workout in progress',
                'Leaving this screen may interrupt your workout. What would you like to do?',
                [
                    { text: 'Stay', style: 'cancel' },
                    {
                        text: 'Discard workout',
                        style: 'destructive',
                        onPress: () => {
                            setIsRunning(false);
                            startedAtRef.current = null;
                            setElapsedSeconds(0);
                            elapsedBeforePauseRef.current = 0;
                            setHasStarted(false);
                            onBack?.();
                        },
                    },
                ],
            );
            return;
        }

        onBack?.();
    };

    const MetricCard = ({
        emoji,
        value,
        unit,
        label,
        tint,
    }: {
        emoji: string;
        value: string;
        unit?: string;
        label: string;
        tint: string;
    }) => (
        <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.metricIcon, { backgroundColor: tint }]}>
                <AppText style={styles.metricEmoji}>{emoji}</AppText>
            </View>

            <View style={styles.metricValueRow}>
                <AppText variant="h3">{value}</AppText>
                {unit ? (
                    <AppText variant="caption" color="textSecondary">
                        {unit}
                    </AppText>
                ) : null}
            </View>

            <AppText variant="caption" color="textSecondary">
                {label}
            </AppText>
        </View>
    );

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
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    style={[
                        styles.headerButton,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}>
                    <ArrowLeft size={20} color={colors.textPrimary} />
                </Pressable>

                <View style={styles.headerTitle}>
                    <AppText variant="h3">Workout</AppText>
                    <AppText variant="caption" color="textSecondary">
                        Track your session
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
                {/* Activity selector */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.activitySelector}>
                    {activities.map(activity => {
                        const selected = selectedActivity.id === activity.id;

                        return (
                            <Pressable
                                key={activity.id}
                                onPress={() => handleSelectActivity(activity)}
                                accessibilityRole="button"
                                accessibilityLabel={`Select ${activity.name}`}
                                accessibilityState={{ selected }}
                                style={[
                                    styles.activityChip,
                                    {
                                        backgroundColor: selected
                                            ? colors.surface
                                            : colors.surfaceElevated,
                                        borderColor: selected ? colors.border : 'transparent',
                                    },
                                    selected && styles.selectedChip,
                                ]}>
                                <AppText style={styles.activityEmoji}>
                                    {activity.emoji}
                                </AppText>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Workout timer */}
                <View
                    style={[
                        styles.workoutHero,
                        { backgroundColor: selectedActivity.color },
                    ]}>
                    <AppText style={styles.heroEmoji}>
                        {selectedActivity.emoji}
                    </AppText>

                    <AppText variant="h3" style={styles.heroActivityName}>
                        {selectedActivity.name.toUpperCase()}
                    </AppText>

                    {/* Heartbeat-style decorative line */}
                    <View style={styles.heartbeat}>
                        <View style={styles.heartbeatLine} />
                        <View style={styles.heartbeatPeakOne} />
                        <View style={styles.heartbeatPeakTwo} />
                        <View style={styles.heartbeatLineEnd} />
                    </View>

                    <AppText style={styles.timer}>
                        {formatTime(elapsedSeconds)}
                    </AppText>

                    <AppText variant="caption" style={styles.timerStatus}>
                        {isRunning
                            ? 'Workout in progress'
                            : hasStarted
                                ? 'Workout paused'
                                : 'Ready to start'}
                    </AppText>
                </View>

                {/* Workout metrics */}
                <View style={styles.metricsGrid}>
                    <MetricCard
                        emoji="📏"
                        value={distanceKm.toFixed(2)}
                        unit="km"
                        label="Distance"
                        tint="#DDF7F1"
                    />
                    <MetricCard
                        emoji="🔥"
                        value={String(calories)}
                        unit="kcal"
                        label="Calories"
                        tint="#FFF0DE"
                    />
                    <MetricCard
                        emoji="❤️"
                        value="--"
                        unit="bpm"
                        label="Heart rate"
                        tint="#FFE8E8"
                    />
                    <MetricCard
                        emoji="⚡"
                        value="--"
                        label="Avg pace"
                        tint="#E9EAFE"
                    />
                </View>

                {/* Workout controls */}
                <Pressable
                    onPress={handleStartPause}
                    accessibilityRole="button"
                    style={[
                        styles.startButton,
                        { backgroundColor: selectedActivity.color },
                    ]}>
                    <AppText variant="button" style={styles.startButtonText}>
                        {isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
                    </AppText>
                </Pressable>

                <Pressable
                    onPress={handleFinish}
                    accessibilityRole="button"
                    style={styles.finishButton}>
                    <AppText
                        variant="subtitle2"
                        style={{ color: colors.textPrimary }}>
                        Finish & Save
                    </AppText>
                </Pressable>
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



export default WorkoutSessionScreen;
