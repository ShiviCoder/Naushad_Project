import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../components/Svg';
import { StarSvgIcon } from '../components/Svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../utils/Colors';

const BottomNavbar = (props: any) => {
  const { state, navigation } = props;
  const handlePress = (tab: any) => {
    if (tab.name === 'BookAppointmentScreen') {
      navigation.navigate('BookAppointmentScreen', { from: 'bottomBar'});
    } else {
      navigation.navigate(tab.name);
    }
  };
  // Fixed order of tabs
  const tabs = [
    { name: 'HomeScreen', icon: <Icon name="home" /> },
    { name: 'BookingScreen', icon: <MySvgIcon /> },
    { name: 'BookAppointmentScreen', icon: (
        <View style={[styles.fabCircle,{backgroundColor : COLORS.primary}]}>
          <Icon name="add" size={wp('7%')} color="#000" />
        </View>
      )
    },
    { name: 'BlankScreen', icon: <StarSvgIcon /> },
    { name: 'AccountScreen', icon: <Icon name="person-outline" /> },
  ];

  return (
    <View style={styles.bottomBarWrap}>
      <View style={styles.bottomNav}>
        {tabs.map((tab, index) => {
          const isActive = state?.routes?.[state.index]?.name === tab.name;
          let iconElement = tab.icon;
          // Set dynamic color for icons except FAB
          if (tab.name !== 'BookAppointmentScreen') {
            if (tab.name === 'HomeScreen') {
              iconElement = <Icon name="home" size={wp('7%')} color={isActive ? COLORS.primary : '#fff'} />;
            } else if (tab.name === 'BookingScreen') {
              iconElement = <MySvgIcon width={wp('7%')} height={hp('3%')} fill={isActive ? COLORS.primary : '#fff'} />;
            } else if (tab.name === 'BlankScreen') {
              iconElement = <StarSvgIcon width={hp('5%')} height={hp('3%')} fill={isActive ? COLORS.primary : '#fff'} />;
            } else if (tab.name === 'AccountScreen') {
              iconElement = <Icon name="person-outline" size={wp('7%')} color={isActive ? COLORS.primary : '#fff'} />;
            }
          }

          return (
            <TouchableOpacity key={tab.name} onPress={() => handlePress(tab)}>
              <View style={[styles.iconWrapper, isActive && tab.name !== 'BookAppointmentScreen' ? styles.activeWrapper : {}]}>
                {iconElement}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp('4%'), // Increased from 16
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: '#1A1A1A', // Darker
    width: '90%', // Reduced from 92%
    height: hp('8%'), // Increased from 54
    borderRadius: wp('205'), // Increased from 28
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabCircle: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  iconWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWrapper: {
    backgroundColor: '#fff',
    borderRadius: '50%'
  },
})


export default BottomNavbar;
