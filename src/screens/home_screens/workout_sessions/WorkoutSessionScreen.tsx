import React, { useCallback, useMemo } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import { AppButton, AppHeader, ConfirmationModal } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createWorkoutSessionStyles } from './styles.WorkoutSession';
import { activities } from './workoutSessionHelpers';
import useWorkoutSession from './useWorkoutSession';
import MetricCard from './components/MetricCard';
import ActivitySelector from './components/ActivitySelector';
import WorkoutHero from './components/WorkoutHero';
import WorkoutControls from './components/WorkoutControls';
import WorkoutCelebrationModal from './components/WorkoutCelebrationModal';

type Props = NativeStackScreenProps<HomeStackParamList, 'WorkoutSession'>;

const WorkoutSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createWorkoutSessionStyles(colors), [colors]);

  const {
    currentActivity,
    elapsedSeconds,
    isRunning,
    hasStarted,
    distanceKm,
    calories,
    avgPace,
    confirmation,
    setConfirmation,
    savingWorkout,
    completedWorkout,
    closeCelebration,
    handleConfirmationAction,
    handleStartPause,
    handleSelectActivity,
    handleFinish,
    handleBack,
  } = useWorkoutSession(navigation, route.params);

  const handleCloseConfirmation = useCallback(() => {
    if (!savingWorkout) {
      setConfirmation(null);
    }
  }, [savingWorkout, setConfirmation]);

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <AppHeader
        title="Workout"
        subtitle="Track your session"
        onBackPress={handleBack}
      />

      <ConfirmationModal
        visible={confirmation !== null}
        onClose={handleCloseConfirmation}
        title={confirmation?.title}
        message={confirmation?.message}
        position="center"
        showCloseButton={false}
      >
        {confirmation?.actions.map(action => (
          <AppButton
            key={action.label}
            title={action.label}
            variant={action.variant ?? 'primary'}
            loading={action.label === 'Finish & Save' && savingWorkout}
            disabled={savingWorkout}
            onPress={() => handleConfirmationAction(action)}
            style={[
              styles.modalActionButton,
              action.destructive && styles.destructiveActionButton,
            ]}
          />
        ))}
      </ConfirmationModal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ActivitySelector
          activities={activities}
          currentActivityId={currentActivity.id}
          onSelectActivity={handleSelectActivity}
          styles={styles}
          colors={colors}
        />

        <WorkoutHero
          currentActivity={currentActivity}
          isRunning={isRunning}
          hasStarted={hasStarted}
          elapsedSeconds={elapsedSeconds}
          styles={styles}
          colors={colors}
        />

        <View style={styles.metricsGrid}>
          <MetricCard
            emoji="📏"
            value={distanceKm.toFixed(2)}
            unit="km"
            label="Distance"
            tint={colors.primaryLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="🔥"
            value={String(calories)}
            unit="kcal"
            label="Calories"
            tint={colors.warningLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="❤️"
            value="--"
            unit="bpm"
            label="Heart rate"
            tint={colors.errorLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="⚡"
            value={avgPace}
            unit={avgPace !== '--' ? '/km' : undefined}
            label="Avg pace"
            tint={colors.infoLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
        </View>

        <WorkoutControls
          isRunning={isRunning}
          hasStarted={hasStarted}
          activityColor={currentActivity.color}
          textColor={colors.textPrimary}
          savingWorkout={savingWorkout}
          onStartPause={handleStartPause}
          onFinish={handleFinish}
          styles={styles}
        />
      </ScrollView>

      {/* Workout Celebration Confetti Modal */}
      <WorkoutCelebrationModal
        visible={completedWorkout !== null}
        data={completedWorkout}
        onClose={closeCelebration}
      />
    </View>
  );
};

export default WorkoutSessionScreen;
