import React from 'react';
import { View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import AppText from '../AppText';
import { useTheme } from '../../../theme/useTheme';
import createStyles from '../profile_questions_modal/styles.ProfileQuestionsModal';

interface QuestionHeaderProps {
  questionLabel: string;
  step: number;
  totalQuestions: number;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  questionLabel,
  step,
  totalQuestions,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);
  const progress = (step / totalQuestions) * 100;

  return (
    <>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: radius.full,
          },
        ]}
      >
        <UserRound size={28} color={colors.primary} />
      </View>
      <AppText variant="label" primary bold center mb={spacing.sm}>
        A LITTLE MORE ABOUT YOU
      </AppText>
      <AppText variant="h3" center bold mb={spacing.xs}>
        {questionLabel}
      </AppText>
      <AppText variant="body2" secondary center mb={spacing.lg}>
        Your answer helps us personalize your wellness experience. You can skip
        for now and answer the remaining questions next time.
      </AppText>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: colors.surfaceElevated },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
      <AppText variant="caption" secondary center style={styles.stepLabel}>
        Question {step} of {totalQuestions}
      </AppText>
    </>
  );
};
