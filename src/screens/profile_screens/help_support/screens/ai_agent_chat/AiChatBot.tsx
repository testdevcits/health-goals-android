import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AppHeader } from '../../../../../components';

const AiChatBot = ({ navigation }:any) => {
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

const styles = StyleSheet.create({});
