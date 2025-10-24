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
<<<<<<< HEAD
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
=======
  Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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

<<<<<<< HEAD
  const validateEmail = email => {
=======
  const validateEmail = (email) => {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

<<<<<<< HEAD
  const handleEmailChange = value => {
=======
  const handleEmailChange = (value) => {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    setEmail(value);
    if (!value) setEmailError('');
    else if (!validateEmail(value)) setEmailError('Enter a valid email');
    else setEmailError('');
  };

<<<<<<< HEAD
  const handlePasswordChange = value => {
=======
  const handlePasswordChange = (value) => {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    setNewPassword(value);
    if (value.length < 6) setPasswordError('Password must be 6+ characters');
    else setPasswordError('');
  };

<<<<<<< HEAD
  const handleConfirmChange = value => {
=======
  const handleConfirmChange = (value) => {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    setConfirmPassword(value);
    if (value !== newPassword) setConfirmError('Passwords do not match');
    else setConfirmError('');
  };

  const handleResetPassword = async () => {
<<<<<<< HEAD
    if (
      !validateEmail(email) ||
      newPassword.length < 6 ||
      confirmPassword !== newPassword
    ) {
=======
    if (!validateEmail(email) || newPassword.length < 6 || confirmPassword !== newPassword) {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      Alert.alert('Error', 'Please fill all fields correctly.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
<<<<<<< HEAD
      navigation.navigate('Signin');
=======
      navigation.navigate('Signin')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
=======
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={'gray'}
            value={confirmPassword}
            onChangeText={handleConfirmChange}
            secureTextEntry
          />
<<<<<<< HEAD
          {confirmError ? (
            <Text style={styles.error}>{confirmError}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
=======
          {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}

          <TouchableOpacity
            style={[styles.button,{backgroundColor : COLORS.primary}]}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
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
=======
             <Text> Remember your password?{' '}</Text>
              <Text style={[styles.helperLink,{color : COLORS.primary}]} onPress={()=>navigation.navigate("Signin")}>
                Sign In
              </Text>
            </Text>
          </View>        
          </ScrollView>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
    marginTop: hp('1.5%'),
=======
    marginTop: hp("1.5%"),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
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
=======
  button: { padding: hp('1.5%'), borderRadius: wp('2%'), alignItems: 'center', marginTop: hp('2%') },
  buttonText: { color: '#fff', fontWeight: 'bold',     fontSize: wp("4%"),
 },
  logo: {
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
  },
   helperContainer: {
    alignItems: 'center',
    marginVertical : hp('2%'),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
