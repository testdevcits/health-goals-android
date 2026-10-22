// src/screens/LoginScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigation';
import { useTheme } from '../theme/useTheme';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ─── Validation helpers ────────────────────────────────────────────────────
const validateEmail = (v: string) => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email';
  return '';
};

const validatePassword = (v: string) => {
  if (!v) return 'Password is required';
  if (v.length < 6) return 'Password must be at least 6 characters';
  return '';
};
// ──────────────────────────────────────────────────────────────────────────

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, radius } = theme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setErrors({ email: emailErr, password: passErr });
    return !emailErr && !passErr;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    // navigate to home after success…
  };

  const Divider = () => (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      <Text style={[typography.caption, { color: colors.textSecondary, marginHorizontal: spacing.md }]}>
        OR
      </Text>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Header / Logo ── */}
        <View style={[styles.header, { marginTop: spacing.xxxl }]}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.primary, borderRadius: radius.xl },
            ]}>
            <Text style={styles.iconEmoji}>💚</Text>
          </View>
          <Text style={[typography.headline2, { color: colors.textPrimary, marginTop: spacing.md }]}>
            Vitality
          </Text>
          <Text style={[typography.body2, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            Your health, your crew, your momentum
          </Text>
        </View>

        {/* ── Form ── */}
        <View style={{ marginTop: spacing.xxl }}>
          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={t => {
              setEmail(t);
              if (errors.email) setErrors(e => ({ ...e, email: validateEmail(t) }));
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <AppInput
            ref={passwordRef}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={t => {
              setPassword(t);
              if (errors.password) setErrors(e => ({ ...e, password: validatePassword(t) }));
            }}
            error={errors.password}
            isPassword
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{ alignSelf: 'flex-end', marginTop: -spacing.sm, marginBottom: spacing.base }}>
            <Text style={[typography.label, { color: colors.primary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={{ marginBottom: spacing.lg }}
          />

          <Divider />

          {/* Social sign-in */}
          <AppButton
            title="Continue with Apple"
            onPress={() => { }}
            variant="outline"
            leftIcon={<Text style={{ fontSize: 18 }}>🍎</Text>}
            style={{ marginBottom: spacing.md }}
          />
          <AppButton
            title="Continue with Google"
            onPress={() => { }}
            variant="outline"
            leftIcon={<Text style={{ fontSize: 18 }}>🔵</Text>}
          />

          {/* Sign-up link */}
          <View style={[styles.footer, { marginTop: spacing.xl }]}>
            <Text style={[typography.body2, { color: colors.textSecondary }]}>
              New here?{' '}
            </Text>
            <TouchableOpacity onPress={() => { }}>
              <Text style={[typography.body2, { color: colors.primary, fontWeight: '600' }]}>
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
