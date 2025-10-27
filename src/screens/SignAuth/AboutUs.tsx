import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutUs = () => {
  const { theme } = useTheme();
  const [aboutUs, setAboutUs] = useState();
  const fetchAboutUs = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg'
      const res = await fetch("https://naushad.onrender.com/api/about-us", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAboutUs(data.data);
      console.log("About US token: ", token);
      console.log("About US Data:", data);
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAboutUs();
  }, [])
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="About Us" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>Welcome to Our App!</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {aboutUs?.title}
        </Text>


        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Our Vision</Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            {aboutUs?.content}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Our Values</Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            Innovation, Integrity, Customer First, Excellence, and Continuous Improvement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutUs

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
