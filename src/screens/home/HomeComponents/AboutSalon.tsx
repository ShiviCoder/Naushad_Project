import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PLACEHOLDER_IMAGE = require('../../../assets/placeholder.jpg');

const AboutIconImage = ({ uri }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <Image
        source={PLACEHOLDER_IMAGE}
        style={styles.aboutIcon}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.aboutIcon}
      resizeMode="cover"
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const AboutSalon = ({ aboutData, theme }) => {
  const renderAboutItem = ({ item }) => (
    <View style={[styles.aboutBox, { backgroundColor: theme.textPrimary }]}>
      <AboutIconImage uri={item.image} />

      <Text
        style={[styles.aboutTop, { color: theme.background }]}
        numberOfLines={1}
      >
        {item.title || 'Title'}
      </Text>
      <Text
        style={[styles.aboutBottom, { color: theme.background }]}
        numberOfLines={2}
      >
        {item.description || 'Description'}
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          About our salon
        </Text>
      </View>

      <FlatList
        data={aboutData}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderAboutItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textPrimary }]}>
              No information available
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
  },
  listContainer: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
  },
  aboutBox: {
    width: wp('28%'),
    height: hp('18%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    elevation: 1,
    marginHorizontal: wp('1%'),
  },
  aboutIcon: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1%'),
  },
  aboutTop: {
    fontSize: wp('3.5%'),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp('0.5%'),
    width: '100%',
  },
  aboutBottom: {
    fontSize: wp('3%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: wp('3.8%'),
  },
  emptyContainer: {
    width: wp('90%'),
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: wp('3.8%'),
  },
});

export default AboutSalon;
