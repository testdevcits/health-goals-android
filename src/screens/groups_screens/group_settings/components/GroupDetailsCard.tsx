import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { AppText } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import type createStyles from '../styles.GroupSetting';

interface GroupDetailsCardProps {
  styles: ReturnType<typeof createStyles>;
  isLeader: boolean;
  nameInputRef: React.RefObject<TextInput | null>;
  descInputRef: React.RefObject<TextInput | null>;
  groupNameDraft: string;
  initialGroupName: string;
  groupDescriptionDraft: string;
  memberCount: number;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onInviteFriends: () => void;
}

const GroupDetailsCard: React.FC<GroupDetailsCardProps> = ({
  styles,
  isLeader,
  nameInputRef,
  descInputRef,
  groupNameDraft,
  initialGroupName,
  groupDescriptionDraft,
  memberCount,
  onChangeName,
  onChangeDescription,
  onInviteFriends,
}) => {
  const { colors } = useTheme().theme;

  return (
    <>
      <AppText style={styles.sectionLabel}>Group Details</AppText>
      <View style={styles.card}>
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
              onChangeText={onChangeName}
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
              onChangeText={onChangeDescription}
              placeholder="Add description"
              placeholderTextColor={colors.textTertiary}
              maxLength={160}
              style={styles.descInput}
              accessibilityLabel="Group Description Input"
              returnKeyType="done"
            />
          </Pressable>
        ) : groupDescriptionDraft ? (
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
        ) : null}

        {!isLeader && !groupDescriptionDraft ? null : (
          <View style={styles.divider} />
        )}

        <View style={styles.row}>
          <View
            style={[styles.iconBadge, { backgroundColor: colors.infoLight }]}
          >
            <AppIcon name="UsersRound" size={19} color={colors.info} />
          </View>

          <View style={styles.rowContent}>
            <AppText style={styles.rowTitle}>Members</AppText>
          </View>

          <AppText style={styles.rowValue}>{memberCount}</AppText>
        </View>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && { backgroundColor: colors.backgroundSecondary },
          ]}
          onPress={onInviteFriends}
          accessibilityRole="button"
          accessibilityLabel="Invite Friends"
        >
          <View
            style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}
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
    </>
  );
};

export default React.memo(GroupDetailsCard);
