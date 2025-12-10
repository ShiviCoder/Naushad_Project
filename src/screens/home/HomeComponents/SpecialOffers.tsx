import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const { width } = Dimensions.get('window');

const SpecialOffers = ({ offers, navigation, theme }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Special Offers
        </Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          key={offers.length}
          autoplay
          autoplayTimeout={3}
          showsPagination
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.paginationStyle}
        >
          {offers.map((item, index) => (
            <View key={index} style={styles.offerCard}>
              <View style={styles.offerLeft}>
                <Text style={styles.offerBig}>
                  {item.title || 'Special Offer'}
                </Text>
                <Text style={styles.offerSmall}>{item.discount || '0'}%</Text>
                <Text style={styles.offerDate}>
                  Date : {item.date || 'N/A'}
                </Text>
                <TouchableOpacity
                  style={styles.offerBtn}
                  onPress={() => navigation.navigate('OfferScreen')}
                >
                  <Text style={styles.offerBtnText}>Offer now</Text>
                </TouchableOpacity>
              </View>
              {/* <Image
                source={{ uri: item.imageUrl }}
                style={styles.offerRightImage}
                defaultSource={require('../../assets/placeholder.jpg')}
              /> */}
            </View>
          ))}
        </Swiper>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  swiperContainer: {
    height: hp('27%'),
    marginBottom: hp('4%'),
  },
  offerCard: {
    marginHorizontal: wp('3%'),
    marginVertical: hp('2%'),
    borderRadius: wp('4%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    height: hp('25%'),
    backgroundColor: COLORS.primary,
  },
  offerLeft: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    width: '50%',
    justifyContent: 'space-between',
  },
  offerBig: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    lineHeight: wp('5.5%'),
  },
  offerSmall: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  offerDate: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
  },
  offerRightImage: {
    width: '50%',
    resizeMode: 'cover',
    height: '100%',
  },
  offerBtn: {
    backgroundColor: '#fff',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('10%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  offerBtnText: {
    color: '#111',
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
  },
  dotStyle: {
    backgroundColor: '#ccc',
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
  },
  activeDotStyle: {
    backgroundColor: COLORS.primary,
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    marginHorizontal: wp('1%'),
  },
  paginationStyle: {
    bottom: -hp('3%'),
  },
});

export default SpecialOffers;
