import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { AppButton, AppHeader, AppText } from '../../../../../components';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../../theme/useTheme';
import { createCommunityGuidelinesStyles } from './styles.CommunityGuidelines';

type Props = { navigation: { goBack: () => void } };

const GUIDELINE_PILLARS = [
  {
    emoji: '🤝',
    title: 'Support & Encouragement',
    description:
      'Be supportive and celebrate wins. Cheer on fellow members and foster a positive environment for all fitness levels.',
  },
  {
    emoji: '🔒',
    title: 'Privacy First',
    description:
      "Never share someone else's health data, workout metrics, or private account details without explicit consent.",
  },
  {
    emoji: '⚖️',
    title: 'Fair Play & Honesty',
    description:
      'Log activities honestly. Keep challenges friendly, inclusive, and authentic so everyone has a fair chance to succeed.',
  },
  {
    emoji: '🛡️',
    title: 'Zero Tolerance for Harassment',
    description:
      'Bullying, hate speech, spam, and inappropriate behavior are strictly prohibited and will result in permanent removal.',
  },
];

const CommunityGuidelines: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createCommunityGuidelinesStyles(theme);

  return (
    <View style={styles.container}>
      {/* <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      /> */}
      <AppHeader
        title="Community Guidelines"
        subtitle="Our shared values and expectations"
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
        showProfile={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card matching the design */}
        <View style={styles.heroCard}>
          <AppIcon name="Info" size={36} color={theme.colors.primary} />
          <AppText variant="h3" bold style={styles.heroTitle}>
            Community Guidelines
          </AppText>
          <AppText variant="body2" style={styles.heroDescription}>
            Be supportive. Celebrate wins. Never share someone else&apos;s
            health data. Keep challenges friendly and inclusive.
          </AppText>
        </View>

        {/* Primary Action Button */}
        <AppButton
          title="I Understand"
          onPress={() => navigation.goBack()}
          style={styles.understandButton}
        />

        {/* Core Pillars Section */}
        <AppText variant="subtitle2" bold style={styles.sectionLabel}>
          Our Core Principles
        </AppText>

        {GUIDELINE_PILLARS.map(pillar => (
          <View key={pillar.title} style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <AppText style={styles.pillarEmoji}>{pillar.emoji}</AppText>
              <AppText variant="subtitle2" bold>
                {pillar.title}
              </AppText>
            </View>
            <AppText variant="caption" secondary style={styles.pillarText}>
              {pillar.description}
            </AppText>
          </View>
        ))}

        <AppText variant="caption" secondary style={styles.footerNote}>
          By participating in groups and challenges, you agree to uphold these
          guidelines to ensure Vitality remains safe and motivating for
          everyone.
        </AppText>
      </ScrollView>
    </View>
  );
};

export default CommunityGuidelines;
