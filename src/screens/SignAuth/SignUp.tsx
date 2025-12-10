// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { SafeAreaView } from "react-native-safe-area-context";
// import COLORS from "../../utils/Colors";
// import Popup from "../../components/PopUp";
// import { launchImageLibrary } from "react-native-image-picker";
// import Icon from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function SignupScreen({ navigation }) {
//   const [fullName, setFullName] = useState("");
//   const [emailOrPhone, setEmailOrPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [address, setAddress] = useState("");
//   const [gender, setGender] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [nextRoute, setNextRoute] = useState(null);
//   const [referal, setReferal] = useState('');
//   const [photo, setPhoto] = useState(null);

// const handleSignup = async () => {
//   if (!fullName || !emailOrPhone || !password || !confirmPassword || !dob || !address || !gender) {
//     setPopupMessage("All fields are required.");
//     setPopupVisible(true);
//     setNextRoute(null);
//     return;
//   }

//   const nameParts = fullName.trim().split(/\s+/);
//   if (nameParts.length < 2) {
//     setPopupMessage("Please enter your full name");
//     setPopupVisible(true);
//     setNextRoute(null);
//     return;
//   }

//   if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailOrPhone)) {
//     setPopupMessage("Please enter a valid Gmail address");
//     setPopupVisible(true);
//     setNextRoute(null);
//     return;
//   }

//   if (password.length < 8) {
//     setPopupMessage("Password must be at least 8 characters long.");
//     setPopupVisible(true);
//     setNextRoute(null);
//     return;
//   }

//   const normalize = (str) => str.replace(/\s+/g, "");
//   if (normalize(password) !== normalize(confirmPassword)) {
//     setPopupMessage("Passwords do not match.");
//     setPopupVisible(true);
//     setNextRoute(null);
//     return;
//   }
//   setLoading(true);
//   try {
//       const userData = {
//         fullName,
//         email : emailOrPhone,
//         password,
//         dob,
//         address,
//         gender,
//         referal,
//         photo,
//       } 
//     await AsyncStorage.setItem("pendingUserData",JSON.stringify(userData));
//     setLoading(false);
//     console.log("User data :", userData);
//     setPopupMessage("Signup details saved! Proceed to verify OTP.");
//     setNextRoute({ name: "CodeVerification" });
//     setPopupVisible(true);
//   } catch (error) {
//     setLoading(false);
//     console.log("AsyncStorage Error:", error);
//     setPopupMessage("Something went wrong while saving data.");
//     setPopupVisible(true);
//   }

//   console.log("Sending signup data:", {
//     fullName,
//     email: emailOrPhone,
//     password,
//     confirmPassword,
//     dob,
//     address,
//     gender,
//   });
// };

//   const handlePopupClose = () => {
//     setPopupVisible(false);
//     if (nextRoute) {
//       navigation.navigate(nextRoute.name, nextRoute.params);
//     }
//   };
//   const handleChange = (text) => {
//     // Remove non-digit characters
//     let cleaned = text.replace(/\D/g, "");

//     // Limit to 8 digits (DDMMYYYY)
//     if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

//     // Format with slashes
//     let formatted = "";
//     if (cleaned.length <= 2) {
//       formatted = cleaned;
//     } else if (cleaned.length <= 4) {
//       formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
//     } else {
//       formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
//     }
//     setDob(formatted);
//   };

//   const handleChoosePhoto = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         maxWidth: 300,
//         maxHeight: 300,
//         quality: 0.7,
//       },
//       (response) => {
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.errorMessage) {
//           console.log('ImagePicker Error: ', response.errorMessage);
//         } else {
//           // iOS / Android me path thoda different ho sakta hai
//           const source = { uri: response.assets[0].uri };
//           setPhoto(source);
//         }
//       }
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Logo */}
//         <Image
//           source={require("../../assets/images/logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         {/* Full Name */}
//         <Text style={styles.label}>Full Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter full name"
//           placeholderTextColor={'gray'}
//           value={fullName}
//           onChangeText={setFullName}
//         />

//         {/* Email / Phone */}
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           placeholderTextColor={'gray'}
//           value={emailOrPhone}
//           onChangeText={setEmailOrPhone}
//           keyboardType="email-address"
//         />

//         {/* Password */}
//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter password"
//           placeholderTextColor={'gray'}
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         {/* Confirm Password */}
//         <Text style={styles.label}>Confirm Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Confirm password"
//           placeholderTextColor={'gray'}
//           secureTextEntry
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />

//         <Text style={styles.label}>Date of Birth</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your date of birth"
//           placeholderTextColor={'gray'}
//           value={dob}
//           keyboardType={"number-pad"}
//           onChangeText={handleChange}
//         />
//         <Text style={[styles.label]}>Phone Number</Text>
//         <TextInput
//           placeholder='Enter your number'
//           placeholderTextColor={'gray'}
//           style={[styles.input]} keyboardType='phone-pad' />

//         <Text style={styles.label}>Address</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your address"
//           placeholderTextColor={'gray'}
//           value={address}
//           onChangeText={setAddress}
//         />

//         <Text style={styles.label}>Gender</Text>
//         <View style={styles.radioContainer}>
//           {['male', 'female', 'other'].map((option) => (
//             <TouchableOpacity
//               key={option}
//               style={[styles.radioOption]}
//               onPress={() => setGender(option)}
//             >
//               <View
//                 style={[
//                   styles.radioCircle,
//                   gender === option && { borderColor: COLORS.primary, borderWidth: wp('1.5%') }
//                 ]}
//               >
//               </View>
//               <Text style={styles.radioLabel}>
//                 {option.charAt(0).toUpperCase() + option.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.imageContainer}>
//            <TouchableOpacity onPress={handleChoosePhoto}>
//           <Image
//             source={
//               photo
//                 ? photo
//                 : require('../../assets/user-img.png') // fallback image
//             }
//             style={styles.profileImage}
//           />
//           <View style={styles.editIcon}>
//             <Icon name="create-outline" size={wp('4%')} color="#fff" />
//           </View>
//         </TouchableOpacity>

//           <View style={styles.nameRow}>
//             <Text style={styles.nameText}>Upload your picture</Text>
//           </View>  
//         </View>

//         <Text style={styles.label}>Referal Code(Optional)</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your referal code"
//           placeholderTextColor={'gray'}
//           value={referal}
//           onChangeText={setReferal}
//         />
//         {/* Signup Button */}
//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: COLORS.primary }]}
//           onPress={handleSignup}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Sign Up</Text>
//           )}
//         </TouchableOpacity>

//         {/* Sign In Link */}
//         <View style={styles.signinContainer}>
//           <Text style={styles.signinText}>Already have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
//             <Text style={[styles.signinLink, { color: COLORS.primary }]}> Sign In</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <Popup visible={popupVisible} message={popupMessage} onClose={handlePopupClose} />

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: wp("5%"),
//     justifyContent: "center",
//   },
//   logo: {
//     width: wp("70%"),
//     height: hp("15%"),
//     alignSelf: "center",
//     marginTop: hp("1%"),
//   },
//   label: {
//     fontSize: wp("3.6%"),
//     fontWeight: "600",
//     marginBottom: hp("1%"),
//     marginTop: hp("0.5%"),
//     color: "#000",
//   },
//   input: {
//     height: hp("6%"),
//     borderWidth: 0.5,
//     borderColor: COLORS.primary,
//     borderRadius: wp("2%"),
//     paddingHorizontal: wp("4%"),
//     fontSize: wp("3.5%"),
//     backgroundColor: "#fff",
//     color: "black"
//   },
//   button: {
//     paddingVertical: hp("1.5%"),
//     borderRadius: wp("2%"),
//     alignItems: "center",
//     marginTop: hp("3%"),
//     marginBottom: hp("2%"),
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: wp("4%"),
//     fontWeight: "bold",
//   },
//   signinContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: hp("1%"),
//     marginBottom: hp("3%"),
//   },
//   signinText: {
//     fontSize: wp("3.5%"),
//     color: "#000",
//   },
//   signinLink: {
//     fontWeight: "bold",
//     fontSize: wp("3.5%"),
//   },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp("5%"),
//     marginTop: hp("1%"),
//   },
//   radioOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: hp('1.5%')
//   },
//   radioCircle: {
//     width: wp("5%"),
//     height: wp("5%"),
//     borderRadius: wp("2.5%"),
//     borderWidth: wp('1.5%'),
//     borderColor: "#3E4347",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: wp("2%"),
//   },
//   radioDot: {
//     width: wp("2.5%"),
//     height: wp("2.5%"),
//     borderRadius: wp("1.25%"),
//   },
//   radioLabel: {
//     fontSize: wp("3.5%"),
//   },
//   uploadButton: {
//     height: hp("6%"),
//     borderWidth: 0.5,
//     borderColor: "#ccc",
//     borderRadius: wp("2%"),
//     paddingHorizontal: wp("4%"),
//     backgroundColor: "#fff",
//     flex: 1,
//     justifyContent: 'center'
//   },
//   uploadText: {
//     color: 'gray',
//     fontSize: wp("3.5%"),
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60,
//   },
//    imageContainer: {
//     position: "relative",
//     flexDirection : 'row',
//     alignItems : 'center',
//     justifyContent : 'center'
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//   },
//   editIcon: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: COLORS.primary,
//     borderRadius: 12,
//     padding: hp('0.2%'),
//     alignSelf : 'center',

//   },
//   nameRow: {
//     flex: 1,
//     marginLeft: wp('3%'),
//     flexDirection: "row",
//     alignItems : 'center'
//   },
//   nameText: {
//     fontSize: wp('4%'),
//     fontWeight: "600",
//     color: "#000",
//   },
// });


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAppRegistrationCode } from '../../utils/appRegistrationCode/appRegistrationCode';

export default function SignupScreen({ navigation }) {
  // 🚀 Optimized state
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [referal, setReferal] = useState('');
  const [photo, setPhoto] = useState(null);
  const [appRegistrationCode, setAppRegistrationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorState, setErrorState] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ⚡ Pre-fetch app registration code immediately
  useEffect(() => {
    const code = getAppRegistrationCode();
    setAppRegistrationCode(code);
  }, []);

  // 🔧 Fixed BackHandler
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [navigation]);

  // 🚀 Optimized DOB formatting
  const handleChange = useCallback((text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (cleaned.length <= 2) formatted = cleaned;
    else if (cleaned.length <= 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    else formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDob(formatted);
  }, []);

  // ⚡ Fast image picker
  const handleChoosePhoto = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 0.7 },
      (response) => {
        if (response?.assets?.[0]?.uri) {
          setPhoto({ uri: response.assets[0].uri });
        }
      }
    );
  }, []);

  // 🚀 Professional validation with detailed error messages
  const isFormValid = useMemo(() => {
    const errors = { fullName: false, email: false, password: false, confirmPassword: false };
    const messages = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Full Name validation
    if ((hasSubmitted || fullName.trim()) && !fullName.trim()) {
      errors.fullName = true;
      messages.fullName = 'Full name is required';
    } else if (hasSubmitted || fullName.trim()) {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        errors.fullName = true;
        messages.fullName = 'Please enter first name and last name';
      }
    }

    // Email validation
    if ((hasSubmitted || emailOrPhone) && !emailOrPhone) {
      errors.email = true;
      messages.email = 'Email is required';
    } else if ((hasSubmitted || emailOrPhone) && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailOrPhone)) {
      errors.email = true;
      messages.email = 'Please enter a valid Gmail address';
    }

    // Password validation
    if ((hasSubmitted || password) && !password) {
      errors.password = true;
      messages.password = 'Password is required';
    } else if ((hasSubmitted || password) && password.length < 8) {
      errors.password = true;
      messages.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if ((hasSubmitted || confirmPassword) && !confirmPassword) {
      errors.confirmPassword = true;
      messages.confirmPassword = 'Please confirm your password';
    } else if ((hasSubmitted || confirmPassword) && password !== confirmPassword) {
      errors.confirmPassword = true;
      messages.confirmPassword = 'Passwords do not match';
    }

    setErrorState(errors);
    setErrorMessages(messages);
    return !Object.values(errors).some(Boolean);
  }, [fullName, emailOrPhone, password, confirmPassword, hasSubmitted]);

  // ✅ User-friendly server error messages
  const getUserFriendlyError = useCallback((status: number, errorData: string) => {
    console.log('🔍 Error analysis:', status, errorData);
    
    try {
      const errorJson = JSON.parse(errorData);
      const message = errorJson.message?.toLowerCase() || '';
      
      if (message.includes('email already in use') || message.includes('already exists')) {
        return 'Email already registered. Please use a different email.';
      }
      if (status === 409) {
        return 'Account already exists. Try signing in.';
      }
    } catch (e) {}

    switch (status) {
      case 400: return 'Please check your information and try again.';
      case 500: return 'Server error. Try again later.';
      default: return 'Something went wrong. Please try again.';
    }
  }, []);

  // ✅ Success popup with auto-navigate
  const showSuccessAndNavigate = useCallback(() => {
    setPopupMessage('User Registered Successfully!');
    setPopupVisible(true);
    setTimeout(() => {
      navigation.replace('Signin');
    }, 1500);
  }, [navigation]);

  // ✅ Professional signup handler
  const handleSignup = useCallback(async () => {
    setHasSubmitted(true);

    if (!isFormValid) {
      setPopupMessage('Please fix all errors before submitting.');
      setPopupVisible(true);
      return;
    }

    setLoading(true);
    setPopupVisible(false);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', emailOrPhone);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('dob', dob);
      formData.append('address', address || '');
      formData.append('gender', gender || '');
      formData.append('referal', referal || '');
      formData.append('appRegistrationCode', appRegistrationCode);

      if (photo?.uri) {
        formData.append('avatar', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }

      const response = await fetch('https://naushad.onrender.com/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        const userError = getUserFriendlyError(response.status, errorData);
        setPopupMessage(userError);
        setPopupVisible(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data?.user) {
        await Promise.all([
          AsyncStorage.setItem('userData', JSON.stringify(data.user)),
          data.user._id ? AsyncStorage.setItem('userId', data.user._id) : Promise.resolve()
        ]);
      }

      showSuccessAndNavigate();
      
    } catch (error: any) {
      let errorMsg = 'Network error. Please check your connection.';
      if (error.message.includes('timeout')) {
        errorMsg = 'Request timeout. Please try again.';
      } else if (error.message.includes('Network')) {
        errorMsg = 'No internet connection.';
      }
      
      setPopupMessage(errorMsg);
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  }, [isFormValid, fullName, emailOrPhone, password, confirmPassword, dob, address, gender, referal, photo, appRegistrationCode, navigation, getUserFriendlyError, showSuccessAndNavigate]);

  const handlePopupClose = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Render required field label
  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.label}>
      {children} <Text style={styles.requiredStar}>*</Text>
    </Text>
  );

  // Get border color - professional error display
  const getBorderColor = (field: keyof typeof errorState, fieldValue: string) => {
    return (errorState[field] && (hasSubmitted || fieldValue.trim())) ? '#FF4444' : COLORS.primary;
  };

  // Error message component
  const ErrorMessage = ({ message, field }: { message: string; field: keyof typeof errorMessages }) => {
    if (!errorState[field] || !(hasSubmitted || errorMessages[field])) return null;
    return (
      <Text style={styles.errorText}>{message}</Text>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button - COMMENTED OUT */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          {/* <Icon name="arrow-back" size={wp('6%')} color={COLORS.primary} /> */}
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <RequiredLabel>Full Name</RequiredLabel>
        <TextInput
          style={[styles.input, { borderColor: getBorderColor('fullName', fullName) }]}
          placeholder="Enter full name"
          placeholderTextColor="gray"
          value={fullName}
          onChangeText={setFullName}
          maxLength={50}
        />
        <ErrorMessage message={errorMessages.fullName} field="fullName" />

        <RequiredLabel>Email</RequiredLabel>
        <TextInput
          style={[styles.input, { borderColor: getBorderColor('email', emailOrPhone) }]}
          placeholder="Enter your Gmail"
          placeholderTextColor="gray"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ErrorMessage message={errorMessages.email} field="email" />

        <RequiredLabel>Password</RequiredLabel>
        <View style={[styles.passwordContainer, { borderColor: getBorderColor('password', password) }]}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Enter password"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            maxLength={50}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <FeatherIcon
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color={showPassword ? COLORS.primary : 'gray'}
            />
          </TouchableOpacity>
        </View>
        <ErrorMessage message={errorMessages.password} field="password" />

        <RequiredLabel>Confirm Password</RequiredLabel>
        <View style={[styles.passwordContainer, { borderColor: getBorderColor('confirmPassword', confirmPassword) }]}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirm password"
            placeholderTextColor="gray"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            maxLength={50}
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <FeatherIcon
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={22}
              color={showConfirmPassword ? COLORS.primary : 'gray'}
            />
          </TouchableOpacity>
        </View>
        <ErrorMessage message={errorMessages.confirmPassword} field="confirmPassword" />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="gray"
          value={dob}
          keyboardType="number-pad"
          onChangeText={handleChange}
          maxLength={10}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor="gray"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={2}
          maxLength={200}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioContainer}>
          {['male', 'female', 'other'].map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioOption}
              onPress={() => setGender(option)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === option && {
                    borderColor: COLORS.primary,
                    borderWidth: wp('1.5%'),
                  },
                ]}
              />
              <Text style={styles.radioLabel}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleChoosePhoto} activeOpacity={0.7}>
            <Image
              source={photo ? { uri: photo.uri } : require('../../assets/user.png')}
              style={styles.profileImage}
            />
            <View style={styles.editIcon}>
              <Icon name="create-outline" size={wp('4%')} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>Upload your picture</Text>
          </View>
        </View>

        <Text style={styles.label}>Referral Code (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter referral code"
          placeholderTextColor="gray"
          value={referal}
          onChangeText={setReferal}
          maxLength={20}
        />

        <TouchableOpacity
          style={[
            styles.button, 
            { 
              backgroundColor: isFormValid ? COLORS.primary : '#ccc',
              opacity: loading ? 0.7 : 1
            }
          ]}
          onPress={handleSignup}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={[styles.signinLink, { color: COLORS.primary }]}>
              {' '}Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={handlePopupClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  backButton: {
    position: 'absolute',
    top: hp('1%'),
    left: wp('3%'),
    zIndex: 10,
    padding: wp('2%'),
  },
  logo: {
    width: wp('70%'),
    height: hp('15%'),
    alignSelf: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
    color: '#000',
  },
  requiredStar: {
    color: COLORS.primary,
    fontSize: wp('4%'),
  },
  input: {
    height: hp('6%'),
    borderWidth: 0.5,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('3.5%'),
    backgroundColor: '#fff',
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    marginBottom: hp('1%'),
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
  },
  eyeIcon: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
  },
  // ✅ Professional error text style
  errorText: {
    fontSize: wp('3%'),
    color: '#FF4444',
    marginTop: hp('0.2%'),
    marginBottom: hp('0.8%'),
    fontWeight: '500',
  },
  button: {
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
  },
  signinText: {
    fontSize: wp('3.5%'),
    color: '#000',
  },
  signinLink: {
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('5%'),
    marginTop: hp('1%'),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  radioCircle: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: wp('1.5%'),
    borderColor: '#3E4347',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  radioLabel: {
    fontSize: wp('3.5%'),
  },
  imageContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: hp('0.2%'),
  },
  nameRow: {
    flex: 1,
    marginLeft: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#000',
  },
});
