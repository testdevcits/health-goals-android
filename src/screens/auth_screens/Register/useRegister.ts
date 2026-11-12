import { TextInput } from 'react-native';
import { useRef, useState } from 'react';
import { SelectOption } from '../../../components';
import { requestRegistration } from '../../../services/auth';
import { showAppToast } from '../../../utils/appToast';
import { apiErrorMessage } from '../../../services/api';

// ── Options ────────────────────────────────────────────────────────────────
export const GOAL_OPTIONS: SelectOption[] = [
  { label: 'Lose weight', value: 'lose_weight' },
  { label: 'Build muscle', value: 'build_muscle' },
  { label: 'Stay active', value: 'stay_active' },
  { label: 'Improve sleep', value: 'improve_sleep' },
  { label: 'Train for an event', value: 'train_event' },
];

// ── Validators ─────────────────────────────────────────────────────────────
const validators = {
  fullName: (v: string) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  },
  email: (v: string) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
      return 'Enter a valid email address';
    return '';
  },
  password: (v: string) => {
    if (!v) return 'Password is required';
    if (v.length < 8) return 'Password must be at least 8 characters';
    return '';
  },
  goal: (v: string) => (!v ? 'Please select a goal' : ''),
};
// ──────────────────────────────────────────────────────────────────────────

const useRegister = ({ navigation }: { navigation: any }) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [goal, setGoal] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    goal: '',
    terms: '',
  });

  // Refs for focus chaining
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const next = {
      fullName: validators.fullName(fullName),
      email: validators.email(email),
      password: validators.password(password),
      goal: validators.goal(goal),
      terms: termsAccepted ? '' : 'You must agree to continue',
    };
    setErrors(next);
    return Object.values(next).every(e => e === '');
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const challenge = await requestRegistration(
        fullName,
        email,
        password,
        companyCode,
        goal,
      );
      navigation.navigate('VerifyEmail', {
        challengeId: challenge?.challengeId,
        email,
        purpose: 'register',
        deliveryMode: challenge?.deliveryMode,
      });
    } catch (error) {
      showAppToast('error', 'Account creation failed', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    companyCode,
    setCompanyCode,
    goal,
    termsAccepted,
    loading,
    errors,
    setErrors,
    emailRef,
    passwordRef,
    companyRef,
    validate,
    handleCreate,
    validators,
    setGoal,
    setTermsAccepted,
  };
};

export default useRegister;
