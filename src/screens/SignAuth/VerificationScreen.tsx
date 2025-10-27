import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import Popup from "../../components/PopUp";

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!email) {
      setPopupMessage("Please enter your email!");
      setPopupVisible(true);
      return;
    }

    setLoading(true);

    // Simulate OTP send delay
    setTimeout(() => {
      setLoading(false);              // Stop loading first
      setPopupMessage("OTP sent successfully!");
      setPopupVisible(true);          // Then show popup
      setNextRoute({ name: "CodeVerification" });
    }, 1000); // 1 second delay
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (nextRoute) {
      navigation.navigate(nextRoute.name, nextRoute.params);
      setNextRoute(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We will send you a One Time Passcode{"\n"}via this email address
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="mail@gmail.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Send OTP Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { color: "#fff" }]}>SEND OTP</Text>
        )}
      </TouchableOpacity>

      {/* Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={handlePopupClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: wp("70%"),
    height: hp("17%"),
    alignSelf: "center",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
    color: "#000",
  },
  subtitle: {
    fontSize: wp("3.5%"),
    textAlign: "center",
    color: "#0a0909ff",
    marginBottom: hp("5%"),
    fontWeight: "400",
  },
  input: {
    width: "100%",
    borderWidth: wp("0.3%"),
    borderColor: "rgba(216, 214, 214, 1)",
    borderRadius: wp("2%"),
    padding: wp("2%"),
    fontSize: wp("4%"),
    marginBottom: hp("5%"),
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    alignItems: "center",
  },
  buttonText: {
    fontSize: wp("3%"),
    fontWeight: "500",
  },
});

export default OTPVerification;
