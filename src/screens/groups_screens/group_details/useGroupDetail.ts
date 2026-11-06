import { Alert } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DURATION_OPTIONS,
  REWARD_OPTIONS,
  type DetailTab,
  type GroupChallenge,
  type Member,
} from './constants';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { createAuthenticatedChatSocket } from '../../../services/chatSocket';
import type { Socket } from 'socket.io-client';

const mergeChatMessages = (
  current: any[],
  incoming: any[],
  userId: string,
  color: string,
) => {
  const messages = new Map(current.map(item => [item.id, item]));
  incoming.forEach(item =>
    messages.set(item.id, {
      ...item,
      color: item.color || color,
      mine: item.senderId ? item.senderId === userId : Boolean(item.mine),
    }),
  );
  return [...messages.values()].sort(
    (a, b) =>
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime(),
  );
};

type GroupDetailOptions = {
  groupId: string;
  groupName: string;
  groupDescription: string;
  memberCount: number;
  primaryColor: string;
};

export default function useGroupDetail({
  groupId,
  groupName: initialGroupName,
  groupDescription: initialGroupDescription,
  memberCount: initialMemberCount,
  primaryColor,
}: GroupDetailOptions) {
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [groupName, setGroupName] = useState(initialGroupName);
  const [groupDescription, setGroupDescription] = useState(
    initialGroupDescription,
  );
  const [memberCount, setMemberCount] = useState(initialMemberCount);
  const [challenges, setChallenges] = useState<GroupChallenge[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
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
    setLoading(true);
    setLoadError('');
    try {
      const [groupResult, challengeResult, messageResult, leaderboardResult] =
        await Promise.all([
          authenticatedRequest<{
            group: { name: string; description: string; members: number };
          }>('GET', `/community/groups/${encodeURIComponent(groupId)}`),
          authenticatedRequest<{
            challenges: Array<{
              id: string;
              title: string;
              description: string;
              status: string;
              participants: number;
            }>;
          }>(
            'GET',
            `/community/groups/${encodeURIComponent(groupId)}/challenges`,
          ),
          authenticatedRequest<{ messages: any[] }>(
            'GET',
            `/community/groups/${encodeURIComponent(groupId)}/messages`,
          ),
          authenticatedRequest<{
            leaderboard: Array<{
              id: string;
              rank: number;
              name: string;
              steps: number;
              initials: string;
              streak: string;
              color: string;
            }>;
          }>(
            'GET',
            `/community/groups/${encodeURIComponent(groupId)}/leaderboard`,
          ),
        ]);
      setGroupName(groupResult.group.name);
      setGroupDescription(groupResult.group.description);
      setMemberCount(groupResult.group.members);
      setChallenges(
        challengeResult.challenges.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status,
          progress: 0,
          progressLabel: `${item.participants} participants`,
          color: primaryColor,
        })),
      );
      setMessages(
        (messageResult.messages || []).map(item => ({
          ...item,
          color: primaryColor,
        })),
      );
      setMembers(
        (leaderboardResult.leaderboard || []).map(item => ({
          id: item.id,
          name: item.name,
          initials: item.initials,
          steps: item.steps,
          streak: Number.parseInt(item.streak, 10) || 0,
          color: item.color,
        })),
      );
    } catch (error) {
      const message = apiErrorMessage(error);
      setLoadError(message);
      showAppToast('error', 'Could not load group', message);
    } finally {
      setLoading(false);
    }
  }, [groupId, primaryColor]);

  useEffect(() => {
    refreshGroup();
  }, [refreshGroup]);

  useEffect(() => {
    if (activeTab !== 'Chat' || !groupId) return;
    let active = true;
    let socket: Socket | null = null;
    createAuthenticatedChatSocket()
      .then(connection => {
        if (!active) {
          connection.socket.disconnect();
          return;
        }
        socket = connection.socket;
        chatSocketRef.current = socket;
        chatUserIdRef.current = connection.userId;
        socket.on('group:message', (message: any) => {
          if (active) {
            setMessages(current =>
              mergeChatMessages(
                current,
                [message],
                chatUserIdRef.current,
                primaryColor,
              ),
            );
          }
        });
        socket.on('connect', () => {
          socket?.emit('group:join', { groupId }, (result: any) => {
            if (!active || !result?.ok) return;
            authenticatedRequest<{ messages: any[] }>(
              'GET',
              `/community/groups/${encodeURIComponent(groupId)}/messages`,
            )
              .then(messagesResult => {
                if (active) {
                  setMessages(current =>
                    mergeChatMessages(
                      current,
                      messagesResult.messages || [],
                      chatUserIdRef.current,
                      primaryColor,
                    ),
                  );
                }
              })
              .catch(() => {});
          });
        });
        socket.connect();
      })
      .catch(error =>
        console.warn('Realtime group chat is unavailable:', error),
      );

    return () => {
      active = false;
      if (socket) {
        socket.emit('group:leave', { groupId });
        socket.disconnect();
      }
      if (chatSocketRef.current === socket) chatSocketRef.current = null;
    };
  }, [activeTab, groupId, primaryColor]);

  const cycleDuration = useCallback(() => {
    setDuration(previous => {
      const index = DURATION_OPTIONS.indexOf(previous);
      return DURATION_OPTIONS[(index + 1) % DURATION_OPTIONS.length];
    });
  }, []);

  const cycleReward = useCallback(() => {
    setReward(previous => {
      const index = REWARD_OPTIONS.indexOf(previous);
      return REWARD_OPTIONS[(index + 1) % REWARD_OPTIONS.length];
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
      if (!Number.isSafeInteger(targetValue) || targetValue < 1) {
        throw new Error('Enter a whole number for the target.');
      }
      const endsAt = new Date(
        Date.now() + Number.parseInt(duration, 10) * 86400000,
      ).toISOString();
      await authenticatedRequest(
        'POST',
        `/community/groups/${encodeURIComponent(groupId)}/challenges`,
        {
          title: challengeName.trim(),
          description: challengeGoal.trim(),
          metricType: 'steps',
          targetValue,
          startsAt: new Date().toISOString(),
          endsAt,
          rewardPoints: Number.parseInt(reward, 10) || 0,
        },
      );
      await refreshGroup();
      setCreateChallengeVisible(false);
      setChallengeName('');
      setChallengeGoal('');
      setDuration(DURATION_OPTIONS[0]);
      setReward(REWARD_OPTIONS[1]);
      setActiveTab('Challenges');
      showAppToast(
        'success',
        'Challenge created',
        'Your group challenge is ready.',
      );
    } catch (error) {
      showAppToast(
        'error',
        'Could not create challenge',
        apiErrorMessage(error),
      );
    }
  }, [challengeName, challengeGoal, duration, reward, groupId, refreshGroup]);

  const sendMessage = useCallback(async () => {
    const message = messageDraft.trim();
    if (!message) return;
    try {
      const socket = chatSocketRef.current;
      if (socket?.connected) {
        const result = await new Promise<any>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Chat server did not respond. Try again.')),
            12000,
          );
          socket.emit('group:send', { groupId, message }, (response: any) => {
            clearTimeout(timeout);
            response?.ok
              ? resolve(response)
              : reject(new Error(response?.error || 'Could not send message.'));
          });
        });
        setMessages(current =>
          mergeChatMessages(
            current,
            [result.message],
            chatUserIdRef.current,
            primaryColor,
          ),
        );
      } else {
        const result = await authenticatedRequest<{ message: any }>(
          'POST',
          `/community/groups/${encodeURIComponent(groupId)}/messages`,
          { message },
        );
        setMessages(current =>
          mergeChatMessages(
            current,
            [result.message],
            chatUserIdRef.current,
            primaryColor,
          ),
        );
      }
      setMessageDraft('');
    } catch (error) {
      showAppToast('error', 'Could not send message', apiErrorMessage(error));
    }
  }, [groupId, messageDraft, primaryColor]);

  return {
    activeTab,
    setActiveTab,
    groupName,
    groupDescription,
    memberCount,
    challenges,
    members,
    messages,
    loading,
    loadError,
    messageDraft,
    setMessageDraft,
    createChallengeVisible,
    setCreateChallengeVisible,
    challengeName,
    setChallengeName,
    challengeGoal,
    setChallengeGoal,
    duration,
    reward,
    refreshGroup,
    cycleDuration,
    cycleReward,
    handleCreateChallenge,
    sendMessage,
  };
}
