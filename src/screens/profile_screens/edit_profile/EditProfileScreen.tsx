import React, { useCallback, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppSelect,
  AppText,
} from '../../../components';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import { radius } from '../../../theme/radius';
import { Camera } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../../../theme/useTheme';
import createStyles from './styles.EditProfile';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { getCurrentUser } from '../../../services/profile';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile, updateProfile } from '../../../store/profileSlice';

const dateToCalendarString = (value: string): string | undefined => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const year = Number(match?.[3] ?? isoMatch?.[1]);
  const month = Number(match?.[2] ?? isoMatch?.[2]);
  const day = Number(match?.[1] ?? isoMatch?.[3]);

  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const calendarStringToBirthDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

const getTodayCalendarString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const EditProfileScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goal, setGoal] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const selectedBirthDate = dateToCalendarString(birthDate);
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getCurrentUser()
        .then(user => {
          if (!active) return;
          dispatch(setProfile(user));
          setName(user?.name || '');
          setEmail(user?.email || '');
          setGoal(user?.goal || '');
          setHeight(user?.heightCm == null ? '' : String(user.heightCm));
          setWeight(user?.weightKg == null ? '' : String(user.weightKg));
          setBirthDate(user?.birthDate || '');
          setProfileImageUrl(user?.profileImageUrl || '');
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [dispatch]),
  );
  const handleChooseImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperToolbarTitle: 'Crop Profile Photo',
        width: 500,
        height: 500,
        compressImageQuality: 0.8,
        includeExif: false,
        includeBase64: true,
        freeStyleCropEnabled: false,
      });
      if (!image.data)
        throw new Error(
          'The selected image could not be prepared. Please select it again.',
        );
      setImageBusy(true);
      const mime = image.mime || 'image/jpeg';
      const result = await authenticatedRequest<{
        user: { profileImageUrl?: string };
      }>(
        'POST',
        '/auth/me/profile-image',
        {
          image: `data:${mime};base64,${image.data}`,
        },
        60000,
      );
      setProfileImage('');
      setProfileImageUrl(result.user.profileImageUrl || '');
      dispatch(updateProfile({ profileImageUrl: result.user.profileImageUrl || '' }));
      showAppToast('success', 'Photo saved', 'Your profile photo was updated.');
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }

      showAppToast(
        'error',
        'Image picker',
        apiErrorMessage(error) ||
          error?.message ||
          'Unable to select profile image.',
      );
    } finally {
      setImageBusy(false);
    }
  };

  const saveProfile = async () => {
    try {
      const user = await authenticatedRequest<{
        user: {
          name: string;
          goal?: string;
          heightCm?: number | null;
          weightKg?: number | null;
          birthDate?: string;
        };
      }>('PATCH', '/auth/me', {
        name,
        goal,
        heightCm: height.trim() ? Number(height) : null,
        weightKg: weight.trim() ? Number(weight) : null,
        birthDate,
      });
      setName(user.user.name || '');
      dispatch(updateProfile(user.user));
      showAppToast('success', 'Profile saved', 'Your details are up to date.');
      navigation.goBack();
    } catch (error) {
      showAppToast('error', 'Could not save profile', apiErrorMessage(error));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Edit Profile"
        subtitle="Update your personal details"
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
        showProfile={false}
      />
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
              <Camera size={16} color={colors.textPrimary} strokeWidth={2} />
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
                birthDate ? `Date of birth, ${birthDate}` : 'Choose date of birth'
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
            onPress={() => void saveProfile()}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
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
          <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
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
