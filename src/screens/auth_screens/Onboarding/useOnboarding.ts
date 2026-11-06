import { useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigations/AppNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const TOTAL_STEPS = 4;

export default function useOnboarding(navigation: Props['navigation']) {
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

  const progress = useMemo(() => ((step + 1) / TOTAL_STEPS) * 100, [step]);
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

  const handleComplete = async () => {
    setLoading(true);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 900);
    });
    setLoading(false);
    navigation.navigate('Login');
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    handleComplete();
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return {
    step,
    setStep,
    form,
    setForm,
    notificationsEnabled,
    setNotificationsEnabled,
    healthSyncEnabled,
    setHealthSyncEnabled,
    loading,
    totalSteps: TOTAL_STEPS,
    progress,
    stepTitle,
    stepSubtitle,
    isStepValid,
    goNext,
    goBack,
  };
}
