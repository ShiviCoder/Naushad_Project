import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentId } = route.params;
  const {theme} = useTheme();
  // Function to navigate to Bookings tab in MainTabs
  const navigateToBookingsTab = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: { screen: 'BookingScreen' },
        },
      ],
    });
  };

  // Disable hardware back button & force navigate to Bookings tab
  useEffect(() => {
    const backAction = () => {
      navigateToBookingsTab();
      return true;
    };

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea,{backgroundColor : theme.background}]}>
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.container}>
        <View style={styles.successImageWrapper}>
          <Image
            source={require('../../assets/images/success.png')}
            style={styles.successImage}
            resizeMode="contain"
            tintColor={COLORS.primary}
          />
        </View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successMessage}>
          Your payment has been completed successfully.
        </Text>
        <Text style={styles.paymentIdLabel}>Payment ID:</Text>
        <Text style={styles.paymentId}>{paymentId}</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={navigateToBookingsTab}
          activeOpacity={0.85}
        >
          <Text style={styles.payButtonText}>Go To Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  logoWrapper: {
    width: wp('70%'),
    height: hp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5, // Only 5 units top margin
    marginBottom: hp('2%'),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: wp('3%'),
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: hp('5%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  successImageWrapper: {
    marginBottom: hp('2%'),
    width: wp('24%'),
    height: hp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  successImage: {
    width: '100%',
    height: '100%',
    tintColor: COLORS.primary,
  },
  successTitle: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: hp('1%'),
  },
  successMessage: {
    fontSize: wp('4.5%'),
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: hp('2.5%'),
  },
  paymentIdLabel: {
    fontSize: wp('4%'),
    color: COLORS.text,
    marginBottom: hp('0.5%'),
  },
  paymentId: {
    fontSize: wp('4.3%'),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: hp('4%'),
  },
  payButton: {
    width: '100%',
    paddingVertical: hp('1.5%'),  
   borderRadius: wp('2%'),
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: COLORS.primary,
  },
  payButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
});
