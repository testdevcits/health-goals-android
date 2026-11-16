import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.EditProfile';

interface HeightWeightFieldRowProps {
  height: string;
  weight: string;
  isInvalidHeight: boolean;
  isInvalidWeight: boolean;
  onOpenHeightPicker: () => void;
  onOpenWeightPicker: () => void;
}

export const HeightWeightFieldRow: React.FC<HeightWeightFieldRowProps> = ({
  height,
  weight,
  isInvalidHeight,
  isInvalidWeight,
  onOpenHeightPicker,
  onOpenWeightPicker,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={[styles.twoColumns, styles.field]}>
      <View style={styles.column}>
        <AppText variant="label" secondary mb={6}>
          Height (cm)
        </AppText>
        <Pressable
          onPress={onOpenHeightPicker}
          style={[
            styles.pickerField,
            {
              backgroundColor: colors.inputBg,
              borderColor: isInvalidHeight ? colors.error : colors.inputBorder,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            height ? `Height, ${height} centimeters` : 'Select height'
          }
        >
          <AppText
            variant="body2"
            color={height ? 'textPrimary' : 'textTertiary'}
          >
            {height ? `${height} cm` : 'Select height'}
          </AppText>
          <AppIcon
            name="ChevronDown"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
        {isInvalidHeight ? (
          <AppText variant="caption" error mt={4}>
            Height must be 50–300 cm
          </AppText>
        ) : null}
      </View>

      <View style={styles.column}>
        <AppText variant="label" secondary mb={6}>
          Weight (kg)
        </AppText>
        <Pressable
          onPress={onOpenWeightPicker}
          style={[
            styles.pickerField,
            {
              backgroundColor: colors.inputBg,
              borderColor: isInvalidWeight ? colors.error : colors.inputBorder,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            weight ? `Weight, ${weight} kilograms` : 'Select weight'
          }
        >
          <AppText
            variant="body2"
            color={weight ? 'textPrimary' : 'textTertiary'}
          >
            {weight ? `${weight} kg` : 'Select weight'}
          </AppText>
          <AppIcon
            name="ChevronDown"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
        {isInvalidWeight ? (
          <AppText variant="caption" error mt={4}>
            Weight must be 20–500 kg
          </AppText>
        ) : null}
      </View>
    </View>
  );
};
