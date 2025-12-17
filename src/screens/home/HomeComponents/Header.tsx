// src/screens/home/HomeComponents/Header.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Header = ({ user, theme, navigation }) => {
  const userName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User Name'
    : 'User Name';

  const userAddress =
    user?.address && user.address.length > 5
      ? `${user.address.substring(0, 7)}...`
      : user?.address || 'Location';

  return (
    <View style={styles.header}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/location.png')}
            style={[styles.locationBtn, { tintColor: theme.textPrimary }]}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text
            style={[styles.welcomeText, { color: theme.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName}
          </Text>
          <Text
            style={[styles.locationText, { color: theme.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userAddress}
          </Text>
        </View>
      </View>

      {/* Center Logo */}
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Image
            source={require('../../../assets/cart2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image
            source={require('../../../assets/notification3.png')}
            style={[styles.icon, { marginLeft: wp('2%') }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('3%'), // increased
    paddingVertical: hp('1%'), // increased
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flex: 1,
  },
  locationBtn: {
    width: wp('7%'), // was 5%
    height: wp('7%'), // was 5%
  },
  userInfo: {
    flexDirection: 'column',
    marginLeft: wp('2%'), // was 1%
    maxWidth: wp('40%'), // was 30%
  },
  welcomeText: {
    fontSize: wp('4%'), // was 3.2%
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  locationText: {
    fontSize: wp('3.6%'), // was 3%
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  logo: {
    width: wp('40%'), // was 35%
    height: hp('8%'), // was 7%
    resizeMode: 'contain',
    marginHorizontal: wp('2%'), // was 1%
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  icon: {
    width: wp('7%'), // was 5%
    height: wp('7%'), // was 5%
  },
});

export default Header;
