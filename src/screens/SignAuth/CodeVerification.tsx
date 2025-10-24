<<<<<<< HEAD
import React, { useState, useRef, useEffect, ActivityIndicator } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const navigation = useNavigation(); // Navigation Hook
  const [loading, setLoading] = useState(false);
=======
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import PopUp from "../../components/PopUp";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
<<<<<<< HEAD

      // Auto move to next input
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
=======
      if (index < 5) inputRefs.current[index + 1].focus();
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    }
  };

  // Resend OTP
  const handleResend = () => {
<<<<<<< HEAD
    setOtp(['', '', '', '', '', '']);
=======
    setOtp(["", "", "", "", "", ""]);
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    setTimer(59);
  };

  // Verify OTP
  const handleVerify = async () => {
<<<<<<< HEAD
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true); // loader start
    try {
      // fake API delay (simulate backend verification)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('OTP Entered:', otpCode);
      navigation.navigate('Signin');
    } catch (error) {
      console.error(error);
      Alert.alert('Something went wrong!');
    } finally {
      setLoading(false); // loader stop
=======
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setPopupMessage("Please enter the complete 6-digit OTP");
      setPopupVisible(true);
      setNextRoute(null);
      return;
    }

    setLoading(true);
    try {
      // simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false); // stop loader before popup

      setPopupMessage("OTP Verified Successfully!");
      setPopupVisible(true);
      setNextRoute({ name: "Signin" });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setPopupMessage("Something went wrong!");
      setPopupVisible(true);
      setNextRoute(null);
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (nextRoute) {
      navigation.navigate(nextRoute.name, nextRoute.params);
      setNextRoute(null);
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
<<<<<<< HEAD
        source={require('../../assets/images/logo.png')} // Change this path to your logo
=======
        source={require("../../assets/images/logo.png")}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Heading */}
      <Text style={styles.title}>Enter your</Text>
      <Text style={styles.title}>Verification code</Text>

      {/* Subtext */}
      <Text style={styles.subtitle}>
<<<<<<< HEAD
        We will send you an One Time Passcode{'\n'}via this mail@gmail.com email
        address
=======
        We will send you an One Time Passcode{"\n"}via this mail@gmail.com email address
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
            onChangeText={text => handleChange(text, index)}
            ref={ref => (inputRefs.current[index] = ref)}
            onKeyPress={({ nativeEvent }) => {
<<<<<<< HEAD
              if (nativeEvent.key === 'Backspace') {
                const newOtp = [...otp];

                if (otp[index] === '') {
                  // agar current box already empty hai -> pehle wale box pe jao
                  if (index > 0) {
                    inputRefs.current[index - 1].focus();
                    newOtp[index - 1] = '';
                  }
                } else {
                  // agar current box me digit hai -> usi box ko clear karo
                  newOtp[index] = '';
                }

=======
              if (nativeEvent.key === "Backspace") {
                const newOtp = [...otp];
                if (otp[index] === "" && index > 0) {
                  inputRefs.current[index - 1].focus();
                  newOtp[index - 1] = "";
                } else {
                  newOtp[index] = "";
                }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
                setOtp(newOtp);
              }
            }}
          />
        ))}
      </View>

      {/* Resend Row */}
      <View style={styles.resendRow}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.resendText}>Didn’t get it?</Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendButton}>Resend Code</Text>
          </TouchableOpacity>
        </View>
<<<<<<< HEAD

        <View>
          <Text style={styles.timer}>{`0:${
            timer < 10 ? `0${timer}` : timer
          }`}</Text>
        </View>
=======
        <Text style={styles.timer}>{`0:${timer < 10 ? `0${timer}` : timer}`}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyBtn, { backgroundColor: COLORS.primary }]}
        onPress={handleVerify}
<<<<<<< HEAD
      >
        <Text style={styles.verifyText}>VERIFY OTP</Text>
      </TouchableOpacity>
=======
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyText}>VERIFY OTP</Text>}
      </TouchableOpacity>
      
      {/* Popup */}
      <PopUp visible={popupVisible} message={popupMessage} onClose={handlePopupClose} />
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  logo: {
    width: wp('90%'),
    height: hp('20%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('7%'),
  },
  title: {
    fontSize: wp('9%'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: wp('3%'),
    textAlign: 'center',
    color: '#161414ff',
    marginVertical: hp('2%'),
    fontWeight: '500',
    lineHeight: hp('2%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('2%'),
  },
  otpInput: {
    width: wp('12%'),
    height: hp('6%'),
    textAlign: 'center',
    fontSize: hp('3%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
    backgroundColor: '#D9D9D975',
  },
  resendRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: hp('5%'),
    justifyContent: 'space-between',
  },
  resendText: {
    color: '#555',
  },
  resendButton: {
    color: '#000',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  timer: {
    marginLeft: wp('2%'),
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: 'bold',
  },
  verifyBtn: {
    paddingVertical: hp('2%'),
    width: '92%',
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
=======
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", paddingHorizontal: wp('5%') },
  logo: { width: wp("90%"), height: hp("17%"), alignSelf: "center", marginBottom: hp("1%") },
  title: { fontSize: wp('5%'), fontWeight: "bold", textAlign: "center", color: "#000" },
  subtitle: { fontSize: wp('3%'), textAlign: "center", color: "#161414ff", marginVertical: hp('2%'), fontWeight: '500', lineHeight: hp('2%') },
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: hp('2%') },
  otpInput: { width: wp('12%'), height: hp('6%'), textAlign: "center", fontSize: hp('2.5%'), borderRadius: wp('1%'), marginHorizontal: wp('1%'), backgroundColor: "#D9D9D975" },
  resendRow: { flexDirection: "row", width: '90%', alignItems: 'flex-start', marginBottom: hp('5%'), justifyContent: 'space-between' },
  resendText: { color: "#555", fontSize: wp('3.5%') },
  resendButton: { color: "#000", fontWeight: "bold", borderWidth: 1, borderColor: "#ccc", paddingHorizontal: wp('2%'), paddingVertical: hp('0.2%'), borderRadius: wp('4%'), marginHorizontal: 5, fontSize: wp('3%') },
  timer: { marginLeft: wp('2%'), color: "rgba(0, 0, 0, 1)", fontWeight: "bold" },
  verifyBtn: { paddingVertical: hp("1.5%"), borderRadius: wp("2%"), alignItems: "center", marginTop: hp("3%"), marginBottom: hp("2%"), width: '98%' },
  verifyText: { color: "#fff", fontWeight: "bold", fontSize: wp('4%') }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});
