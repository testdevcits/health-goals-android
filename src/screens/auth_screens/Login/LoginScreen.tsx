// src/screens/Login/LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppText, AppInput, AppButton } from '../../../components';
import { GoogleIcon } from '../../../assets/images/ImageIndex';
import { createLoginStyles } from './styles.Login';

import useLogin from './useLogin';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ─────────────────────────────────────────────────────────────────────────

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createLoginStyles(theme);
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleSignIn,
    handleGoogleSignIn,
    passwordRef,
    validateEmail,
    validatePassword,
    setErrors,
  } = useLogin({ navigation });

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
