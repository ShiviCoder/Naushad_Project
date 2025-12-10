import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Svg, { Polygon } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const ProductPackages = ({
  productPackages,
  navigation,
  handleSectionNavigation,
  theme,
}) => {
  const renderProductPackageItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <Shadow
        distance={3}
        startColor={COLORS.shadow}
        offset={[0, 13]}
        style={styles.shadowStyle}
      >
        <View style={styles.cardContainer}>
          {/* Folded Corners */}
          <Svg height={hp('25%')} width={wp('35%')} style={styles.foldSvg}>
            <Polygon
              points={`0,0 ${wp('6%')},0 0,${wp('6%')}`}
              fill={theme.background}
            />
            <Polygon
              points={`${wp('35%')},0 ${wp('35%') - wp('6%')},0 ${wp(
                '35%',
              )},${wp('6%')}`}
              fill={theme.background}
            />
          </Svg>

          {/* Header Hexagon */}
          <View style={styles.headerContainer}>
            <Svg height={hp('6%')} width={wp('22%')}>
              <Polygon
                points={`0,0 ${wp('22%')},0 ${wp('22%')},${hp('3%')} ${wp(
                  '11%',
                )},${hp('6%')} 0,${hp('3%')}`}
                fill={COLORS.primary}
              />
            </Svg>
            <Text style={styles.headerText} numberOfLines={1}>
              {item.name || 'Package'}
            </Text>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.rateText}>
              Rate:- <Text style={styles.boldText}>₹ {item.price || '0'}</Text>
            </Text>
            <Text style={styles.productsText} numberOfLines={2}>
              Products:-{' '}
              <Text style={styles.boldText}>
                {Array.isArray(item.items)
                  ? item.items.join(', ')
                  : item.items || 'N/A'}
              </Text>
            </Text>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description || 'No description'}
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductPakage', { item })}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </Shadow>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Product Packages</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('productPackages')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productPackages}
        horizontal
        keyExtractor={item => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={renderProductPackageItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No product packages available</Text>
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
    paddingVertical: hp('0%'),
  },
  cardWrapper: {
    marginHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
    marginBottom: hp('0%'),
  },
  shadowStyle: {
    borderRadius: wp('4%'),
  },
  cardContainer: {
    width: wp('35%'),
    height: hp('25%'),
    backgroundColor: '#EDEDED',
    borderRadius: wp('4%'),
    overflow: 'hidden',
    alignItems: 'center',
  },
  foldSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('22%'),
  },
  headerText: {
    position: 'absolute',
    top: hp('1%'),
    width: wp('20%'),
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: wp('3%'),
    paddingHorizontal: wp('1%'),
  },
  contentContainer: {
    marginTop: hp('8%'),
    width: '85%',
  },
  rateText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginBottom: hp('0.5%'),
  },
  productsText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginBottom: hp('1%'),
    lineHeight: wp('4%'),
  },
  boldText: {
    fontWeight: '700',
  },
  descriptionText: {
    fontStyle: 'italic',
    fontSize: wp('3%'),
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: wp('3.8%'),
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    marginTop: 'auto',
    marginBottom: hp('1%'),
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp('3%'),
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

export default ProductPackages;
