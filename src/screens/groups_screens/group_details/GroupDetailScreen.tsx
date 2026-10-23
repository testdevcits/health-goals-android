import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.GroupDetails';

import { GroupHeader } from './components/GroupHeader';
import { GroupBanner } from './components/GroupBanner';
import { GroupTabs } from './components/GroupTabs';
import { GroupOverview } from './components/GroupOverview';
import { GroupLeaderboard } from './components/GroupLeaderboard';
import { GroupChat } from './components/GroupChat';
import { CreateChallengeModal } from './components/CreateChallengeModal';

import {
  DetailTab,
  GroupMessage,
  GroupChallenge,
  INITIAL_MEMBERS,
  INITIAL_MESSAGES,
  INITIAL_CHALLENGES,
  DURATION_OPTIONS,
  REWARD_OPTIONS,
} from './constants';

// ─── Screen props ─────────────────────────────────────────────────────────────

interface GroupDetailScreenProps {
  groupName?: string;
  groupDescription?: string;
  memberCount?: number;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  groupName = 'Morning Runners',
  groupDescription = 'Weekly step challenge',
  memberCount = 8,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles(colors, spacing, radius),
    [colors, spacing, radius],
  );

  // ─── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  // ─── Chat ───────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<GroupMessage[]>(INITIAL_MESSAGES);
  const [messageDraft, setMessageDraft] = useState('');

  const handleSendMessage = useCallback(() => {
    const text = messageDraft.trim();
    if (!text) return;

    const newMessage: GroupMessage = {
      id: `${Date.now()}`,
      name: 'Alex',
      initials: 'A',
      message: text,
      time: 'Now',
      color: '#00BFA5',
      mine: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageDraft('');
  }, [messageDraft]);

  // ─── Challenges ─────────────────────────────────────────────────────────────
  const [challenges, setChallenges] = useState<GroupChallenge[]>(INITIAL_CHALLENGES);
  const [createChallengeVisible, setCreateChallengeVisible] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [reward, setReward] = useState(REWARD_OPTIONS[1]);

  const cycleDuration = useCallback(() => {
    setDuration(prev => {
      const i = DURATION_OPTIONS.indexOf(prev);
      return DURATION_OPTIONS[(i + 1) % DURATION_OPTIONS.length];
    });
  }, []);

  const cycleReward = useCallback(() => {
    setReward(prev => {
      const i = REWARD_OPTIONS.indexOf(prev);
      return REWARD_OPTIONS[(i + 1) % REWARD_OPTIONS.length];
    });
  }, []);

  const handleCreateChallenge = useCallback(() => {
    if (!challengeName.trim() || !challengeGoal.trim()) {
      Alert.alert('Missing details', 'Enter a challenge name and goal to continue.');
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

    setChallenges(prev => [...prev, newChallenge]);
    setCreateChallengeVisible(false);
    setChallengeName('');
    setChallengeGoal('');
    setDuration(DURATION_OPTIONS[0]);
    setReward(REWARD_OPTIONS[1]);
    setActiveTab('Overview');
  }, [challengeName, challengeGoal, duration, reward]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GroupHeader
        groupName={groupName}
        groupDescription={groupDescription}
        memberCount={memberCount}
        colors={colors}
        styles={styles}
      />

      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GroupBanner
          groupName={groupName}
          groupDescription={groupDescription}
          memberCount={memberCount}
          members={INITIAL_MEMBERS}
          colors={colors}
          styles={styles}
        />

        <GroupTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={colors}
          styles={styles}
        />

        {activeTab === 'Overview' && (
          <GroupOverview
            members={INITIAL_MEMBERS}
            challenges={challenges}
            colors={colors}
            styles={styles}
            spacing={spacing}
            onNewChallenge={() => setCreateChallengeVisible(true)}
          />
        )}

        {activeTab === 'Leaderboard' && (
          <GroupLeaderboard
            members={INITIAL_MEMBERS}
            colors={colors}
            styles={styles}
          />
        )}

        {activeTab === 'Chat' && (
          <GroupChat
            messages={messages}
            messageDraft={messageDraft}
            onChangeDraft={setMessageDraft}
            onSend={handleSendMessage}
            colors={colors}
            styles={styles}
          />
        )}
      </ScrollView>

      <CreateChallengeModal
        visible={createChallengeVisible}
        challengeName={challengeName}
        challengeGoal={challengeGoal}
        duration={duration}
        reward={reward}
        bottomInset={insets.bottom}
        colors={colors}
        styles={styles}
        spacing={spacing}
        onClose={() => setCreateChallengeVisible(false)}
        onChangeName={setChallengeName}
        onChangeGoal={setChallengeGoal}
        onCycleDuration={cycleDuration}
        onCycleReward={cycleReward}
        onSubmit={handleCreateChallenge}
      />
    </View>
  );
};

export default GroupDetailScreen;
