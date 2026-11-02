import { View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../../navigations/ProfileStack';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityGuidelines'>;

const CommunityGuidelines: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title="Community Guidelines"
        subtitle="Community Guidelines by Vitality"
        onBackPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default CommunityGuidelines;
