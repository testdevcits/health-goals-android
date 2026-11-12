import { TextInput, Alert } from 'react-native';
import { useRef, useState } from 'react';
import { GOOGLE_WEB_CLIENT_ID } from '../../../services/googleConfig';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { requestLogin, signInWithGoogle } from '../../../services/auth';

// ── Validators ────────────────────────────────────────────────────────────
const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return 'Enter a valid email address';
  return '';
};

const validatePassword = (v: string): string => {
  if (!v) return 'Password is required';
  if (v.length < 6) return 'Password must be at least 6 characters';
  return '';
};

const useLogin = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setErrors({ email: emailErr, password: passErr });
    return !emailErr && !passErr;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const challenge = await requestLogin(email, password);
      navigation.navigate('VerifyEmail', {
        challengeId: challenge?.challengeId,
        email,
        purpose: 'login',
        deliveryMode: challenge?.deliveryMode,
      });
    } catch (error) {
      showAppToast('error', 'Sign in failed', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        'Google sign-in unavailable',
        'Google sign-in is not configured for this build.',
      );
      return;
    }
    setLoading(true);
    try {
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const result = await GoogleSignin.signIn();
      if (result.type !== 'success' || !result.data.idToken) return;
      await signInWithGoogle(result.data.idToken);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabNavigation' }] });
    } catch (error) {
      showAppToast('error', 'Google sign-in failed', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleSignIn,
    handleGoogleSignIn,
    passwordRef,

    validateEmail,
    validatePassword,
    setErrors,
  };
};

export default useLogin;
