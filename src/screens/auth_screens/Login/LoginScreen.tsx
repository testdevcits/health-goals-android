// src/screens/Login/LoginScreen.tsx
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
import { AppText, AppInput, AppButton } from '../../../components';
import { createLoginStyles } from './styles.Login';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ── Validators ────────────────────────────────────────────────────────────
const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email address';
  return '';
};

const validatePassword = (v: string): string => {
  if (!v) return 'Password is required';
  if (v.length < 6) return 'Password must be at least 6 characters';
  return '';
};
// ─────────────────────────────────────────────────────────────────────────

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const styles = createLoginStyles(theme);

  const [email, setEmail] = useState('alex.johnson@company.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setErrors({ email: emailErr, password: passErr });
    return !emailErr && !passErr;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r:any )=> setTimeout(r, 1400));
    setLoading(false);
    navigation.navigate('MainTabNavigation');
    // TODO: navigate to Home
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
        {/* ── Logo & Title ── */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>💚</Text>
          </View>
          <AppText variant="h2" center mb={4}>
            Vitality
          </AppText>
          <AppText variant="body2" secondary center>
            Your health, your crew, your momentum
          </AppText>
        </View>

        {/* ── Form ── */}
        <View style={styles.formSection}>
          <AppInput
            label="Email"
            placeholder="alex@example.com"
            value={email}
            onChangeText={t => {
              setEmail(t);
              if (errors.email)
                setErrors(e => ({ ...e, email: validateEmail(t) }));
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
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
              if (errors.password)
                setErrors(e => ({ ...e, password: validatePassword(t) }));
            }}
            error={errors.password}
            isPassword
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotRow}
          >
            <AppText variant="label" link>
              Forgot password?
            </AppText>
          </TouchableOpacity>

          {/* Sign In */}
          <AppButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={styles.signInButton}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <AppText variant="caption" secondary style={styles.dividerText}>
              OR
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <AppButton
            title="Continue with Apple"
            onPress={() => {}}
            variant="outline"
            leftIcon={<Text style={{ fontSize: 18 }}>🍎</Text>}
            style={styles.socialButton}
          />
          <AppButton
            title="Continue with Google"
            onPress={() => {}}
            variant="outline"
            leftIcon={<Text style={{ fontSize: 18 }}>🔵</Text>}
          />

          {/* Create account */}
          <View style={styles.footer}>
            <AppText variant="body2" secondary>
              New here?{'  '}
            </AppText>
            <TouchableOpacity
            // onPress={() => { navigation.navigate('Register') }}
            >
              <AppText variant="body2" link bold>
                Create an account
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
