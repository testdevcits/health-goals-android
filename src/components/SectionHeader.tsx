import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { memo } from 'react';
import AppText from './AppText';
import { spacing } from '../theme/spacing';

const SectionHeader = ({
  onRightPress,
  rightText,
  sectionTitle,
  customStyles,
}: {
  sectionTitle: string;
  onRightPress?: () => void;
  rightText?: string;
  customStyles?: ViewStyle;
}) => {
  return (
    <View style={[styles.sectionHeader, customStyles]}>
      <AppText variant="h3">{sectionTitle}</AppText>
      <TouchableOpacity onPress={onRightPress} accessibilityRole="button">
        <AppText variant="label" link>
          {rightText}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SectionHeader);

const styles = StyleSheet.create({
  // ── Section headers ───────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
