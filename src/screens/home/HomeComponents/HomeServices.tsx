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
import COLORS from '../../../utils/Colors';

// Local placeholder
const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');

// Reusable image with fallback
const ServiceImage = ({ uri }) => {
  const [error, setError] = useState(false);

  // If no uri or error occurred, always show local placeholder
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
      // defaultSource is mainly for iOS / loading state; error handled via state
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const HomeServices = ({
  homeServices,
  gender,
  navigation,
  handleSectionNavigation,
}) => {
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
          navigation.navigate('ServiceDetails', {
            item: { ...item, image: item.image },
          })
        }
      >
        <Text style={styles.bookBtnText}>Book now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Home services</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('homeServices')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={homeServices}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderHomeServiceItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No home services found for {gender}
            </Text>
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
    marginTop: hp('2%'),
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
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('0.5%'),
  },
  serviceName: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: '#060505',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: wp('2%'),
  },
  servicePrice: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    color: '#0a0909',
    fontFamily: 'Poppins-Medium',
  },
  serviceDesc: {
    color: '#1111118A',
    fontSize: wp('3.2%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
    lineHeight: wp('4%'),
    height: hp('4%'),
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: hp('1%'),
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

export default HomeServices;
