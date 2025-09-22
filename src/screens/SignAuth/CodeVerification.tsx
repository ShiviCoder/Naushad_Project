import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
  onKeyPress={({ nativeEvent }) => {
    if (nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] === "") {
        // agar current box already empty hai -> pehle wale box pe jao
        if (index > 0) {
          inputRefs.current[index - 1].focus();
          newOtp[index - 1] = "";
        }
      } else {
        // agar current box me digit hai -> usi box ko clear karo
        newOtp[index] = "";
      }

      setOtp(newOtp);
    }
  }}
/>
        ))}
      </View>

      {/* Resend Row */}
      <View style={styles.resendRow}>
        <View style={{flexDirection : 'row'}}>
          <Text style={styles.resendText}>Didn’t get it?</Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendButton}>Resend Code</Text>
        </TouchableOpacity>
        </View>
        
         
         <View>
        <Text style={styles.timer}>{`0:${timer < 10 ? `0${timer}` : timer}`}</Text>
      </View>
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
    paddingHorizontal: wp('5%'),
    justifyContent: "center",
  },
  logo: {
    width: wp("90%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
    marginTop: hp("7%"),
  },
  title: {
    fontSize: wp('9%'),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: wp('3%'),
    textAlign: "center",
    color: "#161414ff",
    marginVertical: hp('2%'),
    fontWeight: '500',
    lineHeight: hp('2%'),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp('2%'),
  },
  otpInput: {
    width: wp('12%'),
    height: hp('6%'),
    textAlign: "center",
    fontSize: hp('3%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
    backgroundColor: "#D9D9D975",
  },
  resendRow: {
    flexDirection: "row",
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: hp('5%'),
    justifyContent: 'space-between',
  },
  resendText: {
    color: "#555",
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
    marginLeft: wp('2%'),
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "bold",
  },
  verifyBtn: {
    backgroundColor: "#F6B93B",
    paddingVertical: hp('2%'),
    width: "92%",
    borderRadius: wp('2%'),
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp('5%'),
  },
});
