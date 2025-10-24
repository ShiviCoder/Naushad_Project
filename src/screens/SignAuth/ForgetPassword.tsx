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

  const validateEmail = email => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = value => {
    setEmail(value);
    if (!value) setEmailError('');
    else if (!validateEmail(value)) setEmailError('Enter a valid email');
    else setEmailError('');
  };

  const handlePasswordChange = value => {
    setNewPassword(value);
    if (value.length < 6) setPasswordError('Password must be 6+ characters');
    else setPasswordError('');
  };

  const handleConfirmChange = value => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      navigation.navigate('Signin');
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: wp('7%'),
          }}
          keyboardShouldPersistTaps="handled"
        >
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
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={'gray'}
            value={confirmPassword}
            onChangeText={handleConfirmChange}
            secureTextEntry
          />
          {confirmError ? (
            <Text style={styles.error}>{confirmError}</Text>
          ) : null}

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

          <View style={styles.helperContainer}>
            <Text style={styles.helperText}>
              <Text> Remember your password? </Text>
              <Text
                style={[styles.helperLink, { color: COLORS.primary }]}
                onPress={() => navigation.navigate('Signin')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  label: {
    fontSize: wp('3%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    marginTop: hp('1.5%'),
    color: '#333',
  },
  input: {
    width: '100%',
    height: hp('4.5%'),
    backgroundColor: '#f1efefff',
    borderWidth: wp('0.2%'),
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('3%'),
  },
  error: { color: 'red', marginBottom: hp('1%') },
  button: {
    padding: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: wp('4%') },
  logo: {
    width: wp('70%'),
    height: hp('20%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  helperContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  helperText: {
    color: '#666',
    fontSize: wp('3%'),
  },
  helperLink: {
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
