import React from 'react';
import {
  FlatList,
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
  Bike,
  Compass,
  Dumbbell,
  Footprints,
  Home,
  Mountain,
  PersonStanding,
  Waves,
  UserRound,
  Users,
  Trophy,
  Flame,
  Activity,
  CircleUserRound,
} from 'lucide-react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import styles from './styles.Categories';

type WorkoutCategory = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tint: string;
};

const categories: WorkoutCategory[] = [
  {
    id: 'running',
    title: 'Running',
    subtitle: 'Cardio & Endurance',
    emoji: '🏃',
    tint: '#FCE8E8',
  },
  {
    id: 'walking',
    title: 'Walking',
    subtitle: 'Low impact steps',
    emoji: '🚶',
    tint: '#DDF7F1',
  },
  {
    id: 'cycling',
    title: 'Cycling',
    subtitle: 'Outdoor & Indoor',
    emoji: '🚴',
    tint: '#E5EFFC',
  },
  {
    id: 'strength',
    title: 'Strength',
    subtitle: 'Weights & Resistance',
    emoji: '🏋️',
    tint: '#EEE8FF',
  },
  {
    id: 'yoga',
    title: 'Yoga',
    subtitle: 'Flexibility & Mind',
    emoji: '🧘',
    tint: '#FFF0DE',
  },
  {
    id: 'hiit',
    title: 'HIIT',
    subtitle: 'High Intensity',
    emoji: '🔥',
    tint: '#FFE5E5',
  },
  {
    id: 'swimming',
    title: 'Pool swim',
    subtitle: 'Full body cardio',
    emoji: '🏊',
    tint: '#E1F3FF',
  },
  {
    id: 'circuit',
    title: 'Circuit training',
    subtitle: 'Full body workout',
    emoji: '🤸',
    tint: '#F6E7FF',
  },
  {
    id: 'hiking',
    title: 'Hiking',
    subtitle: 'Outdoor trails',
    emoji: '🥾',
    tint: '#E0F5EE',
  },
  {
    id: 'machines',
    title: 'Weight machines',
    subtitle: 'Gym equipment',
    emoji: '🏋️',
    tint: '#EDF1F4',
  },
  {
    id: 'indoor-bike',
    title: 'Bike indoor',
    subtitle: 'Stationary cycling',
    emoji: '🚲',
    tint: '#F1E6FA',
  },
  {
    id: 'treadmill',
    title: 'Treadmill',
    subtitle: 'Indoor running',
    emoji: '🏃',
    tint: '#DFF6F1',
  },
  {
    id: 'elliptical',
    title: 'Elliptical trainer',
    subtitle: 'Low impact gym',
    emoji: '🚴',
    tint: '#E4F0FC',
  },
  {
    id: 'dance',
    title: 'Dance',
    subtitle: 'Fun cardio',
    emoji: '💃',
    tint: '#FBE5FA',
  },
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Abs & Stability',
    emoji: '🤸',
    tint: '#FFF3DA',
  },
  {
    id: 'stretch',
    title: 'Stretch',
    subtitle: 'Recovery & Mobility',
    emoji: '🧘',
    tint: '#DDF7F1',
  },
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
  onCategoryPress?: (category: WorkoutCategory) => void;
  onTabPress?: (tab: string) => void;
  activeTab?: string;
};

const WorkoutCategoriesScreen: React.FC<Props> = ({
  onBack,
  onNotificationPress,
  onProfilePress,
  onCategoryPress,
  onTabPress,
  activeTab = 'home',
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const renderCategory = ({ item }: { item: WorkoutCategory }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item?.title}, ${item?.subtitle}`}
      onPress={() => onCategoryPress?.(item)}
      style={({ pressed }) => [
        styles.categoryCard,
        {
          backgroundColor: colors.surface,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.emojiBox, { backgroundColor: item?.tint }]}>
        <AppText style={styles.emoji}>{item?.emoji}</AppText>
      </View>

      <View style={styles.categoryText}>
        <AppText
          variant="subtitle2"
          bold
          numberOfLines={2}
          style={styles.categoryTitle}
        >
          {item?.title}
        </AppText>

        <AppText
          variant="caption"
          color="textSecondary"
          numberOfLines={2}
          style={styles.categorySubtitle}
        >
          {item?.subtitle}
        </AppText>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
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
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={[
            styles.headerButton,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <ArrowLeft size={21} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <AppText variant="h3" numberOfLines={1}>
            Workout Categories
          </AppText>
          <AppText variant="caption" color="textSecondary">
            Choose an activity to track
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}
          style={[
            styles.notificationButton,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Bell size={21} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onProfilePress}
          style={styles.avatar}
        >
          <AppText variant="subtitle2" style={styles.avatarText}>
            AJ
          </AppText>
        </Pressable>
      </View>

      {/* Workout grid */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item?.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={7}
      />

      {/* Bottom navigation */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.divider,
          },
        ]}
      >
        {tabs.map(({ id, label, Icon }) => {
          const selected = activeTab === id;

          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              onPress={() => onTabPress?.(id)}
              style={styles.tabItem}
            >
              <Icon
                size={22}
                strokeWidth={selected ? 2.5 : 1.8}
                color={selected ? colors.primary : colors.textTertiary}
              />
              <AppText
                variant="caption"
                medium={selected}
                style={{
                  color: selected ? colors.primary : colors.textSecondary,
                  marginTop: 3,
                }}
              >
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

export default WorkoutCategoriesScreen;
