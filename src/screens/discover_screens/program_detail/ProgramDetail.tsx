import { Pressable, ScrollView, View } from 'react-native';
import React from 'react';
import { Program } from '../discover/const';
import { AppHeader, AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles.ProgramDetails';

const ProgramDetail = ({
  program,
  startProgram,
  startedPrograms,
  setSelectedProgram,
}: {
  program: Program;
  startProgram: (program: Program) => void;
  startedPrograms: string[];
  setSelectedProgram: (program: Program | null) => void;
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return (
    <>
      <AppHeader
        title={program?.title}
        subtitle={`${program?.duration}-day starter`}
        onBackPress={() => setSelectedProgram(null)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.detailContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={[styles.detailHero, { backgroundColor: program?.color }]}>
          <AppText variant="display" color="white">
            {program?.emoji}
          </AppText>

          <AppText variant="h2" color="white">
            {program?.title}
          </AppText>

          <AppText variant="body2" color="white">
            {program?.description}
          </AppText>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: program?.duration, label: 'Days' },
            { value: program?.daily, label: 'Per Day' },
            { value: program?.level, label: 'Level' },
          ].map(stat => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <AppText variant="subtitle1" bold center>
                {stat.value}
              </AppText>
              <AppText variant="caption" secondary center>
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.includedCard,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.black,
            },
          ]}
        >
          <AppText variant="subtitle1" bold mb={spacing.md}>
            What is included
          </AppText>

          {program?.included.map(item => (
            <View key={item} style={styles.includedRow}>
              <Check size={17} color={colors.primary} />
              <AppText variant="body2" style={styles.includedText}>
                {item}
              </AppText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => startProgram(program)}
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          accessibilityRole="button"
        >
          <AppText variant="button" color="white" center>
            {startedPrograms.includes(program?.id)
              ? 'Continue Program'
              : 'Start Program'}
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setSelectedProgram(null)}
          style={styles.laterButton}
          accessibilityRole="button"
        >
          <AppText variant="buttonSm" center>
            Maybe Later
          </AppText>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default ProgramDetail;
