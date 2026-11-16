import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import AppText from '../AppText';
import { useTheme } from '../../theme/useTheme';
import createStyles from '../styles.ProfileQuestionsModal';

interface QuestionOptionsSelectorProps {
  options: string[];
  selectedAnswer: string;
  onSelectOption: (option: string) => void;
}

export const QuestionOptionsSelector: React.FC<
  QuestionOptionsSelectorProps
> = ({ options, selectedAnswer, onSelectOption }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={styles.options}>
      {options.map(option => {
        const selected = selectedAnswer === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onSelectOption(option)}
            style={[
              styles.option,
              {
                backgroundColor: selected
                  ? colors.primaryLight
                  : colors.backgroundSecondary,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText
              variant="body2"
              color={selected ? 'primary' : 'textPrimary'}
              bold={selected}
            >
              {option}
            </AppText>
            {selected ? <Check size={18} color={colors.primary} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
};
