import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
<<<<<<< HEAD
  Alert,
  ActivityIndicator,
=======
  ActivityIndicator
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
} from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
<<<<<<< HEAD
=======
import Popup from '../../components/PopUp';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

const ADMIN_EMAIL = 'ad@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';

const Signin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      Alert.alert('Access Denied', 'Only admin can log in.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );
=======
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [nextRoute, setNextRoute] = useState(null); // For navigation after popup

  const handleSignIn = async () => {
    if (!email || !password) {
      setPopupMessage('Please enter both email and password.');
      setNextRoute(null);
      setPopupVisible(true);
      return;
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setPopupMessage('Access Denied. Only admin can login.');
      setNextRoute(null);
      setPopupVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://naushad.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

      const data = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        Alert.alert('Success', 'Login successful!');
        console.log('User Data:', data);
        // Navigate to MainTabs screen
        navigation.replace('MainTabs', { from: 'Home', user: data });
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      console.log('Finally block');
    }
    // For demo: Navigate to HomeScreen after successful sign-in
    navigation.replace('MainTabs', { from: 'Home' });
=======
        setPopupMessage('Login successful!');
        setNextRoute({ name: 'MainTabs', params: { from: 'Home', user: data } });
        setPopupVisible(true);
      } else {
        setPopupMessage(data.message || 'Login Failed');
        setNextRoute(null);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setPopupMessage('Something went wrong. Please try again.');
      setNextRoute(null);
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (nextRoute) {
      navigation.replace(nextRoute.name, nextRoute.params);
    }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
<<<<<<< HEAD
          placeholderTextColor={'gray'}
=======
          placeholderTextColor="gray"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
<<<<<<< HEAD
          placeholderTextColor={'gray'}
=======
          placeholderTextColor="gray"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

<<<<<<< HEAD
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => {
          navigation.navigate('ForgetPassword');
        }}
      >
=======
      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate("ForgetPassword")}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
<<<<<<< HEAD
        style={[styles.signupButton, { backgroundColor: COLORS.primary }]}
=======
        style={[styles.signinButton, { backgroundColor: COLORS.primary }]}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
<<<<<<< HEAD
          <Text style={styles.signupButtonText}>Sign In</Text>
=======
          <Text style={styles.signinButtonText}>Sign In</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
<<<<<<< HEAD
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.signupLink, { color: COLORS.primary }]}>
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
=======
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.signupLink, { color: COLORS.primary }]}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={handlePopupClose}
      />
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
  },
  logo: {
<<<<<<< HEAD
    width: wp('70%'),
    height: hp('20%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('4%'),
=======
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
    marginTop: hp("4%"),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  inputContainer: {
    width: '95%',
    marginBottom: hp('2%'),
  },
  label: {
<<<<<<< HEAD
    fontSize: wp('3.5%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
    color: '#000',
  },
  input: {
    height: hp('4.5%'),
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('3%'),
    backgroundColor: '#fff',
    color: 'black',
=======
    fontSize: wp("4%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    marginTop: hp("0.5%"),
    color: "#000",
  },
  input: {
    height: hp("6%"),
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("3.5%"),
    backgroundColor: "#fff",
    color: "black",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('3%'),
  },
  forgotText: {
    color: '#000',
<<<<<<< HEAD
    fontSize: wp('3%'),
    fontWeight: '500',
    alignSelf: 'center',
  },
  signupButton: {
    paddingVertical: hp('1.3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
    width: '98%',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
=======
    fontSize: wp('3.5%'),
    fontWeight: '500',
    alignSelf: 'center',
  },
  signinButton: {
   paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
    width: '98%',
  },
  signinButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('6%'),
    paddingBottom: hp('2%'),
  },
  signupText: {
<<<<<<< HEAD
    fontSize: wp('3%'),
=======
    fontSize: wp('3.5%'),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    color: '#000',
  },
  signupLink: {
    fontWeight: 'bold',
<<<<<<< HEAD
    fontSize: wp('3%'),
=======
    fontSize: wp('3.5%'),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
});
