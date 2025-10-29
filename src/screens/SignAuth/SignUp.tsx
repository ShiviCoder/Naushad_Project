import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import Popup from "../../components/PopUp";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);
  const [referal, setReferal] = useState('');
  const [photo, setPhoto] = useState(null);

const handleSignup = async () => {
  if (!fullName || !emailOrPhone || !password || !confirmPassword || !dob || !address || !gender) {
    setPopupMessage("All fields are required.");
    setPopupVisible(true);
    setNextRoute(null);
    return;
  }

  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length < 2) {
    setPopupMessage("Please enter your full name");
    setPopupVisible(true);
    setNextRoute(null);
    return;
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailOrPhone)) {
    setPopupMessage("Please enter a valid Gmail address");
    setPopupVisible(true);
    setNextRoute(null);
    return;
  }

  if (password.length < 8) {
    setPopupMessage("Password must be at least 8 characters long.");
    setPopupVisible(true);
    setNextRoute(null);
    return;
  }

  const normalize = (str) => str.replace(/\s+/g, "");
  if (normalize(password) !== normalize(confirmPassword)) {
    setPopupMessage("Passwords do not match.");
    setPopupVisible(true);
    setNextRoute(null);
    return;
  }
  setLoading(true);
  try {
      const userData = {
        fullName,
        email : emailOrPhone,
        password,
        dob,
        address,
        gender,
        referal,
        photo,
      } 
    await AsyncStorage.setItem("pendingUserData",JSON.stringify(userData));
    setLoading(false);
    console.log("User data :", userData);
    setPopupMessage("Signup details saved! Proceed to verify OTP.");
    setNextRoute({ name: "CodeVerification" });
    setPopupVisible(true);
  } catch (error) {
    setLoading(false);
    console.log("AsyncStorage Error:", error);
    setPopupMessage("Something went wrong while saving data.");
    setPopupVisible(true);
  }

  console.log("Sending signup data:", {
    fullName,
    email: emailOrPhone,
    password,
    confirmPassword,
    dob,
    address,
    gender,
  });
};

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (nextRoute) {
      navigation.navigate(nextRoute.name, nextRoute.params);
    }
  };
  const handleChange = (text) => {
    // Remove non-digit characters
    let cleaned = text.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // Format with slashes
    let formatted = "";
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    setDob(formatted);
  };

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          // iOS / Android me path thoda different ho sakta hai
          const source = { uri: response.assets[0].uri };
          setPhoto(source);
        }
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor={'gray'}
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email / Phone */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={'gray'}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor={'gray'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor={'gray'}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your date of birth"
          placeholderTextColor={'gray'}
          value={dob}
          keyboardType={"number-pad"}
          onChangeText={handleChange}
        />
        <Text style={[styles.label]}>Phone Number</Text>
        <TextInput
          placeholder='Enter your number'
          placeholderTextColor={'gray'}
          style={[styles.input]} keyboardType='phone-pad' />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          placeholderTextColor={'gray'}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioContainer}>
          {['male', 'female', 'other'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.radioOption]}
              onPress={() => setGender(option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === option && { borderColor: COLORS.primary, borderWidth: wp('1.5%') }
                ]}
              >
              </View>
              <Text style={styles.radioLabel}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.imageContainer}>
           <TouchableOpacity onPress={handleChoosePhoto}>
          <Image
            source={
              photo
                ? photo
                : require('../../assets/user-img.png') // fallback image
            }
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

        <Text style={styles.label}>Referal Code(Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your referal code"
          placeholderTextColor={'gray'}
          value={referal}
          onChangeText={setReferal}
        />
        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={[styles.signinLink, { color: COLORS.primary }]}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Popup visible={popupVisible} message={popupMessage} onClose={handlePopupClose} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp("5%"),
    justifyContent: "center",
  },
  logo: {
    width: wp("70%"),
    height: hp("15%"),
    alignSelf: "center",
    marginTop: hp("1%"),
  },
  label: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    marginTop: hp("0.5%"),
    color: "#000",
  },
  input: {
    height: hp("6%"),
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("3.5%"),
    backgroundColor: "#fff",
    color: "black"
  },
  button: {
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp("1%"),
    marginBottom: hp("3%"),
  },
  signinText: {
    fontSize: wp("3.5%"),
    color: "#000",
  },
  signinLink: {
    fontWeight: "bold",
    fontSize: wp("3.5%"),
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("5%"),
    marginTop: hp("1%"),
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('1.5%')
  },
  radioCircle: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    borderWidth: wp('1.5%'),
    borderColor: "#3E4347",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("2%"),
  },
  radioDot: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.25%"),
  },
  radioLabel: {
    fontSize: wp("3.5%"),
  },
  uploadButton: {
    height: hp("6%"),
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: 'center'
  },
  uploadText: {
    color: 'gray',
    fontSize: wp("3.5%"),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
   imageContainer: {
    position: "relative",
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: hp('0.2%'),
    alignSelf : 'center',
    
  },
  nameRow: {
    flex: 1,
    marginLeft: wp('3%'),
    flexDirection: "row",
    alignItems : 'center'
  },
  nameText: {
    fontSize: wp('4%'),
    fontWeight: "600",
    color: "#000",
  },
});


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
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

// export default function SignupScreen({ navigation }) {
//   const [fullName, setFullName] = useState("");
//   const [emailOrPhone, setEmailOrPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [address, setAddress] = useState("");
//   const [gender, setGender] = useState("");
//   const [referal, setReferal] = useState("");
//   const [photo, setPhoto] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [nextRoute, setNextRoute] = useState(null);

//   // 📆 Format DOB
//   const handleChange = (text) => {
//     let cleaned = text.replace(/\D/g, "");
//     if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
//     let formatted = "";
//     if (cleaned.length <= 2) formatted = cleaned;
//     else if (cleaned.length <= 4)
//       formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
//     else
//       formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
//         4,
//         8
//       )}`;
//     setDob(formatted);
//   };

//   // 🖼️ Pick Image
//   const handleChoosePhoto = () => {
//     launchImageLibrary(
//       { mediaType: "photo", maxWidth: 300, maxHeight: 300, quality: 0.7 },
//       (response) => {
//         if (!response.didCancel && !response.errorMessage && response.assets) {
//           setPhoto({ uri: response.assets[0].uri });
//         }
//       }
//     );
//   };

//   // 🧠 Signup logic
//   const handleSignup = async () => {
//     // ✅ Validation
//     if (
//       !fullName ||
//       !emailOrPhone ||
//       !password ||
//       !confirmPassword ||
//       !dob ||
//       !address ||
//       !gender
//     ) {
//       setPopupMessage("All fields are required.");
//       setPopupVisible(true);
//       return;
//     }

//     const nameParts = fullName.trim().split(/\s+/);
//     if (nameParts.length < 2) {
//       setPopupMessage("Please enter your full name (first and last).");
//       setPopupVisible(true);
//       return;
//     }

//     if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailOrPhone)) {
//       setPopupMessage("Please enter a valid Gmail address.");
//       setPopupVisible(true);
//       return;
//     }

//     if (password.length < 8) {
//       setPopupMessage("Password must be at least 8 characters long.");
//       setPopupVisible(true);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setPopupMessage("Passwords do not match.");
//       setPopupVisible(true);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("https://naushad.onrender.com/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fullName,
//           email: emailOrPhone,
//           password,
//           confirmPassword,
//           dob,
//           address,
//           gender,
//           referal,
//           photo,
//         }),
//       });

//       const data = await response.json();
//       setLoading(false);
//       console.log("Signup Response:", data);

//       if (response.ok) {
//         setPopupMessage("Signup successful! Please sign in.");
//         setNextRoute({ name: "Signin" });
//         setPopupVisible(true);
//       } else {
//         setPopupMessage(data.message || "Signup failed. Try again.");
//         setPopupVisible(true);
//       }
//     } catch (error) {
//       console.log("Signup Error:", error);
//       setLoading(false);
//       setPopupMessage("Unable to connect to the server.");
//       setPopupVisible(true);
//     }
//   };

//   const handlePopupClose = () => {
//     setPopupVisible(false);
//     if (nextRoute) navigation.navigate(nextRoute.name);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Image
//           source={require("../../assets/images/logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         <Text style={styles.label}>Full Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter full name"
//           placeholderTextColor="gray"
//           value={fullName}
//           onChangeText={setFullName}
//         />

//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your Gmail"
//           placeholderTextColor="gray"
//           value={emailOrPhone}
//           onChangeText={setEmailOrPhone}
//           keyboardType="email-address"
//         />

//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter password"
//           placeholderTextColor="gray"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <Text style={styles.label}>Confirm Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Confirm password"
//           placeholderTextColor="gray"
//           secureTextEntry
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />

//         <Text style={styles.label}>Date of Birth</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="DD/MM/YYYY"
//           placeholderTextColor="gray"
//           value={dob}
//           keyboardType="number-pad"
//           onChangeText={handleChange}
//         />

//         <Text style={styles.label}>Address</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter address"
//           placeholderTextColor="gray"
//           value={address}
//           onChangeText={setAddress}
//         />

//         <Text style={styles.label}>Gender</Text>
//         <View style={styles.radioContainer}>
//           {["male", "female", "other"].map((option) => (
//             <TouchableOpacity
//               key={option}
//               style={styles.radioOption}
//               onPress={() => setGender(option)}
//             >
//               <View
//                 style={[
//                   styles.radioCircle,
//                   gender === option && {
//                     borderColor: COLORS.primary,
//                     borderWidth: wp("1.5%"),
//                   },
//                 ]}
//               />
//               <Text style={styles.radioLabel}>
//                 {option.charAt(0).toUpperCase() + option.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.imageContainer}>
//           <TouchableOpacity onPress={handleChoosePhoto}>
//             <Image
//               source={
//                 photo ? photo : require("../../assets/user-img.png")
//               }
//               style={styles.profileImage}
//             />
//             <View style={styles.editIcon}>
//               <Icon name="create-outline" size={wp("4%")} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <View style={styles.nameRow}>
//             <Text style={styles.nameText}>Upload your picture</Text>
//           </View>
//         </View>

//         <Text style={styles.label}>Referral Code (Optional)</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter referral code"
//           placeholderTextColor="gray"
//           value={referal}
//           onChangeText={setReferal}
//         />

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

//         <View style={styles.signinContainer}>
//           <Text style={styles.signinText}>Already have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
//             <Text style={[styles.signinLink, { color: COLORS.primary }]}>
//               {" "}
//               Sign In
//             </Text>
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
//     color: "black",
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
//     marginBottom: hp("1.5%"),
//   },
//   radioCircle: {
//     width: wp("5%"),
//     height: wp("5%"),
//     borderRadius: wp("2.5%"),
//     borderWidth: wp("1.5%"),
//     borderColor: "#3E4347",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: wp("2%"),
//   },
//   radioLabel: {
//     fontSize: wp("3.5%"),
//   },
//   imageContainer: {
//     position: "relative",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
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
//     padding: hp("0.2%"),
//   },
//   nameRow: {
//     flex: 1,
//     marginLeft: wp("3%"),
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   nameText: {
//     fontSize: wp("4%"),
//     fontWeight: "600",
//     color: "#000",
//   },
// });




