import React, { useRef } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppText } from '../../../../components';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../theme/useTheme';
import { formatTime } from '../workoutSessionHelpers';

interface WorkoutSummaryData {
  activityName: string;
  activityEmoji: string;
  durationSeconds: number;
  calories: number;
  distanceKm: number;
}

interface Props {
  visible: boolean;
  data: WorkoutSummaryData | null;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WorkoutCelebrationModal: React.FC<Props> = ({
  visible,
  data,
  onClose,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius, fonts } = theme;
  const insets = useSafeAreaInsets();
  const cannonRef = useRef<ConfettiCannon | null>(null);

  if (!data) return null;

  const handleShare = async () => {
    try {
      const shareMessage = `🔥 I just crushed a ${data?.activityName
        } workout on Vitality!\n\n⏱️ Duration: ${formatTime(
          data?.durationSeconds,
        )}\n🔥 Calories: ${data?.calories} kcal${data?.distanceKm > 0 ? `\n📍 Distance: ${data?.distanceKm.toFixed(2)} km` : ''
        }\n\nTrack your fitness with me on Vitality! 🏃‍♂️💪`;

      await Share.share({
        message: shareMessage,
        title: 'Workout Completed!',
      });
    } catch {
      // User dismissed share dialog
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti blast from top center */}
        <ConfettiCannon
          ref={cannonRef}
          count={50}
          origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
          autoStart
          fadeOut
          fallSpeed={2800}
          colors={[
            colors.primary,
            colors.coral,
            '#FFD700',
            '#00C6A2',
            '#3B82F6',
            '#EC4899',
          ]}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              padding: spacing.xl,
              paddingBottom: Math.max(insets.bottom, spacing.xl),
            },
          ]}
        >
          {/* Top Trophy & Emoji */}
          <View
            style={[
              styles.trophyContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <AppText variant='body1' style={styles.activityEmoji}>{data?.activityEmoji}</AppText>
          </View>

          <AppText variant="h2" center bold mt={spacing.md}>
            Workout Completed!
          </AppText>
          <AppText variant="body2" secondary center mt={spacing.xs}>
            Great job! Your {data?.activityName.toLowerCase()} session has been saved.
          </AppText>

          {/* Stats Grid */}
          <View
            style={[
              styles.statsGrid,
              {
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.lg,
                padding: spacing.md,
                marginTop: spacing.lg,
              },
            ]}
          >
            {/* Duration */}
            <View style={styles.statBox}>
              <AppText variant="caption" secondary>
                Duration
              </AppText>
              <AppText
                variant="subtitle1"
                bold
                style={{ fontFamily: fonts.bold, marginTop: 2 }}
              >
                {formatTime(data?.durationSeconds)}
              </AppText>
            </View>

            <View
              style={[styles.verticalDivider, { backgroundColor: colors.border }]}
            />

            {/* Calories */}
            <View style={styles.statBox}>
              <AppText variant="caption" secondary>
                Calories
              </AppText>
              <AppText
                variant="subtitle1"
                bold
                style={{
                  fontFamily: fonts.bold,
                  color: colors.coral,
                  marginTop: 2,
                }}
              >
                {data?.calories}{' '}
                <AppText variant="caption" secondary>
                  kcal
                </AppText>
              </AppText>
            </View>

            {data?.distanceKm > 0 && (
              <>
                <View
                  style={[
                    styles.verticalDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
                {/* Distance */}
                <View style={styles.statBox}>
                  <AppText variant="caption" secondary>
                    Distance
                  </AppText>
                  <AppText
                    variant="subtitle1"
                    bold
                    style={{
                      fontFamily: fonts.bold,
                      color: colors.primary,
                      marginTop: 2,
                    }}
                  >
                    {data?.distanceKm.toFixed(2)}{' '}
                    <AppText variant="caption" secondary>
                      km
                    </AppText>
                  </AppText>
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={[styles.actions, { marginTop: spacing.xl }]}>
            {/* Share Button */}
            <Pressable
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share your workout"
              style={({ pressed }) => [
                styles.shareButton,
                {
                  backgroundColor: colors.primaryLight,
                  borderRadius: radius.md,
                  borderColor: colors.primary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <AppIcon name="Share2" size={18} color={colors.primary} />
              <AppText
                variant="label"
                bold
                primary
                style={{ marginLeft: spacing.xs }}
              >
                Share Achievement
              </AppText>
            </Pressable>

            {/* Done / Continue Button */}
            <AppButton
              title="Continue"
              onPress={onClose}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  trophyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {

  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
  },
  actions: {
    width: '100%',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    borderWidth: 1,
  },
});

export default WorkoutCelebrationModal;
