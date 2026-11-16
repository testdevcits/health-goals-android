import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader, AppText } from '../../../../../components';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import type { RootStackParamList } from '../../../../../navigations/ProfileStack';
import { useTheme } from '../../../../../theme/useTheme';
import { createAiChatBotStyles } from './styles.AiChatBot';

type Props = NativeStackScreenProps<RootStackParamList, 'AiChatBot'>;

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'How is my health data protected?',
  'Are employer reports anonymous?',
  'Can I export or delete my data?',
  'How are challenge rewards earned?',
  'What are the community rules?',
  'How does device sync work?',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    sender: 'assistant',
    text: 'Hello! I am your Vitality AI Assistant. I can help answer questions regarding your health privacy, data synchronization, terms of service, and community guidelines. How can I assist you today?',
    time: 'Just now',
  },
];

function generateAssistantResponse(prompt: string): string {
  const query = prompt.toLowerCase();

  if (
    query.includes('protect') ||
    query.includes('privacy') ||
    query.includes('security')
  ) {
    return 'Your health data is protected using end-to-end industry-standard encryption in transit and at rest. Vitality accesses metrics strictly via Android Health Connect with your explicit permission. We never sell your personal or biometric information to third parties, and you can revoke access at any time from your system settings.';
  }

  if (
    query.includes('employer') ||
    query.includes('company') ||
    query.includes('corporate')
  ) {
    return 'Yes, employer and team reports are 100% anonymous and aggregated. Your company only sees high-level team averages (such as total team steps or challenge participation percentages). Your individual daily logs, heart rate, sleep history, and personal activities are never visible to your employer.';
  }

  if (
    query.includes('export') ||
    query.includes('delete') ||
    query.includes('remove data')
  ) {
    return 'You have full sovereignty over your data. Under Settings > Privacy & Permissions, you can tap "Export My Data" to receive a copy of your health records, or choose "Delete My Account" to permanently erase your profile, points, group memberships, and historical health metrics.';
  }

  if (
    query.includes('reward') ||
    query.includes('coin') ||
    query.includes('point') ||
    query.includes('wallet')
  ) {
    return 'Points and coins are earned by reaching daily activity goals (like 10,000 steps), maintaining active streaks, and participating in community challenges. Once verified by Health Connect, points are credited to your Vitality Wallet and can be redeemed for gift cards and partner rewards in the Rewards section.';
  }

  if (
    query.includes('rule') ||
    query.includes('guideline') ||
    query.includes('community')
  ) {
    return 'Our community guidelines focus on four core pillars: Mutual Support, Health Privacy (never sharing someone else’s data), Fair Play (honest activity logging), and a Safe & Respectful environment with zero tolerance for harassment or inappropriate conduct.';
  }

  if (
    query.includes('device') ||
    query.includes('sync') ||
    query.includes('bluetooth') ||
    query.includes('watch')
  ) {
    return 'Vitality connects with Android Health Connect to automatically sync readings from compatible smartwatches and fitness trackers (Samsung Health, Google Fit, Garmin, etc.). You can also scan for nearby Bluetooth devices directly from the Connected Devices screen.';
  }

  if (
    query.includes('support') ||
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('help')
  ) {
    return 'For specific account investigations or billing questions, our human support team is available at support@vitality.app and responds within 24 hours Monday through Friday.';
  }

  return `Thank you for your question. Vitality is committed to privacy, transparent health tracking, and fair community challenges. If you have questions about specific terms, policies, or data handling, please let me know, or reach out directly to support@vitality.app for personalized assistance.`;
}

function getFormattedTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const AiChatBot: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createAiChatBotStyles(theme);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const sendMessage = useCallback((textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: getFormattedTime(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: generateAssistantResponse(trimmed),
        time: getFormattedTime(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 600);
  }, []);

  const renderMessageItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.sender === 'user';

      return (
        <View
          style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}
        >
          {!isUser && (
            <View style={styles.botAvatar}>
              <AppIcon name="Heart" size={16} color={theme.colors.primary} />
            </View>
          )}

          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            <AppText
              variant="body2"
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.botMessageText,
              ]}
            >
              {item.text}
            </AppText>
            <AppText
              variant="caption"
              style={[
                styles.messageTime,
                isUser ? styles.userTime : styles.botTime,
              ]}
            >
              {item.time}
            </AppText>
          </View>
        </View>
      );
    },
    [styles, theme.colors.primary],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppHeader
        title="AI Legal & Health Assistant"
        subtitle="Answers on privacy, terms & health data"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Informational Disclaimer Banner */}
        <View style={styles.disclaimerBanner}>
          <AppIcon name="Info" size={16} color={theme.colors.primary} />
          <AppText variant="caption" secondary style={styles.disclaimerText}>
            Informational assistant for policies, privacy & data. Not medical or
            formal legal counsel.
          </AppText>
        </View>

        {/* Conversation Thread */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicatorRow}>
            <View style={styles.botAvatar}>
              <AppIcon name="Heart" size={14} color={theme.colors.primary} />
            </View>
            <AppText variant="caption" secondary style={styles.typingText}>
              Vitality Assistant is answering…
            </AppText>
          </View>
        )}

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsWrapper}>
          <AppText variant="caption" secondary style={styles.suggestionsTitle}>
            Suggested Topics
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
            keyboardShouldPersistTaps="handled"
          >
            {QUICK_PROMPTS.map(prompt => (
              <Pressable
                key={prompt}
                onPress={() => sendMessage(prompt)}
                style={styles.suggestionChip}
                accessibilityRole="button"
                accessibilityLabel={prompt}
              >
                <AppText variant="caption" bold color="primary">
                  {prompt}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Input Composer */}
        <View style={styles.composerContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about privacy, terms, or data…"
            placeholderTextColor={theme.colors.inputPlaceholder}
            style={styles.input}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(inputText)}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            disabled={!inputText.trim() || isTyping}
            onPress={() => sendMessage(inputText)}
            style={[
              styles.sendButton,
              (!inputText.trim() || isTyping) && styles.sendButtonDisabled,
            ]}
          >
            <AppIcon name="Send" size={18} color={theme.colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AiChatBot;
