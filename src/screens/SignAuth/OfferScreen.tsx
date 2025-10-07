import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext'; // theme context import

const OfferScreen = () => {
  const { theme } = useTheme(); // theme access

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="OfferScreen" />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>
          🎉 Special Offers for You!
        </Text>
        <Text style={[styles.subText, { color: theme.subText }]}>
          Check out our latest discounts and promotions.
        </Text>
      </View>
    </View>
  );
};

export default OfferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  content: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily : 'Poppins-Medium'
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
    fontFamily : 'Poppins-Medium'
  },
});
