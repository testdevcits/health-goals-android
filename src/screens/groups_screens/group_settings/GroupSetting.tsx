import React, { useMemo } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppHeader } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.GroupSetting';
import { useGroupSetting } from './useGroupSetting';
import GroupIdentitySection from './components/GroupIdentitySection';
import GroupDetailsCard from './components/GroupDetailsCard';
import GroupNotificationsCard from './components/GroupNotificationsCard';
import GroupDangerZone from './components/GroupDangerZone';

const GroupSetting: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    navigation,
    nameInputRef,
    descInputRef,
    initialGroupName,
    isLeader,
    memberCount,
    groupNameDraft,
    setGroupNameDraft,
    groupDescriptionDraft,
    setGroupDescriptionDraft,
    selectedEmoji,
    setSelectedEmoji,
    displayImageUri,
    setGroupImage,
    chatNotifications,
    setChatNotifications,
    challengeNotifications,
    setChallengeNotifications,
    muteGroup,
    saveLoading,
    leaveLoading,
    leaveModalVisible,
    setLeaveModalVisible,
    archiveLoading,
    archiveModalVisible,
    setArchiveModalVisible,
    handlePickImage,
    handleMuteToggle,
    handleInviteFriends,
    handleSaveChanges,
    handleConfirmLeave,
    handleConfirmArchive,
  } = useGroupSetting();

  const groupDisplayName = groupNameDraft || initialGroupName;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      <AppHeader
        title="Group Settings"
        subtitle={groupDisplayName}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
      >
        <GroupIdentitySection
          styles={styles}
          isLeader={isLeader}
          displayImageUri={displayImageUri}
          selectedEmoji={selectedEmoji}
          onSelectEmoji={setSelectedEmoji}
          onPickImage={handlePickImage}
          onRemoveImage={() => setGroupImage(null)}
        />

        <GroupDetailsCard
          styles={styles}
          isLeader={isLeader}
          nameInputRef={nameInputRef}
          descInputRef={descInputRef}
          groupNameDraft={groupNameDraft}
          initialGroupName={initialGroupName}
          groupDescriptionDraft={groupDescriptionDraft}
          memberCount={memberCount}
          onChangeName={setGroupNameDraft}
          onChangeDescription={setGroupDescriptionDraft}
          onInviteFriends={handleInviteFriends}
        />

        <GroupNotificationsCard
          styles={styles}
          chatNotifications={chatNotifications}
          challengeNotifications={challengeNotifications}
          muteGroup={muteGroup}
          onChangeChat={setChatNotifications}
          onChangeChallenge={setChallengeNotifications}
          onChangeMute={handleMuteToggle}
        />

        <GroupDangerZone
          styles={styles}
          groupDisplayName={groupDisplayName}
          isLeader={isLeader}
          leaveLoading={leaveLoading}
          leaveModalVisible={leaveModalVisible}
          archiveLoading={archiveLoading}
          archiveModalVisible={archiveModalVisible}
          onOpenLeaveModal={() => setLeaveModalVisible(true)}
          onCloseLeaveModal={() => setLeaveModalVisible(false)}
          onConfirmLeave={handleConfirmLeave}
          onOpenArchiveModal={() => setArchiveModalVisible(true)}
          onCloseArchiveModal={() => setArchiveModalVisible(false)}
          onConfirmArchive={handleConfirmArchive}
        />

        <AppButton
          title="Save Changes"
          onPress={handleSaveChanges}
          loading={saveLoading}
          disabled={saveLoading}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
};

export default GroupSetting;
