import { View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { AppColors } from '../../../../theme';

import createStyles from '../styles.Setting';
const SettingsSection = ({
  title,
  colors,
  styles,
  children,
}: {
  title: string;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textTertiary" style={styles.sectionTitle}>
        {title?.toUpperCase()}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {children}
      </View>
    </View>
  );
};

export default memo(SettingsSection);
