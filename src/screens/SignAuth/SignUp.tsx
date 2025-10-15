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

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const response = await fetch("http://192.168.29.143:5001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: emailOrPhone, // assuming backend accepts "email"
          password: password,
          confirmPassword : confirmPassword
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
      confirmPassword : confirmPassword
    });
  };

  return (
    <SafeAreaView>
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
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email / Phone */}
        <Text style={styles.label}>Phone or Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone or email"
          placeholderTextColor="#888"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Signup Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SIGN UP</Text>
          )}
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={styles.signinLink}> Signin</Text>
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
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
    marginTop: hp("10%"),
  },
  label: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    marginTop: hp("1%"),
    color: "#000",
  },
  input: {
    height: hp("6%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("4%"),
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#F6B745",
    paddingVertical: hp("2%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("4%"),
    marginBottom: hp("3%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
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
    color: "#f7b731",
    fontWeight: "bold",
    fontSize: wp("3.5%"),
  },
});
