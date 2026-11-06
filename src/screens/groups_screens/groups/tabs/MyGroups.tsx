import { Pressable, View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../navigations/GroupsStack';
import createStyles from './styles.MyGroups';
import type { Group } from '../data';
import AppIcon from '../../../../assets/appicon/AppIcon';

type GroupsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyGroups = ({
  groups,
  avatarColors,
  setCreateModalVisible,
  onJoinGroup,
  discover = false,
}: {
  groups: Group[];
  avatarColors?: string[];
  setCreateModalVisible: (visible: boolean) => void;
  onJoinGroup?: (id: string) => void;
  discover?: boolean;
}) => {
  // Default avatar colors palette if none provided
  const defaultAvatarColors = ['#FF6B6B', '#4ECDC4', '#FFCE54', '#A29BFE'];
  const avatarPalette =
    avatarColors && avatarColors.length > 0
      ? avatarColors
      : defaultAvatarColors;

  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors, spacing, radius);
  const navigation = useNavigation<GroupsNavigationProp>();
  return (
    <View style={styles.groupList}>
      {groups?.map(group => (
        <Pressable
          key={group?.id}
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('GroupDetails', {
              groupId: group.id,
              name: group.name,
              description: group.description,
              members: group.members,
            })
          }
          style={styles.groupCard}
        >
          <View
            style={[
              styles.groupIcon,
              {
                backgroundColor:
                  group?.emoji === '🏃'
                    ? colors.primaryLight
                    : group?.emoji === '💼'
                    ? colors.infoLight
                    : colors.warningLight,
              },
            ]}
          >
            <AppText style={styles.groupEmoji}>{group?.emoji}</AppText>
          </View>

          <View style={styles.groupInfo}>
            <AppText variant="subtitle2" numberOfLines={1}>
              {group?.name}
            </AppText>

            <AppText variant="caption" secondary numberOfLines={2}>
              {group?.description} · {group?.members} members
              {group?.rank ? ` · ${group?.rank}` : ''}
            </AppText>

            <View style={styles.memberAvatars}>
              {(group?.avatars || []).slice(0, 4).map((avatar, i: number) => (
                <View
                  key={`${group?.id}-${i}`}
                  style={[
                    styles.memberAvatar,
                    {
                      backgroundColor: avatarPalette[i % avatarPalette.length],
                    },
                  ]}
                >
                  <AppText style={styles.memberAvatarText} bold>
                    {typeof avatar === 'string' ? avatar : avatar.initial}
                  </AppText>
                </View>
              ))}

              {group?.members > 4 && (
                <View style={styles.moreMembers}>
                  <AppText style={styles.moreMembersText} color="white" bold>
                    +{group?.members - 4}
                  </AppText>
                </View>
              )}
            </View>
          </View>

          {discover && !group?.joined ? (
            <Pressable
              onPress={() => onJoinGroup?.(group.id)}
              style={{ padding: 8 }}
            >
              <AppText variant="caption" primary bold>
                Join
              </AppText>
            </Pressable>
          ) : (
            <AppIcon
              name="ChevronRight"
              size={19}
              color={colors.textTertiary}
            />
          )}
        </Pressable>
      ))}

      {/* Create group */}
      <Pressable
        accessibilityRole="button"
        onPress={() => setCreateModalVisible(true)}
        style={styles.createGroupButton}
      >
        <AppText variant="buttonSm" primary>
          + Create New Group
        </AppText>
      </Pressable>
    </View>
  );
};

export default memo(MyGroups);
