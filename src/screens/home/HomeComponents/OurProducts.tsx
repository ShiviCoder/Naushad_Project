// src/components/OurProducts.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
      style={styles.productCard}
      activeOpacity={1}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          product: { ...item, image: item.image },
        })
      }
    >
      <ProductImage uri={item.image} />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name || 'Product Name'}
        </Text>

        <View style={styles.priceContainer}>
          <Text
            style={styles.productPrice}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            ₹{item.price || '0'}
          </Text>

          {item.offer && (
            <Text style={styles.productOffer}>{item.offer}% off</Text>
          )}
        </View>

        {/* RATING - 5 Stars */}
        {item.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  name="star"
                  size={wp('3.2%')}
                  color={star <= (item.rating || 0) ? '#F6B745' : '#DDD'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>({item.reviews || 0} reviews)</Text>
          </View>
        )}

        {/* TAG */}
        {item.tag && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail">
              {item.tag}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get our products</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('products')}
          activeOpacity={1}
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
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },

  // ✅ REFERENCE UI - Perfect card layout
  productCard: {
    width: wp('45%'),
    height: hp('38%'),
    marginHorizontal: wp('1%'),
    marginVertical: hp('1%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    overflow: 'hidden', // ✅ Ensures rounded corners on image
  },

  productImage: {
    width: '100%',
    height: hp('18%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
  },

  productInfo: {
    flex: 1,
    padding: wp('3%'),
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000',
    minHeight: hp('4%'),
    marginBottom: hp('0.5%'),
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  productPrice: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    flex: 1,
  },
  productOffer: {
    fontSize: wp('3.2%'),
    color: '#29A244',
    fontWeight: '600',
    marginLeft: wp('1%'),
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: wp('2%'),
  },
  ratingText: {
    fontSize: wp('3%'),
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },

  tagContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#F0F0F0',
    marginBottom: hp('1%'),
  },
  tagText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#000',
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
    fontFamily: 'Poppins-Medium',
  },
});

export default OurProducts;
