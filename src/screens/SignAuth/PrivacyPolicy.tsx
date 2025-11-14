import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const [privacy,setPrivacy] = useState();
 
   const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }


 const fetchPrivacy = async () => {
    try {
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg'
      const token = await getToken();
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
        <Text style={[styles.heading, { color: theme.textSecondary }]}>
         {privacy?.title}
        </Text>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Information Collection</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {privacy?.content}
        </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Use of Information</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
         {privacy?.content}
        </Text>
        </View>


        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Security</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {privacy?.content}
        </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
        <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Changes to Policy</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
         {privacy?.content}
        </Text>
        </View>
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
    textAlign: 'left',
  },
  subHeading: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
   card: {
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 3,
  },
  text: {
    fontSize: wp('4%'),
    lineHeight: hp('2.5%'),
    textAlign: 'justify',
  },
});
