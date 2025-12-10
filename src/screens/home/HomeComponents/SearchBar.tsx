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
        <Icon name="search" size={wp('5%')} color="#9E9E9E" />
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
    paddingVertical: hp('1%'),
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    height: hp('5%'),
    borderWidth: wp('0.3%'),
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp('0.1%'),
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    marginLeft: wp('2%'),
  },
});

export default SearchBar;
