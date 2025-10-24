import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext'; // theme context import
import { SafeAreaView } from 'react-native-safe-area-context';

const OfferScreen = () => {
  const { theme } = useTheme(); // theme access

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
=======
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      <Head title="OfferScreen" />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          🎉 Special Offers for You!
        </Text>
        <Text style={[styles.subText, { color: theme.textPrimary }]}>
          Check out our latest discounts and promotions.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OfferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
=======
   
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  content: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
=======
    fontFamily : 'Poppins-Medium'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
=======
    fontFamily : 'Poppins-Medium'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
});
