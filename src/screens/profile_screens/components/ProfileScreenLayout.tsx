import React from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { spacing } from '../../../theme/spacing';

export type ProfileScreenNavigation = {
  goBack: () => void;
};

export const ProfileSectionLabel: React.FC<{ children: string }> = ({
  children,
}) => (
  <AppText variant="label" color="textTertiary" style={styles.sectionLabel}>
    {children.toUpperCase()}
  </AppText>
);

const styles = StyleSheet.create({
  sectionLabel: {
    marginLeft: spacing.xs,
    marginTop: spacing.sl,
    marginBottom: spacing.sm,
    letterSpacing: 0.6,
  },
});
