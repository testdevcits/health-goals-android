import React, { useMemo, useState } from 'react';
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
import { EditGroupModal } from './components/edit_group_modal/EditGroupModal';
import { MemberSearchModal } from './components/member_search_modal/MemberSearchModal';
import {
  AppButton,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
  ConfirmationModal,
} from '../../../components';
import ChallengesTab from './components/challengestab/ChallengesTab';
import type { RootStackParamList } from '../../../navigations/GroupsStack';
// import { GroupChat } from './components/group_chats/GroupChat';
import useGroupDetail, { type GroupUserSearchResult } from './useGroupDetail';
import AppIcon from '../../../assets/appicon/AppIcon';

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

  return (
    <View style={styles.container}>
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
        {loading ? (
          <AppLoader message="Loading group details…" />
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
              onSettingsPress={() => {
                setGroupNameDraft(groupName);
                setGroupImage(undefined);
                setGroupEditVisible(true);
              }}
            />
            {isLeader ? (
              <Pressable
                onPress={() => setMemberSearchVisible(true)}
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
                onNewChallenge={() => setCreateChallengeVisible(true)}
                onArchiveGroup={() => setArchiveModalVisible(true)}
              />
            )}
            {activeTab === 'Leaderboard' && (
              <GroupLeaderboard members={members} />
            )}
            {activeTab === 'Challenges' && (
              <ChallengesTab
                onNewChallenge={() => setCreateChallengeVisible(true)}
                challenges={challenges}
                onJoin={joinGroupChallenge}
                joiningChallengeId={joiningChallengeId}
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
        onClose={() => !createChallengeLoading && setCreateChallengeVisible(false)}
        onChangeName={setChallengeName}
        onChangeDescription={setChallengeDescription}
        onChangeGoal={setChallengeGoal}
        onChangeMetricType={setMetricType}
        onChangeRewardPoints={setRewardPoints}
        onCycleDuration={cycleDuration}
        onSelectDuration={setDuration}
        onSubmit={handleCreateChallenge}
      />
      <EditGroupModal
        visible={groupEditVisible}
        onClose={() => !saveLoading && setGroupEditVisible(false)}
        isLeader={isLeader}
        groupNameDraft={groupNameDraft}
        setGroupNameDraft={setGroupNameDraft}
        groupImage={groupImage}
        currentGroupImage={groupImageUrl}
        setGroupImage={setGroupImage}
        saveLoading={saveLoading}
        onSaveGroup={async img => {
          setSaveLoading(true);
          try {
            await saveGroup(img);
          } finally {
            setSaveLoading(false);
          }
        }}
        onOpenLeaveModal={() => setLeaveModalVisible(true)}
      />

      <MemberSearchModal
        visible={memberSearchVisible}
        onClose={() => setMemberSearchVisible(false)}
        searchQuery={memberSearchQuery}
        onSearchChange={searchMembers}
        loading={memberSearchLoading}
        searchResults={memberSearchResults}
        onSelectUser={setPendingInviteUser}
      />

      <ConfirmationModal
        visible={pendingInviteUser !== null}
        onClose={() => !memberAddLoading && setPendingInviteUser(null)}
        title="Invite this member?"
        message={
          pendingInviteUser
            ? `Add ${pendingInviteUser.name} (${pendingInviteUser.publicId}) to ${groupName}?`
            : ''
        }
        position="bottom"
      >
        <View style={styles.modalActions}>
          <AppButton
            title="Cancel"
            variant="ghost"
            disabled={memberAddLoading}
            onPress={() => setPendingInviteUser(null)}
            style={styles.modalActionButton}
          />
          <AppButton
            title="Invite member"
            loading={memberAddLoading}
            disabled={memberAddLoading || !pendingInviteUser}
            onPress={async () => {
              if (!pendingInviteUser) return;
              const added = await addMember(pendingInviteUser);
              if (added) setPendingInviteUser(null);
            }}
            style={styles.modalActionButton}
          />
        </View>
      </ConfirmationModal>

      <ConfirmationModal
        visible={archiveModalVisible}
        onClose={() => !archiveLoading && setArchiveModalVisible(false)}
        title="Archive this group?"
        message="The group will disappear from active groups, Discover, feeds, and leaderboards. Its messages and challenges will be retained, but the group cannot be restored in the app."
        position="bottom"
      >
        <View style={styles.modalActions}>
          <AppButton
            title="Cancel"
            variant="ghost"
            disabled={archiveLoading}
            onPress={() => setArchiveModalVisible(false)}
            style={styles.modalActionButton}
          />
          <AppButton
            title="Exit group"
            loading={archiveLoading}
            disabled={archiveLoading}
            onPress={async () => {
              setArchiveLoading(true);
              try {
                const archived = await archiveGroup();
                setArchiveModalVisible(false);
                if (archived) navigation.goBack();
              } finally {
                setArchiveLoading(false);
              }
            }}
            style={[styles.modalActionButton, styles.destructiveButton]}
          />
        </View>
      </ConfirmationModal>

      <ConfirmationModal
        visible={leaveModalVisible}
        onClose={() => !leaveLoading && setLeaveModalVisible(false)}
        title="Leave this group?"
        message="You will lose access to this group’s activity and chat."
        position="bottom"
      >
        <View style={styles.modalActions}>
          <AppButton
            title="Cancel"
            variant="ghost"
            disabled={leaveLoading}
            onPress={() => setLeaveModalVisible(false)}
            style={styles.modalActionButton}
          />
          <AppButton
            title="Leave group"
            loading={leaveLoading}
            disabled={leaveLoading}
            onPress={async () => {
              setLeaveLoading(true);
              try {
                const left = await leaveGroup();
                setLeaveModalVisible(false);
                if (left) navigation.goBack();
              } finally {
                setLeaveLoading(false);
              }
            }}
            style={[styles.modalActionButton, styles.destructiveButton]}
          />
        </View>
      </ConfirmationModal>
    </View>
  );
};

export default GroupDetailScreen;
