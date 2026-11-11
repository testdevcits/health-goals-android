// import React, { useState } from 'react';
// import { View, ScrollView, StatusBar } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { useTheme } from '../../../theme/useTheme';
// import { AppHeader, SectionHeader } from '../../../components';
// import { spacing } from '../../../theme/spacing';
// import styles from './styles.Discover';
// import { Program, programs, recommendations } from './const';
// import ProgramDetail from '../program_detail/ProgramDetail';
// import RecommandedCard from './components/RecommandedCard';
// import ProgramCard from './components/ProgramCard';

// const DiscoverScreen: React.FC = () => {
//   const { theme } = useTheme();
//   const { colors } = theme;
//   const insets = useSafeAreaInsets();

//   const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

//   const [startedPrograms, setStartedPrograms] = useState<string[]>([]);

//   const startProgram = (program: Program) => {
//     setStartedPrograms(previous =>
//       previous.includes(program?.id) ? previous : [...previous, program?.id],
//     );
//     setSelectedProgram(null);
//   };

//   const openProgram = (program: Program) => {
//     setSelectedProgram(program);
//   };

//   const renderDiscover = () => (
//     <>
//       <AppHeader
//         title="Discover"
//         subtitle="Programs, coaching, and personalized plans"
//         isBack={false}
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.scrollContent,
//           { paddingBottom: insets.bottom + spacing.xl },
//         ]}
//       >
//         <SectionHeader
//           sectionTitle="Programs & Coaching"
//           customStyles={styles.sectionTitle}
//         />

//         {programs.map(program => (
//           <ProgramCard
//             key={program?.id}
//             program={program}
//             openProgram={openProgram}
//           />
//         ))}

//         <SectionHeader
//           sectionTitle="Recommended for You"
//           customStyles={styles.sectionTitle}
//         />

//         {recommendations.map((item, index) => (
//           <RecommandedCard
//             key={item?.title}
//             item={item}
//             index={index}
//             openProgram={openProgram}
//           />
//         ))}
//       </ScrollView>
//     </>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: colors.backgroundSecondary },
//       ]}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

//       {selectedProgram ? (
//         <ProgramDetail
//           program={selectedProgram}
//           startProgram={startProgram}
//           startedPrograms={startedPrograms}
//           setSelectedProgram={setSelectedProgram}
//         />
//       ) : (
//         renderDiscover()
//       )}
//     </View>
//   );
// };

// export default DiscoverScreen;

import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass } from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppHeader, AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';

const DiscoverScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <AppHeader
        title="Discover"
        subtitle="Explore something new"
        isBack={false}
      />

      <View
        style={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: colors.surface }]}
        >
          <Compass size={52} color={colors.primary} strokeWidth={1.5} />
        </View>

        <AppText variant="body1" style={styles.title}>
          Coming Soon!
        </AppText>

        <AppText center style={styles.description}>
          We're working on something exciting. Discover new fitness programs,
          challenges, coaching and personalized recommendations will be
          available here soon.
        </AppText>

        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
          <AppText variant="label" style={{ color: colors.primary }}>
            Stay Tuned
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 300,
  },
  badge: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 30,
  },
});

export default DiscoverScreen;
