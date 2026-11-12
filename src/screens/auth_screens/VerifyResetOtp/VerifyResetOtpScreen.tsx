import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpInput } from 'react-native-otp-entry';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import { AppButton, AppHeader, AppText } from '../../../components';
import { createVerifyResetOtpStyles } from './styles.VerifyResetOtp';
import useVerifyResetOtp from './useVerifyResetOtp';
import AppIcon from '../../../assets/appicon/AppIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyResetOtp'>;

const VerifyResetOtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createVerifyResetOtpStyles(theme);

  const { challengeId, email } = route.params;

  const {
    setOtp,
    error,
    setError,
    resending,
    countdown,
    handleVerify,
    handleResend,
  } = useVerifyResetOtp({ navigation, challengeId, email });

  return (
    <View style={styles.container}>
      <AppHeader
        title="OTP Verification"
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
                name="MailCheck"
                size={34}
                color={colors.primary}
                strokeWidth={2}
              />
            </View>
            <AppText variant="h2" center mb={6} bold>
              OTP Verification
            </AppText>
            <AppText
              variant="body2"
              secondary
              center
              style={styles.subtitleText}
            >
              Enter the 6-digit verification code sent to
            </AppText>
            <View style={styles.emailBadge}>
              <AppText variant="caption" primary bold numberOfLines={1}>
                {email}
              </AppText>
            </View>
          </View>

          {/* Code Input Form */}
          <View style={styles.formSection}>
            <AppText variant="subtitle2" style={styles.codeLabel}>
              Verification code
            </AppText>
            <OtpInput
              numberOfDigits={6}
              type="numeric"
              autoFocus
              onTextChange={value => {
                setOtp(value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
              onFilled={code => handleVerify(code)}
              focusColor={colors.primary}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.otpCell,
                focusedPinCodeContainerStyle: styles.otpCellFocused,
                filledPinCodeContainerStyle: styles.otpCellFilled,
                pinCodeTextStyle: styles.otpText,
                placeholderTextStyle: styles.otpPlaceholder,
              }}
              textInputProps={{
                accessibilityLabel: '6-digit reset password verification code',
              }}
            />

            {error ? (
              <AppText variant="caption" error style={styles.errorText}>
                {error}
              </AppText>
            ) : null}

            <AppButton
              title="Verify Code"
              onPress={() => handleVerify()}
              style={styles.verifyButton}
            />

            <View style={styles.resendSection}>
              <AppText variant="body2" secondary>
                Didn't receive code?
              </AppText>
              {countdown > 0 ? (
                <AppText variant="body2" secondary bold>
                  Resend in {countdown}s
                </AppText>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleResend}
                  disabled={resending}
                  accessibilityRole="button"
                  accessibilityLabel="Resend Code"
                >
                  <AppText variant="body2" primary bold>
                    {resending ? 'Sending...' : 'Resend Code'}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyResetOtpScreen;
