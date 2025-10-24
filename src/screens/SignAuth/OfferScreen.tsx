import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext'; // theme context import
import { SafeAreaView } from 'react-native-safe-area-context';

const OfferScreen = () => {
  const { theme } = useTheme(); // theme access

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
