import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  AestheticRulerPickerModal,
  AppButton,
  AppErrorView,
  AppHeader,
  AppInput,
  AppLoader,
  AppSelect,
  AppText,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import type { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import {
  AvatarUploader,
  BirthDateCalendarModal,
  BirthDateField,
  HeightWeightFieldRow,
} from './components';
import createStyles from './styles.EditProfile';
import useEditProfile, {
  isAtLeast18,
  isValidHeight,
  isValidWeight,
} from './useEditProfile';

const EditProfileScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const {
    name,
    setName,
    email,
    height,
    setHeight,
    weight,
    setWeight,
    birthDate,
    setBirthDate,
    gender,
    setGender,
    phone,
    setPhone,
    goal,
    setGoal,
    profileImage,
    profileImageUrl,
    imageBusy,
    savingProfile,
    isCalendarVisible,
    setIsCalendarVisible,
    isHeightPickerVisible,
    setIsHeightPickerVisible,
    isWeightPickerVisible,
    setIsWeightPickerVisible,
    profileLoading,
    profileLoadError,
    refreshProfile,
    selectedBirthDate,
    handleChooseImage,
    saveProfile,
  } = useEditProfile(navigation);

  const isInvalidHeight = Boolean(height.trim() && !isValidHeight(height));
  const isInvalidWeight = Boolean(weight.trim() && !isValidWeight(weight));
  const isInvalidBirthDate = Boolean(birthDate.trim() && !isAtLeast18(birthDate));

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Edit Profile"
        subtitle="Update your personal details"
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
        showProfile={false}
      />
      {profileLoading ? (
        <AppLoader message="Loading your profile…" />
      ) : profileLoadError ? (
        <AppErrorView message={profileLoadError} onRefresh={refreshProfile} />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
          <View style={styles.form}>
            <AvatarUploader
              profileImage={profileImage}
              profileImageUrl={profileImageUrl}
              imageBusy={imageBusy}
              onChooseImage={handleChooseImage}
            />

            <AppInput label="Full Name" value={name} onChangeText={setName} />
            <AppInput
              label="Email"
              value={email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.field}>
              <AppText variant="label" secondary mb={6}>
                Gender
              </AppText>
              <AppSelect
                value={gender}
                onSelect={setGender}
                options={[
                  { label: 'Female', value: 'Female' },
                  { label: 'Male', value: 'Male' },
                  { label: 'Non-binary', value: 'Non-binary' },
                  { label: 'Prefer not to say', value: 'Prefer not to say' },
                ]}
              />
            </View>

            <AppInput
              label="Phone number"
              value={phone}
              onChangeText={value =>
                setPhone(value.replace(/\D/g, '').slice(0, 15))
              }
              keyboardType="phone-pad"
              placeholder="10–15 digits"
              error={
                phone.length > 0 && (phone.length < 10 || phone.length > 15)
                  ? 'Enter 10–15 digits'
                  : undefined
              }
            />

            <HeightWeightFieldRow
              height={height}
              weight={weight}
              isInvalidHeight={isInvalidHeight}
              isInvalidWeight={isInvalidWeight}
              onOpenHeightPicker={() => setIsHeightPickerVisible(true)}
              onOpenWeightPicker={() => setIsWeightPickerVisible(true)}
            />

            <BirthDateField
              birthDate={birthDate}
              isInvalidBirthDate={isInvalidBirthDate}
              onOpenCalendar={() => setIsCalendarVisible(true)}
            />

            <View style={styles.field}>
              <AppText variant="label" secondary mb={6}>
                Primary Goal
              </AppText>
              <AppSelect
                value={goal}
                onSelect={setGoal}
                options={[
                  { label: 'Stay active', value: 'stay_active' },
                  { label: 'Lose weight', value: 'lose_weight' },
                  { label: 'Build muscle', value: 'build_muscle' },
                  { label: 'Improve stamina', value: 'improve_stamina' },
                ]}
              />
            </View>

            <AppButton
              title="Save Changes"
              onPress={() => saveProfile()}
              loading={savingProfile}
              disabled={
                savingProfile ||
                isInvalidHeight ||
                isInvalidWeight ||
                isInvalidBirthDate
              }
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      )}

      <BirthDateCalendarModal
        visible={isCalendarVisible}
        selectedBirthDate={selectedBirthDate}
        onSelectBirthDate={setBirthDate}
        onClose={() => setIsCalendarVisible(false)}
      />

      <AestheticRulerPickerModal
        visible={isHeightPickerVisible}
        mode="height"
        value={height}
        min={50}
        max={250}
        onSelect={setHeight}
        onClose={() => setIsHeightPickerVisible(false)}
      />

      <AestheticRulerPickerModal
        visible={isWeightPickerVisible}
        mode="weight"
        value={weight}
        min={30}
        max={200}
        onSelect={setWeight}
        onClose={() => setIsWeightPickerVisible(false)}
      />
    </View>
  );
};

export default EditProfileScreen;
