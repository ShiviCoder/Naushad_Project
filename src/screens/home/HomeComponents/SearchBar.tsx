// src/screens/home/HomeComponents/SearchBar.js

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SearchBar = ({ theme }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { borderColor: '#dddddd1d' }]}>
        <Icon name="search" size={wp('4.5%')} color="#9E9E9E" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9E9E9E"
          style={[styles.searchInput, { color: theme.textPrimary }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '97%',
    alignSelf: 'center',
    paddingVertical: hp('0.5%'), // Minimal padding
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    height: hp('4.5%'), // Reduced height
    borderWidth: wp('0.2%'),
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0, // No vertical padding
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
    marginLeft: wp('1.5%'),
  },
});

export default SearchBar;
