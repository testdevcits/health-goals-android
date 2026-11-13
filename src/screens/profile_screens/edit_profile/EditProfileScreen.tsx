import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  AppButton,
  AppErrorView,
  AppHeader,
  AppInput,
  AppLoader,
  AppSelect,
  AppText,
  AestheticRulerPickerModal,
} from '../../../components';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import { radius } from '../../../theme/radius';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.EditProfile';
import useEditProfile, {
  calendarStringToBirthDate,
  getMaxBirthDateCalendarString,
  isAtLeast18,
  isValidHeight,
  isValidWeight,
} from './useEditProfile';
import { showAppToast } from '../../../utils/appToast';
import AppIcon from '../../../assets/appicon/AppIcon';

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
            <View style={styles.profileImageContainer}>
              {profileImage || profileImageUrl ? (
                <Image
                  source={{ uri: profileImage || profileImageUrl }}
                  style={[styles.profileImage, { borderRadius: radius.full }]}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    {
                      borderRadius: radius.full,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.surfaceElevated,
                    },
                  ]}
                >
                  <AppIcon
                    name="UserRound"
                    size={42}
                    color={colors.textSecondary}
                  />
                </View>
              )}

              <Pressable
                onPress={handleChooseImage}
                style={[
                  styles.cameraButton,
                  imageBusy && { opacity: 0.6 },
                ]}
                hitSlop={8}
                disabled={imageBusy}
                accessibilityState={{ busy: imageBusy }}
              >
                {imageBusy ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <AppIcon
                    name="Camera"
                    size={16}
                    color={colors.textPrimary}
                    strokeWidth={2}
                  />
                )}
              </Pressable>
            </View>
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
            <View style={[styles.twoColumns, styles.field]}>
              <View style={styles.column}>
                <AppText variant="label" secondary mb={6}>
                  Height (cm)
                </AppText>
                <Pressable
                  onPress={() => setIsHeightPickerVisible(true)}
                  style={[
                    styles.pickerField,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: isInvalidHeight
                        ? colors.error
                        : colors.inputBorder,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    height ? `Height, ${height} centimeters` : 'Select height'
                  }
                >
                  <AppText
                    variant="body2"
                    color={height ? 'textPrimary' : 'textTertiary'}
                  >
                    {height ? `${height} cm` : 'Select height'}
                  </AppText>
                  <AppIcon
                    name="ChevronDown"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {isInvalidHeight ? (
                  <AppText variant="caption" error mt={4}>
                    Height must be 50–300 cm
                  </AppText>
                ) : null}
              </View>

              <View style={styles.column}>
                <AppText variant="label" secondary mb={6}>
                  Weight (kg)
                </AppText>
                <Pressable
                  onPress={() => setIsWeightPickerVisible(true)}
                  style={[
                    styles.pickerField,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: isInvalidWeight
                        ? colors.error
                        : colors.inputBorder,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    weight ? `Weight, ${weight} kilograms` : 'Select weight'
                  }
                >
                  <AppText
                    variant="body2"
                    color={weight ? 'textPrimary' : 'textTertiary'}
                  >
                    {weight ? `${weight} kg` : 'Select weight'}
                  </AppText>
                  <AppIcon
                    name="ChevronDown"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {isInvalidWeight ? (
                  <AppText variant="caption" error mt={4}>
                    Weight must be 20–500 kg
                  </AppText>
                ) : null}
              </View>
            </View>
            <View style={styles.field}>
              <AppText variant="label" secondary mb={6}>
                Date of Birth
              </AppText>
              <Pressable
                onPress={() => setIsCalendarVisible(true)}
                style={[
                  styles.dateField,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: isInvalidBirthDate
                      ? colors.error
                      : colors.inputBorder,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  birthDate
                    ? `Date of birth, ${birthDate}`
                    : 'Choose date of birth'
                }
              >
                <AppText
                  variant="body2"
                  color={
                    birthDate
                      ? isInvalidBirthDate
                        ? 'error'
                        : 'textPrimary'
                      : 'textTertiary'
                  }
                >
                  {birthDate || 'Select date of birth'}
                </AppText>
                <AppIcon
                  name="Calendar"
                  size={18}
                  color={
                    isInvalidBirthDate ? colors.error : colors.textSecondary
                  }
                />
              </Pressable>
              {isInvalidBirthDate ? (
                <AppText variant="caption" error mt={4}>
                  You must be at least 18 years old
                </AppText>
              ) : null}
            </View>
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
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View style={styles.calendarOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsCalendarVisible(false)}
            accessibilityLabel="Close date picker"
          />
          <View
            style={[styles.calendarCard, { backgroundColor: colors.surface }]}
          >
            <AppText variant="h3" style={styles.calendarTitle}>
              Date of Birth
            </AppText>
            <Calendar
              current={selectedBirthDate || getMaxBirthDateCalendarString()}
              maxDate={getMaxBirthDateCalendarString()}
              minDate="1900-01-01"
              markedDates={{
                ...(selectedBirthDate
                  ? {
                    [selectedBirthDate]: {
                      selected: true,
                      selectedColor: colors.primary,
                    },
                  }
                  : {}),
              }}
              onDayPress={day => {
                const formatted = calendarStringToBirthDate(day.dateString);
                if (!isAtLeast18(formatted)) {
                  showAppToast(
                    'error',
                    'Invalid date of birth',
                    'You must be at least 18 years old.',
                  );
                  return;
                }
                setBirthDate(formatted);
                setIsCalendarVisible(false);
              }}
              theme={{
                backgroundColor: colors.surface,
                calendarBackground: colors.surface,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textTertiary,
                monthTextColor: colors.textPrimary,
                arrowColor: colors.primary,
              }}
            />
            <AppButton
              title="Close"
              variant="outline"
              onPress={() => setIsCalendarVisible(false)}
              style={styles.calendarCloseButton}
            />
          </View>
        </View>
      </Modal>
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
