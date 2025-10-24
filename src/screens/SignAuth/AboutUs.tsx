import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutUs = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Head title="About Us" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          Welcome to Our App!
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Our mission is to provide the best services and products to our users.
          We aim to create a seamless experience with user-friendly design and
          innovative solutions. Explore our app to discover amazing features and
          benefits tailored just for you.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.dark ? '#333' : '#f5f5f5' },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Our Vision
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            To become the most trusted platform in the industry, offering
            quality services and solutions to everyone.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.dark ? '#333' : '#f5f5f5' },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Our Values
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            Innovation, Integrity, Customer First, Excellence, and Continuous
            Improvement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

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
  description: {
    fontSize: wp('4%'),
    lineHeight: hp('3%'),
    textAlign: 'justify',
    marginBottom: hp('3%'),
  },
  card: {
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 3,
  },
  cardTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  cardText: {
    fontSize: wp('4%'),
    lineHeight: hp('2.5%'),
  },
});
