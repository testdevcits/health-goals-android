import React from 'react';
import { Pressable, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createDailyActivityStyles } from '../styles.DailyActivities';
import { DailyActivityNavigation } from '../types';

const ActivityHeader: React.FC<{ navigation: DailyActivityNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createDailyActivityStyles(theme);
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.header}>
      <View style={styles.statusRow}>
        <AppText variant="caption" bold>
          9:41
        </AppText>
        <AppText variant="caption">📶 📡 🔋</AppText>
      </View>
      <View style={styles.headerMain}>
        <Pressable
          onPress={navigation.goBack}
          style={[
            styles.backButton,
            { backgroundColor: colors.backgroundSecondary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <ChevronLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCopy}>
          <AppText variant="h3">Daily Activity</AppText>
          <AppText variant="caption" secondary>
            Today, {date}
          </AppText>
        </View>
        <Pressable
          style={[
            styles.headerIcon,
            { backgroundColor: colors.backgroundSecondary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <Bell size={19} color={colors.warning} />
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: colors.info }]}>
          <AppText variant="subtitle2" color="white" bold>
            AJ
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default ActivityHeader;
