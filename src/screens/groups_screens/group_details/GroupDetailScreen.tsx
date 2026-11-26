import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.GroupDetails';
import { GroupBanner } from './components/group_banner/GroupBanner';
import { GroupTabs } from './components/groups_tab/GroupTabs';
import { GroupOverview } from './components/group_overview/GroupOverview';
import { GroupLeaderboard } from './components/group_leaderboard/GroupLeaderboard';
import { CreateChallengeModal } from './components/create_challenge_modal/CreateChallengeModal';
import { MemberSearchModal } from './components/member_search_modal/MemberSearchModal';
import { GroupDetailShimmer } from './components/group_detail_shimmer/GroupDetailShimmer';
import { AppErrorView, AppHeader, AppText } from '../../../components';
import ChallengesTab from './components/challengestab/ChallengesTab';
import type { RootStackParamList } from '../../../navigations/GroupsStack';
// import { GroupChat } from './components/group_chats/GroupChat';
import useGroupDetail, { type GroupUserSearchResult } from './useGroupDetail';
import AppIcon from '../../../assets/appicon/AppIcon';
import InviteMemberModal from './components/modals/InviteMemberModal';

interface GroupDetailScreenProps {
  groupName?: string;
  groupDescription?: string;
  memberCount?: number;
}

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  groupName: initialGroupName = 'Group',
  groupDescription: initialGroupDescription = '',
  memberCount: initialMemberCount = 1,
}) => {
  const [pendingInviteUser, setPendingInviteUser] =
    useState<GroupUserSearchResult | null>(null);
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GroupDetails'>>();
  const groupId = route.params?.groupId || '';
  const styles = useMemo(
    () => createStyles(colors, spacing),
    [colors, spacing],
  );
  const {
    activeTab,
    setActiveTab,
    groupName,
    groupDescription,
    groupImageUrl,
    groupEmoji,
    memberCount,
    isPrivateGroup,
    isLeader,
    memberSearchVisible,
    setMemberSearchVisible,
    memberSearchQuery,
    memberSearchResults,
    memberSearchLoading,
    memberAddLoading,
    searchMembers,
    addMember,
    challenges,
    members,
    // messages,
    loading,
    dataLoading,
    loadError,
    // messageDraft,
    // setMessageDraft,
    createChallengeVisible,
    setCreateChallengeVisible,
    createChallengeLoading,
    challengeName,
    setChallengeName,
    challengeDescription,
    setChallengeDescription,
    challengeGoal,
    setChallengeGoal,
    metricType,
    setMetricType,
    rewardPoints,
    setRewardPoints,
    duration,
    setDuration,
    joiningChallengeId,
    refreshGroup,
    cycleDuration,
    handleCreateChallenge,
    joinGroupChallenge,
    // sendMessage,
  } = useGroupDetail({
    groupId,
    groupName: route.params?.name || initialGroupName,
    groupDescription: route.params?.description || initialGroupDescription,
    memberCount: route.params?.members || initialMemberCount,
    primaryColor: colors.primary,
  });

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      refreshGroup();
    }, [refreshGroup]),
  );

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('GroupSetting', {
      groupId,
      groupName,
      groupDescription,
      groupImageUrl,
      groupEmoji,
      isLeader,
      memberCount: memberCount || members.length,
    });
  }, [
    navigation,
    groupId,
    groupName,
    groupDescription,
    groupImageUrl,
    groupEmoji,
    isLeader,
    memberCount,
    members.length,
  ]);

  const handleOpenMemberSearch = useCallback(() => {
    setMemberSearchVisible(true);
  }, [setMemberSearchVisible]);

  const handleCloseMemberSearch = useCallback(() => {
    setMemberSearchVisible(false);
  }, [setMemberSearchVisible]);

  const handleOpenCreateChallenge = useCallback(() => {
    setCreateChallengeVisible(true);
  }, [setCreateChallengeVisible]);

  const handleCloseCreateChallenge = useCallback(() => {
    if (!createChallengeLoading) {
      setCreateChallengeVisible(false);
    }
  }, [createChallengeLoading, setCreateChallengeVisible]);

  const handleCloseInviteModal = useCallback(() => {
    setPendingInviteUser(null);
  }, []);

  const handleInviteMember = useCallback(async () => {
    if (!pendingInviteUser) return;
    const added = await addMember(pendingInviteUser);
    if (added) setPendingInviteUser(null);
  }, [pendingInviteUser, addMember]);

  return (
    <View style={styles.container}>
      <AppHeader
        title={groupName}
        subtitle={groupDescription}
        onBackPress={handleBackPress}
      />
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <GroupDetailShimmer
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : loadError ? (
          <AppErrorView message={loadError} onRefresh={refreshGroup} />
        ) : (
          <>
            <GroupBanner
              groupName={groupName}
              groupDescription={groupDescription}
              memberCount={memberCount}
              isPrivate={isPrivateGroup}
              members={members}
              imageUrl={groupImageUrl}
              onSettingsPress={handleSettingsPress}
            />
            {isLeader ? (
              <Pressable
                onPress={handleOpenMemberSearch}
                style={styles.addMemberButton}
                accessibilityRole="button"
                accessibilityLabel="Add member to group"
              >
                <AppIcon
                  name="Plus"
                  size={15}
                  color={colors.primary}
                  strokeWidth={2.5}
                />
                <AppText variant="caption" style={styles.addMemberText}>
                  Add member
                </AppText>
              </Pressable>
            ) : null}
            <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'Overview' && (
              <GroupOverview
                members={members}
                challenges={challenges}
                loading={dataLoading}
                onNewChallenge={handleOpenCreateChallenge}
              />
            )}
            {activeTab === 'Leaderboard' && (
              <GroupLeaderboard members={members} loading={dataLoading} />
            )}
            {activeTab === 'Challenges' && (
              <ChallengesTab
                onNewChallenge={handleOpenCreateChallenge}
                challenges={challenges}
                onJoin={joinGroupChallenge}
                joiningChallengeId={joiningChallengeId}
                loading={dataLoading}
              />
            )}
            {/* {activeTab === 'Chat' && (
              <GroupChat
                messages={messages}
                messageDraft={messageDraft}
                onChangeDraft={setMessageDraft}
                onSend={() => sendMessage()}
              />
            )} */}
          </>
        )}
      </ScrollView>

      {createChallengeVisible ? (
        <CreateChallengeModal
          visible={createChallengeVisible}
          challengeName={challengeName}
          challengeDescription={challengeDescription}
          challengeGoal={challengeGoal}
          metricType={metricType}
          duration={duration}
          rewardPoints={rewardPoints}
          bottomInset={insets.bottom}
          loading={createChallengeLoading}
          onClose={handleCloseCreateChallenge}
          onChangeName={setChallengeName}
          onChangeDescription={setChallengeDescription}
          onChangeGoal={setChallengeGoal}
          onChangeMetricType={setMetricType}
          onChangeRewardPoints={setRewardPoints}
          onCycleDuration={cycleDuration}
          onSelectDuration={setDuration}
          onSubmit={handleCreateChallenge}
        />
      ) : null}

      {memberSearchVisible ? (
        <MemberSearchModal
          visible={memberSearchVisible}
          onClose={handleCloseMemberSearch}
          searchQuery={memberSearchQuery}
          onSearchChange={searchMembers}
          loading={memberSearchLoading}
          searchResults={memberSearchResults}
          onSelectUser={setPendingInviteUser}
        />
      ) : null}

      <InviteMemberModal
        user={pendingInviteUser}
        groupName={groupName}
        loading={memberAddLoading}
        onClose={handleCloseInviteModal}
        onInvite={handleInviteMember}
        styles={styles}
      />
    </View>
  );
};

export default GroupDetailScreen;
