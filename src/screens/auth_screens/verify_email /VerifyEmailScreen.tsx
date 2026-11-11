import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpInput } from 'react-native-otp-entry';
import type { RootStackParamList } from '../../../navigations/AppNavigation';
import { AppButton, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.VerifyEmail';
import useVerifyEmail from './useVerifyEmail';
import AppIcon from '../../../assets/appicon/AppIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { setOtp, loading, error, verify, setError } = useVerifyEmail({
    navigation,
    route,
  });

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon
            name="ChevronLeft"
            size={20}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AppIcon
              name="MailCheck"
              size={32}
              color={theme.colors.primary}
              strokeWidth={1.8}
            />
          </View>

          <AppText variant="h2" center mb={10}>
            Verify your email
          </AppText>
          <AppText variant="body2" secondary center style={styles.description}>
            We sent a 6-digit verification code to
          </AppText>
          <AppText variant="body1" bold center style={styles.email}>
            {route.params.email || 'your email'}
          </AppText>

          {/* {route.params.deliveryMode === 'development' && (
            <View style={styles.developmentNotice}>
              <AppText variant="caption" secondary center>
                Development code: 123456
              </AppText>
            </View>
          )} */}

          <View style={styles.codeSection}>
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
              focusColor={theme.colors.primary}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.otpCell,
                focusedPinCodeContainerStyle: styles.otpCellFocused,
                filledPinCodeContainerStyle: styles.otpCellFilled,
                pinCodeTextStyle: styles.otpText,
                placeholderTextStyle: styles.otpPlaceholder,
              }}
              textInputProps={{
                accessibilityLabel: '6-digit email verification code',
              }}
            />
            {error ? (
              <AppText variant="caption" error style={styles.errorText}>
                {error}
              </AppText>
            ) : null}
          </View>

          <AppButton
            title="Verify and continue"
            onPress={verify}
            loading={loading}
            style={styles.verifyButton}
          />

          <AppText variant="caption" secondary center style={styles.helperText}>
            Check your inbox and spam folder if you don't see the message.
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
