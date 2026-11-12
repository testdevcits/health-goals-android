import React, { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppButton, AppHeader, AppInput, AppText } from '../../../components';
import { createResetPasswordStyles } from './styles.ResetPassword';
import useResetPassword from './useResetPassword';
import AppIcon from '../../../assets/appicon/AppIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createResetPasswordStyles(theme);

  const { challengeId, otp } = route.params;

  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    confirmError,
    loading,
    handleReset,
  } = useResetPassword({ navigation, challengeId, otp });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Reset Password"
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
                name="Lock"
                size={34}
                color={colors.primary}
                strokeWidth={2}
              />
            </View>
            <AppText variant="h2" center mb={6} bold>
              Set New Password
            </AppText>
            <AppText
              variant="body2"
              secondary
              center
              style={styles.subtitleText}
            >
              Your identity has been verified. Create a new, strong password for your account.
            </AppText>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.rulesBox}>
              <AppText variant="caption" secondary bold>
                Password requirements:
              </AppText>
              <AppText variant="caption" secondary>
                • Minimum 8 characters long
              </AppText>
              <AppText variant="caption" secondary>
                • Must match confirm password
              </AppText>
            </View>

            <AppInput
              label="New password"
              placeholder="At least 8 characters"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              isPassword
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <AppInput
              ref={confirmPasswordRef}
              label="Confirm new password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmError}
              isPassword
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />

            <AppButton
              title="Reset Password"
              onPress={handleReset}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPasswordScreen;
