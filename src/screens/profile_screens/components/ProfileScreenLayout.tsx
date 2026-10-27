import React from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '../../../components';

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
    marginLeft: 4,
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 0.6,
  },
});
