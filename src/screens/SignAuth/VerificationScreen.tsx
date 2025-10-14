import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Import navigation hook
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation(); // ✅ Initialize navigation

  const handleSendOTP = () => {
    console.log("OTP sent to:", email);
    navigation.navigate("CodeVerification"); // ✅ Navigate to CodeVerification screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We will send you an One Time Passcode{"\n"}via this email address
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="mail@gmail.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>SEND OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp("5%"),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems  :'center'
  },
 logo: {
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
    marginTop: hp("7%"),
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: "bold",
    marginBottom: hp('2%'),
    color: "#000",
  },
  subtitle: {
    fontSize: wp('4%'),
    textAlign: "center",
    color: "#0a0909ff",
    marginBottom: hp('7%'),
    fontWeight : '400'
  },
  input: {
    width: "100%",
    borderWidth: wp('0.3%'),
    borderColor: "rgba(5, 5, 5, 1)",
    borderRadius: wp('2%'),
    padding: wp('3%'),
    fontSize: wp('4%'),
    marginBottom: hp('5%'),
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#F6B745",
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight : '500'
  },
});

export default OTPVerification;
