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
import { readSession } from '../../../services/auth';

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

export type GroupUserSearchResult = {
  id: string;
  name: string;
  publicId: string;
  profileImageUrl?: string;
};

type GroupRecord = {
  name: string;
  description: string;
  members: number | Array<Record<string, any>>;
  imageUrl?: string;
  image?: string;
  isLeader?: boolean;
  isCurrentUserLeader?: boolean;
  currentUserRole?: string;
  role?: string;
  leaderId?: string;
  leaderUserId?: string;
  creatorId?: string;
  ownerId?: string;
  createdByUserId?: string;
  leader?: string | { id?: string; userId?: string };
  owner?: string | { id?: string; userId?: string };
  createdBy?: string | { id?: string; userId?: string };
};

const relatedUserId = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const user = value as { id?: string; userId?: string };
    return user.id || user.userId;
  }
  return undefined;
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
  const [groupImageUrl, setGroupImageUrl] = useState<string | undefined>();
  const [memberCount, setMemberCount] = useState(initialMemberCount);
  const [isLeader, setIsLeader] = useState(false);
  const [memberSearchVisible, setMemberSearchVisible] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<
    GroupUserSearchResult[]
  >([]);
  const [memberSearchLoading, setMemberSearchLoading] = useState(false);
  const [groupEditVisible, setGroupEditVisible] = useState(false);
  const [groupNameDraft, setGroupNameDraft] = useState(initialGroupName);
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
  const memberSearchRequestRef = useRef(0);

  const refreshGroup = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setLoadError('');
    try {
      const [groupResult, challengeResult, messageResult, leaderboardResult] =
        await Promise.all([
          authenticatedRequest<{
            group: GroupRecord;
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
      setGroupImageUrl(groupResult.group.imageUrl || groupResult.group.image);
      const session = await readSession();
      const userId = session?.user?.id;
      const group = groupResult.group;
      const memberRecords = Array.isArray(group.members) ? group.members : [];
      const leaderIds = [
        group.leaderId,
        group.leaderUserId,
        group.creatorId,
        group.ownerId,
        group.createdByUserId,
        relatedUserId(group.leader),
        relatedUserId(group.owner),
        relatedUserId(group.createdBy),
        ...memberRecords
          .filter(member =>
            ['LEADER', 'OWNER', 'GL', 'GROUP_LEADER'].includes(
              String(member.role || member.groupRole || '').toUpperCase(),
            ),
          )
          .map(
            member =>
              relatedUserId(member.user) || member.userId || member.id,
          ),
      ].filter((id): id is string => Boolean(id));
      const currentRole = String(
        group.currentUserRole || group.role || '',
      ).toUpperCase();
      setIsLeader(
        group.isLeader === true ||
        group.isCurrentUserLeader === true ||
          ['LEADER', 'OWNER', 'GL', 'GROUP_LEADER'].includes(currentRole) ||
          Boolean(userId && leaderIds.includes(userId)),
      );
      setMemberCount(
        Array.isArray(group.members) ? group.members.length : group.members,
      );
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

  const searchMembers = useCallback(async (query: string) => {
    setMemberSearchQuery(query);
    const requestId = ++memberSearchRequestRef.current;
    if (query.trim().length < 2) {
      setMemberSearchResults([]);
      setMemberSearchLoading(false);
      return;
    }
    setMemberSearchLoading(true);
    try {
      const result = await authenticatedRequest<{
        users: GroupUserSearchResult[];
      }>(
        'GET',
        `/community/users/search?q=${encodeURIComponent(query.trim())}`,
      );
      if (requestId === memberSearchRequestRef.current) {
        setMemberSearchResults(result.users || []);
      }
    } catch (error) {
      if (requestId === memberSearchRequestRef.current) {
        showAppToast(
          'error',
          'Could not search members',
          apiErrorMessage(error),
        );
      }
    } finally {
      if (requestId === memberSearchRequestRef.current) {
        setMemberSearchLoading(false);
      }
    }
  }, []);

  const addMember = useCallback(
    async (user: GroupUserSearchResult) => {
      try {
        await authenticatedRequest(
          'POST',
          `/community/groups/${encodeURIComponent(groupId)}/members`,
          { publicId: user.publicId },
        );
        setMemberSearchVisible(false);
        setMemberSearchQuery('');
        setMemberSearchResults([]);
        await refreshGroup();
        showAppToast(
          'success',
          'Member added',
          `${user.name} joined the group.`,
        );
      } catch (error) {
        showAppToast('error', 'Could not add member', apiErrorMessage(error));
      }
    },
    [groupId, refreshGroup],
  );

  const saveGroup = useCallback(
    async (image?: string | null) => {
      const name = groupNameDraft.trim();
      if (!name) {
        showAppToast('error', 'Group name required', 'Enter a group name.');
        return;
      }
      try {
        const result = await authenticatedRequest<{
          group?: {
            name?: string;
            description?: string;
            imageUrl?: string;
            image?: string;
          };
        }>('PATCH', `/community/groups/${encodeURIComponent(groupId)}`, {
          name,
          ...(image !== undefined ? { image } : {}),
        });
        setGroupName(result.group?.name || name);
        setGroupDescription(result.group?.description || groupDescription);
        setGroupImageUrl(
          image === null
            ? undefined
            : result.group?.imageUrl ||
                result.group?.image ||
                (typeof image === 'string' ? image : groupImageUrl),
        );
        setGroupEditVisible(false);
        showAppToast('success', 'Group updated');
      } catch (error) {
        showAppToast('error', 'Could not update group', apiErrorMessage(error));
      }
    },
    [groupDescription, groupId, groupImageUrl, groupNameDraft],
  );

  const leaveGroup = useCallback(async () => {
    try {
      await authenticatedRequest(
        'POST',
        `/community/groups/${encodeURIComponent(groupId)}/leave`,
      );
      showAppToast('success', 'Left group', 'You have left this group.');
      return true;
    } catch (error) {
      showAppToast('error', 'Could not leave group', apiErrorMessage(error));
      return false;
    }
  }, [groupId]);

  const archiveGroup = useCallback(async () => {
    try {
      await authenticatedRequest(
        'DELETE',
        `/community/groups/${encodeURIComponent(groupId)}`,
      );
      showAppToast('success', 'Group archived', 'The group has been archived.');
      return true;
    } catch (error) {
      showAppToast('error', 'Could not archive group', apiErrorMessage(error));
      return false;
    }
  }, [groupId]);

  return {
    activeTab,
    setActiveTab,
    groupName,
    groupDescription,
    groupImageUrl,
    memberCount,
    isLeader,
    groupEditVisible,
    setGroupEditVisible,
    groupNameDraft,
    setGroupNameDraft,
    saveGroup,
    leaveGroup,
    archiveGroup,
    memberSearchVisible,
    setMemberSearchVisible,
    memberSearchQuery,
    memberSearchResults,
    memberSearchLoading,
    searchMembers,
    addMember,
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
