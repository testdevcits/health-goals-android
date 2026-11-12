import { useState } from 'react';
import { Alert } from 'react-native';
import { requestPasswordReset } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';

const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email address';
  return '';
};

interface UseForgotPasswordProps {
  navigation: any;
}

const useForgotPassword = ({ navigation }: UseForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const challenge = await requestPasswordReset(email);
      const challengeId = challenge?.challengeId || '';
      navigation.navigate('VerifyResetOtp', {
        challengeId,
        email: email.trim(),
      });
    } catch (e) {
      Alert.alert('Could not request reset', apiErrorMessage(e));
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
    handleSend,
    validateEmail,
  };
};

export default useForgotPassword;
