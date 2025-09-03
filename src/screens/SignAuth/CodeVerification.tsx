import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const navigation = useNavigation(); // Navigation Hook

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto move to next input
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(59);
  };

  // Verify OTP
  const handleVerify = () => {
    const otpCode = otp.join("");
    console.log("OTP Entered:", otpCode);

    // Navigate to SignIn screen after OTP verification
    navigation.navigate("Signin");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")} // Change this path to your logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Heading */}
      <Text style={styles.title}>Enter your</Text>
      <Text style={styles.title}>Verification code</Text>

      {/* Subtext */}
      <Text style={styles.subtitle}>
        We will send you an One Time Passcode{"\n"}via this mail@gmail.com email address
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>

      {/* Resend Row */}
      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn’t get it?</Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendButton}>Resend Code</Text>
        </TouchableOpacity>
        <Text style={styles.timer}>{`0:${timer < 10 ? `0${timer}` : timer}`}</Text>
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>VERIFY OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginVertical: 10,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    color: "#555",
    marginRight: 5,
  },
  resendButton: {
    color: "#000",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  timer: {
    marginLeft: 10,
    color: "#000",
    fontWeight: "bold",
  },
  verifyBtn: {
    backgroundColor: "#F6B93B",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
