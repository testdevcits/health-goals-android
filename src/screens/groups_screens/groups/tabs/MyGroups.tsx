import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../../theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../navigations/GroupsStack';

type GroupsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyGroups = ({
  groups,
  avatarColors,
  setCreateModalVisible,
}: {
  groups: any[];
  avatarColors?: string[]; // optional prop
  setCreateModalVisible: (visible: boolean) => void;
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
            navigation.navigate('GroupDetails')
          }
          style={styles.groupCard}
        >
          <View
            style={[
              styles.groupIcon,
              {
                backgroundColor:
                  group?.emoji === '🏃'
                    ? '#DDF8F3'
                    : group?.emoji === '💼'
                    ? '#EFEBFF'
                    : '#FFF1E3',
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
              {group?.avatars
                .slice(0, 4)
                .map(({ initial }: { initial: string }, i: number) => (
                  <View
                    key={`${group?.id}-${i}`}
                    style={[
                      styles.memberAvatar,
                      {
                        backgroundColor:
                          avatarPalette[i % avatarPalette.length],
                      },
                    ]}
                  >
                    <AppText style={styles.memberAvatarText} bold>
                      {initial}
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

          <ChevronRight size={19} color={colors.textTertiary} />
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

const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    groupList: {
      paddingHorizontal: spacing.base,
    },

    groupCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      minHeight: 108,
      gap: spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },

    groupIcon: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },

    groupEmoji: {
      fontSize: 25,
    },

    groupInfo: {
      flex: 1,
      minWidth: 0,
    },

    memberAvatars: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },

    memberAvatar: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surface,
      marginRight: -4,
      overflow: 'hidden',
    },

    memberAvatarText: {
      fontSize: 9,
      lineHeight: 10,
      color: '#fff',
      includeFontPadding: false,
      textAlignVertical: 'center',
    },

    moreMembers: {
      width: 19,
      height: 19,
      borderRadius: radius.full,
      backgroundColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surface,
      marginLeft: 1,
    },

    moreMembersText: {
      fontSize: 8,
      lineHeight: 10,
    },

    createGroupButton: {
      minHeight: 48,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });
