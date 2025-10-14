import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>Privacy Policy</Text>

        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data while using our application.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>1. Information Collection</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We may collect personal information such as your name, email address, and usage data to improve our services and provide a better user experience.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>2. Use of Information</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Your information is used to personalize your experience, provide customer support, and improve the app's functionality. We do not share your personal data with third parties without your consent.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>3. Security</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction.
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>4. Changes to Policy</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          We may update this Privacy Policy periodically. Any changes will be communicated through the app, and continued use signifies your acceptance of the updated policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

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
});
