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
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppText, AppInput, AppButton } from '../../../components';
import { GoogleIcon } from '../../../assets/images/ImageIndex';
import { createLoginStyles } from './styles.Login';
import { requestLogin, signInWithGoogle } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';
import { GOOGLE_WEB_CLIENT_ID } from '../../../services/googleConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { showAppToast } from '../../../utils/appToast';

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
  const styles = createLoginStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    try {
      const challenge = await requestLogin(email, password);
      navigation.navigate('VerifyEmail', {
        challengeId: challenge.challengeId,
        email,
        purpose: 'login',
        deliveryMode: challenge.deliveryMode,
      });
    } catch (error) {
      showAppToast('error', 'Sign in failed', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        'Google sign-in setup needed',
        'Add the Google Web OAuth client ID in src/services/googleConfig.ts and GOOGLE_CLIENT_ID in the backend environment.',
      );
      return;
    }
    setLoading(true);
    try {
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const result = await GoogleSignin.signIn();
      if (result.type !== 'success' || !result.data.idToken) return;
      await signInWithGoogle(result.data.idToken);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabNavigation' }] });
    } catch (error) {
      showAppToast('error', 'Google sign-in failed', apiErrorMessage(error));
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
          {Platform.OS === 'ios' && (
            <AppButton
              title="Continue with Apple"
              onPress={() => {}}
              variant="outline"
              leftIcon={<Text style={{ fontSize: 18 }}>🍎</Text>}
              style={styles.socialButton}
            />
          )}

          <AppButton
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            leftIcon={
              <Image
                source={GoogleIcon}
                style={styles.googleIcon}
                resizeMode="contain"
                accessible={false}
              />
            }
            style={styles.socialButton}
          />

          {/* Create account */}
          <View style={styles.footer}>
            <AppText variant="body2" secondary>
              New here?{'  '}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}
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
