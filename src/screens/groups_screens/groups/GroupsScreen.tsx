import React, { Suspense } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import createStyles from './styles.Groups';
import FeedTab from './tabs/FeedTab';
import MyGroups from './tabs/MyGroups';

import useGroups, { GroupTab } from './useGroups';

const avatarColors = ['#FF8278', '#579CF4', '#00C6A2', '#FF9B38', '#8175F5'];

const GroupsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const styles = createStyles(colors, spacing, radius);
  const CreateGroupModal = React.lazy(
    () => import('./components/CreateGroupModal'),
  );
  const {
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
    selectedIcon,
    setSelectedIcon,
    isPrivate,
    setIsPrivate,

    handleCreateGroup,
    joinGroup,
  } = useGroups();

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
        {loading ? (
          <AppLoader
            message={
              activeTab === 'Feed'
                ? 'Loading community feed…'
                : 'Loading groups…'
            }
          />
        ) : loadError ? (
          <AppErrorView
            message={loadError}
            onRefresh={() => {
              refresh();
            }}
          />
        ) : activeTab !== 'Feed' ? (
          groups.length ? (
            <MyGroups
              groups={groups}
              avatarColors={avatarColors}
              setCreateModalVisible={setCreateModalVisible}
              onJoinGroup={joinGroup}
              discover={activeTab === 'Discover'}
            />
          ) : (
            <AppEmptyState
              title={
                activeTab === 'Discover'
                  ? 'No groups to discover'
                  : 'No groups yet'
              }
              description={
                activeTab === 'Discover'
                  ? 'New communities will appear here when available.'
                  : 'Create a group or explore communities to get started.'
              }
              actionLabel={
                activeTab === 'Discover' ? undefined : 'Create a group'
              }
              onAction={
                activeTab === 'Discover'
                  ? undefined
                  : () => setCreateModalVisible(true)
              }
            />
          )
        ) : posts.length ? (
          <FeedTab posts={posts} />
        ) : (
          <AppEmptyState
            title="Your feed is quiet"
            description="Group activity and updates will show here when they are available."
          />
        )}
      </ScrollView>

      {/* Create Group bottom sheet */}
      <Suspense fallback={<AppLoader message="Loading create group sheet…" />}>
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
      </Suspense>
    </View>
  );
};

export default GroupsScreen;
