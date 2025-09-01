import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert, // Import Alert for feedback
} from 'react-native';
import React, { useState } from 'react'; // Import useState

// Accept { navigation } as a prop to use React Navigation
const Signin = ({ navigation }) => {
  // State variables to hold the input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle the sign-in action
  const handleSignIn = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    // In a real app, you would send this to your backend server for authentication.
    console.log('Signing in with:', { email, password });
    // Corrected success message to "Signed in"
    Alert.alert('Success', `Signed in with email: ${email}`);
  };

  return (
    // Use a single root element (SafeAreaView) for the entire component
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain" // Added for better image scaling
      />

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.inputtext}
          value={email}
          onChangeText={setEmail} // Update state on change
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.inputtext}
          value={password}
          onChangeText={setPassword} // Update state on change
          secureTextEntry // Hides password characters
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Signin Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignIn}>
        <Text style={styles.signupButtonText}>SIGN IN</Text>
      </TouchableOpacity>

      {/* "Don't have an account?" Section moved inside the root element */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupLink}> Signup</Text>
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
    paddingHorizontal: 20, // Add horizontal padding for spacing
  },
  logo: {
    width: 298,
    height: 169,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%', // Use percentage for responsiveness
    marginBottom: 15,
  },
  inputtext: {
    width: '100%',
    height: 50,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start', // Aligned to the right as is common practice
    marginBottom: 20,
  },
  forgotText: {
   
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#F6B745',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    paddingBottom:20,
  
  },
  signupText: {
    fontSize: 14,
    color: '#000',
  },
  signupLink: {
    color: '#f7b731',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
