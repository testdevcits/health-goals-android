import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    Share,
    StatusBar,
    TextInput,
    View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AppButton,
    AppHeader,
    AppText,
    ConfirmationModal,
    CustomSwitch,
} from '../../../components';
import AppIcon from '../../../assets/appicon/AppIcon';
import { useTheme } from '../../../theme/useTheme';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { storageService } from '../../../storage/storageService';
import type { RootStackParamList } from '../../../navigations/GroupsStack';
import createStyles from './styles.GroupSetting';

type GroupSettingNavProp = NativeStackNavigationProp<
    RootStackParamList,
    'GroupSetting'
>;
type GroupSettingRouteProp = RouteProp<RootStackParamList, 'GroupSetting'>;

const GROUP_EMOJIS = [
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

const GroupSetting: React.FC = () => {
    const { theme } = useTheme();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(theme), [theme]);
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

    const handlePickImage = async () => {
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
    };

    const handleMuteToggle = (value: boolean) => {
        setMuteGroup(value);
        if (value) {
            setChatNotifications(false);
            setChallengeNotifications(false);
        } else {
            setChatNotifications(true);
            setChallengeNotifications(true);
        }
    };

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

    const handleSaveChanges = async () => {
        setSaveLoading(true);
        try {
            if (isLeader) {
                const trimmedName = groupNameDraft.trim();
                if (!trimmedName) {
                    showAppToast('error', 'Group name required', 'Please enter a group name');
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

            // Persist notification preferences
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
    };

    const handleConfirmLeave = async () => {
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
    };

    const handleConfirmArchive = async () => {
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
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.surface}
            />

            <AppHeader
                title="Group Settings"
                subtitle={groupNameDraft || initialGroupName}
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
                {/* Visual Identity: Group Photo / Avatar */}
                <View style={styles.imageSection}>
                    <Pressable
                        onPress={isLeader ? handlePickImage : undefined}
                        disabled={!isLeader}
                        style={styles.imageContainer}
                        accessibilityRole={isLeader ? 'button' : 'image'}
                        accessibilityLabel="Group photo"
                    >
                        {displayImageUri ? (
                            <Image
                                source={{ uri: displayImageUri }}
                                style={styles.groupImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <AppText style={styles.avatarEmoji}>{selectedEmoji}</AppText>
                            </View>
                        )}

                        {isLeader && (
                            <View style={styles.cameraBadge}>
                                <AppIcon
                                    name="Camera"
                                    size={14}
                                    color={colors.textPrimary}
                                />
                            </View>
                        )}
                    </Pressable>

                    {isLeader && (
                        <View style={styles.imageActions}>
                            <Pressable onPress={handlePickImage} hitSlop={8}>
                                <AppText variant="caption" bold primary>
                                    {displayImageUri ? 'Change Photo' : 'Upload Photo'}
                                </AppText>
                            </Pressable>
                            {displayImageUri ? (
                                <>
                                    <AppText variant="caption" secondary>
                                        {' '}
                                        ·{' '}
                                    </AppText>
                                    <Pressable onPress={() => setGroupImage(null)} hitSlop={8}>
                                        <AppText
                                            variant="caption"
                                            bold
                                            style={{ color: colors.error }}
                                        >
                                            Remove
                                        </AppText>
                                    </Pressable>
                                </>
                            ) : null}
                        </View>
                    )}
                </View>

                {/* Group Emoji Selector (Leader only) */}
                {isLeader && (
                    <>
                        <AppText style={styles.sectionLabel}>Group Icon</AppText>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.emojiScrollContent}
                        >
                            {GROUP_EMOJIS.map(emoji => {
                                const isSelected = selectedEmoji === emoji;
                                return (
                                    <Pressable
                                        key={emoji}
                                        onPress={() => setSelectedEmoji(emoji)}
                                        style={[
                                            styles.emojiChip,
                                            isSelected && styles.emojiChipSelected,
                                        ]}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Select ${emoji} icon`}
                                    >
                                        <AppText style={styles.emojiText}>{emoji}</AppText>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </>
                )}

                {/* ── 1. GROUP DETAILS ── */}
                <AppText style={styles.sectionLabel}>Group Details</AppText>
                <View style={styles.card}>
                    {/* Row 1: Group Name */}
                    {isLeader ? (
                        <Pressable
                            style={styles.row}
                            onPress={() => nameInputRef.current?.focus()}
                            accessibilityRole="button"
                            accessibilityLabel="Edit Group Name"
                        >
                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: colors.primaryLight },
                                ]}
                            >
                                <AppIcon name="Pencil" size={19} color={colors.primary} />
                            </View>

                            <View style={styles.rowContent}>
                                <AppText style={styles.rowTitle}>Group Name</AppText>
                            </View>

                            <TextInput
                                ref={nameInputRef}
                                value={groupNameDraft}
                                onChangeText={setGroupNameDraft}
                                placeholder="Enter name"
                                placeholderTextColor={colors.textTertiary}
                                maxLength={50}
                                style={styles.nameInput}
                                accessibilityLabel="Group Name Input"
                                returnKeyType="done"
                            />
                        </Pressable>
                    ) : (
                        <View style={styles.row}>
                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: colors.primaryLight },
                                ]}
                            >
                                <AppIcon name="UsersRound" size={19} color={colors.primary} />
                            </View>

                            <View style={styles.rowContent}>
                                <AppText style={styles.rowTitle}>Group Name</AppText>
                            </View>

                            <AppText style={styles.rowValue} numberOfLines={1}>
                                {groupNameDraft || initialGroupName}
                            </AppText>
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* Row 2: Group Description */}
                    {isLeader ? (
                        <Pressable
                            style={styles.row}
                            onPress={() => descInputRef.current?.focus()}
                            accessibilityRole="button"
                            accessibilityLabel="Edit Group Description"
                        >
                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: colors.primaryLight },
                                ]}
                            >
                                <AppIcon name="FileText" size={19} color={colors.primary} />
                            </View>

                            <View style={styles.rowContent}>
                                <AppText style={styles.rowTitle}>Description</AppText>
                            </View>

                            <TextInput
                                ref={descInputRef}
                                value={groupDescriptionDraft}
                                onChangeText={setGroupDescriptionDraft}
                                placeholder="Add description"
                                placeholderTextColor={colors.textTertiary}
                                maxLength={160}
                                style={styles.descInput}
                                accessibilityLabel="Group Description Input"
                                returnKeyType="done"
                            />
                        </Pressable>
                    ) : (
                        groupDescriptionDraft ? (
                            <View style={styles.row}>
                                <View
                                    style={[
                                        styles.iconBadge,
                                        { backgroundColor: colors.primaryLight },
                                    ]}
                                >
                                    <AppIcon name="FileText" size={19} color={colors.primary} />
                                </View>

                                <View style={styles.rowContent}>
                                    <AppText style={styles.rowTitle}>Description</AppText>
                                    <AppText style={styles.rowSubtitle} numberOfLines={2}>
                                        {groupDescriptionDraft}
                                    </AppText>
                                </View>
                            </View>
                        ) : null
                    )}

                    {(!isLeader && !groupDescriptionDraft) ? null : <View style={styles.divider} />}

                    {/* Row 3: Members */}
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconBadge,
                                { backgroundColor: colors.infoLight },
                            ]}
                        >
                            <AppIcon name="UsersRound" size={19} color={colors.info} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={styles.rowTitle}>Members</AppText>
                        </View>

                        <AppText style={styles.rowValue}>{memberCount}</AppText>
                    </View>

                    <View style={styles.divider} />

                    {/* Row 4: Invite Friends */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.row,
                            pressed && { backgroundColor: colors.backgroundSecondary },
                        ]}
                        onPress={handleInviteFriends}
                        accessibilityRole="button"
                        accessibilityLabel="Invite Friends"
                    >
                        <View
                            style={[
                                styles.iconBadge,
                                { backgroundColor: colors.primaryLight },
                            ]}
                        >
                            <AppIcon name="Link2" size={19} color={colors.primary} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={styles.rowTitle}>Invite Friends</AppText>
                            <AppText style={styles.rowSubtitle}>
                                Share a join link with your crew
                            </AppText>
                        </View>

                        <AppIcon
                            name="ChevronRight"
                            size={18}
                            color={colors.textTertiary}
                        />
                    </Pressable>
                </View>

                {/* ── 2. NOTIFICATIONS ── */}
                <AppText style={styles.sectionLabel}>Notifications</AppText>
                <View style={styles.card}>
                    {/* Row 1: Group Chat */}
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconBadge,
                                { backgroundColor: colors.warningLight },
                            ]}
                        >
                            <AppIcon name="Bell" size={19} color={colors.warning} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={styles.rowTitle}>Group Chat</AppText>
                            <AppText style={styles.rowSubtitle}>
                                New messages from members
                            </AppText>
                        </View>

                        <CustomSwitch
                            value={chatNotifications}
                            onValueChange={setChatNotifications}
                            disabled={muteGroup}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Row 2: Challenge Updates */}
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconBadge,
                                { backgroundColor: colors.warningLight },
                            ]}
                        >
                            <AppIcon name="Trophy" size={19} color={colors.warning} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={styles.rowTitle}>Challenge Updates</AppText>
                            <AppText style={styles.rowSubtitle}>Progress and results</AppText>
                        </View>

                        <CustomSwitch
                            value={challengeNotifications}
                            onValueChange={setChallengeNotifications}
                            disabled={muteGroup}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Row 3: Mute Group */}
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconBadge,
                                { backgroundColor: colors.warningLight },
                            ]}
                        >
                            <AppIcon name="BellOff" size={19} color={colors.warning} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={styles.rowTitle}>Mute Group</AppText>
                            <AppText style={styles.rowSubtitle}>
                                Silence all notifications
                            </AppText>
                        </View>

                        <CustomSwitch
                            value={muteGroup}
                            onValueChange={handleMuteToggle}
                        />
                    </View>
                </View>

                {/* ── 3. DANGER ZONE ── */}
                <AppText style={styles.sectionLabel}>Danger Zone</AppText>
                <View style={styles.card}>
                    {/* Leave Group */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.row,
                            pressed && { backgroundColor: colors.coralLight },
                        ]}
                        onPress={() => setLeaveModalVisible(true)}
                        accessibilityRole="button"
                        accessibilityLabel="Leave Group"
                    >
                        <View
                            style={[styles.iconBadge, { backgroundColor: colors.coralLight }]}
                        >
                            <AppIcon name="LogOut" size={19} color={colors.coral} />
                        </View>

                        <View style={styles.rowContent}>
                            <AppText style={[styles.rowTitle, styles.dangerTitle]}>
                                Leave Group
                            </AppText>
                            <AppText style={[styles.rowSubtitle, styles.dangerSubtitle]}>
                                You can rejoin with an invite
                            </AppText>
                        </View>

                        <AppIcon name="ChevronRight" size={18} color={colors.coral} />
                    </Pressable>

                    {/* Archive Group (Leader only) */}
                    {isLeader && (
                        <>
                            <View style={styles.divider} />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.row,
                                    pressed && { backgroundColor: colors.coralLight },
                                ]}
                                onPress={() => setArchiveModalVisible(true)}
                                accessibilityRole="button"
                                accessibilityLabel="Archive Group"
                            >
                                <View
                                    style={[
                                        styles.iconBadge,
                                        { backgroundColor: colors.coralLight },
                                    ]}
                                >
                                    <AppIcon name="Trash2" size={19} color={colors.coral} />
                                </View>

                                <View style={styles.rowContent}>
                                    <AppText style={[styles.rowTitle, styles.dangerTitle]}>
                                        Archive Group
                                    </AppText>
                                    <AppText style={[styles.rowSubtitle, styles.dangerSubtitle]}>
                                        Permanently close and delete this group
                                    </AppText>
                                </View>

                                <AppIcon name="ChevronRight" size={18} color={colors.coral} />
                            </Pressable>
                        </>
                    )}
                </View>

                {/* ── 4. SAVE BUTTON ── */}
                <AppButton
                    title="Save Changes"
                    onPress={handleSaveChanges}
                    loading={saveLoading}
                    disabled={saveLoading}
                    style={styles.saveButton}
                />
            </ScrollView>

            {/* Leave Group Modal */}
            {
                leaveModalVisible &&
                <ConfirmationModal
                    visible={leaveModalVisible}
                    onClose={() => setLeaveModalVisible(false)}
                    title="Leave Group?"
                    message={`Are you sure you want to leave "${groupNameDraft || initialGroupName}"? You will lose access to team chat and leaderboards.`}
                    position="bottom"
                >
                    <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
                        <AppButton
                            title="Leave Group"
                            loading={leaveLoading}
                            disabled={leaveLoading}
                            onPress={handleConfirmLeave}
                            style={{ backgroundColor: colors.coral }}
                        />
                        <AppButton
                            title="Stay in Group"
                            variant="outline"
                            disabled={leaveLoading}
                            onPress={() => setLeaveModalVisible(false)}
                        />
                    </View>
                </ConfirmationModal>
            }


            {/* Archive Group Modal (Leader only) */}
            {
                archiveModalVisible &&
                <ConfirmationModal
                    visible={archiveModalVisible}
                    onClose={() => setArchiveModalVisible(false)}
                    title="Archive Group?"
                    message={`This will permanently delete "${groupNameDraft || initialGroupName}". All members, challenges, and chat history will be removed. This cannot be undone.`}
                    position="bottom"
                >
                    <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
                        <AppButton
                            title="Archive Group"
                            loading={archiveLoading}
                            disabled={archiveLoading}
                            onPress={handleConfirmArchive}
                            style={{ backgroundColor: colors.coral }}
                        />
                        <AppButton
                            title="Cancel"
                            variant="outline"
                            disabled={archiveLoading}
                            onPress={() => setArchiveModalVisible(false)}
                        />
                    </View>
                </ConfirmationModal>

            }

        </View>
    );
};

export default GroupSetting;
