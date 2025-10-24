<<<<<<< HEAD
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeContext';
import COLORS from '../utils/Colors';

const TimeSelect = () => {
  const { theme } = useTheme(); // ✅ use theme
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const slotArray = [
    '9.00',
    '10.00',
    '11.00',
    '12.00',
    '13.00',
    '14.00',
    '15.00',
    '16.00',
    '17.00',
    '18.00',
    '19:00',
=======
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Shadow } from "react-native-shadow-2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";

const TimeSelect = () => {
  const { theme } = useTheme(); // ✅ use theme
 const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const slotArray = [
    "9.00","10.00","11.00","12.00","13.00","14.00","15.00","16.00","17.00","18.00","19:00",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  ];

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + currentMinute / 60;

<<<<<<< HEAD
  const parseSlot = (slot: string) => {
    const [h, m] = slot.split('.');
    return parseInt(h) + (m ? parseInt(m) / 60 : 0);
  };

  const formatSlot = (slot: string) => {
    let hour = parseInt(slot.split('.')[0]);
    let minute = slot.split('.')[1] ? parseInt(slot.split('.')[1]) : 0;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}${minute > 0 ? ':' + minute : ''} ${ampm}`;
  };

  return (
    <View style={{ paddingHorizontal: wp('2%') }}>
=======

  const parseSlot = (slot:string) => {
    const [h,m] = slot.split(".");
    return parseInt(h) + (m ? parseInt(m)/60 : 0);
  }

  const formatSlot = (slot : string) => {
    let hour = parseInt(slot.split(".")[0]);
    let minute = slot.split(".")[1] ? parseInt(slot.split(".")[1]) : 0;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if(hour === 0) hour = 12;
    return  `${hour}${minute > 0 ? ":" + minute : ""} ${ampm}`
  }


    return (
    <View style={{ paddingHorizontal: wp("2%") }}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      <FlatList
        data={slotArray}
        numColumns={4}
        columnWrapperStyle={{
<<<<<<< HEAD
          justifyContent: 'flex-start',
          marginVertical: hp('0.8%'),
=======
          justifyContent: "flex-start",
          marginVertical: hp("0.8%"),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedSlot === item; // ✅ check if selected
          const slotTime = parseSlot(item);
          const isPast = slotTime <= currentTime;

          return (
            <Shadow
              distance={3}
              startColor={COLORS.shadow} // yellow if selected
              offset={[4, 0]}
<<<<<<< HEAD
              style={[
                styles.shadowContainer,
                { width: wp('18%'), height: hp('4.5%') },
              ]}
              paintInside={isSelected ? true : false}
            >
              <TouchableOpacity
                disabled={isPast}
                style={[
                  styles.slotButton,
                  {
                    backgroundColor: isSelected
                      ? COLORS.primary
                      : theme.cardBackground, // ✅ yellow if selected
                  },
                ]}
                onPress={() => setSelectedSlot(isSelected ? '' : item)} // ✅ update state on press
=======
              style={[styles.shadowContainer, { width: wp("18%") , height: hp("4.5%")}]}
              paintInside={isSelected ? true : false} 
            >
              <TouchableOpacity
              disabled={isPast}
                style={[
                  styles.slotButton,
                  {
                    backgroundColor: isSelected ? COLORS.primary : theme.cardBackground, // ✅ yellow if selected
                    
                  },
                ]}
                onPress={() => setSelectedSlot(isSelected ? "" : item)} // ✅ update state on press
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
              >
                <Text
                  style={[
                    styles.slotText,
<<<<<<< HEAD
                    {
                      color: isPast
                        ? '#8a8787ff'
                        : isSelected
                        ? '#000'
                        : theme.textPrimary,
                    }, // text color contrast
=======
                    { color: isPast ? 
                      "#8a8787ff" : 
                      isSelected ? '#000' : theme.textPrimary }, // text color contrast
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
                  ]}
                >
                  {formatSlot(item)}
                </Text>
              </TouchableOpacity>
            </Shadow>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
<<<<<<< HEAD
    marginHorizontal: wp('1%'),
    borderRadius: wp('2%'),
    minHeight: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotButton: {
    borderRadius: wp('2%'),
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slotText: {
    fontWeight: '700',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
=======
    marginHorizontal: wp("1%"),
    borderRadius: wp("2%"),
    minHeight: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  slotButton: {
    borderRadius: wp("2%"),
    paddingVertical: hp("1.3%"),
    paddingHorizontal: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  slotText: {
    fontWeight: "700",
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Medium",

>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
});

export default TimeSelect;
