import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Settings,
  Send,
  X,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
} from 'lucide-react-native';

import { useTheme } from '../../../theme/useTheme';
import { AppText } from '../../../components';
import createStyles from './styles.GroupDetails';

type DetailTab = 'Overview' | 'Leaderboard' | 'Chat';

interface Member {
  id: string;
  name: string;
  initials: string;
  steps: number;
  streak: number;
  color: string;
}

interface GroupMessage {
  id: string;
  name: string;
  initials: string;
  message: string;
  time: string;
  color: string;
  mine?: boolean;
}

interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    initials: 'S',
    steps: 52400,
    streak: 14,
    color: '#FF6868',
  },
  {
    id: '2',
    name: 'Mike Chen',
    initials: 'M',
    steps: 48300,
    streak: 9,
    color: '#4D91EB',
  },
  {
    id: '3',
    name: 'You (Alex)',
    initials: 'A',
    steps: 41200,
    streak: 12,
    color: '#00BFA5',
  },
  {
    id: '4',
    name: 'Priya Patel',
    initials: 'P',
    steps: 37600,
    streak: 7,
    color: '#FF9B38',
  },
  {
    id: '5',
    name: 'James Liu',
    initials: 'J',
    steps: 32100,
    streak: 5,
    color: '#7563F5',
  },
  {
    id: '6',
    name: 'Lena Park',
    initials: 'L',
    steps: 29600,
    streak: 3,
    color: '#00BFA5',
  },
];

const initialMessages: GroupMessage[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    initials: 'S',
    message: 'Morning run done! 6.2K before 7 AM ☀️',
    time: '6:42 AM',
    color: '#FF6868',
  },
  {
    id: '2',
    name: 'Mike Chen',
    initials: 'M',
    message: "Nice! I'm doing a 5K at lunch, anyone joining?",
    time: '7:15 AM',
    color: '#4D91EB',
  },
  {
    id: '3',
    name: 'Priya Patel',
    initials: 'P',
    message: 'Count me in! Meet at the park entrance?',
    time: '7:22 AM',
    color: '#FF9B38',
  },
  {
    id: '4',
    name: 'Alex',
    initials: 'A',
    message: "I'll be there 💪",
    time: '7:30 AM',
    color: '#00BFA5',
    mine: true,
  },
];

const initialChallenges: GroupChallenge[] = [
  {
    id: '1',
    title: 'Weekend Sprint',
    description:
      'Whoever walks the most steps between Sat–Sun wins 200 bonus points and group bragging rights.',
    status: 'Starts Sat',
    progress: 0,
    progressLabel: 'Not started',
    color: '#00C6A2',
  },
];

const weeklySteps = [
  { day: 'Mon', value: 68 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 54 },
  { day: 'Thu', value: 84 },
  { day: 'Fri', value: 72 },
  { day: 'Sat', value: 46 },
  { day: 'Sun', value: 28 },
];

const formatSteps = (steps: number) => steps.toLocaleString('en-US');

interface GroupDetailScreenProps {
  groupName?: string;
  groupDescription?: string;
  memberCount?: number;
}

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  groupName = 'Morning Runners',
  groupDescription = 'Weekly step challenge',
  memberCount = 8,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  const [messages, setMessages] = useState(initialMessages);
  const [messageDraft, setMessageDraft] = useState('');

  const [challenges, setChallenges] = useState(initialChallenges);
  const [createChallengeVisible, setCreateChallengeVisible] = useState(false);

  const [challengeName, setChallengeName] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [duration, setDuration] = useState('3 days');
  const [reward, setReward] = useState('200 pts');

  const [likedChallenges, setLikedChallenges] = useState<string[]>([]);

  const styles = createStyles(colors, spacing, radius);

  const handleSendMessage = () => {
    const text = messageDraft.trim();

    if (!text) {
      return;
    }

    const newMessage: GroupMessage = {
      id: `${Date.now()}`,
      name: 'Alex',
      initials: 'A',
      message: text,
      time: 'Now',
      color: '#00BFA5',
      mine: true,
    };

    setMessages(previous => [...previous, newMessage]);
    setMessageDraft('');
  };

  const handleCreateChallenge = () => {
    if (!challengeName.trim() || !challengeGoal.trim()) {
      Alert.alert(
        'Missing details',
        'Enter a challenge name and goal to continue.',
      );
      return;
    }

    const newChallenge: GroupChallenge = {
      id: `${Date.now()}`,
      title: challengeName.trim(),
      description: `Goal: ${challengeGoal.trim()}. Duration: ${duration}. Reward: ${reward}.`,
      status: 'New',
      progress: 0,
      progressLabel: 'Not started',
      color: '#00C6A2',
    };

    setChallenges(previous => [...previous, newChallenge]);
    setCreateChallengeVisible(false);

    setChallengeName('');
    setChallengeGoal('');
    setDuration('3 days');
    setReward('200 pts');

    setActiveTab('Overview');
  };

  const cycleDuration = () => {
    const options = ['3 days', '7 days', '14 days', '30 days'];
    const currentIndex = options.indexOf(duration);
    setDuration(options[(currentIndex + 1) % options.length]);
  };

  const cycleReward = () => {
    const options = ['100 pts', '200 pts', '500 pts', '1000 pts'];
    const currentIndex = options.indexOf(reward);
    setReward(options[(currentIndex + 1) % options.length]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <ArrowLeft size={20} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText variant="h3" numberOfLines={1}>
          {groupName}
        </AppText>

        <AppText variant="caption" secondary numberOfLines={1}>
          {groupDescription} · {memberCount} members
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        style={styles.headerIconButton}
      >
        <Bell size={19} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.profileAvatar}>
        <AppText variant="subtitle2" color="white" bold>
          AJ
        </AppText>
      </View>
    </View>
  );

  const renderGroupBanner = () => (
    <View style={styles.groupBanner}>
      <View style={styles.bannerIcon}>
        <AppText style={styles.bannerEmoji}>🏃</AppText>
      </View>

      <View style={styles.bannerDetails}>
        <AppText variant="h3" color="white">
          {groupName}
        </AppText>

        <AppText variant="caption" color="white">
          {groupDescription} · {memberCount} members
        </AppText>

        <View style={styles.bannerAvatars}>
          {initialMembers.slice(0, 5).map(member => (
            <View
              key={member.id}
              style={[styles.bannerAvatar, { backgroundColor: member.color }]}
            >
              <AppText variant="caption" color="white" bold>
                {member.initials}
              </AppText>
            </View>
          ))}

          <View style={styles.bannerMore}>
            <AppText variant="caption" color="white" bold>
              +3
            </AppText>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Group settings"
        onPress={() =>
          Alert.alert(
            'Group settings',
            'Connect this action to your group settings screen.',
          )
        }
        style={styles.settingsButton}
      >
        <Settings size={17} color="white" />
      </Pressable>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['Overview', 'Leaderboard', 'Chat'] as DetailTab[]).map(tab => {
        const selected = activeTab === tab;

        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, selected && styles.activeTab]}
          >
            <AppText
              variant="label"
              center
              style={{
                color: selected ? colors.textPrimary : colors.textSecondary,
              }}
              medium={selected}
            >
              {tab}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );

  const renderGoalCard = () => (
    <View style={styles.goalCard}>
      <View style={styles.goalRing}>
        <View style={styles.goalRingInner}>
          <AppText variant="h3" center>
            69%
          </AppText>

          <AppText variant="caption" secondary center>
            OF GOAL
          </AppText>
        </View>
      </View>

      <View style={styles.goalInfo}>
        <AppText variant="caption" secondary>
          WEEKLY GROUP GOAL
        </AppText>

        <View style={styles.goalNumbers}>
          <AppText variant="h2">241,200</AppText>

          <AppText variant="caption" secondary>
            {' / 350,000 steps'}
          </AppText>
        </View>

        <AppText variant="caption" success bold>
          🔥 3 days left to close the gap
        </AppText>
      </View>
    </View>
  );

  const renderWeeklyChart = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Group Daily Steps</AppText>

        <View style={styles.weekBadge}>
          <AppText variant="caption" primary bold>
            This week
          </AppText>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartBars}>
          {weeklySteps.map(item => (
            <View key={item.day} style={styles.chartColumn}>
              <View style={[styles.chartBar, { height: `${item.value}%` }]} />

              <AppText
                variant="caption"
                secondary
                center
                style={styles.chartDay}
              >
                {item.day}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderMemberRow = (member: Member, index: number) => {
    const isCurrentUser = member.id === '3';

    return (
      <Pressable
        key={member.id}
        accessibilityRole="button"
        onPress={() =>
          Alert.alert(
            member.name,
            `${formatSteps(member.steps)} steps · ${member.streak}-day streak`,
          )
        }
        style={[styles.memberRow, isCurrentUser && styles.currentMemberRow]}
      >
        <View
          style={[
            styles.rankBadge,
            index === 0 && styles.firstRankBadge,
            index === 2 && styles.thirdRankBadge,
          ]}
        >
          <AppText
            variant="caption"
            style={{
              color:
                index === 0
                  ? '#B77900'
                  : index === 2
                  ? '#B45309'
                  : colors.textSecondary,
            }}
            bold
          >
            {index + 1}
          </AppText>
        </View>

        <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
          <AppText variant="subtitle2" color="white" bold>
            {member.initials}
          </AppText>
        </View>

        <View style={styles.memberInfo}>
          <AppText variant="label" numberOfLines={1}>
            {member.name}
          </AppText>

          <AppText variant="caption" secondary>
            🔥 {member.streak}-day streak
          </AppText>
        </View>

        <View style={styles.memberSteps}>
          <AppText variant="label" bold right>
            {formatSteps(member.steps)}
          </AppText>

          <AppText variant="caption" secondary right>
            steps
          </AppText>
        </View>
      </Pressable>
    );
  };

  const renderContributors = (limit?: number) => (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Top Contributors</AppText>
      </View>

      <View style={styles.contributorsCard}>
        {initialMembers
          .slice(0, limit ?? initialMembers.length)
          .map(renderMemberRow)}
      </View>

      {activeTab === 'Overview' && (
        <AppText variant="caption" secondary center mt={spacing.sm}>
          View the leaderboard to see all members
        </AppText>
      )}
    </View>
  );

  const renderChallengeCard = (challenge: GroupChallenge) => (
    <View
      key={challenge.id}
      style={[styles.challengeCard, { borderLeftColor: challenge.color }]}
    >
      <View style={styles.challengeHeading}>
        <View style={styles.challengeTitleRow}>
          <AppText style={styles.challengeEmoji}>🔥</AppText>

          <AppText variant="subtitle2" style={styles.challengeTitle}>
            {challenge.title}
          </AppText>
        </View>

        <View style={styles.challengeStatus}>
          <AppText
            variant="caption"
            style={{
              color: challenge.color,
            }}
          >
            {challenge.status}
          </AppText>
        </View>
      </View>

      <AppText variant="body2" secondary style={styles.challengeDescription}>
        {challenge.description}
      </AppText>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${challenge.progress}%`,
              backgroundColor: challenge.color,
            },
          ]}
        />
      </View>

      <View style={styles.challengeFooter}>
        <AppText variant="caption" secondary>
          {challenge.progressLabel}
        </AppText>

        <AppText
          variant="caption"
          style={{
            color: challenge.color,
          }}
          bold
        >
          {challenge.progress}%
        </AppText>
      </View>
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="subtitle1">Challenges</AppText>
      </View>

      {challenges.map(renderChallengeCard)}

      <Pressable
        accessibilityRole="button"
        onPress={() => setCreateChallengeVisible(true)}
        style={styles.newChallengeButton}
      >
        <AppText variant="buttonSm" primary>
          + New Challenge
        </AppText>
      </Pressable>
    </View>
  );

  const renderOverview = () => (
    <>
      {renderGoalCard()}
      {renderWeeklyChart()}
      {renderContributors(3)}
      {renderChallenges()}
    </>
  );

  const renderLeaderboard = () => (
    <>
      <View style={styles.leaderboardIntro}>
        <AppText variant="caption" secondary center>
          Group ranking · This week
        </AppText>
      </View>

      {renderContributors()}
    </>
  );

  const renderChat = () => (
    <View style={styles.chatContainer}>
      <ScrollView
        style={styles.chatMessages}
        contentContainerStyle={styles.chatMessagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(message => (
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
                style={{
                  color: message.mine ? 'white' : colors.textPrimary,
                }}
              >
                {message.message}
              </AppText>

              <AppText
                variant="caption"
                style={[
                  {
                    color: message.mine ? 'white' : colors.textTertiary,
                  },
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
          onChangeText={setMessageDraft}
          placeholder="Message the group..."
          placeholderTextColor={colors.inputPlaceholder}
          style={styles.chatInput}
          multiline
          maxLength={1000}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          onPress={handleSendMessage}
          style={styles.sendButton}
        >
          <Send size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );

  const renderCreateChallengeModal = () => (
    <Modal
      visible={createChallengeVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => setCreateChallengeVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setCreateChallengeVisible(false)}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboardContainer}
        >
          <View
            style={[
              styles.bottomSheet,
              {
                paddingBottom: Math.max(insets.bottom, spacing.base),
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <AppText variant="h3">New Group Challenge</AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setCreateChallengeVisible(false)}
                style={styles.closeButton}
              >
                <X size={18} color={colors.textPrimary} />
              </Pressable>
            </View>

            <AppText variant="caption" secondary>
              Challenge Name
            </AppText>

            <TextInput
              value={challengeName}
              onChangeText={setChallengeName}
              placeholder="e.g. Weekend Step Showdown"
              placeholderTextColor={colors.inputPlaceholder}
              style={styles.modalInput}
              maxLength={60}
            />

            <AppText variant="caption" secondary>
              Goal
            </AppText>

            <TextInput
              value={challengeGoal}
              onChangeText={setChallengeGoal}
              placeholder="e.g. 10,000 steps/day"
              placeholderTextColor={colors.inputPlaceholder}
              style={styles.modalInput}
              maxLength={100}
            />

            <View style={styles.modalOptionsRow}>
              <View style={styles.modalOption}>
                <AppText variant="caption" secondary>
                  Duration
                </AppText>

                <Pressable onPress={cycleDuration} style={styles.selectOption}>
                  <AppText variant="body2">{duration}</AppText>

                  <ChevronDown size={17} color={colors.textSecondary} />
                </Pressable>
              </View>

              <View style={styles.modalOption}>
                <AppText variant="caption" secondary>
                  Reward
                </AppText>

                <Pressable onPress={cycleReward} style={styles.selectOption}>
                  <AppText variant="body2">{reward}</AppText>

                  <ChevronDown size={17} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleCreateChallenge}
              style={styles.submitChallengeButton}
            >
              <AppText variant="button" color="white">
                Create Challenge
              </AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}

      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderGroupBanner()}
        {renderTabs()}

        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Leaderboard' && renderLeaderboard()}
        {activeTab === 'Chat' && renderChat()}
      </ScrollView>

      {renderCreateChallengeModal()}
    </View>
  );
};

export default GroupDetailScreen;
