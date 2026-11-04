import React, { useCallback, useState } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import { AppHeader, AppText } from '../../../components';
import createStyles from './styles.Groups';
import CreateGroupModal from './components/CreateGroupModal';
import FeedTab from './tabs/FeedTab';
import MyGroups from './tabs/MyGroups';
import { Group, FeedPost } from './data';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

type GroupTab = 'My Groups' | 'Discover' | 'Feed';

const avatarColors = ['#FF8278', '#579CF4', '#00C6A2', '#FF9B38', '#8175F5'];

const GroupsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const [activeTab, setActiveTab] = useState<GroupTab>('My Groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  const refresh = useCallback(async () => {
    try {
      if (activeTab === 'Feed') {
        const feedResult = await authenticatedRequest<{ posts: FeedPost[] }>('GET', '/community/feed');
        setPosts(feedResult.posts || []);
      } else {
        const groupResult = await authenticatedRequest<{ groups: Group[] }>('GET', activeTab === 'Discover' ? '/community/groups/discover' : '/community/groups');
        setGroups(groupResult.groups || []);
      }
    } catch (error) { showAppToast('error', 'Could not load community', apiErrorMessage(error)); }
  }, [activeTab]);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏃');
  const [isPrivate, setIsPrivate] = useState(true);

  const styles = createStyles(colors, spacing, radius);

  const resetCreateForm = () => {
    setGroupName('');
    setSelectedIcon('🏃');
    setIsPrivate(true);
  };

  const handleCreateGroup = async () => {
    const name = groupName.trim();

    if (!name) {
      Alert.alert('Group name required', 'Please enter a group name.');
      return;
    }

    try {
      await authenticatedRequest('POST', '/community/groups', { name, description: 'Your new community', emoji: selectedIcon, private: isPrivate });
      await refresh(); setCreateModalVisible(false); resetCreateForm(); setActiveTab('My Groups');
      showAppToast('success', 'Group created', 'Your community is ready.');
    } catch (error) { showAppToast('error', 'Could not create group', apiErrorMessage(error)); }
  };
  const joinGroup = async (groupId: string) => {
    try { await authenticatedRequest('POST', `/community/groups/${encodeURIComponent(groupId)}/join`); await refresh(); setActiveTab('My Groups'); showAppToast('success', 'Group joined'); }
    catch (error) { showAppToast('error', 'Could not join group', apiErrorMessage(error)); }
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <AppHeader
        title="Groups & Community"
        subtitle={'Your teams, friends, and accountability pods'}
        isBack={false}
      />

      {/* My Groups / Feed selector */}
      <View style={styles.tabs}>
        {(['My Groups', 'Discover', 'Feed'] as GroupTab[]).map(tab => {
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
                style={
                  selected
                    ? { color: colors.textPrimary }
                    : { color: colors.textSecondary }
                }
                medium={selected}
              >
                {tab}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Main content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab !== 'Feed' ? (
          <MyGroups
            groups={groups}
            avatarColors={avatarColors}
            setCreateModalVisible={setCreateModalVisible}
            onJoinGroup={joinGroup}
            discover={activeTab === 'Discover'}
          />
        ) : (
          <FeedTab
            posts={posts}
          />
        )}
      </ScrollView>

      {/* Create Group bottom sheet */}

      <CreateGroupModal
        createModalVisible={createModalVisible}
        setCreateModalVisible={setCreateModalVisible}
        groupName={groupName}
        setGroupName={setGroupName}
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        handleCreateGroup={handleCreateGroup}
      />
    </View>
  );
};

export default GroupsScreen;
