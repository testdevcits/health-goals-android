import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import { AppHeader, AppText } from '../../../components';
import createStyles from './styles.Groups';
import CreateGroupModal from './components/CreateGroupModal';
import FeedTab from './tabs/FeedTab';
import MyGroups from './tabs/MyGroups';
import { initialGroups, initialPosts, Group, FeedPost } from './data';

type GroupTab = 'My Groups' | 'Feed';

const avatarColors = ['#FF8278', '#579CF4', '#00C6A2', '#FF9B38', '#8175F5'];

const GroupsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const [activeTab, setActiveTab] = useState<GroupTab>('My Groups');
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const posts: FeedPost[] = initialPosts;

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏃');
  const [isPrivate, setIsPrivate] = useState(true);

  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const styles = createStyles(colors, spacing, radius);

  const resetCreateForm = () => {
    setGroupName('');
    setSelectedIcon('🏃');
    setIsPrivate(true);
  };

  const handleCreateGroup = () => {
    const name = groupName.trim();

    if (!name) {
      Alert.alert('Group name required', 'Please enter a group name.');
      return;
    }

    const newGroup: Group = {
      id: `${Date.now()}`,
      name,
      description: 'Your new community',
      members: 1,
      emoji: selectedIcon,
      avatars: ['A'],
      private: isPrivate,
    };

    setGroups(previous => [newGroup, ...previous]);
    setCreateModalVisible(false);
    resetCreateForm();
    setActiveTab('My Groups');
  };

  const toggleKudos = (postId: string) => {
    setLikedPosts(previous =>
      previous.includes(postId)
        ? previous.filter(id => id !== postId)
        : [...previous, postId],
    );
  };

  const handleShare = (post: FeedPost) => {
    Alert.alert('Share post', `Share ${post.name}'s update with your friends.`);
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
        {(['My Groups', 'Feed'] as GroupTab[]).map(tab => {
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
        {activeTab === 'My Groups' ? (
          <MyGroups
            groups={groups}
            avatarColors={avatarColors}
            setCreateModalVisible={setCreateModalVisible}
          />
        ) : (
          <FeedTab
            posts={posts}
            likedPosts={likedPosts}
            toggleKudos={toggleKudos}
            handleShare={handleShare}
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

 