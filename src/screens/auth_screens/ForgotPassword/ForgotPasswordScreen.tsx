// src/screens/ForgotPassword/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
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
import { AppText, AppInput, AppButton } from '../../../components';
import { createForgotPasswordStyles } from './styles.ForgotPassword';

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

  const handleSend = async () => {
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    await new Promise((r: any) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
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
            Enter the email linked to your account and we'll send you a secure
            reset link.
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
              <AppText variant="body2" secondary center>
                We sent a password reset link to{'\n'}
                <AppText variant="body2" primary bold>
                  {email}
                </AppText>
              </AppText>
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
                title="Send Reset Link"
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
