import React from 'react';
import { Alert, Linking, ScrollView, StatusBar, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppHeader, AppText } from '../../../../../components';
import type { RootStackParamList } from '../../../../../navigations/ProfileStack';
import { useTheme } from '../../../../../theme/useTheme';
import { createEmailSupportStyles } from './styles.EmailSupport';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailSupport'>;

const SUPPORT_EMAIL = 'support@vitality.app';

const EmailSupport: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createEmailSupportStyles(theme);

  const handleComposeEmail = async () => {
    const subject = encodeURIComponent('Vitality Support Request');
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Email Support',
          `No default email app was found. You can email us directly at ${SUPPORT_EMAIL}.`,
        );
      }
    } catch {
      Alert.alert(
        'Email Support',
        `Please send your message directly to ${SUPPORT_EMAIL}.`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppHeader
        title="Email Support"
        subtitle="We will reply within 24 hours"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card matching the design */}
        <View style={styles.heroCard}>
          <View style={styles.iconBox}>
            <AppText style={styles.iconText}>✉️</AppText>
          </View>
          <AppText variant="h3" bold style={styles.heroTitle}>
            Email Support
          </AppText>
          <AppText variant="body2" style={styles.heroDescription}>
            Send us a message at {SUPPORT_EMAIL} and we will reply within 24
            hours.
          </AppText>
        </View>

        {/* Primary Action Button */}
        <AppButton
          title="Compose Email"
          onPress={handleComposeEmail}
          style={styles.composeButton}
        />

        {/* Support Information Section */}
        <AppText variant="subtitle2" bold style={styles.sectionLabel}>
          Helpful Information
        </AppText>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <AppText style={styles.infoEmoji}>⏱️</AppText>
            <View style={styles.infoContent}>
              <AppText variant="subtitle2" bold>
                Response Time
              </AppText>
              <AppText variant="caption" secondary>
                Our team reviews tickets Monday through Friday and typically
                responds in less than 24 hours.
              </AppText>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <AppText style={styles.infoEmoji}>📝</AppText>
            <View style={styles.infoContent}>
              <AppText variant="subtitle2" bold>
                What to Include
              </AppText>
              <AppText variant="caption" secondary>
                Mention your account email, phone model, and a brief description
                of the issue for faster assistance.
              </AppText>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <AppText style={styles.infoEmoji}>🔒</AppText>
            <View style={styles.infoContent}>
              <AppText variant="subtitle2" bold>
                Security Reminder
              </AppText>
              <AppText variant="caption" secondary>
                Vitality will never ask for your password, verification OTPs, or
                payment pin numbers via email.
              </AppText>
            </View>
          </View>
        </View>

        <AppText variant="caption" secondary style={styles.footerNote}>
          Need instant help with legal or privacy policies? You can also check
          the AI Legal & Health Assistant in Help & Support.
        </AppText>
      </ScrollView>
    </View>
  );
};

export default EmailSupport;
