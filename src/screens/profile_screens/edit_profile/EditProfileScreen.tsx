import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
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
import { apiErrorMessage } from '../../../services/api';

const EditProfileScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goal, setGoal] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  useFocusEffect(useCallback(() => {
    let active = true;
    authenticatedRequest<{ user: { name?: string; email?: string; goal?: string; heightCm?: number | null; weightKg?: number | null; birthDate?: string; profileImageUrl?: string } }>('GET', '/auth/me')
      .then(({ user }) => {
        if (!active) return;
        setName(user?.name || '');
        setEmail(user?.email || '');
        setGoal(user?.goal || '');
        setHeight(user?.heightCm == null ? '' : String(user.heightCm));
        setWeight(user?.weightKg == null ? '' : String(user.weightKg));
        setBirthDate(user?.birthDate || '');
        setProfileImageUrl(user?.profileImageUrl || '');
      })
      .catch(() => {});
    return () => { active = false; };
  }, []));
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
      if (!image.data) throw new Error('The selected image could not be prepared. Please select it again.');
      setImageBusy(true);
      const mime = image.mime || 'image/jpeg';
      const result = await authenticatedRequest<{ user: { profileImageUrl?: string } }>('POST', '/auth/me/profile-image', {
        image: `data:${mime};base64,${image.data}`,
      }, 60000);
      setProfileImage('');
      setProfileImageUrl(result.user.profileImageUrl || '');
      Alert.alert('Photo saved', 'Your photo was uploaded to Cloudinary.');
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }

      Alert.alert(
        'Image Picker',
        apiErrorMessage(error) || error?.message || 'Unable to select profile image.',
      );
    } finally {
      setImageBusy(false);
    }
  };

  const saveProfile = async () => {
    try {
      const user = await authenticatedRequest<{ user: { name: string; goal?: string; heightCm?: number | null; weightKg?: number | null; birthDate?: string } }>('PATCH', '/auth/me', {
        name,
        goal,
        heightCm: height.trim() ? Number(height) : null,
        weightKg: weight.trim() ? Number(weight) : null,
        birthDate,
      });
      setName(user.user.name || '');
      Alert.alert('Profile saved', 'Your profile details are updated.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save profile', apiErrorMessage(error));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Edit Profile"
        subtitle="Update your personal details"
        onBackPress={() => navigation.goBack()}
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
            onPress={() => void saveProfile()}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
