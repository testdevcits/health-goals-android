import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { AppHeader, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import styles from './styles.CategoriesDetails';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import { WORKOUT_CATEGORIES } from '../Home/const';

const weeklyData = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 4 },
  { day: 'Wed', value: 90 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 100 },
  { day: 'Sat', value: 65 },
  { day: 'Sun', value: 4 },
];

type Props = NativeStackScreenProps<
  HomeStackParamList,
  'CategoriesDetailsScreen'
>;

const CategoriesDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const workoutId =
    route.params.source === 'home' ? route.params.workoutId : undefined;
  const homeCategory = WORKOUT_CATEGORIES.find(item => item?.id === workoutId);
  const selectedCategory =
    route.params.source === 'categories'
      ? {
          title: route.params.category.title,
          subtitle: route.params.category.subtitle,
          emoji: route.params.category.emoji,
        }
      : homeCategory
      ? {
          title: homeCategory.name,
          subtitle: homeCategory.subtitle,
          emoji: homeCategory.emoji,
        }
      : {
          title: 'Workout',
          subtitle: 'Activity details',
          emoji: '🏃',
        };

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <AppHeader
        title={selectedCategory.title}
        subtitle={selectedCategory.subtitle}
        onBackPress={navigation.goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Running hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroCircle} />
          <AppText style={styles.runnerEmoji}>{selectedCategory.emoji}</AppText>
          <AppText variant="h2" style={styles.heroTitle}>
            {selectedCategory.title}
          </AppText>
          <AppText variant="body2" style={styles.heroSubtitle}>
            {selectedCategory.subtitle}
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
          ]}
        >
          <AppText variant="subtitle2" bold>
            About this activity
          </AppText>

          <AppText
            variant="body2"
            color="textSecondary"
            style={styles.description}
          >
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
          ]}
        >
          <View style={styles.chart}>
            {weeklyData.map(item => (
              <View key={item?.day} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${item?.value}%`,
                        backgroundColor:
                          item?.value <= 5 ? '#F6BFC1' : '#F16F73',
                      },
                    ]}
                  />
                </View>
                <AppText
                  variant="caption"
                  color="textSecondary"
                  style={styles.dayLabel}
                >
                  {item?.day}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesDetailsScreen;
