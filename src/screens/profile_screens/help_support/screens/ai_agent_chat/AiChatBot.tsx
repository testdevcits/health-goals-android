import { View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../../navigations/ProfileStack';

type Props = NativeStackScreenProps<RootStackParamList, 'AiChatBot'>;

const AiChatBot: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title="AI Legal Assistant"
        subtitle="Answers on privacy, terms & health data"
        onBackPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default AiChatBot;
