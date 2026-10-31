import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';

const CommunityGuidelines = ({ navigation }: any) => {
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

const styles = StyleSheet.create({});
