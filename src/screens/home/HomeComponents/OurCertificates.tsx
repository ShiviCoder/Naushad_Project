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

const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');

const CertificateImage = ({ uri }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <Image
        source={PLACEHOLDER_IMAGE}
        style={styles.certImage}
        resizeMode="contain"
      />
    );
  }

  return (
    <Image
      source={{ uri: uri?.replace('http://', 'https://') }}
      style={styles.certImage}
      resizeMode="contain"
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const OurCertificates = ({ certificates, handleSectionNavigation }) => {
  const renderCertificateItem = ({ item }) => (
    <View style={styles.certItem}>
      <CertificateImage uri={item.imageUrl} />
      <Text style={styles.certCaption} numberOfLines={2}>
        {item.title || 'Certificate'}
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Certificates</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('certificates')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={certificates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderCertificateItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No certificates available</Text>
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
    marginBottom: hp('2%'),
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
    paddingVertical: hp('2%'),
    backgroundColor: COLORS.primary,
    borderRadius: wp('3%'),
    marginHorizontal: wp('3%'),
  },
  certItem: {
    width: wp('40%'),
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    marginHorizontal: wp('2%'),
  },
  certImage: {
    width: wp('35%'),
    height: hp('15%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
    borderRadius: wp('2%'),
  },
  certCaption: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    lineHeight: wp('4%'),
    height: hp('4%'),
  },
  emptyContainer: {
    width: wp('90%'),
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: wp('3.8%'),
  },
});

export default OurCertificates;
