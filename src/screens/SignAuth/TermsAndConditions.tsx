import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsAndConditions = () => {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Terms And Conditions" />
      <ScrollView contentContainerStyle={styles.contentContainer}>    
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Welcome to our app. By using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using the app.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>1. Use of Services</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          You agree to use the app only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use of the app.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>2. User Responsibilities</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>3. Limitation of Liability</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the app.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>4. Changes to Terms</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We may modify these terms at any time, and changes will be posted within the app. Continued use signifies acceptance of updated terms.
        </Text>

        {/* Accept Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAccepted(!accepted)}
        >
          <View style={[styles.checkbox, { borderColor: theme.textPrimary }]}>
            {accepted && <Icon name="checkmark" size={wp('4%')} color="#42BA86" />}
          </View>
          <Text style={[styles.checkboxText, { color: theme.textPrimary }]}>
            I have read and accept the Terms and Conditions
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: wp('5%'),
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  subHeading: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  text: {
    fontSize: wp('4%'),
    lineHeight: hp('2.5%'),
    textAlign: 'justify',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 2,
    borderRadius: 4,
    marginRight: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: wp('4%'),
    flexShrink: 1,
  },
});
