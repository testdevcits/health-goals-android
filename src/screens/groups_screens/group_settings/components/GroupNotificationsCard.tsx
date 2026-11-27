import React from 'react';
import { View } from 'react-native';
import { AppText, CustomSwitch } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import type createStyles from '../styles.GroupSetting';

interface GroupNotificationsCardProps {
  styles: ReturnType<typeof createStyles>;
  chatNotifications: boolean;
  challengeNotifications: boolean;
  muteGroup: boolean;
  onChangeChat: (value: boolean) => void;
  onChangeChallenge: (value: boolean) => void;
  onChangeMute: (value: boolean) => void;
}

const GroupNotificationsCard: React.FC<GroupNotificationsCardProps> = ({
  styles,
  chatNotifications,
  challengeNotifications,
  muteGroup,
  onChangeChat,
  onChangeChallenge,
  onChangeMute,
}) => {
  const { colors } = useTheme().theme;

  return (
    <>
      <AppText style={styles.sectionLabel}>Notifications</AppText>
      <View style={styles.card}>
        <View style={styles.row}>
          <View
            style={[styles.iconBadge, { backgroundColor: colors.warningLight }]}
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
            onValueChange={onChangeChat}
            disabled={muteGroup}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View
            style={[styles.iconBadge, { backgroundColor: colors.warningLight }]}
          >
            <AppIcon name="Trophy" size={19} color={colors.warning} />
          </View>

          <View style={styles.rowContent}>
            <AppText style={styles.rowTitle}>Challenge Updates</AppText>
            <AppText style={styles.rowSubtitle}>Progress and results</AppText>
          </View>

          <CustomSwitch
            value={challengeNotifications}
            onValueChange={onChangeChallenge}
            disabled={muteGroup}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View
            style={[styles.iconBadge, { backgroundColor: colors.warningLight }]}
          >
            <AppIcon name="BellOff" size={19} color={colors.warning} />
          </View>

          <View style={styles.rowContent}>
            <AppText style={styles.rowTitle}>Mute Group</AppText>
            <AppText style={styles.rowSubtitle}>
              Silence all notifications
            </AppText>
          </View>

          <CustomSwitch value={muteGroup} onValueChange={onChangeMute} />
        </View>
      </View>
    </>
  );
};

export default React.memo(GroupNotificationsCard);
