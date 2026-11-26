import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { RefreshCw, Watch } from 'lucide-react-native';
import { AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { readHealthConnectWearableSources } from '../../../../services/healthConnect';
import type { HealthConnectWearableSource } from '../../../../services/healthConnect';
import { useFocusEffect } from '@react-navigation/native';

const formatLastSeen = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const HealthConnectSourcesCard: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const [sources, setSources] = useState<HealthConnectWearableSource[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSources = useCallback(async () => {
    setLoading(true);
    try {
      setSources(await readHealthConnectWearableSources());
    } catch (error) {
      console.warn('Could not read Health Connect wearable sources:', error);
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshSources();
    }, [refreshSources]),
  );

  return (
    <ProfileCard>
      <View style={{ gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Watch size={18} color={colors.primary} />
            <AppText variant="subtitle2" bold>
              Watch data in Health Connect
            </AppText>
          </View>
          <Pressable
            onPress={() => void refreshSources()}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Refresh watch data sources"
            hitSlop={8}
            style={{ padding: spacing.xs }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <RefreshCw size={16} color={colors.primary} />
            )}
          </Pressable>
        </View>

        {loading && sources.length === 0 ? (
          <AppText variant="caption" secondary>
            Checking recent Health Connect records…
          </AppText>
        ) : sources.length === 0 ? (
          <AppText variant="caption" secondary>
            No recent watch records found. Sync your watch in its companion app
            and make sure it shares data with Health Connect.
          </AppText>
        ) : (
          sources.map(source => {
            const deviceName = [source.manufacturer, source.model]
              .filter(Boolean)
              .join(' ');
            const lastSeen = formatLastSeen(source.latestRecordAt);
            return (
              <View
                key={source.id}
                style={{
                  padding: spacing.md,
                  borderRadius: radius.md,
                  backgroundColor: colors.backgroundSecondary,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="body2" bold>
                  {deviceName || 'Wearable model not reported'}
                </AppText>
                <AppText variant="caption" secondary>
                  Source app: {source.appName}
                </AppText>
                <AppText variant="caption" secondary>
                  Data: {source.dataTypes.join(', ')}
                  {lastSeen ? ` · Latest record ${lastSeen}` : ''}
                </AppText>
              </View>
            );
          })
        )}
        <AppText variant="caption" secondary>
          Device model appears only when the watch or companion app includes it
          in Health Connect records.
        </AppText>
      </View>
    </ProfileCard>
  );
};

export default React.memo(HealthConnectSourcesCard);
