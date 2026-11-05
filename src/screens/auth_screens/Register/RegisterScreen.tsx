// src/screens/Register/RegisterScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
} from '../../../components';
import { createRegisterStyles } from './styles.Register';

import useRegister, { GOAL_OPTIONS } from './useRegister';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const styles = createRegisterStyles(theme);
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    companyCode,
    goal,
    termsAccepted,
    loading,
    errors,
    setErrors,
    emailRef,
    passwordRef,
    companyRef,

    handleCreate,
    validators,
    setPassword,
    setCompanyCode,
    setGoal,
    setTermsAccepted,
  } = useRegister({ navigation });

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
