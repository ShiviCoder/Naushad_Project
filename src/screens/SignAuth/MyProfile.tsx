import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  BackHandler,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const MyProfile = () => {
  const [filePath, setFilePath] = useState<any>({});
  const [imageModal, setImageModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    fullName: '',
    email: '',
    gender: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    dob: '',
    referal: '',
  });
  const [errorState, setErrorState] = useState({
    fullName: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'error', 'confirm'
    buttons: [] as Array<{ text: string; onPress: () => void; style?: string }>,
  });
  const [imageSourceModal, setImageSourceModal] = useState(false);

  const navigation = useNavigation();
  const { theme } = useTheme();

  // Custom popup functions
  const showPopup = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'confirm' = 'info',
    buttons?: Array<{ text: string; onPress: () => void; style?: string }>,
  ) => {
    const defaultButtons = [
      {
        text: 'OK',
        onPress: () => setPopup({ ...popup, visible: false }),
        style: 'primary',
      },
    ];

    setPopup({
      visible: true,
      title,
      message,
      type,
      buttons: buttons || defaultButtons,
    });
  };

  const hidePopup = () => {
    setPopup({ ...popup, visible: false });
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('userToken');

      if (!storedToken) {
        console.log('❌ No token found');
        showPopup('Error', 'No authentication token found', 'error');
        return;
      }

      console.log(
        '📡 Fetching profile with token:',
        storedToken.substring(0, 20) + '...',
      );

      const response = await fetch(
        'https://naushad.onrender.com/api/auth/profile',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      console.log('📡 API User Response:', json);

      const userData = json.data || json.user || json;
      setUser(userData);
      setToken(storedToken);

      setTempData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        gender: userData.gender || '',
        phoneNumber: userData.phoneNumber || userData.phone || '',
        address: userData.address || '',
        avatar: userData.avatar || userData.image || '',
        dob: userData.dob || '',
        referal: userData.referal || userData.referralCode || '',
      });

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ User profile loaded:', userData);
    } catch (error) {
      console.log('❌ API Fetch Error:', error);
      showPopup('Error', 'Failed to load profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!token) {
      showPopup('Error', 'No authentication token found', 'error');
      return;
    }

    try {
      setUpdating(true);

      const updateData: any = {
        fullName: tempData.fullName.trim(),
        gender: tempData.gender.toLowerCase(),
        address: tempData.address,
        phoneNumber: tempData.phoneNumber,
      };

      console.log('🔄 Updating profile with data:', updateData);

      const response = await fetch(
        'https://naushad.onrender.com/api/auth/profile-update',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );

      const json = await response.json();
      console.log('📡 PUT API Response:', json);

      if (response.ok) {
        console.log('✅ Update successful! Response:', json);
        showPopup(
          'Success',
          'Profile updated successfully!\n\nNote: If changes are not reflected, please re-login to the app.',
          'success',
          [
            {
              text: 'OK',
              onPress: () => {
                hidePopup();
                setEditModal(false);
                fetchUserProfile();
              },
              style: 'primary',
            },
          ],
        );
      } else {
        showPopup('Error', json.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.log('❌ Update API Error:', error);
      showPopup(
        'Error',
        'Failed to update profile. Please try again.',
        'error',
      );
    } finally {
      setUpdating(false);
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    if (!token) {
      showPopup('Error', 'No authentication token found', 'error');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      console.log('📤 Uploading profile image...');

      const response = await fetch(
        'https://naushad.onrender.com/api/auth/profile-update',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const json = await response.json();
      console.log('📡 Image Upload Response:', json);

      if (response.ok) {
        console.log('✅ Image upload successful!');
        showPopup('Success', 'Profile image updated successfully!', 'success');
        fetchUserProfile();
      } else {
        showPopup('Error', json.message || 'Failed to upload image', 'error');
      }
    } catch (error) {
      console.log('❌ Image Upload Error:', error);
      showPopup('Error', 'Failed to upload image. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const openEditModal = useCallback(() => {
    if (user) {
      setTempData({
        fullName: user.fullName || '',
        email: user.email || '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        address: user.address || '',
        avatar: user.avatar || user.image || '',
        dob: user.dob || '',
        referal: user.referal || user.referralCode || '',
      });
    }
    setEditModal(true);
    setHasSubmitted(false);
    setErrorState({ fullName: false });
    setErrorMessages({ fullName: '' });
  }, [user]);

  const validateForm = useCallback(() => {
    const errors = { fullName: false };
    const messages = { fullName: '' };

    if (!tempData.fullName.trim()) {
      errors.fullName = true;
      messages.fullName = 'Full name is required';
    } else if (tempData.fullName.trim().split(/\s+/).length < 2) {
      errors.fullName = true;
      messages.fullName = 'Please enter your full name';
    }

    if (!tempData.gender) {
      // gender validation separately
    }

    setErrorState(errors);
    setErrorMessages(messages);
    return !Object.values(errors).some(Boolean);
  }, [tempData.fullName, tempData.gender]);

  const handleSave = () => {
    setHasSubmitted(true);

    if (!tempData.fullName.trim()) {
      setErrorState({ fullName: true });
      setErrorMessages({ fullName: 'Full name is required' });
      return;
    } else if (tempData.fullName.trim().split(/\s+/).length < 2) {
      setErrorState({ fullName: true });
      setErrorMessages({ fullName: 'Please enter your full name' });
      return;
    }

    if (!tempData.gender) {
      showPopup('Error', 'Please select your gender', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    updateProfile();
  };

  const showImageSourceOptions = () => {
    // Use native Alert for better compatibility
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => openCamera(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => openImageLibraryPicker(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    const options: any = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      saveToPhotos: true,
      cameraType: 'front',
      presentationStyle: 'fullScreen',
      includeBase64: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error Code: ', response.errorCode);
        console.log('Camera Error Message: ', response.errorMessage);
        showPopup(
          'Error',
          `Failed to take photo: ${response.errorMessage}`,
          'error',
        );
      } else if (response.assets && response.assets[0]?.uri) {
        const selectedImage = response.assets[0];
        handleImageSelected(selectedImage);
      } else {
        console.log('Camera: No image returned');
        showPopup('Error', 'No image captured. Please try again.', 'error');
      }
    });
  };

  const openImageLibraryPicker = () => {
    // Use proper configuration to open gallery/photos app
    const options: any = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      selectionLimit: 1,
      includeBase64: false,
      // Add these options to ensure proper gallery opening
      presentationStyle: 'fullScreen',
      // For Android specifically
      ...(Platform.OS === 'android' && {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      }),
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error Code: ', response.errorCode);
        console.log('ImagePicker Error Message: ', response.errorMessage);

        // Handle permission errors gracefully
        if (
          response.errorCode === 'permission' ||
          response.errorMessage?.includes('permission')
        ) {
          showPopup(
            'Permission Required',
            'Please grant permission to access photos in your device settings.',
            'error',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    // For iOS
                    Linking.openURL('app-settings:');
                  } else {
                    // For Android
                    Linking.openSettings();
                  }
                },
                style: 'primary',
              },
              {
                text: 'Cancel',
                onPress: () => hidePopup(),
                style: 'cancel',
              },
            ],
          );
        } else {
          showPopup(
            'Error',
            `Failed to select image: ${response.errorMessage}`,
            'error',
          );
        }
      } else if (response.assets && response.assets[0]?.uri) {
        const selectedImage = response.assets[0];
        handleImageSelected(selectedImage);
      } else {
        console.log('ImagePicker: No image returned');
        showPopup('Error', 'No image selected. Please try again.', 'error');
      }
    });
  };

  const handleImageSelected = (selectedImage: any) => {
    setFilePath(selectedImage);
    setTempData(prev => ({ ...prev, avatar: selectedImage.uri }));

    if (selectedImage.uri) {
      uploadProfileImage(selectedImage.uri);
    }
  };

  const chooseImage = () => {
    showImageSourceOptions();
  };

  const getGenderDisplayText = (gender: string | undefined | null) => {
    if (!gender) return 'Not selected';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const getBorderColor = (
    field: keyof typeof errorState,
    fieldValue: string,
  ) => {
    return errorState[field] && (hasSubmitted || fieldValue.trim())
      ? '#FF4444'
      : COLORS.primary;
  };

  const ErrorMessage = ({
    message,
    field,
  }: {
    message: string;
    field: keyof typeof errorMessages;
  }) => {
    if (!errorState[field] || !(hasSubmitted || errorMessages[field]))
      return null;
    return <Text style={styles.errorText}>{message}</Text>;
  };

  const handleCopyReferral = () => {
    const code = user?.referal || user?.referralCode || '';
    if (!code) {
      showPopup('Info', 'No referral code available', 'info');
      return;
    }
    Clipboard.setString(code);
    showPopup('Copied', 'Referral code copied to clipboard', 'success');
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme?.background || '#fff' },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderInfoRow = (icon: string, label: string, value: string) => (
    <View style={styles.infoRow}>
      <Icon
        name={icon}
        size={22}
        color={COLORS.primary}
        style={{ marginTop: hp('0.5%') }}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Not available'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <Head title="My Profile" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <TouchableOpacity onPress={() => setImageModal(true)}>
              {uploadingImage ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : (
                <Image
                  style={styles.profilePic}
                  source={
                    filePath.uri
                      ? { uri: filePath.uri }
                      : user?.avatar &&
                        user?.avatar !== '' &&
                        user?.avatar !== 'null'
                      ? { uri: user.avatar }
                      : user?.image &&
                        user?.image !== '' &&
                        user?.image !== 'null'
                      ? { uri: user.image }
                      : require('../../assets/user.png')
                  }
                />
              )}
            </TouchableOpacity>

            {/* Centered Camera Icon */}
            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={chooseImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <View style={styles.cameraIconCenter}>
                  <Icon name="camera" size={wp('5%')} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.fullName || 'Your Name'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'yourmail@email.com'}
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={openEditModal}
              activeOpacity={0.7}
            >
              <Icon name="create-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {renderInfoRow('person-outline', 'Full Name', user?.fullName)}
          {renderInfoRow('mail-outline', 'Email', user?.email)}
          {renderInfoRow(
            'male-female-outline',
            'Gender',
            getGenderDisplayText(user?.gender),
          )}
          {renderInfoRow(
            'call-outline',
            'Phone',
            user?.phoneNumber || user?.phone,
          )}
          {renderInfoRow('calendar-outline', 'Date of Birth', user?.dob)}
          {renderInfoRow('location-outline', 'Address', user?.address)}

          {/* Referral Code at last with copy icon */}
          <View style={styles.infoRow}>
            <Icon
              name="gift-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginTop: hp('0.5%') }}
            />
            <View
              style={[
                styles.infoTextContainer,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View style={{ flex: 1, paddingRight: wp('2%') }}>
                <Text style={styles.label}>Referral Code</Text>
                <Text style={styles.value}>
                  {user?.referal || user?.referralCode || 'Not available'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCopyReferral}
                activeOpacity={0.7}
                style={styles.copyIconWrapper}
              >
                <Image
                  source={require('../../assets/copy.png')}
                  style={styles.copyIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={imageModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setImageModal(false)}
          />
          <Image
            style={styles.fullImage}
            resizeMode="contain"
            source={
              filePath.uri
                ? { uri: filePath.uri }
                : user?.avatar && user?.avatar !== '' && user?.avatar !== 'null'
                ? { uri: user.avatar }
                : user?.image && user?.image !== '' && user?.image !== 'null'
                ? { uri: user.image }
                : require('../../assets/user.png')
            }
          />
          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setImageModal(false)}
          />
        </View>
      </Modal>

      {/* Edit Profile Popup */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.popupScroll}
              contentContainerStyle={styles.popupScrollContent}
            >
              {/* Profile Image in Popup */}
              <View style={styles.popupProfileSection}>
                <TouchableOpacity
                  onPress={chooseImage}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <View
                      style={[
                        styles.popupProfilePic,
                        styles.uploadingContainer,
                      ]}
                    >
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                  ) : (
                    <Image
                      style={styles.popupProfilePic}
                      source={
                        tempData.avatar
                          ? { uri: tempData.avatar }
                          : require('../../assets/user.png')
                      }
                    />
                  )}
                  {!uploadingImage && (
                    <View style={styles.popupCameraContainer}>
                      <Icon name="camera" size={wp('4%')} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.popupProfileText}>Tap to change photo</Text>
              </View>

              {/* Full Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Full Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  value={tempData.fullName}
                  onChangeText={text => {
                    setTempData({ ...tempData, fullName: text });
                    if (errorState.fullName) {
                      setErrorState({ ...errorState, fullName: false });
                      setErrorMessages({ ...errorMessages, fullName: '' });
                    }
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#aaa"
                  style={[
                    styles.formInput,
                    {
                      borderColor: getBorderColor(
                        'fullName',
                        tempData.fullName,
                      ),
                    },
                  ]}
                  autoFocus={false}
                />
                <ErrorMessage
                  message={errorMessages.fullName}
                  field="fullName"
                />
              </View>

              {/* Email (read-only) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  value={tempData.email}
                  onChangeText={text =>
                    setTempData({ ...tempData, email: text })
                  }
                  placeholder="Enter email"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.disabledInput]}
                  editable={false}
                  keyboardType="email-address"
                />
              </View>

              {/* Gender */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Gender <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Text style={styles.genderCurrentSelection} />
                <View style={styles.genderContainer}>
                  {['male', 'female', 'other'].map(gender => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        tempData.gender === gender && styles.genderSelected,
                      ]}
                      onPress={() =>
                        setTempData({ ...tempData, gender: gender })
                      }
                    >
                      <Text
                        style={[
                          styles.genderText,
                          tempData.gender === gender &&
                            styles.genderTextSelected,
                        ]}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Phone (editable, key phoneNumber) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  value={tempData.phoneNumber}
                  onChangeText={text =>
                    setTempData({ ...tempData, phoneNumber: text })
                  }
                  placeholder="Enter phone number"
                  placeholderTextColor="#aaa"
                  style={styles.formInput}
                  keyboardType="phone-pad"
                />
              </View>

              {/* DOB (read-only display) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date of Birth</Text>
                <TextInput
                  value={tempData.dob}
                  editable={false}
                  placeholder="Date of Birth"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.disabledInput]}
                />
              </View>

              {/* Address */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  value={tempData.address}
                  onChangeText={text =>
                    setTempData({ ...tempData, address: text })
                  }
                  placeholder="Enter your address"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              {/* Referral Code (read-only display) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Referral Code</Text>
                <TextInput
                  value={tempData.referal}
                  editable={false}
                  placeholder="Referral Code"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.disabledInput]}
                />
              </View>
            </ScrollView>

            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
                disabled={updating}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!tempData.fullName?.trim() ||
                    !tempData.gender ||
                    updating) &&
                    styles.saveBtnDisabled,
                ]}
                onPress={handleSave}
                disabled={
                  !tempData.fullName?.trim() || !tempData.gender || updating
                }
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveTextBtn}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Popup Modal */}
      <Modal
        visible={popup.visible}
        transparent
        animationType="fade"
        onRequestClose={hidePopup}
      >
        <TouchableOpacity
          style={styles.customPopupOverlay}
          activeOpacity={1}
          onPress={hidePopup}
        >
          <View
            style={styles.customPopupContainer}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={[
                styles.customPopupHeader,
                popup.type === 'success' && styles.customPopupHeaderSuccess,
                popup.type === 'error' && styles.customPopupHeaderError,
                popup.type === 'info' && styles.customPopupHeaderInfo,
              ]}
            >
              {popup.type === 'success' && (
                <Icon name="checkmark-circle" size={30} color="#fff" />
              )}
              {popup.type === 'error' && (
                <Icon name="alert-circle" size={30} color="#fff" />
              )}
              {popup.type === 'info' && (
                <Icon name="information-circle" size={30} color="#fff" />
              )}
              <Text style={styles.customPopupTitle}>{popup.title}</Text>
            </View>

            <View style={styles.customPopupContent}>
              <Text style={styles.customPopupMessage}>{popup.message}</Text>

              {popup.type === 'success' && popup.title === 'Success' && (
                <View style={styles.noteContainer}>
                  <Icon
                    name="information-circle-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.noteText}>
                    Note: If changes are not reflected, please re-login to the
                    app.
                  </Text>
                </View>
              )}

              <View style={styles.customPopupButtons}>
                {popup.buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.customPopupButton,
                      button.style === 'primary' &&
                        styles.customPopupButtonPrimary,
                      button.style === 'cancel' &&
                        styles.customPopupButtonCancel,
                    ]}
                    onPress={() => {
                      hidePopup();
                      button.onPress();
                    }}
                  >
                    <Text
                      style={[
                        styles.customPopupButtonText,
                        button.style === 'primary' &&
                          styles.customPopupButtonTextPrimary,
                        button.style === 'cancel' &&
                          styles.customPopupButtonTextCancel,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: moderateScale(20),
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('5%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: wp('4%'),
    color: '#666',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: hp('5%'),
    paddingTop: hp('3%'),
    paddingHorizontal: wp('4%'),
  },
  profileImageWrapper: {
    width: wp('32%'),
    height: wp('32%'),
    borderRadius: wp('16%'),
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.primary,
    elevation: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: 'relative',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: wp('16%'),
  },
  uploadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: wp('16%'),
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconCenter: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  userName: {
    fontSize: wp('5.5%'),
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  userEmail: {
    fontSize: wp('4%'),
    color: '#666',
    marginTop: hp('0.5%'),
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    marginHorizontal: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '20',
    paddingBottom: hp('1.2%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: COLORS.primary,
  },
  editButton: {
    padding: wp('2.5%'),
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2.5%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    backgroundColor: '#f8f9fa',
    borderRadius: wp('2%'),
  },
  infoTextContainer: {
    marginLeft: wp('4%'),
    flex: 1,
    paddingVertical: hp('0.5%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: hp('0.3%'),
  },
  value: {
    fontSize: wp('4.2%'),
    color: '#333',
    fontWeight: '500',
    lineHeight: hp('2.5%'),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: wp('90%'),
    height: hp('70%'),
    borderRadius: 16,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('2%'),
  },
  popupContainer: {
    width: '100%',
    maxWidth: wp('96%'),
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: hp('85%'),
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  popupTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: COLORS.primary,
  },
  popupScroll: {
    paddingHorizontal: wp('5%'),
  },
  popupScrollContent: {
    paddingBottom: wp('5%'),
  },
  popupProfileSection: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  popupProfilePic: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  popupCameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: wp('7%'),
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
    elevation: 4,
  },
  popupProfileText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('1%'),
  },
  formGroup: {
    marginBottom: hp('2%'),
  },
  formLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  requiredStar: {
    color: COLORS.primary,
    fontSize: wp('4%'),
  },
  formInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: wp('3.5%'),
    fontSize: wp('4%'),
    color: '#000',
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: hp('10%'),
    textAlignVertical: 'top',
    borderColor: '#ddd',
  },
  errorText: {
    fontSize: wp('3%'),
    color: '#FF4444',
    marginTop: hp('0.2%'),
    marginBottom: hp('0.8%'),
    fontWeight: '500',
  },
  genderCurrentSelection: {
    fontSize: wp('3.8%'),
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: hp('0%'),
    fontStyle: 'italic',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0%'),
  },
  genderOption: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    marginHorizontal: wp('1%'),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: wp('4%'),
    color: '#666',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: wp('3%'),
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: hp('2.2%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: hp('2.2%'),
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelText: {
    color: '#666',
    fontWeight: '700',
    fontSize: wp('4%'),
  },
  saveTextBtn: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('4%'),
  },
  copyIconWrapper: {
    padding: wp('1.5%'),
  },
  copyIcon: {
    width: wp('6%'),
    height: wp('6%'),
    tintColor: COLORS.primary,
  },
  // Custom Popup Styles
  customPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  customPopupContainer: {
    width: '100%',
    maxWidth: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  customPopupHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  customPopupHeaderSuccess: {
    backgroundColor: '#4CAF50',
  },
  customPopupHeaderError: {
    backgroundColor: '#F44336',
  },
  customPopupHeaderInfo: {
    backgroundColor: '#2196F3',
  },
  customPopupTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#fff',
    marginLeft: wp('2%'),
  },
  customPopupContent: {
    padding: wp('5%'),
  },
  customPopupMessage: {
    fontSize: wp('4%'),
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('2%'),
    lineHeight: hp('2.5%'),
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E9',
    padding: wp('3%'),
    borderRadius: 8,
    marginBottom: hp('3%'),
  },
  noteText: {
    fontSize: wp('3.5%'),
    color: '#2E7D32',
    marginLeft: wp('2%'),
    flex: 1,
    fontStyle: 'italic',
  },
  customPopupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  customPopupButton: {
    flex: 1,
    paddingVertical: hp('1.8%'),
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  customPopupButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  customPopupButtonCancel: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  customPopupButtonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#666',
  },
  customPopupButtonTextPrimary: {
    color: '#fff',
  },
  customPopupButtonTextCancel: {
    color: '#666',
  },
});

export default MyProfile;
