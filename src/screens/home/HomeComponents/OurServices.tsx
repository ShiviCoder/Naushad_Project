// src/components/.../OurServices.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useCart } from '../../../context/CartContext';
import COLORS from '../../../utils/Colors';

const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');

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

const OurServices = ({
  services,
  gender,
  navigation,
  handleSectionNavigation,
}) => {
  const { addToCart } = useCart();

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <ServiceImage uri={item.imageUrl} />

      <View style={styles.nameItem}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.serviceName || item.name || 'Service'}
        </Text>
      </View>

      <Text style={styles.serviceDesc} numberOfLines={2}>
        {item.title || item.description || 'Service description'}
      </Text>

      <Text style={styles.servicePriceBold}>₹{item.price || '0'}</Text>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => {
          addToCart({
            id: item._id?.toString?.() || String(item._id),
            name: item.serviceName || item.name || 'Service',
            price: item.price || 0,
            qty: 1,
          });

          navigation.navigate('ServiceDetails', {
            item: { ...item, image: item.imageUrl },
          });
        }}
      >
        <Text style={styles.bookBtnText}>Book now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our services</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('services')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderServiceItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found for {gender}</Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: wp('3.8%'),
  },
  listContainer: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
  },

  // Increased height: 30% → 33%
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
    height: hp('33%'), // UPDATED
  },

  serviceImage: {
    width: '100%',
    height: hp('15%'),
    borderRadius: wp('3%'),
    marginBottom: 0,
  },
  nameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    marginTop: hp('0.5%'),
  },
  serviceName: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: '#060505',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: wp('2%'),
    marginBottom: 0,
  },
  serviceDesc: {
    color: '#1111118A',
    fontSize: wp('3.2%'),
    marginBottom: 0,
    marginTop: hp('0.3%'),
    alignSelf: 'flex-start',
    lineHeight: wp('4%'),
    height: hp('4%'),
  },
  servicePriceBold: {
    width: '100%',
    textAlign: 'left',
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.3%'),
    marginBottom: 0,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: hp('0.5%'),
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    width: wp('90%'),
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: wp('3.8%'),
  },
});

export default OurServices;
