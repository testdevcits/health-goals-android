import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.GroupDetails';

import { GroupBanner } from './components/group_banner/GroupBanner';
import { GroupTabs } from './components/groups_tab/GroupTabs';
import { GroupOverview } from './components/group_overview/GroupOverview';
import { GroupLeaderboard } from './components/group_leaderboard/GroupLeaderboard';
import { CreateChallengeModal } from './components/create_challenge_modal/CreateChallengeModal';

import {
  DetailTab,
  GroupChallenge,
  DURATION_OPTIONS,
  REWARD_OPTIONS,
} from './constants';
import { AppHeader } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import ChallengesTab from './components/challengestab/ChallengesTab';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigations/GroupsStack';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { GroupChat } from './components/group_chats/GroupChat';
import type { Member } from './constants';
import { createAuthenticatedChatSocket } from '../../../services/chatSocket';
import type { Socket } from 'socket.io-client';

const mergeChatMessages = (current: any[], incoming: any[], userId: string, color: string) => {
  const messages = new Map(current.map(item => [item.id, item]));
  incoming.forEach(item => messages.set(item.id, {
    ...item,
    color: item.color || color,
    mine: item.senderId ? item.senderId === userId : Boolean(item.mine),
  }));
  return [...messages.values()].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
};

// ─── Screen props ─────────────────────────────────────────────────────────────

interface GroupDetailScreenProps {
  groupName?: string;
  groupDescription?: string;
  memberCount?: number;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  groupName: initialGroupName = 'Group',
  groupDescription: initialGroupDescription = '',
  memberCount: initialMemberCount = 1,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'GroupDetails'>>();
  const groupId = route.params?.groupId || '';

  const styles = useMemo(
    () => createStyles(colors, spacing),
    [colors, spacing],
  );

  // ─── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  // ─── Challenges ─────────────────────────────────────────────────────────────
  const [groupName, setGroupName] = useState(route.params?.name || initialGroupName);
  const [groupDescription, setGroupDescription] = useState(route.params?.description || initialGroupDescription);
  const [memberCount, setMemberCount] = useState(route.params?.members || initialMemberCount);
  const [challenges, setChallenges] = useState<GroupChallenge[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [createChallengeVisible, setCreateChallengeVisible] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [reward, setReward] = useState(REWARD_OPTIONS[1]);
  const chatSocketRef = useRef<Socket | null>(null);
  const chatUserIdRef = useRef('');

  const refreshGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      const [groupResult, challengeResult, messageResult, leaderboardResult] = await Promise.all([
        authenticatedRequest<{ group: { name: string; description: string; members: number } }>('GET', `/community/groups/${encodeURIComponent(groupId)}`),
        authenticatedRequest<{ challenges: Array<{ id: string; title: string; description: string; status: string; participants: number }> }>('GET', `/community/groups/${encodeURIComponent(groupId)}/challenges`),
        authenticatedRequest<{ messages: any[] }>('GET', `/community/groups/${encodeURIComponent(groupId)}/messages`),
        authenticatedRequest<{ leaderboard: Array<{ id: string; rank: number; name: string; steps: number; initials: string; streak: string; color: string }> }>('GET', `/community/groups/${encodeURIComponent(groupId)}/leaderboard`),
      ]);
      setGroupName(groupResult.group.name); setGroupDescription(groupResult.group.description); setMemberCount(groupResult.group.members);
      setChallenges(challengeResult.challenges.map(item => ({ id: item.id, title: item.title, description: item.description, status: item.status, progress: 0, progressLabel: `${item.participants} participants`, color: colors.primary })));
      setMessages((messageResult.messages || []).map((item: any) => ({ ...item, color: colors.primary })));
      setMembers((leaderboardResult.leaderboard || []).map(item => ({ id: item.id, name: item.name, initials: item.initials, steps: item.steps, streak: Number.parseInt(item.streak, 10) || 0, color: item.color })));
    } catch (error) { Alert.alert('Could not load group', apiErrorMessage(error)); }
  }, [groupId, colors.primary]);
  React.useEffect(() => { void refreshGroup(); }, [refreshGroup]);

  React.useEffect(() => {
    if (activeTab !== 'Chat' || !groupId) return;
    let active = true;
    let socket: Socket | null = null;
    void createAuthenticatedChatSocket().then(connection => {
      if (!active) {
        connection.socket.disconnect();
        return;
      }
      socket = connection.socket;
      chatSocketRef.current = socket;
      chatUserIdRef.current = connection.userId;
      socket.on('group:message', (message: any) => {
        if (active) setMessages(current => mergeChatMessages(current, [message], chatUserIdRef.current, colors.primary));
      });
      socket.on('connect', () => {
        socket?.emit('group:join', { groupId }, (result: any) => {
          if (!active || !result?.ok) return;
          void authenticatedRequest<{ messages: any[] }>('GET', `/community/groups/${encodeURIComponent(groupId)}/messages`)
            .then(result => { if (active) setMessages(current => mergeChatMessages(current, result.messages || [], chatUserIdRef.current, colors.primary)); })
            .catch(() => {});
        });
      });
      socket.connect();
    }).catch(error => console.warn('Realtime group chat is unavailable:', error));

    return () => {
      active = false;
      if (socket) {
        socket.emit('group:leave', { groupId });
        socket.disconnect();
      }
      if (chatSocketRef.current === socket) chatSocketRef.current = null;
    };
  }, [activeTab, groupId, colors.primary]);

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

  const handleCreateChallenge = useCallback(async () => {
    if (!challengeName.trim() || !challengeGoal.trim()) {
      Alert.alert(
        'Missing details',
        'Enter a challenge name and goal to continue.',
      );
      return;
    }

    try {
      const targetValue = Number(challengeGoal.replace(/[^0-9.]/g, ''));
      if (!Number.isSafeInteger(targetValue) || targetValue < 1) throw new Error('Enter a whole number for the target.');
      const endsAt = new Date(Date.now() + Number.parseInt(duration, 10) * 86400000).toISOString();
      await authenticatedRequest('POST', `/community/groups/${encodeURIComponent(groupId)}/challenges`, { title: challengeName.trim(), description: challengeGoal.trim(), metricType: 'steps', targetValue, startsAt: new Date().toISOString(), endsAt, rewardPoints: Number.parseInt(reward, 10) || 0 });
      await refreshGroup(); setCreateChallengeVisible(false); setChallengeName(''); setChallengeGoal(''); setDuration(DURATION_OPTIONS[0]); setReward(REWARD_OPTIONS[1]); setActiveTab('Challenges');
    } catch (error) { Alert.alert('Could not create challenge', apiErrorMessage(error)); }
  }, [challengeName, challengeGoal, duration, reward, groupId, refreshGroup]);

  const sendMessage = useCallback(async () => {
    const message = messageDraft.trim(); if (!message) return;
    try {
      const socket = chatSocketRef.current;
      if (socket?.connected) {
        const result = await new Promise<any>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Chat server did not respond. Try again.')), 12000);
          socket.emit('group:send', { groupId, message }, (response: any) => {
            clearTimeout(timeout);
            response?.ok ? resolve(response) : reject(new Error(response?.error || 'Could not send message.'));
          });
        });
        setMessages(current => mergeChatMessages(current, [result.message], chatUserIdRef.current, colors.primary));
      } else {
        const result = await authenticatedRequest<{ message: any }>('POST', `/community/groups/${encodeURIComponent(groupId)}/messages`, { message });
        setMessages(current => mergeChatMessages(current, [result.message], chatUserIdRef.current, colors.primary));
      }
      setMessageDraft('');
    }
    catch (error) { Alert.alert('Could not send message', apiErrorMessage(error)); }
  }, [groupId, messageDraft, colors.primary]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container]}>
      <AppHeader
        title={groupName}
        subtitle={groupDescription}
        onBackPress={() => navigation.goBack()}
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
          members={members}
        />

        <GroupTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'Overview' && (
          <GroupOverview
            members={members}
            challenges={challenges}
            onNewChallenge={() => setCreateChallengeVisible(true)}
          />
        )}

        {activeTab === 'Leaderboard' && (
          <GroupLeaderboard
            members={members}
          />
        )}

        {activeTab === 'Challenges' && (
          <ChallengesTab
            onNewChallenge={() => setCreateChallengeVisible(true)}
            challenges={challenges}
          />
        )}
        {activeTab === 'Chat' && <GroupChat messages={messages} messageDraft={messageDraft} onChangeDraft={setMessageDraft} onSend={() => void sendMessage()} />}
      </ScrollView>

      <CreateChallengeModal
        visible={createChallengeVisible}
        challengeName={challengeName}
        challengeGoal={challengeGoal}
        duration={duration}
        reward={reward}
        bottomInset={insets.bottom}
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
