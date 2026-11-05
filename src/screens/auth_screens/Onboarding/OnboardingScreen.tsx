import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/AppNavigation';
import {
  AppButton,
  AppInput,
  AppText,
  CustomSwitch,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createOnboardingStyles } from './styles.Onboarding';
import { featureList, goals, workoutStyles } from './const';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createOnboardingStyles(theme);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    goal: 'Lose weight',
    workoutStyle: 'Home workout',
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step]);

  const stepTitle =
    step === 0
      ? 'Welcome to Vitality'
      : step === 1
      ? 'Tell us about you'
      : step === 2
      ? 'Pick your focus'
      : 'Ready to go';

  const stepSubtitle =
    step === 0
      ? 'Build healthy routines with real momentum.'
      : step === 1
      ? 'A few details help us personalize your experience.'
      : step === 2
      ? 'Choose your goals and preferred workout style.'
      : 'Allow a few permissions so your wellness plan feels smarter.';

  const isStepValid =
    step === 0 ||
    (step === 1 && form.name.trim().length > 1 && form.age.trim().length > 0) ||
    (step === 2 && form.goal && form.workoutStyle) ||
    step === 3;

  const goNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }

    handleComplete();
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 900);
    });
    setLoading(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goBack} disabled={step === 0}>
            <AppText
              variant="body2"
              color={step === 0 ? 'textTertiary' : 'primary'}
              style={styles.backText}
            >
              {step === 0 ? 'Skip' : 'Back'}
            </AppText>
          </TouchableOpacity>

          <AppText variant="label" secondary>
            {step + 1}/{totalSteps}
          </AppText>
        </View>

        <View style={styles.progressWrap}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>

        <View style={styles.titleWrap}>
          <AppText variant="h2" bold>
            {stepTitle}
          </AppText>
          <AppText variant="body2" secondary style={styles.subtitle}>
            {stepSubtitle}
          </AppText>
        </View>

        {step === 0 ? (
          <View style={styles.welcomeCard}>
            <View
              style={[
                styles.emojiBox,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <AppText style={styles.emoji}>💪</AppText>
            </View>

            <View style={styles.featureList}>
              {featureList.map(item => (
                <View
                  key={item.title}
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.featureIcon,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <AppText style={styles.featureIconText}>
                      {item.icon}
                    </AppText>
                  </View>
                  <View style={styles.featureTextWrap}>
                    <AppText variant="label" bold>
                      {item.title}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {item.text}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.formCard}>
            <AppInput
              label="Full name"
              placeholder="Alex Johnson"
              value={form.name}
              onChangeText={value => setForm({ ...form, name: value })}
              autoCapitalize="words"
            />
            <AppInput
              label="Age"
              placeholder="28"
              value={form.age}
              onChangeText={value => setForm({ ...form, age: value })}
              keyboardType="number-pad"
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.selectionWrap}>
            <View style={styles.choiceSection}>
              <AppText variant="label" secondary mb={12}>
                Fitness goal
              </AppText>
              <View style={styles.chipGrid}>
                {goals.map(item => {
                  const selected = item === form.goal;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setForm({ ...form, goal: item })}
                      activeOpacity={0.8}
                      style={[
                        styles.choiceChip,
                        {
                          backgroundColor: selected
                            ? colors.primaryLight
                            : colors.backgroundSecondary,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                          borderWidth: selected ? 1.5 : 1,
                        },
                      ]}
                    >
                      <AppText
                        variant="body2"
                        color={selected ? 'primary' : 'textPrimary'}
                        bold={selected}
                      >
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.choiceSection}>
              <AppText variant="label" secondary mb={12}>
                Workout style
              </AppText>
              <View style={styles.chipGrid}>
                {workoutStyles.map(item => {
                  const selected = item === form.workoutStyle;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setForm({ ...form, workoutStyle: item })}
                      activeOpacity={0.8}
                      style={[
                        styles.choiceChip,
                        {
                          backgroundColor: selected
                            ? colors.primaryLight
                            : colors.backgroundSecondary,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                          borderWidth: selected ? 1.5 : 1,
                        },
                      ]}
                    >
                      <AppText
                        variant="body2"
                        color={selected ? 'primary' : 'textPrimary'}
                        bold={selected}
                      >
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.permissionCard}>
            <View
              style={[
                styles.summaryBox,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <AppText variant="label" secondary>
                Your setup
              </AppText>
              <AppText variant="h3" mt={8}>
                {form.name || 'Your profile'}
              </AppText>
              <AppText variant="body2" secondary style={styles.summaryText}>
                {form.goal} · {form.workoutStyle}
              </AppText>
            </View>

            <View
              style={[styles.permissionRow, { borderColor: colors.border }]}
            >
              <View style={styles.permissionTextWrap}>
                <AppText variant="label" bold>
                  Push notifications
                </AppText>
                <AppText variant="caption" secondary>
                  Reminders for workouts and challenges
                </AppText>
              </View>
              <CustomSwitch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <View
              style={[styles.permissionRow, { borderColor: colors.border }]}
            >
              <View style={styles.permissionTextWrap}>
                <AppText variant="label" bold>
                  Health sync
                </AppText>
                <AppText variant="caption" secondary>
                  Connect movement and wellness data
                </AppText>
              </View>
              <CustomSwitch
                value={healthSyncEnabled}
                onValueChange={setHealthSyncEnabled}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            title={step === totalSteps - 1 ? 'Finish setup' : 'Continue'}
            onPress={goNext}
            loading={loading}
            disabled={!isStepValid || loading}
            style={styles.primaryButton}
          />

          {step < totalSteps - 1 ? (
            <AppButton
              title="Skip for now"
              onPress={() => setStep(Math.min(step + 1, totalSteps - 1))}
              variant="ghost"
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default OnboardingScreen;
