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
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import Head from "../../components/Head";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const MyProfile = () => {
  const [filePath, setFilePath] = useState({});
  const [imageModal, setImageModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [token, setToken] = useState(null);
  const [tempData, setTempData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    avatar: ""
  });
  const [errorState, setErrorState] = useState({
    fullName: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: "",
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Fetch user data from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("userToken");
      
      if (!storedToken) {
        console.log("❌ No token found");
        return;
      }

      console.log("📡 Fetching profile with token:", storedToken.substring(0, 20) + "...");
      
      const response = await fetch("https://naushad.onrender.com/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log("📡 API User Response:", json);

      const userData = json.data || json.user || json;
      setUser(userData);
      setToken(storedToken);

      // Initialize tempData with current user data
      setTempData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        address: userData.address || "",
        avatar: userData.avatar || userData.image || ""
      });

      // Store in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log("✅ User profile loaded:", userData);
      
    } catch (error) {
      console.log("❌ API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile via PUT API
  const updateProfile = async () => {
    if (!token) {
      Alert.alert("Error", "No authentication token found");
      return;
    }

    try {
      setUpdating(true);
      
      const updateData = {
        fullName: tempData.fullName.trim(),
        gender: tempData.gender.toLowerCase(), // Convert to lowercase for API
        address: tempData.address
      };

      console.log("🔄 Updating profile with data:", updateData);
      
      const response = await fetch("https://naushad.onrender.com/api/auth/profile-update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const json = await response.json();
      console.log("📡 PUT API Response:", json);

      if (response.ok) {
        console.log("✅ Update successful! Response:", json);
        Alert.alert("Success", "Profile updated successfully!", [
          { 
            text: "OK", 
            onPress: () => {
              setEditModal(false);
              fetchUserProfile(); // Refresh data
            }
          }
        ]);
      } else {
        Alert.alert("Error", json.message || "Failed to update profile");
      }
    } catch (error) {
      console.log("❌ Update API Error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (imageUri) => {
    if (!token) {
      Alert.alert("Error", "No authentication token found");
      return;
    }

    try {
      setUploadingImage(true);
      
      // Create form data for image upload
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      console.log("📤 Uploading profile image...");
      
      const response = await fetch("https://naushad.onrender.com/api/auth/profile-update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await response.json();
      console.log("📡 Image Upload Response:", json);

      if (response.ok) {
        console.log("✅ Image upload successful!");
        Alert.alert("Success", "Profile image updated successfully!");
        fetchUserProfile(); // Refresh data
      } else {
        Alert.alert("Error", json.message || "Failed to upload image");
      }
    } catch (error) {
      console.log("❌ Image Upload Error:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
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
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const openEditModal = useCallback(() => {
    // Set tempData to current user data
    if (user) {
      setTempData({
        fullName: user.fullName || "",
        email: user.email || "",
        gender: user.gender || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || user.image || ""
      });
    }
    setEditModal(true);
    setHasSubmitted(false);
    setErrorState({ fullName: false });
    setErrorMessages({ fullName: "" });
  }, [user]);

  // Validate form
  const validateForm = useCallback(() => {
    const errors = { fullName: false };
    const messages = { fullName: "" };

    if (!tempData.fullName.trim()) {
      errors.fullName = true;
      messages.fullName = "Full name is required";
    } else if (tempData.fullName.trim().split(/\s+/).length < 2) {
      errors.fullName = true;
      messages.fullName = "Please enter your full name";
    }

    if (!tempData.gender) {
      // Gender validation handled separately
    }

    setErrorState(errors);
    setErrorMessages(messages);
    return !Object.values(errors).some(Boolean);
  }, [tempData.fullName, tempData.gender]);

  const handleSave = () => {
    setHasSubmitted(true);
    
    // Validate full name
    if (!tempData.fullName.trim()) {
      setErrorState({ fullName: true });
      setErrorMessages({ fullName: "Full name is required" });
      return;
    } else if (tempData.fullName.trim().split(/\s+/).length < 2) {
      setErrorState({ fullName: true });
      setErrorMessages({ fullName: "Please enter your full name" });
      return;
    }
    
    if (!tempData.gender) {
      Alert.alert("Error", "Please select your gender");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    updateProfile();
  };

  const showImageSourceOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => openCamera(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => openImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled camera");
        } else if (response.error) {
          console.log("Camera Error: ", response.error);
          Alert.alert("Error", "Failed to take photo. Please try again.");
        } else if (response.assets?.[0]) {
          const selectedImage = response.assets[0];
          handleImageSelected(selectedImage);
        }
      }
    );
  };

  const openImageLibrary = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          Alert.alert("Error", "Failed to select image. Please try again.");
        } else if (response.assets?.[0]) {
          const selectedImage = response.assets[0];
          handleImageSelected(selectedImage);
        }
      }
    );
  };

  const handleImageSelected = (selectedImage) => {
    setFilePath(selectedImage);
    setTempData({...tempData, avatar: selectedImage.uri});
    
    // Upload image to server
    if (selectedImage.uri) {
      uploadProfileImage(selectedImage.uri);
    }
  };

  const chooseImage = () => {
    showImageSourceOptions();
  };

  const getGenderDisplayText = (gender) => {
    if (!gender) return "Not selected";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Get border color for input field
  const getBorderColor = (field, fieldValue) => {
    return (errorState[field] && (hasSubmitted || fieldValue.trim())) ? '#FF4444' : COLORS.primary;
  };

  // Error message component
  const ErrorMessage = ({ message, field }) => {
    if (!errorState[field] || !(hasSubmitted || errorMessages[field])) return null;
    return (
      <Text style={styles.errorText}>{message}</Text>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.background || "#fff" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderInfoRow = (icon, label, value) => (
    <View style={styles.infoRow}>
      <Icon
        name={icon}
        size={22}
        color={COLORS.primary}
        style={{ marginTop: hp("0.5%") }}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value || "Not available"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
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
                      : user?.avatar && user?.avatar !== "" && user?.avatar !== "null"
                      ? { uri: user.avatar }
                      : user?.image && user?.image !== "" && user?.image !== "null"
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
                  <Icon name="camera" size={wp("5%")} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user?.fullName || "Your Name"}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "yourmail@email.com"}
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
          
          {renderInfoRow("person-outline", "Full Name", user?.fullName)}
          {renderInfoRow("mail-outline", "Email", user?.email)}
          {renderInfoRow("male-female-outline", "Gender", getGenderDisplayText(user?.gender))}
          {renderInfoRow("call-outline", "Phone", user?.phone)}
          {renderInfoRow("location-outline", "Address", user?.address)}
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
                : user?.avatar && user?.avatar !== "" && user?.avatar !== "null"
                ? { uri: user.avatar }
                : user?.image && user?.image !== "" && user?.image !== "null"
                  ? { uri: user.image }
                  : require("../../assets/user.png")
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
                <TouchableOpacity onPress={chooseImage} disabled={uploadingImage}>
                  {uploadingImage ? (
                    <View style={[styles.popupProfilePic, styles.uploadingContainer]}>
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
                      <Icon name="camera" size={wp("4%")} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.popupProfileText}>Tap to change photo</Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Full Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  value={tempData.fullName}
                  onChangeText={(text) => {
                    setTempData({...tempData, fullName: text});
                    // Clear error when user starts typing
                    if (errorState.fullName) {
                      setErrorState({...errorState, fullName: false});
                      setErrorMessages({...errorMessages, fullName: ""});
                    }
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, { borderColor: getBorderColor('fullName', tempData.fullName) }]}
                  autoFocus={false}
                />
                <ErrorMessage message={errorMessages.fullName} field="fullName" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  value={tempData.email}
                  onChangeText={(text) => setTempData({...tempData, email: text})}
                  placeholder="Enter email"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.disabledInput]}
                  editable={false}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Gender <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Text style={styles.genderCurrentSelection}>
                  {/* Current Selection: {getGenderDisplayText(tempData.gender)} */}
                </Text>
                <View style={styles.genderContainer}>
                  {['male', 'female', 'other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        tempData.gender === gender && styles.genderSelected
                      ]}
                      onPress={() => setTempData({...tempData, gender})}
                    >
                      <Text style={[
                        styles.genderText,
                        tempData.gender === gender && styles.genderTextSelected
                      ]}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  value={tempData.phone}
                  onChangeText={(text) => setTempData({...tempData, phone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.disabledInput]}
                  editable={false}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  value={tempData.address}
                  onChangeText={(text) => setTempData({...tempData, address: text})}
                  placeholder="Enter your address"
                  placeholderTextColor="#aaa"
                  style={[styles.formInput, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
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
                  (!tempData.fullName?.trim() || !tempData.gender || updating) && styles.saveBtnDisabled
                ]} 
                onPress={handleSave}
                disabled={!tempData.fullName?.trim() || !tempData.gender || updating}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { 
    flex: 1, 
    paddingTop: moderateScale(20),
    paddingHorizontal: wp("2%"),
    paddingBottom: hp("5%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: wp("4%"),
    color: "#666",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: hp("5%"),
    paddingTop: hp("3%"),
    paddingHorizontal: wp("4%"),
  },
  profileImageWrapper: {
    width: wp("32%"),
    height: wp("32%"),
    borderRadius: wp("16%"),
    overflow: "hidden",
    borderWidth: 4,
    borderColor: COLORS.primary,
    elevation: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: "relative",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: wp("16%"),
  },
  uploadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: wp("16%"),
  },
  cameraContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconCenter: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  userName: {
    fontSize: wp("5.5%"),
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: hp("2%"),
    textAlign: "center",
  },
  userEmail: {
    fontSize: wp("4%"),
    color: "#666",
    marginTop: hp("0.5%"),
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: wp("4%"),
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("5%"),
    marginHorizontal: wp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: "100%",
    alignSelf: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2.5%"),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + "20",
    paddingBottom: hp("1.2%"),
  },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: COLORS.primary,
  },
  editButton: {
    padding: wp("2.5%"),
    backgroundColor: COLORS.primary + "10",
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("2.5%"),
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: "#f8f9fa",
    borderRadius: wp("2%"),
  },
  infoTextContainer: { 
    marginLeft: wp("4%"), 
    flex: 1,
    paddingVertical: hp("0.5%"),
  },
  label: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: hp("0.3%"),
  },
  value: {
    fontSize: wp("4.2%"),
    color: "#333",
    fontWeight: "500",
    lineHeight: hp("2.5%"),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: { 
    flex: 1, 
    width: "100%",
    justifyContent: "center", 
    alignItems: "center" 
  },
  fullImage: {
    width: wp("90%"),
    height: hp("70%"),
    borderRadius: 16,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp("2%"),
  },
  popupContainer: {
    width: "100%",
    maxWidth: wp("96%"),
    backgroundColor: "#fff",
    borderRadius: 20,
    maxHeight: hp("85%"),
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  popupTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: COLORS.primary,
  },
  popupScroll: {
    paddingHorizontal: wp("5%"),
  },
  popupScrollContent: {
    paddingBottom: wp("5%"),
  },
  popupProfileSection: {
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  popupProfilePic: {
    width: wp("25%"),
    height: wp("25%"),
    borderRadius: wp("12.5%"),
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  popupCameraContainer: {
    position: "absolute",
    bottom: 0,
    right: wp("7%"),
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
    elevation: 4,
  },
  popupProfileText: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginTop: hp("1%"),
  },
  formGroup: {
    marginBottom: hp("2%"),
  },
  formLabel: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp("1%"),
  },
  requiredStar: {
    color: COLORS.primary,
    fontSize: wp("4%"),
  },
  formInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: wp("3.5%"),
    fontSize: wp("4%"),
    color: "#000",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
    borderColor: "#ddd",
  },
  textArea: {
    minHeight: hp("10%"),
    textAlignVertical: "top",
    borderColor: "#ddd",
  },
  errorText: {
    fontSize: wp("3%"),
    color: "#FF4444",
    marginTop: hp("0.2%"),
    marginBottom: hp("0.8%"),
    fontWeight: "500",
  },
  genderCurrentSelection: {
    fontSize: wp("3.8%"),
    color: COLORS.primary,
    fontWeight: "500",
    marginBottom: hp("1.5%"),
    fontStyle: "italic",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("0.5%"),
  },
  genderOption: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    marginHorizontal: wp("1%"),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  genderSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: wp("4%"),
    color: "#666",
    fontWeight: "500",
  },
  genderTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp("5%"),
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: wp("3%"),
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: hp("2.2%"),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: hp("2.2%"),
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  cancelText: { 
    color: "#666", 
    fontWeight: "700",
    fontSize: wp("4%"),
  },
  saveTextBtn: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: wp("4%"),
  },
});

export default MyProfile;