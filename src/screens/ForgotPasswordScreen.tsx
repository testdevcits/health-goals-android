// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigation';
import { useTheme } from '../theme/useTheme';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const validateEmail = (v: string) => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email';
  return '';
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, radius } = theme;

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[styles.header, { marginTop: spacing.xxxl }]}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: '#F5A623', borderRadius: radius.xl },
            ]}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>

          <Text
            style={[
              typography.headline2,
              { color: colors.textPrimary, marginTop: spacing.md },
            ]}>
            Reset Password
          </Text>

          <Text
            style={[
              typography.body2,
              {
                color: colors.textSecondary,
                marginTop: spacing.sm,
                textAlign: 'center',
                maxWidth: 280,
              },
            ]}>
            Enter the email linked to your account and we'll send you a secure reset link.
          </Text>
        </View>

        {/* Form */}
        <View style={{ marginTop: spacing.xxl }}>
          {sent ? (
            <View style={[styles.successBox, { backgroundColor: colors.inputBg, borderRadius: radius.lg }]}>
              <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: spacing.sm }}>
                📩
              </Text>
              <Text
                style={[
                  typography.subtitle,
                  { color: colors.textPrimary, textAlign: 'center' },
                ]}>
                Check your inbox!
              </Text>
              <Text
                style={[
                  typography.body2,
                  { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
                ]}>
                We sent a password reset link to{'\n'}{email}
              </Text>
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
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />

              <AppButton
                title="Send Reset Link"
                onPress={handleSend}
                loading={loading}
                style={{ marginTop: spacing.xs }}
              />
            </>
          )}

          {/* Back to sign in */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backRow, { marginTop: spacing.xl }]}>
            <Text style={[typography.body2, { color: colors.primary }]}>
              ← Back to sign in
            </Text>
          </TouchableOpacity>
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
  successBox: {
    padding: 24,
    alignItems: 'center',
  },
  backRow: {
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;
