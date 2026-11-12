// src/screens/ForgotPassword/ForgotPasswordScreen.tsx
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppButton, AppHeader, AppInput, AppText } from '../../../components';
import { createForgotPasswordStyles } from './styles.ForgotPassword';
import useForgotPassword from './useForgotPassword';
import AppIcon from '../../../assets/appicon/AppIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createForgotPasswordStyles(theme);

  const {
    email,
    setEmail,
    error,
    setError,
    loading,
    handleSend,
    validateEmail,
  } = useForgotPassword({ navigation });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Forgot Password"
        showNotifications={false}
        showProfile={false}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Illustration & Info */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <AppIcon
                name="LockKeyhole"
                size={34}
                color={colors.primary}
                strokeWidth={2}
              />
            </View>
            <AppText variant="h2" center mb={6} bold>
              Forgot Password
            </AppText>
            <AppText
              variant="body2"
              secondary
              center
              style={styles.subtitleText}
            >
              Enter your registered email address and we will send you a verification code to reset your password.
            </AppText>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <AppInput
              label="Email address"
              placeholder="name@example.com"
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
              title="Send Verification Code"
              onPress={handleSend}
              loading={loading}
              disabled={loading}
              style={styles.sendButton}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
              style={styles.backRow}
              accessibilityRole="button"
              accessibilityLabel="Back to Sign In"
            >
              <AppIcon
                name="ArrowLeft"
                size={18}
                color={colors.textSecondary}
              />
              <AppText variant="body2" secondary>
                Remember your password?{' '}
                <AppText variant="body2" primary bold>
                  Sign In
                </AppText>
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
