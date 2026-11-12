import { Alert } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { useFocusEffect } from '@react-navigation/native';
import { FeedPost, Group } from './data';
export type GroupTab = 'My Groups' | 'Discover' | 'Feed';

const useGroups = () => {
  const [activeTab, setActiveTab] = useState<GroupTab>('My Groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      if (activeTab === 'Feed') {
        const feedResult = await authenticatedRequest<{ posts: FeedPost[] }>(
          'GET',
          '/community/feed',
        );
        setPosts(feedResult.posts || []);
      } else {
        const groupResult = await authenticatedRequest<{ groups: Group[] }>(
          'GET',
          activeTab === 'Discover'
            ? '/community/groups/discover'
            : '/community/groups',
        );
        setGroups(groupResult.groups || []);
      }
    } catch (error) {
      const message = apiErrorMessage(error);
      setLoadError(message);
      showAppToast('error', 'Could not load community', message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏃');
  const [isPrivate, setIsPrivate] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const createInFlight = useRef(false);

  const resetCreateForm = () => {
    setGroupName('');
    setGroupDescription('');
    setSelectedIcon('🏃');
    setIsPrivate(true);
  };

  const handleCreateGroup = async () => {
    if (createInFlight.current) return;

    const name = groupName.trim();

    if (!name) {
      Alert.alert('Group name required', 'Please enter a group name.');
      return;
    }

    createInFlight.current = true;
    setCreateLoading(true);
    try {
      await authenticatedRequest('POST', '/community/groups', {
        name,
        description: groupDescription.trim() || undefined,
        emoji: selectedIcon,
        private: isPrivate,
      });
      const groupResult = await authenticatedRequest<{ groups: Group[] }>(
        'GET',
        '/community/groups',
      );
      setGroups(groupResult.groups || []);
      setCreateModalVisible(false);
      resetCreateForm();
      setActiveTab('My Groups');
      showAppToast('success', 'Group created', 'Your community is ready.');
    } catch (error) {
      showAppToast('error', 'Could not create group', apiErrorMessage(error));
    } finally {
      createInFlight.current = false;
      setCreateLoading(false);
    }
  };
  const joinGroup = async (groupId: string) => {
    try {
      await authenticatedRequest(
        'POST',
        `/community/groups/${encodeURIComponent(groupId)}/join`,
      );
      await refresh();
      setActiveTab('My Groups');
      showAppToast('success', 'Group joined');
    } catch (error) {
      showAppToast('error', 'Could not join group', apiErrorMessage(error));
    }
  };
  return {
    activeTab,
    setActiveTab,
    groups,
    posts,
    loading,
    loadError,
    refresh,
    createModalVisible,
    setCreateModalVisible,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    selectedIcon,
    setSelectedIcon,
    isPrivate,
    setIsPrivate,
    createLoading,
    resetCreateForm,
    handleCreateGroup,
    joinGroup,
  };
};

export default useGroups;
