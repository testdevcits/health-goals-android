import { StyleSheet, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from '../../theme/useTheme';

const ProfileCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme().theme;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.black },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default memo(ProfileCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});
