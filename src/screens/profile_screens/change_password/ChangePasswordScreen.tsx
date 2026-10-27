import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
  AppButton,
  AppInput,
  AppText,
  ProfileScreen,
} from '../../../components';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';

const ChangePasswordScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);

    if (!current.trim() || !password || !confirm) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    if (password !== confirm) {
      return;
    }

    Alert.alert('Password updated', 'Your password has been changed.');

    setCurrent('');
    setPassword('');
    setConfirm('');
    setSubmitted(false);
  };

  return (
    <ProfileScreen
      navigation={navigation}
      title="Change Password"
      subtitle="Keep your account secure"
    >
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
            (submitted || password.length > 0) && password.length < 8
              ? 'New password must be at least 8 characters'
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
          style={styles.updateButton}
        />

        <AppText variant="caption" secondary center style={styles.hint}>
          Use 8+ characters with a mix of letters, numbers & symbols
        </AppText>
      </View>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 16,
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
