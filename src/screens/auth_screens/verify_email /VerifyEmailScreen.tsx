import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { ArrowLeft, MailCheck } from 'lucide-react-native';
import { OtpInput } from 'react-native-otp-entry';
import type { RootStackParamList } from '../../../navigations/AppNavigation';
import { AppButton, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { apiErrorMessage } from '../../../services/api';
import { verifyEmailCode } from '../../../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailCode(route.params.challengeId, otp);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabNavigation' }],
        }),
      );
    } catch (e) {
      setError(apiErrorMessage(e));
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
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MailCheck
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

          {route.params.deliveryMode === 'development' && (
            <View style={styles.developmentNotice}>
              <AppText variant="caption" secondary center>
                Development code: 123456
              </AppText>
            </View>
          )}

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

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: spacing.xl,
    },
    iconContainer: {
      width: 76,
      height: 76,
      borderRadius: radius.xxl,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    description: {
      maxWidth: 300,
      lineHeight: 22,
    },
    email: {
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
    developmentNotice: {
      alignSelf: 'stretch',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
    },
    codeSection: {
      alignSelf: 'stretch',
      marginTop: spacing.sm,
    },
    codeLabel: {
      marginBottom: spacing.md,
    },
    otpContainer: {
      width: '100%',
    },
    otpCell: {
      width: 46,
      height: 56,
      borderRadius: radius.md,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBg,
    },
    otpCellFocused: {
      borderWidth: 1.5,
      backgroundColor: colors.surface,
    },
    otpCellFilled: {
      borderColor: colors.primary,
    },
    otpText: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '600',
    },
    otpPlaceholder: {
      color: colors.textTertiary,
    },
    errorText: {
      marginTop: spacing.sm,
    },
    verifyButton: {
      alignSelf: 'stretch',
      marginTop: spacing.xl,
    },
    helperText: {
      maxWidth: 300,
      lineHeight: 20,
      marginTop: spacing.lg,
    },
  });
};

export default VerifyEmailScreen;
