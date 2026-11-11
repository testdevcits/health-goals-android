import React, { useMemo, useState } from 'react';
import { Alert, View, ScrollView, Modal, Pressable } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
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
import {
  AppErrorView,
  AppHeader,
  AppInput,
  AppLoader,
  AppText,
} from '../../../components';
import ChallengesTab from './components/challengestab/ChallengesTab';
import type { RootStackParamList } from '../../../navigations/GroupsStack';
import { GroupChat } from './components/group_chats/GroupChat';
import useGroupDetail from './useGroupDetail';

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
              members={members}
              imageUrl={groupImageUrl}
              onSettingsPress={() => {
                setGroupNameDraft(groupName);
                setGroupImage(undefined);
                setGroupEditVisible(true);
              }}
            />
            <Pressable
              onPress={() => setMemberSearchVisible(true)}
              style={{
                alignSelf: 'flex-end',
                paddingVertical: 10,
                paddingHorizontal: 14,
              }}
            >
              <AppText variant="label" primary bold>
                + Add member
              </AppText>
            </Pressable>
            <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'Overview' && (
              <GroupOverview
                members={members}
                challenges={challenges}
                isLeader={isLeader}
                onNewChallenge={() => setCreateChallengeVisible(true)}
                onArchiveGroup={() =>
                  Alert.alert(
                    'Archive this group?',
                    'The group will disappear from active groups, Discover, feeds, and leaderboards. Its messages and challenges will be retained, but the group cannot be restored in the app.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Archive group',
                        style: 'destructive',
                        onPress: async () => {
                          const archived = await archiveGroup();
                          if (archived) navigation.goBack();
                        },
                      },
                    ],
                  )
                }
              />
            )}
            {activeTab === 'Leaderboard' && (
              <GroupLeaderboard members={members} />
            )}
            {activeTab === 'Challenges' && (
              <ChallengesTab
                onNewChallenge={() => setCreateChallengeVisible(true)}
                challenges={challenges}
              />
            )}
            {activeTab === 'Chat' && (
              <GroupChat
                messages={messages}
                messageDraft={messageDraft}
                onChangeDraft={setMessageDraft}
                onSend={() => sendMessage()}
              />
            )}
          </>
        )}
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
      <Modal
        visible={groupEditVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGroupEditVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <View
            style={{
              padding: 20,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: colors.surface,
            }}
          >
            <AppText variant="h3" bold mb={12}>
              Edit group
            </AppText>
            <AppInput
              label="Group name"
              value={groupNameDraft}
              onChangeText={setGroupNameDraft}
              maxLength={50}
            />
            <Pressable
              onPress={async () => {
                try {
                  const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    cropping: true,
                    width: 900,
                    height: 600,
                    compressImageQuality: 0.8,
                    includeBase64: true,
                    includeExif: false,
                  });
                  if (image.data) {
                    setGroupImage(
                      `data:${image.mime || 'image/jpeg'};base64,${image.data}`,
                    );
                  }
                } catch (error: any) {
                  if (error?.code !== 'E_PICKER_CANCELLED') {
                    showAppToast(
                      'error',
                      'Could not choose image',
                      apiErrorMessage(error),
                    );
                  }
                }
              }}
              style={{ paddingVertical: 12 }}
            >
              <AppText variant="label" primary bold>
                {groupImage
                  ? 'Group image selected · Change image'
                  : 'Choose group image'}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setGroupImage(null)}
              style={{ paddingVertical: 8 }}
            >
              <AppText variant="caption" secondary>
                Remove group image
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => void saveGroup(groupImage)}
              style={{ paddingVertical: 14, alignItems: 'center' }}
            >
              <AppText variant="label" primary bold>
                Save changes
              </AppText>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Leave this group?',
                  'You will lose access to this group’s activity and chat.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Leave group',
                      style: 'destructive',
                      onPress: async () => {
                        const left = await leaveGroup();
                        if (left) navigation.goBack();
                      },
                    },
                  ],
                )
              }
              style={{ paddingVertical: 12, alignItems: 'center' }}
            >
              <AppText variant="label" error bold>
                Leave group
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={memberSearchVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMemberSearchVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <View
            style={{
              maxHeight: '75%',
              padding: 20,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: colors.surface,
            }}
          >
            <AppText variant="h3" bold mb={12}>
              Add a group member
            </AppText>
            <AppInput
              value={memberSearchQuery}
              onChangeText={searchMembers}
              placeholder="Search by name or public ID"
              autoCapitalize="none"
            />
            {memberSearchLoading ? (
              <AppText variant="body2" secondary mb={12}>
                Searching…
              </AppText>
            ) : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              {memberSearchResults.map(user => (
                <Pressable
                  key={user.id}
                  onPress={() => void addMember(user)}
                  style={{ paddingVertical: 12 }}
                >
                  <AppText variant="subtitle2" bold>
                    {user.name}
                  </AppText>
                  <AppText variant="caption" secondary>
                    {user.publicId}
                  </AppText>
                </Pressable>
              ))}
              {memberSearchQuery.trim().length >= 2 &&
              !memberSearchLoading &&
              memberSearchResults.length === 0 ? (
                <AppText variant="body2" secondary mb={12}>
                  No matching users found.
                </AppText>
              ) : null}
            </ScrollView>
            <Pressable
              onPress={() => setMemberSearchVisible(false)}
              style={{ paddingTop: 14, alignItems: 'center' }}
            >
              <AppText variant="label" primary bold>
                Close
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupDetailScreen;
