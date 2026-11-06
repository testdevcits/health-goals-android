import React from 'react';
import {
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
} from '../../../components';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import { radius } from '../../../theme/radius';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.EditProfile';
import useEditProfile, {
  calendarStringToBirthDate,
  getTodayCalendarString,
} from './useEditProfile';
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
    goal,
    setGoal,
    profileImage,
    profileImageUrl,
    imageBusy,
    savingProfile,
    isCalendarVisible,
    setIsCalendarVisible,
    profileLoading,
    profileLoadError,
    refreshProfile,
    selectedBirthDate,
    handleChooseImage,
    saveProfile,
  } = useEditProfile(navigation);

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
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : profileImageUrl
                    ? { uri: profileImageUrl }
                    : {
                        uri: 'https://imgv3.fotor.com/images/slider-image/after-image-generated-by-ai-profile-pictuire-maker-for-mobile.jpg',
                      }
                }
                style={[styles.profileImage, { borderRadius: radius.full }]}
                resizeMode="cover"
              />

              <Pressable
                onPress={handleChooseImage}
                style={styles.cameraButton}
                hitSlop={8}
                disabled={imageBusy}
                accessibilityState={{ busy: imageBusy }}
              >
                <AppIcon
                  name="Camera"
                  size={16}
                  color={colors.textPrimary}
                  strokeWidth={2}
                />
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
                    borderColor: colors.inputBorder,
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
                  color={birthDate ? 'textPrimary' : 'textTertiary'}
                >
                  {birthDate || 'Select date of birth'}
                </AppText>
              </Pressable>
            </View>
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
              onPress={() => saveProfile()}
              loading={savingProfile}
              disabled={savingProfile}
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
              current={selectedBirthDate}
              maxDate={getTodayCalendarString()}
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
                setBirthDate(calendarStringToBirthDate(day.dateString));
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
    </View>
  );
};

export default EditProfileScreen;
