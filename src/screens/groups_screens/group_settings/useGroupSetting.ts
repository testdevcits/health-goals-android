import { useCallback, useMemo, useRef, useState } from 'react';
import { Share, TextInput } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ImagePicker from 'react-native-image-crop-picker';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { storageService } from '../../../storage/storageService';
import type { RootStackParamList } from '../../../navigations/GroupsStack';

type GroupSettingNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'GroupSetting'
>;
type GroupSettingRouteProp = RouteProp<RootStackParamList, 'GroupSetting'>;

export const GROUP_EMOJIS = [
  '🏃',
  '🚶',
  '🚴',
  '💪',
  '🧘',
  '🏆',
  '🔥',
  '🏋️',
  '🏊',
  '🥗',
  '⚡',
  '🎯',
];

export function useGroupSetting() {
  const navigation = useNavigation<GroupSettingNavProp>();
  const route = useRoute<GroupSettingRouteProp>();
  const nameInputRef = useRef<TextInput>(null);
  const descInputRef = useRef<TextInput>(null);

  const {
    groupId,
    groupName: initialGroupName = 'Group',
    groupDescription: initialGroupDescription = '',
    groupImageUrl: initialImageUrl,
    groupEmoji: initialGroupEmoji = '🏃',
    isLeader = false,
    memberCount = 1,
  } = route.params || {};

  const storageKey = `group_notifications_${groupId}`;
  const cachedSettings = useMemo(
    () =>
      storageService.getObject<{
        chat?: boolean;
        challenges?: boolean;
        mute?: boolean;
      }>(storageKey) || {},
    [storageKey],
  );

  const [groupNameDraft, setGroupNameDraft] = useState(initialGroupName);
  const [groupDescriptionDraft, setGroupDescriptionDraft] = useState(
    initialGroupDescription,
  );
  const [selectedEmoji, setSelectedEmoji] = useState(initialGroupEmoji);
  const [groupImage, setGroupImage] = useState<string | null | undefined>(
    undefined,
  );
  const [chatNotifications, setChatNotifications] = useState(
    cachedSettings.chat ?? true,
  );
  const [challengeNotifications, setChallengeNotifications] = useState(
    cachedSettings.challenges ?? true,
  );
  const [muteGroup, setMuteGroup] = useState(cachedSettings.mute ?? false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);

  const displayImageUri =
    groupImage !== undefined ? groupImage : initialImageUrl;

  const handlePickImage = useCallback(async () => {
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
        showAppToast('error', 'Could not choose image', apiErrorMessage(error));
      }
    }
  }, []);

  const handleMuteToggle = useCallback((value: boolean) => {
    setMuteGroup(value);
    setChatNotifications(!value);
    setChallengeNotifications(!value);
  }, []);

  const handleInviteFriends = useCallback(async () => {
    try {
      await Share.share({
        title: groupNameDraft,
        message: `Join my group "${groupNameDraft}" on Vitality! Track steps together and hit goals: https://vitality.app/groups/${groupId}`,
      });
    } catch {
      // User dismissed share
    }
  }, [groupId, groupNameDraft]);

  const handleSaveChanges = useCallback(async () => {
    setSaveLoading(true);
    try {
      if (isLeader) {
        const trimmedName = groupNameDraft.trim();
        if (!trimmedName) {
          showAppToast(
            'error',
            'Group name required',
            'Please enter a group name',
          );
          setSaveLoading(false);
          return;
        }

        const payload: {
          name: string;
          description?: string;
          emoji?: string;
          image?: string | null;
        } = {
          name: trimmedName,
          description: groupDescriptionDraft.trim() || undefined,
          emoji: selectedEmoji,
        };
        if (groupImage !== undefined) {
          payload.image = groupImage;
        }

        await authenticatedRequest(
          'PATCH',
          API_ENDPOINTS.COMMUNITY.GROUP_DETAILS(groupId),
          payload,
        );
      }

      storageService.setObject(storageKey, {
        chat: chatNotifications,
        challenges: challengeNotifications,
        mute: muteGroup,
      });

      showAppToast(
        'success',
        'Changes saved',
        'Group settings have been updated.',
      );
      navigation.goBack();
    } catch (error) {
      showAppToast('error', 'Failed to save', apiErrorMessage(error));
    } finally {
      setSaveLoading(false);
    }
  }, [
    challengeNotifications,
    chatNotifications,
    groupDescriptionDraft,
    groupId,
    groupImage,
    groupNameDraft,
    isLeader,
    muteGroup,
    navigation,
    selectedEmoji,
    storageKey,
  ]);

  const handleConfirmLeave = useCallback(async () => {
    setLeaveLoading(true);
    try {
      await authenticatedRequest(
        'POST',
        API_ENDPOINTS.COMMUNITY.LEAVE_GROUP(groupId),
      );
      setLeaveModalVisible(false);
      showAppToast('success', 'Left group', 'You have left this group.');
      navigation.navigate('Groups');
    } catch (error) {
      showAppToast('error', 'Could not leave group', apiErrorMessage(error));
    } finally {
      setLeaveLoading(false);
    }
  }, [groupId, navigation]);

  const handleConfirmArchive = useCallback(async () => {
    setArchiveLoading(true);
    try {
      await authenticatedRequest(
        'DELETE',
        API_ENDPOINTS.COMMUNITY.GROUP_DETAILS(groupId),
      );
      setArchiveModalVisible(false);
      showAppToast('success', 'Group archived', 'The group has been archived.');
      navigation.navigate('Groups');
    } catch (error) {
      showAppToast('error', 'Could not archive group', apiErrorMessage(error));
    } finally {
      setArchiveLoading(false);
    }
  }, [groupId, navigation]);

  return {
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
  };
}
