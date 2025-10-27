import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const [privacy,setPrivacy] = useState();
 const fetchPrivacy = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg'
      const res = await fetch("https://naushad.onrender.com/api/privacy-policy", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPrivacy(data.data);
      console.log("Privacy policy token: ", token);
      console.log("Privacy Data:", data);
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchPrivacy();
  },[])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>{privacy?.title}</Text>

        <Text style={[styles.text, { color: theme.textSecondary }]}>
         {privacy?.content}
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>1. Information Collection</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {privacy?.content}
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>2. Use of Information</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
         {privacy?.content}
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>3. Security</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {privacy?.content}
        </Text>

        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>4. Changes to Policy</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
         {privacy?.content}
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
