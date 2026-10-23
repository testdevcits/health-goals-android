// import React, { useState } from 'react';
// import {
//     View,
//     StyleSheet,
//     ScrollView,
//     Pressable,
//     StatusBar,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//     Bell,
//     ChevronLeft,
//     UserRound,
//     ArrowRight,
//     Check,
//     X,
// } from 'lucide-react-native';

// import { useTheme } from '../../../theme/useTheme';
// import { AppText } from '../../../components';
// import { spacing } from '../../../theme/spacing';
// import { radius } from '../../../theme/radius';
// import styles from './styles.Discover';

// type Program = {
//     id: string;
//     emoji: string;
//     title: string;
//     subtitle: string;
//     button: string;
//     color: string;
//     description: string;
//     duration: string;
//     daily: string;
//     level: string;
//     included: string[];
// };

// const programs: Program[] = [
//     {
//         id: 'yoga',
//         emoji: '🧘',
//         title: 'Mindfulness & Yoga',
//         subtitle: '7-day starter program to reduce stress and improve sleep',
//         button: 'Start Program',
//         color: '#7660ED',
//         description:
//             'A gentle program to reduce stress and improve sleep quality through daily guided sessions.',
//         duration: '7',
//         daily: '20m',
//         level: 'Easy',
//         included: [
//             '15–20 min daily sessions',
//             'Breathing + stretching routines',
//             'Sleep-focused evening flows',
//             'Progress tracking & reminders',
//         ],
//     },
//     {
//         id: 'running',
//         emoji: '🏃',
//         title: 'Couch to 5K',
//         subtitle: 'Adaptive run coaching — beginner to race day in 8 weeks',
//         button: 'View Plan',
//         color: '#FF8D79',
//         description:
//             'Build your endurance with a beginner-friendly running plan that gradually prepares you for a 5K.',
//         duration: '8',
//         daily: '30m',
//         level: 'Beginner',
//         included: [
//             'Progressive running and walking',
//             'Weekly training schedule',
//             'Rest and recovery days',
//             'Track your distance and pace',
//         ],
//     },
//     {
//         id: 'sleep',
//         emoji: '😴',
//         title: 'Sleep Coaching',
//         subtitle: 'Personalized sleep insights and wind-down routines',
//         button: 'Get Started',
//         color: '#5DA4F5',
//         description:
//             'Build a relaxing nighttime routine and improve your sleep habits with guided coaching.',
//         duration: '14',
//         daily: '15m',
//         level: 'Easy',
//         included: [
//             'Personalized bedtime routine',
//             'Relaxation exercises',
//             'Sleep habit tracking',
//             'Daily wind-down reminders',
//         ],
//     },
//     {
//         id: 'nutrition',
//         emoji: '🥗',
//         title: 'Nutrition Tracker',
//         subtitle: 'Log meals, track macros, and get smart food suggestions',
//         button: 'Explore',
//         color: '#FFBE32',
//         description:
//             'Understand your daily food habits and build a balanced nutrition routine.',
//         duration: '30',
//         daily: '5m',
//         level: 'All levels',
//         included: [
//             'Daily meal logging',
//             'Nutrition and macro overview',
//             'Food habit insights',
//             'Personalized meal suggestions',
//         ],
//     },
// ];

// const recommendations = [
//     {
//         emoji: '🌅',
//         title: '10-Min Morning Stretch',
//         subtitle:
//             'Based on your sleep data, a short stretch could boost your energy score by ~4 points.',
//         tag: 'AI Pick',
//     },
//     {
//         emoji: '💧',
//         title: 'Daily Hydration Routine',
//         subtitle: 'Build a simple habit to stay hydrated throughout the day.',
//         tag: 'Daily',
//     },
// ];

// const DiscoverScreen: React.FC = () => {
//     const { theme } = useTheme();
//     const { colors } = theme;
//     const insets = useSafeAreaInsets();

//     const [selectedProgram, setSelectedProgram] =
//         useState<Program | null>(null);

//     const [startedPrograms, setStartedPrograms] = useState<string[]>([]);

//     const startProgram = (program: Program) => {
//         setStartedPrograms(previous =>
//             previous.includes(program.id)
//                 ? previous
//                 : [...previous, program.id],
//         );
//         setSelectedProgram(null);
//     };

//     const openProgram = (program: Program) => {
//         setSelectedProgram(program);
//     };

//     const Header = ({
//         title,
//         subtitle,
//         back,
//     }: {
//         title: string;
//         subtitle: string;
//         back?: boolean;
//     }) => (
//         <View style={[styles.header, { backgroundColor: colors.surface }]}>
//             <View style={styles.statusRow}>
//                 <AppText variant="caption" bold>
//                     9:41
//                 </AppText>
//                 <AppText variant="caption">📶 📡 🔋</AppText>
//             </View>

//             <View style={styles.headerMain}>
//                 {back && (
//                     <Pressable
//                         onPress={() => setSelectedProgram(null)}
//                         style={[styles.headerIcon, { backgroundColor: colors.backgroundSecondary }]}
//                         accessibilityRole="button"
//                         accessibilityLabel="Go back">
//                         <ChevronLeft size={22} color={colors.textPrimary} />
//                     </Pressable>
//                 )}

//                 <View style={styles.headerTitle}>
//                     <AppText variant="h3" numberOfLines={1}>
//                         {title}
//                     </AppText>
//                     <AppText variant="caption" secondary numberOfLines={1}>
//                         {subtitle}
//                     </AppText>
//                 </View>

//                 <Pressable
//                     style={[styles.headerIcon, { backgroundColor: colors.backgroundSecondary }]}
//                     accessibilityRole="button"
//                     accessibilityLabel="Notifications">
//                     <Bell size={19} color={colors.warning} />
//                 </Pressable>

//                 <Pressable
//                     style={styles.avatar}
//                     accessibilityRole="button"
//                     accessibilityLabel="Profile">
//                     <AppText variant="subtitle2" color="white" bold>
//                         AJ
//                     </AppText>
//                 </Pressable>
//             </View>
//         </View>
//     );

//     const renderDiscover = () => (
//         <>
//             <Header
//                 title="Discover"
//                 subtitle="Programs, coaching, and personalized plans"
//             />

//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={[
//                     styles.scrollContent,
//                     { paddingBottom: insets.bottom + spacing.xl },
//                 ]}>
//                 <AppText variant="h3" style={styles.sectionTitle}>
//                     Programs & Coaching
//                 </AppText>

//                 {programs.map(program => (
//                     <Pressable
//                         key={program.id}
//                         onPress={() => openProgram(program)}
//                         style={[
//                             styles.programCard,
//                             { backgroundColor: program.color },
//                         ]}
//                         accessibilityRole="button"
//                         accessibilityLabel={`Open ${program.title}`}>
//                         <AppText variant="subtitle1" color="white" bold>
//                             {program.emoji} {program.title}
//                         </AppText>

//                         <AppText
//                             variant="caption"
//                             color="white"
//                             style={styles.programDescription}>
//                             {program.subtitle}
//                         </AppText>

//                         <View style={styles.programButton}>
//                             <AppText variant="buttonSm" style={{ color: colors.textPrimary }}>
//                                 {program.button}
//                             </AppText>
//                         </View>
//                     </Pressable>
//                 ))}

//                 <AppText variant="h3" style={styles.sectionTitle}>
//                     Recommended for You
//                 </AppText>

//                 {recommendations.map((item, index) => (
//                     <Pressable
//                         key={item?.title}
//                         onPress={() => openProgram(programs[index === 0 ? 0 : 3])}
//                         style={[
//                             styles.recommendationCard,
//                             {
//                                 backgroundColor: colors.surface,
//                                 borderColor: colors.border,
//                             },
//                         ]}>
//                         <View style={styles.recommendationAccent} />

//                         <View style={styles.recommendationContent}>
//                             <View style={styles.recommendationHeading}>
//                                 <AppText variant="subtitle2" bold>
//                                     {item?.emoji} {item?.title}
//                                 </AppText>

//                                 <View style={styles.tag}>
//                                     <AppText variant="caption" style={{ color: colors.primaryDark }} bold>
//                                         {item?.tag}
//                                     </AppText>
//                                 </View>
//                             </View>

//                             <AppText variant="caption" secondary>
//                                 {item?.subtitle}
//                             </AppText>

//                             <View style={styles.recommendationFooter}>
//                                 <AppText variant="buttonSm" primary>
//                                     Explore
//                                 </AppText>
//                                 <ArrowRight size={16} color={colors.primary} />
//                             </View>
//                         </View>
//                     </Pressable>
//                 ))}
//             </ScrollView>
//         </>
//     );

//     const renderProgramDetail = (program: Program) => (
//         <>
//             <Header
//                 title={program.title}
//                 subtitle={`${program.duration}-day starter`}
//                 back
//             />

//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={[
//                     styles.detailContent,
//                     { paddingBottom: insets.bottom + spacing.xl },
//                 ]}>
//                 <View
//                     style={[
//                         styles.detailHero,
//                         { backgroundColor: program.color },
//                     ]}>
//                     <AppText variant="display" color="white">
//                         {program.emoji}
//                     </AppText>

//                     <AppText variant="h2" color="white">
//                         {program.title}
//                     </AppText>

//                     <AppText variant="body2" color="white">
//                         {program.description}
//                     </AppText>
//                 </View>

//                 <View style={styles.statsRow}>
//                     {[
//                         { value: program.duration, label: 'Days' },
//                         { value: program.daily, label: 'Per Day' },
//                         { value: program.level, label: 'Level' },
//                     ].map(stat => (
//                         <View
//                             key={stat.label}
//                             style={[
//                                 styles.statCard,
//                                 { backgroundColor: colors.surface },
//                             ]}>
//                             <AppText variant="subtitle1" bold center>
//                                 {stat.value}
//                             </AppText>
//                             <AppText variant="caption" secondary center>
//                                 {stat.label}
//                             </AppText>
//                         </View>
//                     ))}
//                 </View>

//                 <View
//                     style={[
//                         styles.includedCard,
//                         { backgroundColor: colors.surface },
//                     ]}>
//                     <AppText variant="subtitle1" bold mb={spacing.md}>
//                         What is included
//                     </AppText>

//                     {program.included.map(item => (
//                         <View key={item} style={styles.includedRow}>
//                             <Check size={17} color={colors.primary} />
//                             <AppText variant="body2" style={styles.includedText}>
//                                 {item}
//                             </AppText>
//                         </View>
//                     ))}
//                 </View>

//                 <Pressable
//                     onPress={() => startProgram(program)}
//                     style={[styles.startButton, { backgroundColor: colors.primary }]}
//                     accessibilityRole="button">
//                     <AppText variant="button" color="white" center>
//                         {startedPrograms.includes(program.id)
//                             ? 'Continue Program'
//                             : 'Start Program'}
//                     </AppText>
//                 </Pressable>

//                 <Pressable
//                     onPress={() => setSelectedProgram(null)}
//                     style={styles.laterButton}
//                     accessibilityRole="button">
//                     <AppText variant="buttonSm" center>
//                         Maybe Later
//                     </AppText>
//                 </Pressable>
//             </ScrollView>
//         </>
//     );

//     return (
//         <View
//             style={[
//                 styles.container,
//                 { backgroundColor: colors.backgroundSecondary },
//             ]}>
//             <StatusBar
//                 barStyle="dark-content"
//                 backgroundColor={colors.surface}
//             />

//             {selectedProgram
//                 ? renderProgramDetail(selectedProgram)
//                 : renderDiscover()}
//         </View>
//     );
// };

// export default DiscoverScreen;

import React from 'react';
import { StyleSheet, View } from 'react-native';

const Discover = () => {
  return <View></View>;
};

const styles = StyleSheet.create({});

export default Discover;
