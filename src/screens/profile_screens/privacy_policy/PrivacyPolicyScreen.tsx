import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppButton, AppHeader, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createPrivacyPolicyStyles } from './styles.PrivacyPolicy';

type Props = { navigation: { goBack: () => void } };

const PRIVACY_SECTIONS = [
  {
    emoji: '📊',
    title: '1. Information We Collect',
    description:
      'We collect step counts, activity duration, distance, and calories synced through Google Health Connect or recorded via the Vitality workout tracker, along with basic profile details (name, email).',
  },
  {
    emoji: '🛡️',
    title: '2. Health Connect & Health Data',
    description:
      'Health data accessed through Google Health Connect is used solely to verify activity, award reward points, and display your fitness progress. We strictly comply with Google Health Connect Developer Policies.',
  },
  {
    emoji: '🚫',
    title: '3. Zero Third-Party Advertising',
    description:
      'We never sell, rent, or trade your personal or health data to data brokers, advertisers, or third-party marketing networks. Your fitness data belongs entirely to you.',
  },
  {
    emoji: '🔐',
    title: '4. Data Security & Encryption',
    description:
      'All user communications and fitness records are encrypted in transit (TLS 1.3) and stored securely with industry-standard cryptographic protection.',
  },
  {
    emoji: '👥',
    title: '5. Social & Group Privacy',
    description:
      'In groups and community feeds, you maintain full control over your post visibility (Private vs Public). You can opt out of leaderboard display anytime in your account settings.',
  },
  {
    emoji: '🗑️',
    title: '6. Data Retention & Deletion',
    description:
      'You have the right to request deletion of your account and associated health data at any time. Revoking Health Connect permissions immediately stops all future data reading.',
  },
  {
    emoji: '📧',
    title: '7. Contact Us About Privacy',
    description:
      'If you have questions, feedback, or requests regarding this Privacy Policy or your data rights, please contact our team at privacy@vitality.app.',
  },
];

const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createPrivacyPolicyStyles(theme);

  return (
    <View style={styles.container}>
      {/* <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      /> */}
      <AppHeader
        title="Privacy Policy"
        subtitle="How we protect and respect your data"
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
        showProfile={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <AppText style={styles.iconText}>🛡️</AppText>
          <AppText variant="h3" style={styles.heroTitle}>
            Your Privacy Comes First
          </AppText>
          <AppText variant="body2" style={styles.heroDescription}>
            Vitality is built to reward healthy habits while keeping your
            personal and health data completely confidential, encrypted, and
            secure.
          </AppText>

          <View style={styles.effectiveDateBadge}>
            <AppText style={styles.effectiveDateText}>
              Last updated: November 2026
            </AppText>
          </View>
        </View>

        <AppText variant="subtitle2" bold style={styles.sectionLabel}>
          Privacy Commitments & Policy
        </AppText>

        {PRIVACY_SECTIONS.map(item => (
          <View key={item?.title} style={styles.policyCard}>
            <View style={styles.policyHeader}>
              <AppText style={styles.policyEmoji}>{item?.emoji}</AppText>
              <AppText variant="subtitle2" bold>
                {item?.title}
              </AppText>
            </View>
            <AppText variant="body2" style={styles.policyText}>
              {item?.description}
            </AppText>
          </View>
        ))}

        <AppText variant="caption" style={styles.footerNote}>
          By continuing to use Vitality, you acknowledge and agree to the
          practices described in this policy.
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

export default PrivacyPolicyScreen;
