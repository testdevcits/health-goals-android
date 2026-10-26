import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppSelect, AppText } from '../../../components';
import {
  ProfileScreen,
  ProfileScreenNavigation,
} from '../components/ProfileScreenLayout';

const EditProfileScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@company.com');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('74');
  const [birthDate, setBirthDate] = useState('18/04/1992');
  const [goal, setGoal] = useState('Stay active');

  return (
    <ProfileScreen
      navigation={navigation}
      title="Edit Profile"
      subtitle="Update your personal details"
    >
      <View style={styles.form}>
        <AppInput label="Full Name" value={name} onChangeText={setName} />
        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.twoColumns}>
          <AppInput
            containerStyle={styles.column}
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            error={
              parseInt(height) < 50 || parseInt(height) > 300
                ? 'Height must be between 50 and 300 cm'
                : undefined
            }
          />
          <AppInput
            containerStyle={styles.column}
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            error={
              parseInt(weight) < 20 || parseInt(weight) > 500
                ? 'Weight must be between 20 and 500 kg'
                : undefined
            }
          />
        </View>
        <AppInput
          label="Date of Birth"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD/MM/YYYY"
          error={
            birthDate && !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)
              ? 'Please enter a valid date (DD/MM/YYYY)'
              : undefined
          }
        />
        <View style={styles.field}>
          <AppText variant="label" secondary mb={6}>
            Primary Goal
          </AppText>
          <AppSelect
            value={goal}
            onSelect={setGoal}
            options={[
              { label: 'Stay active', value: 'Stay active' },
              { label: 'Lose weight', value: 'Lose weight' },
              { label: 'Build strength', value: 'Build strength' },
              { label: 'Improve fitness', value: 'Improve fitness' },
            ]}
          />
        </View>
        <AppButton
          title="Save Changes"
          onPress={() =>
            Alert.alert(
              'Profile updated',
              'Your personal details have been saved.',
            )
          }
          style={styles.saveButton}
        />
      </View>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  form: { paddingTop: 16 },
  twoColumns: { flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  field: { marginBottom: 16 },
  saveButton: { width: '100%', borderRadius: 14, marginTop: 2 },
});

export default EditProfileScreen;
