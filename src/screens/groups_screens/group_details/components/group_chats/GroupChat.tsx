import React, { memo } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { Send } from 'lucide-react-native';
import { AppEmptyState, AppText } from '../../../../../components';
import { GroupMessage } from '../../constants';
import { useTheme } from '../../../../../theme/useTheme';
import createGroupChatStyles from './styles.GroupChat';

interface Props {
  messages: GroupMessage[];
  messageDraft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
}

export const GroupChat: React.FC<Props> = memo(
  ({ messages, messageDraft, onChangeDraft, onSend }) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = theme;
    const styles = createGroupChatStyles(colors, spacing, radius);

    return (
      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.chatMessages}
          contentContainerStyle={styles.chatMessagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <AppEmptyState
              title="Start the conversation"
              description="Send the first message to your group."
            />
          ) : messages.map(message => (
            <View
              key={message.id}
              style={[styles.messageRow, message.mine && styles.myMessageRow]}
            >
              {!message.mine && (
                <View
                  style={[styles.chatAvatar, { backgroundColor: message.color }]}
                >
                  <AppText variant="caption" color="white" bold>
                    {message.initials}
                  </AppText>
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  message.mine
                    ? styles.myMessageBubble
                    : styles.otherMessageBubble,
                ]}
              >
                {!message.mine && (
                  <AppText
                    variant="caption"
                    primary
                    bold
                    style={styles.messageAuthor}
                  >
                    {message.name}
                  </AppText>
                )}

                <AppText
                  variant="body2"
                  style={
                    message.mine
                      ? styles.myMessageText
                      : styles.otherMessageText
                  }
                >
                  {message.message}
                </AppText>

                <AppText
                  variant="caption"
                  style={[
                    message.mine
                      ? styles.myMessageTime
                      : styles.otherMessageTime,
                    styles.messageTime,
                  ]}
                >
                  {message.time}
                </AppText>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatComposer}>
          <TextInput
            value={messageDraft}
            onChangeText={onChangeDraft}
            placeholder="Message the group..."
            placeholderTextColor={colors.inputPlaceholder}
            style={styles.chatInput}
            multiline
            maxLength={1000}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            onPress={onSend}
            style={styles.sendButton}
          >
            <Send size={18} color="white" />
          </Pressable>
        </View>
      </View>
    );
  },
);
