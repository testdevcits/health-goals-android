import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
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
import { AppErrorView, AppHeader, AppLoader } from '../../../components';
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
            />
            <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'Overview' && (
              <GroupOverview
                members={members}
                challenges={challenges}
                onNewChallenge={() => setCreateChallengeVisible(true)}
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
    </View>
  );
};

export default GroupDetailScreen;
