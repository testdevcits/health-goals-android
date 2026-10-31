import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.GroupDetails';

import { GroupBanner } from './components/group_banner/GroupBanner';
import { GroupTabs } from './components/groups_tab/GroupTabs';
import { GroupOverview } from './components/group_overview/GroupOverview';
import { GroupLeaderboard } from './components/group_leaderboard/GroupLeaderboard';
import { CreateChallengeModal } from './components/create_challenge_modal/CreateChallengeModal';

import {
  DetailTab,
  GroupChallenge,
  INITIAL_MEMBERS,
  INITIAL_CHALLENGES,
  DURATION_OPTIONS,
  REWARD_OPTIONS,
} from './constants';
import { AppHeader } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import ChallengesTab from './components/challengestab/ChallengesTab';

// ─── Screen props ─────────────────────────────────────────────────────────────

interface GroupDetailScreenProps {
  groupName?: string;
  groupDescription?: string;
  memberCount?: number;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  groupName = 'Morning Runners',
  groupDescription = 'Weekly step challenge',
  memberCount = 8,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const styles = useMemo(
    () => createStyles(colors, spacing),
    [colors, spacing],
  );

  // ─── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  // ─── Challenges ─────────────────────────────────────────────────────────────
  const [challenges, setChallenges] =
    useState<GroupChallenge[]>(INITIAL_CHALLENGES);
  const [createChallengeVisible, setCreateChallengeVisible] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [reward, setReward] = useState(REWARD_OPTIONS[1]);

  const cycleDuration = useCallback(() => {
    setDuration(prev => {
      const i = DURATION_OPTIONS.indexOf(prev);
      return DURATION_OPTIONS[(i + 1) % DURATION_OPTIONS.length];
    });
  }, []);

  const cycleReward = useCallback(() => {
    setReward(prev => {
      const i = REWARD_OPTIONS.indexOf(prev);
      return REWARD_OPTIONS[(i + 1) % REWARD_OPTIONS.length];
    });
  }, []);

  const handleCreateChallenge = useCallback(() => {
    if (!challengeName.trim() || !challengeGoal.trim()) {
      Alert.alert(
        'Missing details',
        'Enter a challenge name and goal to continue.',
      );
      return;
    }

    const newChallenge: GroupChallenge = {
      id: `${Date.now()}`,
      title: challengeName.trim(),
      description: `Goal: ${challengeGoal.trim()}. Duration: ${duration}. Reward: ${reward}.`,
      status: 'New',
      progress: 0,
      progressLabel: 'Not started',
      color: colors.primary,
    };

    setChallenges(prev => [...prev, newChallenge]);
    setCreateChallengeVisible(false);
    setChallengeName('');
    setChallengeGoal('');
    setDuration(DURATION_OPTIONS[0]);
    setReward(REWARD_OPTIONS[1]);
    setActiveTab('Overview');
  }, [challengeName, challengeGoal, duration, reward, colors.primary]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container]}>
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
        <GroupBanner
          groupName={groupName}
          groupDescription={groupDescription}
          memberCount={memberCount}
          members={INITIAL_MEMBERS}
        />

        <GroupTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'Overview' && (
          <GroupOverview
            members={INITIAL_MEMBERS}
            challenges={challenges}
            onNewChallenge={() => setCreateChallengeVisible(true)}
          />
        )}

        {activeTab === 'Leaderboard' && (
          <GroupLeaderboard
            members={INITIAL_MEMBERS}
          />
        )}

        {activeTab === 'Challenges' && (
          <ChallengesTab
            onNewChallenge={() => setCreateChallengeVisible(true)}
            challenges={challenges}
          />
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
