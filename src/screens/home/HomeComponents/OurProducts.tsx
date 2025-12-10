import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

// Local placeholder
const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');

// Reusable image with fallback
const ProductImage = ({ uri }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <Image
        source={PLACEHOLDER_IMAGE}
        style={styles.productImage}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.productImage}
      resizeMode="cover"
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const OurProducts = ({
  products,
  gender,
  navigation,
  handleSectionNavigation,
}) => {
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetails', {
          product: { ...item, image: item.image },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.productCard}>
        <ProductImage uri={item.image} />

        <Text style={styles.productName} numberOfLines={2}>
          {item.name || 'Product Name'}
        </Text>

        <Text style={styles.productPrice}>
          ₹{item.price || '0'}{' '}
          <Text style={styles.offerText}>({item.offer || '0% off'})</Text>
        </Text>

        <View style={styles.tagsContainer}>
          {item.rating && (
            <View style={styles.ratingPill}>
              <Icon name="star" size={wp('3.2%')} color="#29A244" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}

          {item.tag && (
            <View style={styles.tagPill}>
              <Text style={styles.tagText} numberOfLines={1}>
                {item.tag}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get our products</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('products')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderProductItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found for {gender}</Text>
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
  productCard: {
    width: wp('45%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    borderRadius: wp('4%'),
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
  },
  productImage: {
    width: '100%',
    height: hp('15%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
  },
  productName: {
    marginTop: hp('0.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.8%'),
    lineHeight: wp('4.5%'),
    height: hp('4.5%'),
  },
  productPrice: {
    color: '#777',
    marginTop: hp('0.5%'),
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.8%'),
  },
  offerText: {
    color: '#29A244',
    fontSize: wp('3.5%'),
  },
  tagsContainer: {
    flexDirection: 'column',
    gap: wp('2%'),
    marginTop: hp('1.5%'),
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: wp('3.2%'),
    marginLeft: wp('1%'),
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  tagPill: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
    backgroundColor: '#E8F6EF',
    alignSelf: 'flex-start',
    maxWidth: wp('35%'),
  },
  tagText: {
    fontSize: wp('3.2%'),
    color: '#29A244',
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

export default OurProducts;
