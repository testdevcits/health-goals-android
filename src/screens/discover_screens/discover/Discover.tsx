import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import { AppHeader, SectionHeader } from '../../../components';
import { spacing } from '../../../theme/spacing';
import styles from './styles.Discover';
import { Program, programs, recommendations } from './const';
import ProgramDetail from '../program_detail/ProgramDetail';
import RecommandedCard from './components/RecommandedCard';
import ProgramCard from './components/ProgramCard';

const DiscoverScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [startedPrograms, setStartedPrograms] = useState<string[]>([]);

  const startProgram = (program: Program) => {
    setStartedPrograms(previous =>
      previous.includes(program.id) ? previous : [...previous, program.id],
    );
    setSelectedProgram(null);
  };

  const openProgram = (program: Program) => {
    setSelectedProgram(program);
  };

  const renderDiscover = () => (
    <>
      <AppHeader
        title="Discover"
        subtitle="Programs, coaching, and personalized plans"
        isBack={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <SectionHeader
          sectionTitle="Programs & Coaching"
          customStyles={styles.sectionTitle}
        />

        {programs.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            openProgram={openProgram}
          />
        ))}

        <SectionHeader
          sectionTitle="Recommended for You"
          customStyles={styles.sectionTitle}
        />

        {recommendations.map((item, index) => (
          <RecommandedCard
            key={item?.title}
            item={item}
            index={index}
            openProgram={openProgram}
          />
        ))}
      </ScrollView>
    </>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {selectedProgram ? (
        <ProgramDetail
          program={selectedProgram}
          startProgram={startProgram}
          startedPrograms={startedPrograms}
          setSelectedProgram={setSelectedProgram}
        />
      ) : (
        renderDiscover()
      )}
    </View>
  );
};

export default DiscoverScreen;
