import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
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
  const [errorState, setErrorState] = useState({
    email: false,
    password: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const isFormValid = useMemo(() => {
    const errors = { email: false, password: false };
    const messages = { email: '', password: '' };

    if ((hasSubmitted || email) && !email.trim()) {
      errors.email = true;
      messages.email = 'Email is required';
    } else if ((hasSubmitted || email.trim()) && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      errors.email = true;
      messages.email = 'Please enter a valid Gmail address';
    }

    if ((hasSubmitted || password) && !password.trim()) {
      errors.password = true;
      messages.password = 'Password is required';
    }

    setErrorState(errors);
    setErrorMessages(messages);
    return !Object.values(errors).some(Boolean);
  }, [email, password, hasSubmitted]);

  const getUserFriendlyError = useCallback((status: number, errorData: string) => {
    console.log('🔍 Server error analysis:', status, errorData);
    
    try {
      const errorJson = JSON.parse(errorData);
      const message = errorJson.message?.toLowerCase() || '';
      
      if (message.includes('invalid') || message.includes('incorrect')) {
        return { message: 'Invalid email or password', emailError: true, passwordError: true };
      }
      if (message.includes('email') || message.includes('account')) {
        return { message: 'Email not registered', emailError: true, passwordError: false };
      }
      if (message.includes('password')) {
        return { message: 'Incorrect password', emailError: false, passwordError: true };
      }
    } catch (e) {}

    switch (status) {
      case 400: return { message: 'Invalid credentials', emailError: true, passwordError: true };
      case 401: return { message: 'Invalid email or password', emailError: true, passwordError: true };
      case 403: return { message: 'Account access denied', emailError: true, passwordError: true };
      case 404: return { message: 'Account not found', emailError: true, passwordError: false };
      case 429: return { message: 'Too many login attempts', emailError: false, passwordError: false };
      case 500: return { message: 'Server error. Try again later', emailError: false, passwordError: false };
      default: return { message: 'Login failed. Please try again', emailError: true, passwordError: true };
    }
  }, []);

  const showSuccessAndNavigate = useCallback(() => {
    setPopupMessage('Login Successful!');
    setPopupVisible(true);
    setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1500);
  }, [navigation]);

  // ⚡ Ultra-fast login with field-specific error highlighting
  const handleSignIn = useCallback(async () => {
    setHasSubmitted(true);
    setServerError('');

    if (!isFormValid) {
      setPopupMessage('Please fix all errors before submitting.');
      setPopupVisible(true);
      return;
    }

    setLoading(true);
    setPopupVisible(false);

    try {
      console.log('📤 Fast login request...');
      
      const response = await Promise.race([
        fetch('https://naushad.onrender.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]);

      if (!response.ok) {
        const errorData = await response.text();
        console.log('❌ Login failed:', response.status, errorData);
        
        const userError = getUserFriendlyError(response.status, errorData);
        
        setErrorState(prev => ({
          ...prev,
          email: userError.emailError,
          password: userError.passwordError
        }));
        
        setPopupMessage(userError.message);
        setPopupVisible(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Login success:', data);

      // Clear errors on success
      setErrorState({ email: false, password: false });
      setErrorMessages({ email: '', password: '' });

      // 🚀 Fast AsyncStorage batch save
      if (data?.token) {
        await Promise.all([
          AsyncStorage.setItem('userToken', data.token),
          AsyncStorage.setItem('userData', JSON.stringify(data)),
          data.user?._id ? AsyncStorage.setItem('userId', data.user._id) : Promise.resolve()
        ]);
        console.log('✅ Login data saved successfully');
        
        // 🔥 NEW: Save user's gender to AsyncStorage if available
        if (data.user?.gender) {
          await AsyncStorage.setItem('userGender', data.user.gender.toLowerCase());
          console.log('✅ User gender saved:', data.user.gender);
        }
      }

      showSuccessAndNavigate();
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setErrorState({ email: false, password: false });
      let errorMsg = 'Network error. Please check connection.';
      if (error.message.includes('timeout')) {
        errorMsg = 'Request timeout. Try again.';
      } else if (error.message.includes('Network')) {
        errorMsg = 'No internet connection.';
      }
      setPopupMessage(errorMsg);
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  }, [isFormValid, email, password, navigation, showSuccessAndNavigate, getUserFriendlyError]);

  const handlePopupClose = useCallback(() => {
    setPopupVisible(false);
    setServerError('');
  }, []);

  const getBorderColor = (field: keyof typeof errorState, fieldValue: string) => {
    return (errorState[field] && (hasSubmitted || fieldValue.trim())) ? '#FF4444' : COLORS.primary;
  };

  const ErrorMessage = ({ message, field }: { message: string; field: keyof typeof errorMessages }) => {
    if (!errorState[field] || !(hasSubmitted || message)) return null;
    return <Text style={styles.errorText}>{message}</Text>;
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
          style={[styles.input, { borderColor: getBorderColor('email', email) }]}
          placeholder="Enter your email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ErrorMessage message={errorMessages.email} field="email" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={[styles.passwordContainer, { borderColor: getBorderColor('password', password) }]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color={showPassword ? COLORS.primary : 'gray'}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <ErrorMessage message={errorMessages.password} field="password" />
      </View>

      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => navigation.navigate('ForgetPassword')}
        activeOpacity={0.7}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.signinButton, 
          { 
            backgroundColor: isFormValid ? COLORS.primary : '#ccc',
            opacity: loading ? 0.7 : 1
          }
        ]}
        onPress={handleSignIn}
        disabled={!isFormValid || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.signinButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
          <Text style={[styles.signupLink, { color: COLORS.primary }]}>
            {' '}Sign Up
          </Text>
        </TouchableOpacity>
      </View>

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
    marginBottom: hp('1.5%'),
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
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    height: hp('6%'),
    paddingHorizontal: wp('3%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('6%'),
    paddingHorizontal: wp('1%'),
    fontSize: wp('3.5%'),
    backgroundColor: 'transparent',
    color: 'black',
  },
  eyeIcon: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1.8%'),
  },
  errorText: {
    fontSize: wp('3%'),
    color: '#FF4444',
    marginTop: hp('0.2%'),
    marginBottom: hp('0.8%'),
    fontWeight: '500',
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