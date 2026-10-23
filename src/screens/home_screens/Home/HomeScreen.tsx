// // src/screens/Home/HomeScreen.tsx
// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Bell, ChevronRight } from 'lucide-react-native';
// import { useTheme } from '../../../theme/useTheme';
// import { AppText, OnboardingModal } from '../../../components';
// import { createHomeStyles } from './styles.Home';

// // ── Static data ────────────────────────────────────────────────────────────
// const WORKOUT_CATEGORIES = [
//   { id: '1', emoji: '🏃', name: 'Running', subtitle: 'Cardio & Endurance', bg: '#FFE8E8', accent: '#EF4444' },
//   { id: '2', emoji: '🚶', name: 'Walking', subtitle: 'Low impact steps', bg: '#E0FAF5', accent: '#00C6A2' },
//   { id: '3', emoji: '🚴', name: 'Cycling', subtitle: 'Outdoor & Indoor', bg: '#E0EEFF', accent: '#3B82F6' },
//   { id: '4', emoji: '🏊', name: 'Swimming', subtitle: 'Full body workout', bg: '#EDE9FE', accent: '#7C3AED' },
//   { id: '5', emoji: '🧘', name: 'Yoga', subtitle: 'Flexibility & calm', bg: '#FEF3C7', accent: '#D97706' },
// ];

// const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// const TREND_TABS = ['Steps', 'Sleep', 'Active'] as const;
// type TrendTab = typeof TREND_TABS[number];

// const TREND_DATA: Record<TrendTab, {
//   bars: number[];
//   color: string;
//   stats: { value: string; label: string }[];
// }> = {
//   Steps: {
//     bars: [6500, 8200, 7100, 9400, 8800, 5600, 7200],
//     color: '#00C6A2',
//     stats: [
//       { value: '55,872', label: 'Total' },
//       { value: '7,981', label: 'Daily Avg' },
//       { value: '2', label: 'Days >10K' },
//     ],
//   },
//   Sleep: {
//     bars: [7.5, 6.8, 8.1, 7.2, 6.5, 8.8, 7.0],
//     color: '#7C5CBF',
//     stats: [
//       { value: '7h 16m', label: 'Avg Sleep' },
//       { value: '88%', label: 'Quality' },
//       { value: '6.4h', label: 'Lowest' },
//     ],
//   },
//   Active: {
//     bars: [45, 60, 35, 75, 55, 30, 50],
//     color: '#3B82F6',
//     stats: [
//       { value: '350', label: 'Total Mins' },
//       { value: '50', label: 'Daily Avg' },
//       { value: '1', label: 'Rest Days' },
//     ],
//   },
// };

// const QUICK_ACTIONS = [
//   { id: '1', emoji: '▶️', label: 'Start Workout', bg: '#FFF3E0', accent: '#F59E0B' },
//   { id: '2', emoji: '🏆', label: 'Join Challenge', bg: '#FFF9E0', accent: '#D97706' },
// ];

// // ── Helpers ────────────────────────────────────────────────────────────────
// const getGreeting = (): string => {
//   const h = new Date().getHours();
//   if (h >= 5 && h < 12) return 'Good morning';
//   if (h >= 12 && h < 17) return 'Good afternoon';
//   if (h >= 17 && h < 21) return 'Good evening';
//   return 'Good night';
// };

// const getFormattedDate = (): string => {
//   const now = new Date();
//   return now.toLocaleDateString('en-US', {
//     weekday: 'long',
//     month: 'long',
//     day: 'numeric',
//   });
// };

// // ── Sub-components ─────────────────────────────────────────────────────────

// const BAR_MAX_HEIGHT = 100;

// const BarChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
//   const { theme } = useTheme();
//   const { colors } = theme;
//   const styles = createHomeStyles(theme);
//   const maxVal = Math.max(...data);

//   return (
//     <View style={styles.chartArea}>
//       {data.map((val, i) => {
//         const barH = Math.max(8, (val / maxVal) * BAR_MAX_HEIGHT);
//         return (
//           <View key={i} style={styles.barWrapper}>
//             <View
//               style={[
//                 styles.bar,
//                 {
//                   height: barH,
//                   backgroundColor: color,
//                   opacity: i === 4 ? 1 : 0.65, // highlight friday as example
//                 },
//               ]}
//             />
//             <AppText variant="caption" secondary>
//               {DAYS[i]}
//             </AppText>
//           </View>
//         );
//       })}
//     </View>
//   );
// };
// // ──────────────────────────────────────────────────────────────────────────

// const HomeScreen: React.FC = () => {
//   const { theme } = useTheme();
//   const { colors, spacing, radius } = theme;
//   const insets = useSafeAreaInsets();
//   const styles = createHomeStyles(theme);

//   const [activeTab, setActiveTab] = useState<TrendTab>('Steps');
//   const [notifDismissed, setNotifDismissed] = useState(false);
//   const [onboardingVisible, setOnboardingVisible] = useState(true);

//   const trendData = TREND_DATA[activeTab];

//   const renderWorkoutCard = useCallback(
//     ({ item }: { item: typeof WORKOUT_CATEGORIES[0] }) => (
//       <TouchableOpacity activeOpacity={0.8} style={styles.workoutCard}>
//         <View style={[styles.workoutIconBox, { backgroundColor: item.bg }]}>
//           <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
//         </View>
//         <AppText variant="subtitle2" bold mb={2}>
//           {item.name}
//         </AppText>
//         <AppText variant="caption" secondary>
//           {item.subtitle}
//         </AppText>
//         {/* Accent bottom bar */}
//         <View
//           style={[styles.workoutAccentBar, { backgroundColor: item.accent }]}
//         />
//       </TouchableOpacity>
//     ),
//     [styles],
//   );

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       {/* ── Header ── */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <AppText variant="h3">
//             {getGreeting()}, Alex 👋
//           </AppText>
//           <AppText variant="caption" secondary mt={2}>
//             {getFormattedDate()} · Let's crush your goals
//           </AppText>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
//             <Bell size={20} color={colors.textSecondary} />
//           </TouchableOpacity>
//           <View style={styles.avatar}>
//             <AppText variant="label" bold color="textInverse">
//               AJ
//             </AppText>
//           </View>
//         </View>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}>

//         {/* ── Notification Banner ── */}
//         {!notifDismissed && (
//           <View style={styles.notifBanner}>
//             <Text style={{ fontSize: 20 }}>🔔</Text>
//             <View style={styles.notifBannerText}>
//               <AppText variant="subtitle2" bold color="textInverse" mb={2}>
//                 Enable notifications
//               </AppText>
//               <AppText variant="caption" color="textInverse" style={{ opacity: 0.8 }}>
//                 Get nudges, kudos, and challenge alerts
//               </AppText>
//             </View>
//             <TouchableOpacity
//               onPress={() => setNotifDismissed(true)}
//               style={styles.notifEnableBtn}>
//               <AppText variant="label" bold color="textInverse">
//                 Enable
//               </AppText>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* ── Energy Card ── */}
//         <View style={styles.energyCard}>
//           {/* Circle score */}
//           <View style={styles.energyCircle}>
//             <AppText variant="h2" bold color="textInverse">
//               82
//             </AppText>
//             <AppText
//               variant="caption"
//               color="textInverse"
//               style={{ opacity: 0.75, letterSpacing: 1 }}>
//               ENERGY
//             </AppText>
//           </View>

//           {/* Right text */}
//           <View style={styles.energyRight}>
//             <AppText variant="subtitle1" bold color="textInverse" mb={4}>
//               You're doing great! 🎯
//             </AppText>
//             <AppText
//               variant="caption"
//               color="textInverse"
//               style={{ opacity: 0.8, lineHeight: 18 }}>
//               Your recovery is strong today. A 20-min walk would push you to{' '}
//               <AppText variant="caption" bold color="textInverse">
//                 85.
//               </AppText>
//             </AppText>
//             <View style={styles.streakPill}>
//               <Text style={{ fontSize: 14 }}>🔥</Text>
//               <AppText variant="caption" bold color="textInverse">
//                 12-day streak
//               </AppText>
//             </View>
//           </View>
//         </View>

//         {/* ── Today's Summary ── */}
//         <View style={styles.sectionHeader}>
//           <AppText variant="h3">Today's Summary</AppText>
//           <TouchableOpacity>
//             <AppText variant="label" link>
//               View Details
//             </AppText>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity activeOpacity={0.85} style={styles.summaryCard}>
//           <View style={styles.summaryIconBox}>
//             <Text style={{ fontSize: 24 }}>❤️</Text>
//           </View>
//           <View style={styles.summaryText}>
//             <AppText variant="subtitle2" bold mb={2}>
//               Daily Activity
//             </AppText>
//             <AppText variant="caption" secondary>
//               2,038 steps · 21 active mins
//             </AppText>
//           </View>
//           <ChevronRight size={18} color={colors.textTertiary} />
//         </TouchableOpacity>

//         {/* ── Workout Categories ── */}
//         <View style={styles.sectionHeader}>
//           <AppText variant="h3">Workout Categories</AppText>
//           <TouchableOpacity>
//             <AppText variant="label" link>
//               View all
//             </AppText>
//           </TouchableOpacity>
//         </View>

//         <FlatList
//           data={WORKOUT_CATEGORIES}
//           renderItem={renderWorkoutCard}
//           keyExtractor={item => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.workoutList}
//           scrollEnabled
//         />

//         {/* ── Daily Activity Trends ── */}
//         <View style={styles.sectionHeader}>
//           <AppText variant="h3">Daily Activity Trends</AppText>
//           <TouchableOpacity>
//             <AppText variant="label" link>
//               Details
//             </AppText>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.trendsCard}>
//           {/* Tab switcher */}
//           <View style={styles.tabRow}>
//             {TREND_TABS.map(tab => (
//               <TouchableOpacity
//                 key={tab}
//                 onPress={() => setActiveTab(tab)}
//                 style={[
//                   styles.tabBtn,
//                   activeTab === tab && styles.tabBtnActive,
//                 ]}>
//                 <AppText
//                   variant="label"
//                   bold={activeTab === tab}
//                   color={activeTab === tab ? 'textPrimary' : 'textSecondary'}>
//                   {tab}
//                 </AppText>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Bar chart */}
//           <BarChart data={trendData.bars} color={trendData.color} />

//           {/* Stats row */}
//           <View style={styles.statsRow}>
//             {trendData.stats.map((stat, i) => (
//               <React.Fragment key={stat.label}>
//                 {i > 0 && <View style={styles.statDivider} />}
//                 <View style={styles.statItem}>
//                   <AppText variant="subtitle1" bold mb={2}>
//                     {stat.value}
//                   </AppText>
//                   <AppText variant="caption" secondary>
//                     {stat.label}
//                   </AppText>
//                 </View>
//               </React.Fragment>
//             ))}
//           </View>
//         </View>

//         {/* ── Quick Actions ── */}
//         <View style={styles.sectionHeader}>
//           <AppText variant="h3">Quick Actions</AppText>
//         </View>

//         <View style={styles.quickActionsRow}>
//           {QUICK_ACTIONS.map(action => (
//             <TouchableOpacity
//               key={action.id}
//               activeOpacity={0.85}
//               style={styles.quickActionCard}>
//               <View
//                 style={[
//                   styles.quickActionIconBox,
//                   { backgroundColor: action.bg },
//                 ]}>
//                 <Text style={{ fontSize: 24 }}>{action.emoji}</Text>
//               </View>
//               <AppText variant="subtitle2" bold center>
//                 {action.label}
//               </AppText>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* ── Onboarding Modal ── */}
//       <OnboardingModal
//         visible={onboardingVisible}
//         onDismiss={() => setOnboardingVisible(false)}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Text>Home screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
