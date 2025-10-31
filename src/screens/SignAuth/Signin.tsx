import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';


// const ADMIN_EMAIL = 'shivani123@gmail.com';
// const ADMIN_PASSWORD = 'shi123';


const Signin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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


    // if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    //   setPopupMessage('Access Denied. Only admin can login.');
    //   setNextRoute(null);
    //   setPopupVisible(true);
    //   return;
    // }


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
      const data = await response.json();
      if (response.ok && data.token) {
        console.log('Token :' , data.token);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        setPopupMessage('Login successful!');
        setNextRoute({
          name: 'MainTabs',
          params: { from: 'Home', user: data },
        });
        setPopupVisible(true);
      } else {
        setPopupMessage(data.message || 'Login Failed');
        setNextRoute(null);
        setPopupVisible(true);
      }
    } 
    catch (error) {
      console.error('Login Error:', error);
      setPopupMessage('Something went wrong. Please try again.');
      setNextRoute(null);
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }


    // setPopupMessage('Login successful!');
    //     setNextRoute({
    //       name: 'MainTabs',
    //       params: { from: 'Home'},
    //     });
    //     setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (nextRoute) {
      navigation.replace(nextRoute.name, nextRoute.params);
    }
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
          placeholderTextColor="gray"
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
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>


      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => navigation.navigate('ForgetPassword')}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.signinButton, { backgroundColor: COLORS.primary }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signinButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>


      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.signupLink, { color: COLORS.primary }]}>
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>


      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={handlePopupClose}
      />
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
    width: wp('70%'),
    height: hp('20%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('4%'),
  },
  inputContainer: {
    width: '95%',
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
    color: '#000',
  },
  input: {
    height: hp('6%'),
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('3.5%'),
    backgroundColor: '#fff',
    color: 'black',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('3%'),
  },
  forgotText: {
    color: '#000',
    fontSize: wp('3.5%'),
    fontWeight: '500',
    alignSelf: 'center',
  },
  signinButton: {
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
    width: '98%',
  },
  signinButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('6%'),
    paddingBottom: hp('2%'),
  },
  signupText: {
    fontSize: wp('3.5%'),
    color: '#000',
  },
  signupLink: {
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
});