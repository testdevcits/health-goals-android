// src/screens/ForgotPassword/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppText, AppInput, AppButton } from '../../../components';
import { createForgotPasswordStyles } from './styles.ForgotPassword';
import { requestPasswordReset, resetPassword } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email address';
  return '';
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createForgotPasswordStyles(theme);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const [developmentCode, setDevelopmentCode] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSend = async () => {
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const challenge = await requestPasswordReset(email);
      setChallengeId(challenge.challengeId || '');
      setDevelopmentCode(challenge.deliveryMode === 'development');
      setSent(true);
    } catch (e) { Alert.alert('Could not request reset', apiErrorMessage(e)); }
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!/^\d{6}$/.test(otp)) { Alert.alert('Check the code', 'Enter the 6-digit reset code from your email.'); return; }
    if (password.length < 8) { Alert.alert('Choose a stronger password', 'Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { Alert.alert('Passwords do not match', 'Re-enter the same password in both fields.'); return; }
    setLoading(true);
    try {
      await resetPassword(challengeId, otp, password);
      Alert.alert('Password updated', 'You can now sign in with your new password.', [{ text: 'Sign in', onPress: () => navigation.navigate('Login') }]);
    } catch (e) { Alert.alert('Password reset failed', apiErrorMessage(e)); }
    finally { setLoading(false); }
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
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>
          <AppText variant="h2" center mb={8}>
            Reset Password
          </AppText>
          <AppText variant="body2" secondary center style={styles.subtitleText}>
            Enter your account email and we will send a secure reset code.
          </AppText>
        </View>

        {/* ── Body ── */}
        <View style={styles.formSection}>
          {sent ? (
            /* Success State */
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>📩</Text>
              <AppText variant="subtitle1" center mb={8}>
                Check your inbox!
              </AppText>
              {developmentCode && <AppText variant="caption" secondary center style={{ marginTop: 8 }}>Development code: 123456</AppText>}
              <AppText variant="body2" secondary center>
                If an account exists, a reset code was sent to{'\n'}
                <AppText variant="body2" primary bold>
                  {email}
                </AppText>
              </AppText>
              <AppInput label="Reset code" placeholder="000000" value={otp} onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" containerStyle={{ marginTop: 20 }} />
              <AppInput label="New password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} isPassword />
              <AppInput label="Confirm new password" placeholder="Re-enter password" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
              <AppButton title="Reset password" onPress={handleReset} loading={loading} style={styles.sendButton} />
            </View>
          ) : (
            <>
              <AppInput
                label="Email"
                placeholder="you@company.com"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (error) setError(validateEmail(t));
                }}
                error={error}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />

              <AppButton
                title="Send Reset Code"
                onPress={handleSend}
                loading={loading}
                style={styles.sendButton}
              />
            </>
          )}

          {/* Back to sign in */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backRow}
          >
            <AppText variant="body2" link>
              ← Back to sign in
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
