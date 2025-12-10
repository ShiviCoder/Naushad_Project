import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const OurPackages = ({ packages, navigation, handleSectionNavigation }) => {
  const renderPackageItem = ({ item }) => (
    <View style={styles.packageCard}>
      <View style={styles.headerRow}>
        <Text style={styles.packageTitle} numberOfLines={2}>
          {item.title || 'Package Title'}
        </Text>
        <Text style={styles.packagePrice}>₹{item.price || '0'}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.packageLabel} numberOfLines={2}>
          <Text style={styles.labelText}>Services:- </Text>
          <Text style={styles.valueText}>{item.services || 'N/A'}</Text>
        </Text>

        <Text
          style={[styles.packageLabel, { marginTop: hp('0.5%') }]}
          numberOfLines={2}
        >
          <Text style={styles.labelText}>About:- </Text>
          <Text style={styles.valueText}>{item.about || 'N/A'}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('PackageDetails', { item })}
      >
        <Text style={styles.buttonText}>Book now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Packages</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('packages')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={packages}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id || item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderPackageItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No packages available</Text>
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
  packageCard: {
    width: wp('65%'),
    borderRadius: wp('3%'),
    borderWidth: wp('0.3%'),
    borderColor: '#E5D4B1',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    marginHorizontal: wp('1%'),
    marginVertical: hp('1%'),
    backgroundColor: COLORS.secondary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.1%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('5%'),
    borderTopRightRadius: wp('1%'),
    borderBottomLeftRadius: wp('1%'),
    overflow: 'hidden',
    height: hp('25%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  packageTitle: {
    fontSize: wp('4%'),
    fontWeight: '800',
    flex: 1,
    marginRight: wp('3%'),
    color: '#333',
    lineHeight: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
  },
  packagePrice: {
    color: '#B07813',
    fontWeight: '800',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  packageLabel: {
    fontSize: wp('3.5%'),
    lineHeight: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  labelText: {
    color: '#42BA86',
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  valueText: {
    color: '#060606',
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    alignSelf: 'flex-start',
    marginTop: hp('1%'),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
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

export default OurPackages;
