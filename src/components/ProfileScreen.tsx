import { ScrollView, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from '../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from './appHeader/AppHeader';

export type ProfileScreenNavigation = {
  goBack: () => void;
};

const ProfileScreen: React.FC<{
  navigation: ProfileScreenNavigation;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ navigation, title, subtitle, children }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.backgroundSecondary },
      ]}
    >
      <AppHeader
        title={title}
        subtitle={subtitle}
        onBackPress={() => navigation.goBack}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  screen: { flex: 1 },

  content: { paddingHorizontal: 16, paddingTop: 18 },
});
