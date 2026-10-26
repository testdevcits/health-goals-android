import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { radius } from '../../../../theme/radius';
import { spacing } from '../../../../theme/spacing';

const ProgramCard = ({
  program,
  openProgram,
}: {
  program: any;
  openProgram: (program: any) => void;
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <Pressable
      key={program.id}
      onPress={() => openProgram(program)}
      style={[styles.programCard, { backgroundColor: program.color }]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${program.title}`}
    >
      <AppText variant="subtitle1" color="white" bold>
        {program.emoji} {program.title}
      </AppText>

      <AppText
        variant="caption"
        color="white"
        style={styles.programDescription}
      >
        {program.subtitle}
      </AppText>

      <View style={styles.programButton}>
        <AppText variant="buttonSm" style={{ color: colors.textPrimary }}>
          {program.button}
        </AppText>
      </View>
    </Pressable>
  );
};

export default memo(ProgramCard);

const styles = StyleSheet.create({
  programCard: {
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    minHeight: 114,
    justifyContent: 'center',
  },

  programDescription: {
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
  },

  programButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
  },
});
