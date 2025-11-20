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
import Icon from 'react-native-vector-icons/Feather';

const Signin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [nextRoute, setNextRoute] = useState(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setPopupMessage('Please enter both email and password.');
      setNextRoute(null);
      setPopupVisible(true);
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
        }
      );
      
      const data = await response.json();
      console.log('📥 Login API Response:', JSON.stringify(data, null, 2));
      console.log('🔑 Response Status:', response.status);
      
      if (response.ok && data.token) {
        console.log('✅ Login successful!');
        console.log('🎯 User ID from response:', data.user?._id);
        console.log('🔐 Token from response:', data.token);
        console.log('👤 Full user data:', data.user);

        // Store all necessary data in AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        
        // Store userId separately for easy access
        if (data.user && data.user._id) {
          await AsyncStorage.setItem('userId', data.user._id);
          console.log('💾 User ID stored in AsyncStorage:', data.user._id);
        } else {
          console.warn('⚠️ No user ID found in response');
        }

        // Verify stored data
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        console.log('🔍 Verification - Stored Token:', storedToken);
        console.log('🔍 Verification - Stored User ID:', storedUserId);
        console.log('🔍 Verification - Stored User Data:', storedUserData);

        setPopupMessage('Login successful!');
        setNextRoute({
          name: 'MainTabs',
          params: { from: 'Home', user: data },
        });
        setPopupVisible(true);
      } else {
        console.error('❌ Login failed:', data.message);
        setPopupMessage(data.message || 'Login Failed');
        setNextRoute(null);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, borderWidth: 0.5, borderLeftWidth: 0, borderRightWidth: 0, marginBottom: 0 }]}
            placeholder="Enter password"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color={showPassword ? COLORS.primary : 'gray'}
              style={{ marginLeft: wp('2%') }}
            />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.signupText}>Don't have an account?</Text>
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
    paddingHorizontal: wp('2%'),
    fontSize: wp('3.5%'),
    backgroundColor: '#fff',
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    height: hp('6%'),
    paddingHorizontal: wp('3%'),
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