import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppText } from '../../../components';
import {
  ProfileScreen,
  ProfileScreenNavigation,
} from '../components/ProfileScreenLayout';

const ChangePasswordScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (password.length < 8) {
      Alert.alert(
        'Password too short',
        'Choose a password with at least 8 characters.',
      );
      return;
    }
    if (password !== confirm) {
      Alert.alert(
        'Passwords do not match',
        'Re-enter your new password and try again.',
      );
      return;
    }
    Alert.alert('Password updated', 'Your password has been changed.');
    setCurrent('');
    setPassword('');
    setConfirm('');
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
        />
        <AppInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          placeholder="At least 8 characters"
          autoCapitalize="none"
        />
        <AppInput
          label="Confirm New Password"
          value={confirm}
          onChangeText={setConfirm}
          isPassword
          placeholder="Re-enter new password"
          autoCapitalize="none"
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
  form: { paddingTop: 16 },
  updateButton: { width: '100%', borderRadius: 14 },
  hint: { marginTop: 8 },
});

export default ChangePasswordScreen;
