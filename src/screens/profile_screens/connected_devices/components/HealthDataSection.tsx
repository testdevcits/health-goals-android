import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import {
  AppText,
  ProfileCard,
  ProfileListRow,
  ProfileToggleRow,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.ConnectedDevices';
import type { ConnectionState } from '../useConnectedDevices';

interface HealthDataSectionProps {
  autoSyncEnabled: boolean;
  autoSyncLoading: boolean;
  onAutoSyncToggle: (enabled: boolean) => void;
  statusDetail: string;
  actionLabel: string;
  connectionState: ConnectionState;
  errorMessage: string | null;
  onProviderAction: () => void;
  onOpenSettings: () => void;
}

export const HealthDataSection: React.FC<HealthDataSectionProps> = ({
  autoSyncEnabled,
  autoSyncLoading,
  onAutoSyncToggle,
  statusDetail,
  actionLabel,
  connectionState,
  errorMessage,
  onProviderAction,
  onOpenSettings,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);

  return (
    <>
      <AppText
        variant="label"
        color="textTertiary"
        style={[styles.sectionLabel, styles.healthSectionLabel]}
      >
        HEALTH DATA
      </AppText>

      {Platform.OS === 'android' ? (
        <AppText variant="caption" secondary style={styles.errorMessage}>
          Sync your watch with its companion app first, then allow that app to
          share data with Health Connect. Vitality reads the data you approve.
        </AppText>
      ) : null}

      {Platform.OS === 'android' && Number(Platform.Version) >= 34 ? (
        <ProfileCard>
          <ProfileToggleRow
            icon="🔄"
            title="Auto-Sync"
            detail="Sync data in the background every 15 min"
            value={autoSyncEnabled}
            onChange={onAutoSyncToggle}
            disabled={autoSyncLoading}
            last
          />
        </ProfileCard>
      ) : null}

      <View style={styles.spacer} />

      <ProfileCard>
        <ProfileListRow
          icon="❤️"
          title="Health Connect"
          detail={statusDetail}
          action={actionLabel}
          onPress={
            connectionState === 'available' || connectionState === 'error'
              ? onProviderAction
              : undefined
          }
          last
        />
      </ProfileCard>

      {connectionState === 'available' ? (
        <Pressable
          onPress={onOpenSettings}
          style={[
            styles.settingsButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              marginTop: spacing.md,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open Health Connect settings"
        >
          <AppText variant="buttonSm" primary>
            Open Health Connect settings
          </AppText>
        </Pressable>
      ) : null}

      {connectionState === 'unsupported' ? (
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              marginTop: spacing.md,
              padding: spacing.base,
            },
          ]}
        >
          <AppText variant="body2" secondary>
            iPhone health data connection is not configured yet. This screen
            currently connects Android devices through Health Connect.
          </AppText>
        </View>
      ) : null}

      {errorMessage && connectionState !== 'error' ? (
        <AppText variant="caption" error style={styles.errorMessage}>
          {errorMessage}
        </AppText>
      ) : null}
    </>
  );
};
