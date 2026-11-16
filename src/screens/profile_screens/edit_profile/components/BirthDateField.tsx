import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.EditProfile';

interface BirthDateFieldProps {
  birthDate: string;
  isInvalidBirthDate: boolean;
  onOpenCalendar: () => void;
}

export const BirthDateField: React.FC<BirthDateFieldProps> = ({
  birthDate,
  isInvalidBirthDate,
  onOpenCalendar,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={styles.field}>
      <AppText variant="label" secondary mb={6}>
        Date of Birth
      </AppText>
      <Pressable
        onPress={onOpenCalendar}
        style={[
          styles.dateField,
          {
            backgroundColor: colors.inputBg,
            borderColor: isInvalidBirthDate ? colors.error : colors.inputBorder,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={
          birthDate ? `Date of birth, ${birthDate}` : 'Choose date of birth'
        }
      >
        <AppText
          variant="body2"
          color={
            birthDate
              ? isInvalidBirthDate
                ? 'error'
                : 'textPrimary'
              : 'textTertiary'
          }
        >
          {birthDate || 'Select date of birth'}
        </AppText>
        <AppIcon
          name="Calendar"
          size={18}
          color={isInvalidBirthDate ? colors.error : colors.textSecondary}
        />
      </Pressable>
      {isInvalidBirthDate ? (
        <AppText variant="caption" error mt={4}>
          You must be at least 18 years old
        </AppText>
      ) : null}
    </View>
  );
};
