
// import React, { useState } from 'react';
// import {
//   View,
//   ScrollView,
//   Pressable,
//   StyleSheet,
//   useWindowDimensions,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   Bell,
//   Trophy,
//   Flame,
//   Droplets,
//   Footprints,
//   Sunrise,
//   Dumbbell,
//   Medal,
//   Users,
//   ChevronRight,
//   ChartNoAxesColumnIncreasing,
// } from 'lucide-react-native';

// import { useTheme } from '../../../theme/useTheme';
// import { AppText } from '../../../components';
// import createStyles from './styles.Challenges';

// type TabType = 'Leaderboard' | 'Challenges' | 'Badges';

// const TABS: TabType[] = ['Leaderboard', 'Challenges', 'Badges'];

// const challenges = [
//   {
//     id: '1',
//     title: '30-Day Step Sprint',
//     description: 'Walk 10,000 steps daily with your team. Top 3 win gift cards.',
//     progress: 68,
//     progressLabel: '20 of 30 days',
//     status: 'LIVE',
//     color: '#00C6A2',
//     icon: Footprints,
//   },
//   {
//     id: '2',
//     title: 'Morning Yoga Streak',
//     description: 'Complete a 15-min yoga session before 9 AM for 7 days.',
//     progress: 71,
//     progressLabel: '2 days left',
//     status: '5/7 days',
//     color: '#7461FF',
//     icon: Sunrise,
//   },
//   {
//     id: '3',
//     title: 'Hydration Hero',
//     description: 'Log 8 glasses of water every day this week.',
//     progress: 50,
//     progressLabel: '4 of 8 glasses today',
//     status: 'Daily',
//     color: '#FF9B38',
//     icon: Droplets,
//   },
// ];

// const badges = [
//   {
//     id: '1',
//     title: 'Streak Master',
//     subtitle: '10-day streak',
//     emoji: '🔥',
//     earned: true,
//   },
//   {
//     id: '2',
//     title: 'Step Champion',
//     subtitle: '100K steps',
//     emoji: '👟',
//     earned: true,
//   },
//   {
//     id: '3',
//     title: 'Hydrated Hero',
//     subtitle: '7-day hydration',
//     emoji: '💧',
//     earned: true,
//   },
//   {
//     id: '4',
//     title: 'Early Bird',
//     subtitle: '5 AM workouts',
//     emoji: '🌅',
//     earned: true,
//   },
//   {
//     id: '5',
//     title: 'Top 3',
//     subtitle: 'Leaderboard',
//     emoji: '🏆',
//     earned: false,
//   },
//   {
//     id: '6',
//     title: 'Iron Will',
//     subtitle: '30-day streak',
//     emoji: '💪',
//     earned: false,
//   },
// ];

// const leaderboard = [
//   {
//     rank: 1,
//     name: 'Sarah',
//     steps: '12,450',
//     initials: 'S',
//     color: '#FF8278',
//   },
//   {
//     rank: 2,
//     name: 'Mike',
//     steps: '10,230',
//     initials: 'M',
//     color: '#579CF4',
//   },
//   {
//     rank: 3,
//     name: 'Priya',
//     steps: '7,100',
//     initials: 'P',
//     color: '#FFB52E',
//   },
//   {
//     rank: 4,
//     name: 'You (Alex)',
//     steps: '7,842',
//     initials: 'A',
//     color: '#00BFA5',
//     streak: '12-day streak',
//   },
//   {
//     rank: 5,
//     name: 'James',
//     steps: '6,500',
//     initials: 'J',
//     color: '#8175F5',
//     streak: '5-day streak',
//   },
//   {
//     rank: 6,
//     name: 'Lena',
//     steps: '5,920',
//     initials: 'L',
//     color: '#25CDA9',
//     streak: '2-day streak',
//   },
// ];

// const ChallengesScreen: React.FC = () => {
//   const { theme } = useTheme();
//   const { colors, spacing, radius } = theme;
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const [activeTab, setActiveTab] = useState<TabType>('Leaderboard');

//   const horizontalPadding = spacing.base;
//   const badgeGap = spacing.sm;
//   const badgeWidth =
//     (width - horizontalPadding * 2 - badgeGap * 2) / 3;

//   const styles = createStyles(colors, spacing, radius);

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerText}>
//         <AppText variant="h3">
//           Challenges &amp; Leaderboard
//         </AppText>

//         <AppText variant="caption" secondary>
//           Compete, earn badges, stay motivated
//         </AppText>
//       </View>

//       <View style={styles.headerActions}>
//         <Pressable
//           accessibilityRole="button"
//           accessibilityLabel="Notifications"
//           style={styles.notificationButton}
//         >
//           <Bell size={20} color={colors.textPrimary} />
//         </Pressable>

//         <View style={styles.profileAvatar}>
//           <AppText variant="subtitle2" color="white" bold>
//             AJ
//           </AppText>
//         </View>
//       </View>
//     </View>
//   );

//   const renderTabs = () => (
//     <View style={styles.tabs}>
//       {TABS.map(tab => {
//         const selected = activeTab === tab;

//         return (
//           <Pressable
//             key={tab}
//             accessibilityRole="tab"
//             accessibilityState={{ selected }}
//             onPress={() => setActiveTab(tab)}
//             style={[
//               styles.tab,
//               selected && styles.activeTab,
//             ]}
//           >
//             <AppText
//               variant="label"
//               style={selected ? { color: colors.textPrimary } : { color: colors.textSecondary }}
//               medium={selected}
//             >
//               {tab}
//             </AppText>
//           </Pressable>
//         );
//       })}
//     </View>
//   );

//   const renderPodium = () => {
//     const topThree = [
//       leaderboard[1],
//       leaderboard[0],
//       leaderboard[2],
//     ];

//     return (
//       <View style={styles.podium}>
//         {topThree.map((person, index) => {
//           const isFirst = person.rank === 1;

//           return (
//             <View
//               key={person.rank}
//               style={[
//                 styles.podiumPerson,
//                 isFirst && styles.firstPlacePerson,
//               ]}
//             >
//               <View
//                 style={[
//                   styles.podiumAvatar,
//                   {
//                     backgroundColor: person.color,
//                     width: isFirst ? 62 : 48,
//                     height: isFirst ? 62 : 48,
//                   },
//                 ]}
//               >
//                 <AppText
//                   variant={isFirst ? 'h2' : 'h3'}
//                   color="white"
//                   bold
//                   center
//                 >
//                   {person.initials}
//                 </AppText>
//               </View>

//               <AppText variant="label" center>
//                 {person.name}
//               </AppText>

//               <AppText variant="caption" secondary center>
//                 {person.steps}
//               </AppText>

//               <View
//                 style={[
//                   styles.podiumBase,
//                   {
//                     height: isFirst ? 64 : index === 0 ? 48 : 38,
//                     backgroundColor:
//                       person.rank === 1
//                         ? '#FFD500'
//                         : person.rank === 2
//                           ? '#B8B8B8'
//                           : '#C17A36',
//                   },
//                 ]}
//               >
//                 <AppText variant="h3" color="white" bold center>
//                   {person.rank}
//                 </AppText>
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   const renderLeaderboard = () => (
//     <>
//       {renderPodium()}

//       <View style={styles.leaderboardCard}>
//         {leaderboard.slice(3).map((person, index) => {
//           const isCurrentUser = person.rank === 4;

//           return (
//             <View
//               key={person.rank}
//               style={[
//                 styles.leaderboardRow,
//                 isCurrentUser && styles.currentUserRow,
//                 index === 2 && styles.lastLeaderboardRow,
//               ]}
//             >
//               <View style={styles.rankCircle}>
//                 <AppText variant="caption" secondary bold>
//                   {person.rank}
//                 </AppText>
//               </View>

//               <View
//                 style={[
//                   styles.smallAvatar,
//                   { backgroundColor: person.color },
//                 ]}
//               >
//                 <AppText variant="label" color="white" bold>
//                   {person.initials}
//                 </AppText>
//               </View>

//               <View style={styles.leaderboardDetails}>
//                 <AppText variant="label" numberOfLines={1}>
//                   {person.name}
//                 </AppText>

//                 <AppText variant="caption" secondary>
//                   {isCurrentUser ? '🔥 ' : ''}
//                   {person.streak}
//                 </AppText>
//               </View>

//               <View style={styles.stepsColumn}>
//                 <AppText variant="label" bold right>
//                   {person.steps}
//                 </AppText>

//                 <AppText variant="caption" secondary right>
//                   steps
//                 </AppText>
//               </View>
//             </View>
//           );
//         })}
//       </View>

//       <AppText
//         variant="caption"
//         secondary
//         center
//         mt={spacing.md}
//       >
//         Friends Leaderboard · resets in 9h 20m
//       </AppText>
//     </>
//   );

//   const renderChallenges = () => (
//     <View>
//       {challenges.map(challenge => {
//         const Icon = challenge.icon;

//         return (
//           <View
//             key={challenge.id}
//             style={[
//               styles.challengeCard,
//               { borderLeftColor: challenge.color },
//             ]}
//           >
//             <View style={styles.challengeHeading}>
//               <View style={styles.challengeTitleRow}>
//                 <Icon
//                   size={19}
//                   color={challenge.color}
//                   strokeWidth={2.5}
//                 />

//                 <AppText
//                   variant="subtitle2"
//                   style={styles.challengeTitle}
//                 >
//                   {challenge.title}
//                 </AppText>
//               </View>

//               <View
//                 style={[
//                   styles.statusPill,
//                   { backgroundColor: `${challenge.color}20` },
//                 ]}
//               >
//                 <AppText
//                   variant="caption"
//                   style={{ color: challenge.color }}
//                   bold
//                 >
//                   {challenge.status}
//                 </AppText>
//               </View>
//             </View>

//             <AppText variant="body2" secondary>
//               {challenge.description}
//             </AppText>

//             <View style={styles.progressTrack}>
//               <View
//                 style={[
//                   styles.progressFill,
//                   {
//                     width: `${challenge.progress}%`,
//                     backgroundColor: challenge.color,
//                   },
//                 ]}
//               />
//             </View>

//             <View style={styles.progressFooter}>
//               <AppText variant="caption" secondary>
//                 {challenge.progressLabel}
//               </AppText>

//               <AppText
//                 variant="caption"
//                 style={{ color: challenge.color }}
//                 bold
//               >
//                 {challenge.progress}%
//               </AppText>
//             </View>
//           </View>
//         );
//       })}

//       <Pressable
//         accessibilityRole="button"
//         onPress={() => {
//           // Navigate to your complete challenge list here.
//         }}
//         style={styles.browseButton}
//       >
//         <AppText variant="buttonSm" primary>
//           + Browse all challenges
//         </AppText>

//         <ChevronRight size={18} color={colors.primary} />
//       </Pressable>
//     </View>
//   );

//   const renderBadges = () => (
//     <View style={styles.badgesGrid}>
//       {badges.map(badge => (
//         <View
//           key={badge.id}
//           style={[
//             styles.badgeCard,
//             { width: badgeWidth },
//             !badge.earned && styles.lockedBadge,
//           ]}
//         >
//           <View
//             style={[
//               styles.badgeIcon,
//               !badge.earned && styles.lockedBadgeIcon,
//             ]}
//           >
//             <AppText
//               style={{ fontSize: 27, color: badge.earned ? colors.textPrimary : colors.textTertiary }}
//             >
//               {badge.emoji}
//             </AppText>
//           </View>

//           <AppText
//             variant="label"
//             center
//             numberOfLines={1}
//             style={styles.badgeTitle}
//           >
//             {badge.title}
//           </AppText>

//           <AppText
//             variant="caption"
//             secondary
//             center
//             numberOfLines={2}
//           >
//             {badge.subtitle}
//           </AppText>
//         </View>
//       ))}
//     </View>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { paddingTop: insets.top },
//       ]}
//     >
//       {renderHeader()}

//       <ScrollView
//         contentContainerStyle={[
//           styles.scrollContent,
//           { paddingBottom: spacing.xl },
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {renderTabs()}

//         <View style={styles.content}>
//           {activeTab === 'Leaderboard' && renderLeaderboard()}
//           {activeTab === 'Challenges' && renderChallenges()}
//           {activeTab === 'Badges' && renderBadges()}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };


// export default ChallengesScreen;


import React from 'react';
import { StyleSheet, View } from 'react-native';

const ChallengesScreen = () => {
  return (
    <View>

    </View>
  );
}

const styles = StyleSheet.create({})

export default ChallengesScreen;
