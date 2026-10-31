import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';

const EmailSupport = ({ navigation }: any) => {
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

const styles = StyleSheet.create({});
