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

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !emailOrPhone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    const normalize = (str) => str.replace(/\s+/g, ''); // remove ALL spaces
    if (normalize(password) !== normalize(confirmPassword)) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://naushad.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: emailOrPhone, // assuming backend accepts "email"
          password: password,
          confirmPassword: confirmPassword
        }),
      });

      const data = await response.json();
      setLoading(false);

      console.log("Signup Response:", data);

      if (response.ok && data.success) {
        Alert.alert("Success", data.message || "Signup successful!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Signin"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Signup Error:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    }
    console.log("Sending signup data:", {
      name: fullName,
      email: emailOrPhone,
      password: password,
      confirmPassword: confirmPassword
    });
  };

  return (
    <SafeAreaView style={{flex : 1, backgroundColor : '#fff'}}>
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
          onChangeText={setDob}
        />

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
    fontSize: wp("3.5%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    marginTop: hp("0.5%"),
    color: "#000",
  },
  input: {
    height: hp("4.5%"),
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("3%"),
    backgroundColor: "#fff",
    color:"black"
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
    fontSize: wp("3%"),
    color: "#000",
  },
  signinLink: {
    fontWeight: "bold",
    fontSize: wp("3%"),
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
    fontSize: wp("3%"),
  }
});
