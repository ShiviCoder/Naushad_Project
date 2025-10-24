import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (!value) setEmailError('');
    else if (!validateEmail(value)) setEmailError('Enter a valid email');
    else setEmailError('');
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    if (value.length < 6) setPasswordError('Password must be 6+ characters');
    else setPasswordError('');
  };

  const handleConfirmChange = (value) => {
    setConfirmPassword(value);
    if (value !== newPassword) setConfirmError('Passwords do not match');
    else setConfirmError('');
  };

  const handleResetPassword = async () => {
    if (
      !validateEmail(email) ||
      newPassword.length < 6 ||
      confirmPassword !== newPassword
    ) {
      Alert.alert('Error', 'Please fill all fields correctly.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      navigation.navigate('Signin');
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={'gray'}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={'gray'}
            value={newPassword}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={'gray'}
            value={confirmPassword}
            onChangeText={handleConfirmChange}
            secureTextEntry
          />
          {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={[styles.signinLink, { color: COLORS.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  logo: {
    width: wp('70%'),
    height: hp('15%'),
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  label: {
    fontSize: wp('3.6%'),
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
    marginBottom: hp('1.3%'),
  },
  error: { color: 'red', marginBottom: hp('1%') },
  button: {
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
  },
  signinText: {
    fontSize: wp('3.5%'),
    color: '#000',
  },
  signinLink: {
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
});

export default ForgotPassword;
