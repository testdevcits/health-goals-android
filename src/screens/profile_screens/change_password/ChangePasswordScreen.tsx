import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppHeader, AppInput, AppText } from '../../../components';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import { useTheme } from '../../../theme/useTheme';
import { apiErrorMessage } from '../../../services/api';
import { changePassword, clearSession } from '../../../services/auth';
import { navigationRef } from '../../../navigations/AppNavigation';
import { useAppDispatch } from '../../../store/hooks';
import { clearProfile } from '../../../store/profileSlice';
import { showAppToast } from '../../../utils/appToast';

const ChangePasswordScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { colors } = theme;
  const submit = async () => {
    if (loading) return;
    setSubmitted(true);

    if (!current.trim() || !password || !confirm) {
      return;
    }

    if (password.length < 8 || password.length > 72) {
      return;
    }

    if (password !== confirm) {
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(current, password);
      if (!result.passwordChanged || !result.requiresSignIn) {
        throw new Error('The server did not confirm the password change.');
      }
      await clearSession();
      dispatch(clearProfile());
      showAppToast(
        'success',
        'Password updated',
        'Please sign in again with your new password.',
      );
      navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      showAppToast('error', 'Could not update password', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Change Password"
        subtitle="Keep your account secure"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.form}>
        <AppInput
          label="Current Password"
          value={current}
          onChangeText={setCurrent}
          isPassword
          autoCapitalize="none"
          error={
            (submitted || current.length > 0) && !current.trim()
              ? 'Current password is required'
              : undefined
          }
        />

        <AppInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          placeholder="At least 8 characters"
          autoCapitalize="none"
          error={
            (submitted || password.length > 0) &&
            (password.length < 8 || password.length > 72)
              ? 'New password must be 8–72 characters'
              : undefined
          }
        />

        <AppInput
          label="Confirm New Password"
          value={confirm}
          onChangeText={setConfirm}
          isPassword
          placeholder="Re-enter new password"
          autoCapitalize="none"
          error={
            (submitted || confirm.length > 0) && confirm !== password
              ? 'Passwords do not match'
              : undefined
          }
        />

        <AppButton
          title="Update Password"
          onPress={submit}
          loading={loading}
          disabled={loading}
          style={styles.updateButton}
        />

        <AppText variant="caption" secondary center style={styles.hint}>
          Use 8+ characters with a mix of letters, numbers & symbols
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 16,
    padding: 16,
  },
  updateButton: {
    width: '100%',
    borderRadius: 14,
  },
  hint: {
    marginTop: 8,
  },
});

export default ChangePasswordScreen;
