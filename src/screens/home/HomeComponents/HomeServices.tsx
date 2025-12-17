// src/screens/home/components/HomeServices.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

// Assets
const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');
const HOME_BG = require('../../../assets/homebg.png');

/* -------------------------------------------------------------------------- */
/*                               Helper Image                                 */
/* -------------------------------------------------------------------------- */

const ServiceImage = ({ uri }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <Image
        source={PLACEHOLDER_IMAGE}
        style={styles.serviceImage}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.serviceImage}
      resizeMode="cover"
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                                */
/* -------------------------------------------------------------------------- */

const HomeServices = ({ homeServices, navigation }) => {
  const renderHomeServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <ServiceImage uri={item.image} />

      <View style={styles.nameItem}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.name || 'Service'}
        </Text>
        <Text style={styles.servicePrice}>₹ {item.price || '0'}</Text>
      </View>

      <Text style={styles.serviceDesc} numberOfLines={2}>
        {item.description || 'Service description'}
      </Text>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() =>
          navigation.navigate('HomeServiceSelectionScreen', { item })
        }
      >
        <Text style={styles.bookBtnText}>Book now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {/* ---------------------------- SECTION TITLE FIRST ---------------------------- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Home services</Text>
      </View>

      {/* ---------------------------- HERO BANNER ---------------------------- */}
      <ImageBackground
        source={HOME_BG}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.bannerOverlay} />

        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>
            Book your appointment today{'\n'}
            and take your look to the next level
          </Text>

          <TouchableOpacity
            style={styles.bannerBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeServiceSelectionScreen')}
          >
            <Text style={styles.bannerBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* ------------------------------ SERVICES LIST ------------------------------ */}
      <FlatList
        data={homeServices}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderHomeServiceItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* <Text style={styles.emptyText}>No home services available</Text> */}
          </View>
        }
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Section */
  sectionHeader: {
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    color: '#000',
  },

  /* Banner */
  banner: {
    height: hp('26%'),
    marginHorizontal: wp('4%'),
    marginTop: hp('1.5%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerContent: {
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  bannerText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: wp('6%'),
    marginBottom: hp('2%'),
  },
  bannerBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('10%'),
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },

  /* List */
  listContainer: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
  },

  /* Card */
  serviceCard: {
    width: wp('42%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: wp('3%'),
    alignItems: 'center',
    height: hp('33%'),
  },
  serviceImage: {
    width: '100%',
    height: hp('15%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
  },
  nameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp('0.5%'),
  },
  serviceName: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: wp('2%'),
  },
  servicePrice: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },
  serviceDesc: {
    color: '#1111118A',
    fontSize: wp('3.2%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
    height: hp('4%'),
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    width: '100%',
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
  },

  emptyContainer: {
    width: wp('90%'),
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyText: {
    color: '#666',
    fontSize: wp('3.8%'),
  },
});

export default HomeServices;
