import { useState } from 'react';
import { Alert } from 'react-native';
import { resetPassword } from '../../../services/auth';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

interface UseResetPasswordProps {
  navigation: any;
  challengeId: string;
  otp: string;
}

const useResetPassword = ({
  navigation,
  challengeId,
  otp,
}: UseResetPasswordProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmError('');
    }

    return isValid;
  };

  const handleReset = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(challengeId, otp, password);
      showAppToast(
        'success',
        'Password reset successfully',
        'You can now sign in with your new password.',
      );
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Password reset failed', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    confirmError,
    loading,
    handleReset,
  };
};

export default useResetPassword;
