import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import {
  AppHeader,
  AppText,
  ProfileCard,
  ProfileListRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileSectionLabel } from '../components/ProfileScreenLayout';
import createStyles from './styles.HelpSupport';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/ProfileStack';

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

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
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
  const { colors } = theme;
  const styles = createStyles(colors);
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Help & Support"
        subtitle="We're here to help"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
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
            icon="🤖"
            title="AI Legal & Health Assistant"
            detail="Instant answers on privacy, terms & disclaimers"
            onPress={() => navigation.navigate('AiChatBot')}
          />
          <ProfileListRow
            icon="📧"
            title="Email Support"
            detail="support@vitality.app"
            onPress={() => navigation.navigate('EmailSupport')}
          />
          {/* <ProfileListRow
            icon="🐞"
            title="Report a Bug"
            detail="Help us improve the app"
            onPress={() => navigation.navigate('AiChatBot')}
          /> */}
          <ProfileListRow
            icon="📜"
            title="Community Guidelines"
            onPress={() => navigation.navigate('CommunityGuidelines')}
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
            <AppText
              variant="body2"
              secondary
              center
              style={styles.emptySearch}
            >
              No articles found. Try a different search.
            </AppText>
          ) : null}
        </View>
        <AppText variant="caption" secondary center style={styles.responseTime}>
          Average response time: 4 min · 24/7 coverage
        </AppText>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;
