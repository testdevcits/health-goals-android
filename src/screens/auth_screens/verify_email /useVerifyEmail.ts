import { useState } from 'react';
import { apiErrorMessage } from '../../../services/api';
import { verifyEmailCode } from '../../../services/auth';
import { CommonActions } from '@react-navigation/native';

const useVerifyEmail = ({ navigation, route }: any) => {
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
  return {
    setOtp,
    otp,
    loading,
    error,
    verify,
    setError,
  };
};

export default useVerifyEmail;
