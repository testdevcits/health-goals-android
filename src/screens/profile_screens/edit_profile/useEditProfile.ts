import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { getCurrentUser } from '../../../services/profile';
import { saveProfileAnswers } from '../../../services/profileQuestions';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile, updateProfile } from '../../../store/profileSlice';
import type { ProfileScreenNavigation } from '../components/ProfileScreenLayout';

export const dateToCalendarString = (value: string): string | undefined => {
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
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
};

export const calendarStringToBirthDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

export const getTodayCalendarString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`;
};

export const getMaxBirthDateCalendarString = () => {
  const today = new Date();
  const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(max.getDate()).padStart(2, '0')}`;
};

export const isAtLeast18 = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  const year = Number(match?.[3] ?? isoMatch?.[1]);
  const month = Number(match?.[2] ?? isoMatch?.[2]);
  const day = Number(match?.[1] ?? isoMatch?.[3]);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const maxAllowed = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return date <= maxAllowed;
};

const GOAL_VALUES: Record<string, string> = {
  loseweight: 'lose_weight',
  lose_weight: 'lose_weight',
  buildmuscle: 'build_muscle',
  build_muscle: 'build_muscle',
  improvestamina: 'improve_stamina',
  improve_stamina: 'improve_stamina',
  stayactive: 'stay_active',
  stay_active: 'stay_active',
};

export const normalizeProfileGoal = (value?: string) => {
  if (!value) return '';
  return GOAL_VALUES[value.toLowerCase().replace(/\s+/g, '')] || value;
};

export default function useEditProfile(navigation: ProfileScreenNavigation) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const selectedBirthDate = dateToCalendarString(birthDate);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setProfileLoading(true);
    setProfileLoadError('');
    getCurrentUser()
      .then(user => {
        if (!active) return;
        dispatch(setProfile(user));
        setName(user?.name || '');
        setEmail(user?.email || '');
        setGoal(normalizeProfileGoal(user?.goal));
        setHeight(user?.heightCm == null ? '' : String(user.heightCm));
        setWeight(user?.weightKg == null ? '' : String(user.weightKg));
        setBirthDate(user?.birthDate || '');
        setGender(
          user?.gender === 'Woman' || user?.gender === 'Female'
            ? 'Female'
            : user?.gender === 'Man' || user?.gender === 'Male'
            ? 'Male'
            : user?.gender || '',
        );
        setPhone(user?.phone || '');
        setProfileImageUrl(user?.profileImageUrl || '');
      })
      .catch(error => {
        if (active) {
          const message = apiErrorMessage(error);
          setProfileLoadError(message);
          showAppToast('error', 'Could not load profile', message);
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, isFocused, reloadKey]);

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
      if (!image.data) {
        throw new Error(
          'The selected image could not be prepared. Please select it again.',
        );
      }
      setImageBusy(true);
      const mime = image.mime || 'image/jpeg';
      const result = await authenticatedRequest<{
        user: { profileImageUrl?: string };
      }>(
        'POST',
        '/auth/me/profile-image',
        { image: `data:${mime};base64,${image.data}` },
        60000,
      );
      setProfileImage('');
      setProfileImageUrl(result.user.profileImageUrl || '');
      dispatch(
        updateProfile({ profileImageUrl: result.user.profileImageUrl || '' }),
      );
      showAppToast('success', 'Photo saved', 'Your profile photo was updated.');
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') return;
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
    if (phone.trim() && (phone.length < 10 || phone.length > 15)) {
      showAppToast('error', 'Invalid phone number', 'Enter 10–15 digits.');
      return;
    }
    if (birthDate.trim() && !isAtLeast18(birthDate)) {
      showAppToast(
        'error',
        'Invalid date of birth',
        'You must be at least 18 years old.',
      );
      return;
    }
    setSavingProfile(true);
    try {
      await saveProfileAnswers({ gender: gender || null });
      const user = await authenticatedRequest<{
        user: {
          name: string;
          goal?: string;
          heightCm?: number | null;
          weightKg?: number | null;
          birthDate?: string;
          phone?: string;
        };
      }>('PATCH', '/auth/me', {
        name,
        goal,
        heightCm: height.trim() ? Number(height) : null,
        weightKg: weight.trim() ? Number(weight) : null,
        birthDate,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
      setName(user.user.name || '');
      dispatch(updateProfile({ ...user.user, gender }));
      showAppToast('success', 'Profile saved', 'Your details are up to date.');
      navigation.goBack();
    } catch (error) {
      showAppToast('error', 'Could not save profile', apiErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  return {
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
    profileLoading,
    profileLoadError,
    refreshProfile: () => setReloadKey(value => value + 1),
    selectedBirthDate,
    handleChooseImage,
    saveProfile,
  };
}
