import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

const ProfileMetric: React.FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.metric,
        { backgroundColor: theme.colors.backgroundSecondary },
      ]}
    >
      <AppText variant="subtitle2" bold center>
        {value}
      </AppText>
      <AppText variant="caption" secondary center>
        {label}
      </AppText>
    </View>
  );
};

export default memo(ProfileMetric);

const styles = StyleSheet.create({
  metric: {
    minHeight: 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingVertical: 5,
  },
});
