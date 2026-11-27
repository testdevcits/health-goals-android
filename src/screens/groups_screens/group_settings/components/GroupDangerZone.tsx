import React from 'react';
import { Pressable, View } from 'react-native';
import { AppButton, AppText, ConfirmationModal } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import type createStyles from '../styles.GroupSetting';

interface GroupDangerZoneProps {
  styles: ReturnType<typeof createStyles>;
  groupDisplayName: string;
  isLeader: boolean;
  leaveLoading: boolean;
  leaveModalVisible: boolean;
  archiveLoading: boolean;
  archiveModalVisible: boolean;
  onOpenLeaveModal: () => void;
  onCloseLeaveModal: () => void;
  onConfirmLeave: () => void;
  onOpenArchiveModal: () => void;
  onCloseArchiveModal: () => void;
  onConfirmArchive: () => void;
}

const GroupDangerZone: React.FC<GroupDangerZoneProps> = ({
  styles,
  groupDisplayName,
  isLeader,
  leaveLoading,
  leaveModalVisible,
  archiveLoading,
  archiveModalVisible,
  onOpenLeaveModal,
  onCloseLeaveModal,
  onConfirmLeave,
  onOpenArchiveModal,
  onCloseArchiveModal,
  onConfirmArchive,
}) => {
  const { colors, spacing } = useTheme().theme;

  return (
    <>
      <AppText style={styles.sectionLabel}>Danger Zone</AppText>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && { backgroundColor: colors.coralLight },
          ]}
          onPress={onOpenLeaveModal}
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

        {isLeader && (
          <>
            <View style={styles.divider} />
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: colors.coralLight },
              ]}
              onPress={onOpenArchiveModal}
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

      {leaveModalVisible && (
        <ConfirmationModal
          visible={leaveModalVisible}
          onClose={onCloseLeaveModal}
          title="Leave Group?"
          message={`Are you sure you want to leave "${groupDisplayName}"? You will lose access to team chat and leaderboards.`}
          position="bottom"
        >
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <AppButton
              title="Leave Group"
              loading={leaveLoading}
              disabled={leaveLoading}
              onPress={onConfirmLeave}
              style={{ backgroundColor: colors.coral }}
            />
            <AppButton
              title="Stay in Group"
              variant="outline"
              disabled={leaveLoading}
              onPress={onCloseLeaveModal}
            />
          </View>
        </ConfirmationModal>
      )}

      {archiveModalVisible && (
        <ConfirmationModal
          visible={archiveModalVisible}
          onClose={onCloseArchiveModal}
          title="Archive Group?"
          message={`This will permanently delete "${groupDisplayName}". All members, challenges, and chat history will be removed. This cannot be undone.`}
          position="bottom"
        >
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <AppButton
              title="Archive Group"
              loading={archiveLoading}
              disabled={archiveLoading}
              onPress={onConfirmArchive}
              style={{ backgroundColor: colors.coral }}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              disabled={archiveLoading}
              onPress={onCloseArchiveModal}
            />
          </View>
        </ConfirmationModal>
      )}
    </>
  );
};

export default React.memo(GroupDangerZone);
