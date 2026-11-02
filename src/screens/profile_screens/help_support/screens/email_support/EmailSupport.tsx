import { View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../../navigations/ProfileStack';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailSupport'>;

const EmailSupport: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title="Email Support"
        subtitle="Help & Support"
        onBackPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default EmailSupport;
