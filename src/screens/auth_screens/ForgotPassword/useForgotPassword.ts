import { Alert } from 'react-native';
import { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';

const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email address';
  return '';
};

const useForgotPassword = ({ navigation }: any) => {
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
    } catch (e) {
      Alert.alert('Could not request reset', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert(
        'Check the code',
        'Enter the 6-digit reset code from your email.',
      );
      return;
    }
    if (password.length < 8) {
      Alert.alert(
        'Choose a stronger password',
        'Password must be at least 8 characters.',
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Re-enter the same password in both fields.',
      );
      return;
    }
    setLoading(true);
    try {
      await resetPassword(challengeId, otp, password);
      Alert.alert(
        'Password updated',
        'You can now sign in with your new password.',
        [{ text: 'Sign in', onPress: () => navigation.navigate('Login') }],
      );
    } catch (e) {
      Alert.alert('Password reset failed', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };
  return {
    email,
    setEmail,
    error,
    setError,
    loading,
    setLoading,
    sent,
    setSent,
    challengeId,
    setChallengeId,
    developmentCode,
    setDevelopmentCode,
    otp,
    setOtp,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSend,
    handleReset,
    validateEmail,
  };
};

export default useForgotPassword;
