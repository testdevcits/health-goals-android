import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigations/AppNavigation';
import { AppButton, AppInput, AppText } from '../../components';
import { useTheme } from '../../theme/useTheme';
import { apiErrorMessage } from '../../services/api';
import { verifyEmailCode } from '../../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await verifyEmailCode(route.params.challengeId, otp);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabNavigation' }] }));
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 42 }}>📩</Text>
          <AppText variant="h2" center mb={8}>Verify your email</AppText>
          <AppText variant="body2" secondary center>
            Enter the 6-digit code sent to {route.params.email || 'your email'}.
          </AppText>
          {route.params.deliveryMode === 'development' && <AppText variant="caption" secondary center style={{ marginTop: 8 }}>Development code: 123456</AppText>}
        </View>
        <AppInput label="Verification code" placeholder="000000" value={otp} onChangeText={value => { setOtp(value.replace(/\D/g, '').slice(0, 6)); setError(''); }} keyboardType="number-pad" error={error} />
        <AppButton title="Verify and continue" onPress={verify} loading={loading} style={{ marginTop: 12 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
