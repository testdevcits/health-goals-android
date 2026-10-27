import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import {
  AppText,
  ProfileCard,
  ProfileListRow,
  ProfileScreen,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';

const faqs = [
  {
    question: 'How are points and rewards calculated?',
    answer:
      'You earn points by completing health goals, joining challenges, and maintaining activity streaks. Each reward shows the points needed to redeem it.',
  },
  {
    question: 'Who can see my health data?',
    answer:
      'You control what is shared in Privacy & Permissions. Employer reporting is anonymous and only includes aggregated team data.',
  },
  {
    question: 'How do I connect my wearable?',
    answer:
      'Open Connected Devices, choose Connect for your wearable, and allow the requested health permissions.',
  },
  {
    question: 'Can I create a private group with friends?',
    answer:
      'Yes. Create a group and choose the private visibility option before inviting your friends.',
  },
  {
    question: 'What happens if I miss a day in a streak?',
    answer:
      'Your streak pauses when a day is missed. Complete your daily goal again to begin a new streak.',
  },
];

const HelpSupportScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const filteredFaqs = useMemo(
    () =>
      faqs.filter(item =>
        item?.question.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <ProfileScreen
      navigation={navigation}
      title="Help & Support"
      subtitle="We're here to help"
    >
      <View
        style={[styles.searchBox, { backgroundColor: theme.colors.surface }]}
      >
        <Search size={18} color={theme.colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search help articles..."
          placeholderTextColor={theme.colors.inputPlaceholder}
          style={[
            styles.searchInput,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.regular,
            },
          ]}
          accessibilityLabel="Search help articles"
        />
      </View>
      <ProfileCard style={styles.supportCard}>
        <ProfileListRow
          icon="💬"
          title="Live Chat with Support"
          detail="Typically replies in under 5 min"
          onPress={() =>
            Alert.alert('Live chat', 'Support chat is ready to start.')
          }
        />
        <ProfileListRow
          icon="📧"
          title="Email Support"
          detail="support@vitality.app"
          onPress={() =>
            Alert.alert('Email support', 'Contact us at support@vitality.app')
          }
        />
        <ProfileListRow
          icon="🐞"
          title="Report a Bug"
          detail="Help us improve the app"
          onPress={() =>
            Alert.alert(
              'Report a bug',
              'Tell our support team what went wrong.',
            )
          }
        />
        <ProfileListRow
          icon="📜"
          title="Community Guidelines"
          onPress={() =>
            Alert.alert(
              'Community Guidelines',
              'Be respectful, supportive, and kind to everyone in the community.',
            )
          }
          last
        />
      </ProfileCard>
      <ProfileSectionLabel>Frequently Asked Questions</ProfileSectionLabel>
      <View style={styles.faqList}>
        {filteredFaqs.map(item => {
          const index = faqs.indexOf(item);
          const expanded = expandedFaq === index;
          return (
            <Pressable
              key={item?.question}
              onPress={() => setExpandedFaq(expanded ? null : index)}
              style={[
                styles.faqCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={styles.faqQuestion}>
                <AppText variant="subtitle2" bold style={styles.faqText}>
                  {item?.question}
                </AppText>
                <ChevronDown
                  size={16}
                  color={theme.colors.textTertiary}
                  style={expanded ? styles.chevronExpanded : undefined}
                />
              </View>
              {expanded ? (
                <AppText variant="caption" secondary style={styles.faqAnswer}>
                  {item?.answer}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
        {filteredFaqs.length === 0 ? (
          <AppText variant="body2" secondary center style={styles.emptySearch}>
            No articles found. Try a different search.
          </AppText>
        ) : null}
      </View>
      <AppText variant="caption" secondary center style={styles.responseTime}>
        Average response time: 4 min · 24/7 coverage
      </AppText>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    minHeight: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  supportCard: { marginBottom: 2 },
  faqList: { gap: 9 },
  faqCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    elevation: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.035,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  faqText: { flex: 1 },
  chevronExpanded: { transform: [{ rotate: '180deg' }] },
  faqAnswer: { marginTop: 9, paddingRight: 18 },
  emptySearch: { paddingVertical: 20 },
  responseTime: { marginTop: 16, marginBottom: 4 },
});

export default HelpSupportScreen;
