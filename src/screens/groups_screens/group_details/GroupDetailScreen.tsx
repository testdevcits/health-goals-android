import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
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
import LeaveGroupModal from './components/modals/LeaveGroupModal';
import ArchiveGroupModal from './components/modals/ArchiveGroupModal';
import InviteMemberModal from './components/modals/InviteMemberModal';
import EditGroupModal from './components/edit_group_modal/EditGroupModal';

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
  const [groupImage, setGroupImage] = useState<string | null | undefined>(
    undefined,
  );
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [pendingInviteUser, setPendingInviteUser] =
    useState<GroupUserSearchResult | null>(null);
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
  const {
    activeTab,
    setActiveTab,
    groupName,
    groupDescription,
    groupImageUrl,
    memberCount,
    isPrivateGroup,
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

  const handleSettingsPress = useCallback(() => {
    setGroupNameDraft(groupName);
    setGroupImage(undefined);
    setGroupEditVisible(true);
  }, [groupName, setGroupNameDraft, setGroupEditVisible]);

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

  const handleOpenArchiveModal = useCallback(() => {
    setArchiveModalVisible(true);
  }, []);

  const handleCloseArchiveModal = useCallback(() => {
    setArchiveModalVisible(false);
  }, []);

  const handleArchiveGroup = useCallback(async () => {
    setArchiveLoading(true);
    try {
      const archived = await archiveGroup();
      setArchiveModalVisible(false);
      if (archived) navigation.goBack();
    } finally {
      setArchiveLoading(false);
    }
  }, [archiveGroup, navigation]);

  const handleOpenLeaveModal = useCallback(() => {
    setLeaveModalVisible(true);
  }, []);

  const handleCloseLeaveModal = useCallback(() => {
    setLeaveModalVisible(false);
  }, []);

  const handleLeaveGroup = useCallback(async () => {
    setLeaveLoading(true);
    try {
      const left = await leaveGroup();
      setLeaveModalVisible(false);
      if (left) navigation.goBack();
    } finally {
      setLeaveLoading(false);
    }
  }, [leaveGroup, navigation]);

  const handleCloseEditGroup = useCallback(() => {
    if (!saveLoading) {
      setGroupEditVisible(false);
    }
  }, [saveLoading, setGroupEditVisible]);

  const handleSaveGroup = useCallback(
    async (img?: string | null) => {
      setSaveLoading(true);
      try {
        await saveGroup(img);
      } finally {
        setSaveLoading(false);
      }
    },
    [saveGroup],
  );

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
                isLeader={isLeader}
                loading={dataLoading}
                onNewChallenge={handleOpenCreateChallenge}
                onArchiveGroup={handleOpenArchiveModal}
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

      <EditGroupModal
        visible={groupEditVisible}
        onClose={handleCloseEditGroup}
        isLeader={isLeader}
        groupNameDraft={groupNameDraft}
        setGroupNameDraft={setGroupNameDraft}
        groupImage={groupImage}
        currentGroupImage={groupImageUrl}
        setGroupImage={setGroupImage}
        saveLoading={saveLoading}
        onSaveGroup={handleSaveGroup}
        onOpenLeaveModal={handleOpenLeaveModal}
      />

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

      <ArchiveGroupModal
        visible={archiveModalVisible}
        loading={archiveLoading}
        onClose={handleCloseArchiveModal}
        onArchive={handleArchiveGroup}
        styles={styles}
      />

      <LeaveGroupModal
        visible={leaveModalVisible}
        loading={leaveLoading}
        onClose={handleCloseLeaveModal}
        onLeave={handleLeaveGroup}
        styles={styles}
      />
    </View>
  );
};

export default GroupDetailScreen;
