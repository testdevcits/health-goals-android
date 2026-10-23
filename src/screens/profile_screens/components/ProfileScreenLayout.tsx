import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';

export type ProfileScreenNavigation = {
  goBack: () => void;
};

export const ProfileScreen: React.FC<{
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
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
         
        <View style={styles.headerMain}>
          <Pressable
            onPress={navigation.goBack}
            style={[
              styles.headerButton,
              { backgroundColor: theme.colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={styles.headerCopy}>
            <AppText variant="h3" numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="caption" secondary numberOfLines={1}>
              {subtitle}
            </AppText>
          </View>
          <Pressable
            style={[
              styles.headerButton,
              { backgroundColor: theme.colors.backgroundSecondary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={19} color={theme.colors.warning} />
          </Pressable>
          <View style={[styles.avatar, { backgroundColor: theme.colors.info }]}>
            <AppText variant="subtitle2" color="white" bold>
              AJ
            </AppText>
          </View>
        </View>
      </View>
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

export const ProfileCard: React.FC<{
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

export const ProfileSectionLabel: React.FC<{ children: string }> = ({
  children,
}) => (
  <AppText variant="label" color="textTertiary" style={styles.sectionLabel}>
    {children.toUpperCase()}
  </AppText>
);

export const ProfileListRow: React.FC<{
  icon: string;
  title: string;
  detail?: string;
  action?: string;
  onPress?: () => void;
  last?: boolean;
}> = ({ icon, title, detail, action, onPress, last }) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.listRow,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
        pressed && { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: colors.primaryLight, borderRadius: radius.sm },
        ]}
      >
        <AppText variant="body1">{icon}</AppText>
      </View>
      <View style={styles.rowCopy}>
        <AppText variant="subtitle2" bold numberOfLines={1}>
          {title}
        </AppText>
        {detail ? (
          <AppText variant="caption" secondary numberOfLines={1}>
            {detail}
          </AppText>
        ) : null}
      </View>
      {action ? (
        <AppText variant="caption" primary bold>
          {action}
        </AppText>
      ) : onPress ? (
        <ChevronRight size={17} color={colors.textTertiary} />
      ) : null}
    </Pressable>
  );
};

export const ProfileToggleRow: React.FC<{
  icon: string;
  title: string;
  detail?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
}> = ({ icon, title, detail, value, onChange, last }) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  return (
    <View
      style={[
        styles.listRow,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: colors.primaryLight, borderRadius: radius.sm },
        ]}
      >
        <AppText variant="body1">{icon}</AppText>
      </View>
      <View style={styles.rowCopy}>
        <AppText variant="subtitle2" bold numberOfLines={1}>
          {title}
        </AppText>
        {detail ? (
          <AppText variant="caption" secondary numberOfLines={1}>
            {detail}
          </AppText>
        ) : null}
      </View>
      <Pressable
        onPress={() => onChange(!value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={title}
        style={[
          styles.switchTrack,
          { backgroundColor: value ? colors.primary : colors.border },
        ]}
      >
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </Pressable>
    </View>
  );
};

export const ProfileMetric: React.FC<{ value: string; label: string }> = ({
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  
  headerMain: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 16, paddingTop: 18 },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionLabel: {
    marginLeft: 4,
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 0.6,
  },
  listRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  switchThumbOn: { alignSelf: 'flex-end' },
  metric: {
    minHeight: 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingVertical: 5,
  },
});
