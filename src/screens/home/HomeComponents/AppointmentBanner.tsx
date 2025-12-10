import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const AppointmentBanner = ({ gender, navigation, theme }) => {
  const bannerImage =
    gender === 'male'
      ? require('../../../assets/images/man-banner.jpg')
      : require('../../../assets/images/image1.jpg');

  return (
    <ImageBackground
      resizeMode="cover"
      source={bannerImage}
      style={styles.banner}
      imageStyle={styles.bannerImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.bannerText}>Book your appointment today</Text>
        <Text style={styles.bannerText}>
          and take your look to the next level
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('BookAppointmentScreen', {})}
          style={styles.bookNowBtn}
        >
          <Text style={styles.bookNowText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: wp('4%'),
    marginVertical: hp('2%'),
    height: hp('25%'),
    overflow: 'hidden',
    justifyContent: 'center',
    borderRadius: wp('3%'),
  },
  bannerImage: {
    borderRadius: wp('3%'),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(232, 227, 227, 0.54)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
  },
  bannerText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#0c0b0b',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: hp('0.5%'),
  },
  bookNowBtn: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    marginTop: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },
});

export default AppointmentBanner;
