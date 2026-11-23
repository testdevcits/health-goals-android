import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppHeader, AppText } from '../../../components';
import type { RootStackParamList } from '../../../navigations/ProfileStack';
import { useTheme } from '../../../theme/useTheme';
import { createAboutVitalityStyles } from './styles.AboutVitality';

type Props = NativeStackScreenProps<RootStackParamList, 'AboutVitality'>;

const HIGHLIGHTS = [
  {
    emoji: '🎯',
    title: 'Our Mission',
    description:
      'We believe daily movement should be rewarding, social, and habit-forming. Vitality gamifies every step you take so healthy living feels fun and celebrated.',
  },
  {
    emoji: '🪙',
    title: 'Earn Real Rewards',
    description:
      'Turn your steps and workouts into valuable Vitality Points. Redeem your points for healthy refreshments, merchandise, wellness vouchers, and raffle ticket prizes.',
  },
  {
    emoji: '👥',
    title: 'Community & Accountability',
    description:
      'Build fitness pods with coworkers, friends, and family. Challenge each other, share milestone photos, and climb the team leaderboards together.',
  },
  {
    emoji: '⌚',
    title: 'Seamless Google Health Connect',
    description:
      'Zero battery drain. Vitality syncs automatically with Google Health Connect, boAt, Samsung Health, and wearable trackers with complete data privacy.',
  },
];

const APP_SPECS = [
  { label: 'Application', value: 'Vitality' },
  { label: 'Version', value: '1.0.0 (Production)' },
  { label: 'Build', value: '2026.11-release' },
  { label: 'Engine', value: 'React Native & Health Connect' },
  { label: 'Platform', value: 'Android' },
];

const AboutVitalityScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createAboutVitalityStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppHeader
        title="About Vitality"
        subtitle="Empowering your daily wellness journey"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.appIconBadge}>
            <AppText style={styles.appIconEmoji}>⚡</AppText>
          </View>
          <AppText variant="h2" style={styles.appName}>
            Vitality
          </AppText>
          <AppText variant="body2" style={styles.appTagline}>
            Every step counts. Every movement inspires. Every milestone is rewarded.
          </AppText>

          <View style={styles.versionBadge}>
            <AppText style={styles.versionText}>Version 1.0.0</AppText>
          </View>
        </View>

        <AppText variant="subtitle2" bold style={styles.sectionLabel}>
          What We Stand For
        </AppText>

        {HIGHLIGHTS.map(item => (
          <View key={item.title} style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <AppText style={styles.featureEmoji}>{item.emoji}</AppText>
              <AppText variant="subtitle2" bold>
                {item.title}
              </AppText>
            </View>
            <AppText variant="body2" style={styles.featureText}>
              {item.description}
            </AppText>
          </View>
        ))}

        <AppText variant="subtitle2" bold style={styles.sectionLabel}>
          App Information
        </AppText>

        <View style={styles.specCard}>
          {APP_SPECS.map((spec, index) => (
            <React.Fragment key={spec.label}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.specRow}>
                <AppText style={styles.specLabel}>{spec.label}</AppText>
                <AppText style={styles.specValue}>{spec.value}</AppText>
              </View>
            </React.Fragment>
          ))}
        </View>

        <AppText variant="caption" style={styles.footerNote}>
          Designed and built with ❤️ for active, healthy communities worldwide.
        </AppText>

        <AppButton
          title="Back to Profile"
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        />
      </ScrollView>
    </View>
  );
};

export default AboutVitalityScreen;
