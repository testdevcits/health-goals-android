// src/screens/Register/RegisterScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import {
  AppText,
  AppInput,
  AppButton,
  AppCheckbox,
  AppSelect,
  SelectOption,
} from '../../../components';
import { createRegisterStyles } from './styles.Register';
import { requestRegistration } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

// ── Options ────────────────────────────────────────────────────────────────
const GOAL_OPTIONS: SelectOption[] = [
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

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const styles = createRegisterStyles(theme);

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
        challengeId: challenge.challengeId,
        email,
        purpose: 'register',
        deliveryMode: challenge.deliveryMode,
      });
    } catch (error) {
      showAppToast('error', 'Account creation failed', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, styles.scrollContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo ── */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>💚</Text>
          </View>
          <AppText variant="h2" center mb={4}>
            Join Vitality
          </AppText>
          <AppText variant="body2" secondary center>
            Start your health journey today
          </AppText>
        </View>

        {/* ── Form ── */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <AppInput
            label="Full Name"
            placeholder="Alex Johnson"
            value={fullName}
            onChangeText={t => {
              setFullName(t);
              if (errors.fullName)
                setErrors(e => ({ ...e, fullName: validators.fullName(t) }));
            }}
            error={errors.fullName}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          {/* Email */}
          <AppInput
            ref={emailRef}
            label="Email"
            placeholder="you@company.com"
            value={email}
            onChangeText={t => {
              setEmail(t);
              if (errors.email)
                setErrors(e => ({ ...e, email: validators.email(t) }));
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {/* Password */}
          <AppInput
            ref={passwordRef}
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={t => {
              setPassword(t);
              if (errors.password)
                setErrors(e => ({ ...e, password: validators.password(t) }));
            }}
            error={errors.password}
            isPassword
            returnKeyType="next"
            onSubmitEditing={() => companyRef.current?.focus()}
          />

          {/* Company Code + Goal row */}
          <View style={styles.row}>
            <AppInput
              ref={companyRef}
              label="Company Code"
              placeholder="Optional"
              value={companyCode}
              onChangeText={setCompanyCode}
              autoCapitalize="characters"
              returnKeyType="done"
              containerStyle={styles.halfContainer}
            />
            <AppSelect
              label="Goal"
              value={goal}
              options={GOAL_OPTIONS}
              onSelect={v => {
                setGoal(v);
                if (errors.goal)
                  setErrors(e => ({ ...e, goal: validators.goal(v) }));
              }}
              placeholder="Select"
              error={errors.goal}
              containerStyle={styles.halfContainer}
            />
          </View>

          {/* Terms */}
          <AppCheckbox
            checked={termsAccepted}
            onChange={v => {
              setTermsAccepted(v);
              if (errors.terms) setErrors(e => ({ ...e, terms: '' }));
            }}
            error={errors.terms}
            containerStyle={styles.termsRow}
            label={
              <View style={styles.termsLinkRow}>
                <AppText variant="body2" secondary>
                  I agree to the{' '}
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText variant="body2" link>
                    Terms of Service
                  </AppText>
                </TouchableOpacity>
                <AppText variant="body2" secondary>
                  {' '}
                  and{' '}
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText variant="body2" link>
                    Privacy Policy
                  </AppText>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Create Account */}
          <AppButton
            title="Create Account"
            onPress={handleCreate}
            loading={loading}
            style={styles.createButton}
          />

          {/* Sign In footer */}
          <View style={styles.footer}>
            <AppText variant="body2" secondary>
              Already have an account?{'  '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AppText variant="body2" link bold>
                Sign in
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
