import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { getFormattedDate, getGreeting } from '../const';
import { createHomeStyles } from '../styles.Home';
import { useNavigation } from '@react-navigation/native';

const HomeHeader: React.FC = () => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <AppText variant="h3">{getGreeting()}, Alex 👋</AppText>
        <AppText variant="caption" secondary mt={2}>
          {getFormattedDate()} · Let's crush your goals
        </AppText>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.bellButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate('Notifications' as never)}
        >
          {/* <Bell size={20} color={theme.colors.textSecondary} /> */}
          <AppText
            variant="caption"
            color="warning"
            style={styles.notificationBadge}
          >
            🔔
          </AppText>
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate('Profile' as never)}
          style={styles.avatar}
        >
          <AppText variant="label" bold color="textInverse">
            AJ
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;
