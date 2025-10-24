import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const ADMIN_EMAIL = 'ad@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';

const Signin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleSignIn = async() => {
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
      const response = await fetch('https://naushad.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
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
      console.log("Finally block");
    }
    // For demo: Navigate to HomeScreen after successful sign-in
     navigation.replace('MainTabs', { from: 'Home' });
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
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize='none'
              />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={'gray'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
      
      </View>

      <TouchableOpacity  style={styles.forgotPasswordContainer} onPress={()=>{
        navigation.navigate("ForgetPassword")
      }}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.signupButton,{backgroundColor : COLORS.primary}]} 
      onPress={handleSignIn}
      disabled={loading}>
       {loading ? (
                 <ActivityIndicator color="#fff" />
               ) : (
                 <Text style={styles.signupButtonText}>Sign In</Text>
               )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.signupLink,{color : COLORS.primary}]}> Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("1%"),
    marginTop: hp("4%"),
  },
  inputContainer: {
    width: '95%',
    marginBottom: hp('2%'),
  },
   label: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    marginTop: hp("0.5%"),
    color: "#000",
  },
  input: {
    height: hp("4.5%"),
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("3%"),
    backgroundColor: "#fff",
    color:"black"
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('3%'),
  },
  forgotText: {
    color: '#000',
    fontSize: wp('3%'),
    fontWeight: '500',
    alignSelf : 'center'
  },
  signupButton: {
    paddingVertical: hp("1.3%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
    width : '98%'
  },
  signupButtonText: {
    color: "#fff",
    fontSize: wp("3%"),
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('6%'),
    paddingBottom: hp('2%'),
  },
  signupText: {
    fontSize: wp('3%'),
    color: '#000',
  },
  signupLink: {
    fontWeight: 'bold',
    fontSize: wp('3%'),
  },
});
