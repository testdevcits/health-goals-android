import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { requestPasswordReset } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

interface UseVerifyResetOtpProps {
  navigation: any;
  challengeId: string;
  email: string;
}

const useVerifyResetOtp = ({
  navigation,
  challengeId: initialChallengeId,
  email,
}: UseVerifyResetOtpProps) => {
  const [challengeId, setChallengeId] = useState(initialChallengeId);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = (customOtp?: string) => {
    const codeToVerify = (customOtp ?? otp).trim();
    if (!/^\d{6}$/.test(codeToVerify)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    setError('');
    navigation.navigate('ResetPassword', {
      challengeId,
      email,
      otp: codeToVerify,
    });
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      const res = await requestPasswordReset(email);
      if (res?.challengeId) {
        setChallengeId(res.challengeId);
      }
      setCountdown(30);
      setError('');
      showAppToast(
        'info',
        'Verification code resent',
        'A fresh 6-digit code has been sent to your email.',
      );
    } catch (e) {
      Alert.alert('Resend failed', apiErrorMessage(e));
    } finally {
      setResending(false);
    }
  };

  return {
    otp,
    setOtp,
    error,
    setError,
    resending,
    countdown,
    handleVerify,
    handleResend,
  };
};

export default useVerifyResetOtp;
