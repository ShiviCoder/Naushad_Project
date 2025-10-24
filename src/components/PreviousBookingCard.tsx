<<<<<<< HEAD
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import COLORS from '../utils/Colors';
=======
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import CheckBox from "@react-native-community/checkbox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

const PreviousBookingCard = ({ item }) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ get current theme

  return (
    <TouchableOpacity
<<<<<<< HEAD
      style={[styles.container, { backgroundColor: COLORS.secondary }]} // background unchanged
=======
      style={[styles.container,{backgroundColor : COLORS.secondary}]} // background unchanged
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      onPress={() => navigation.navigate('PreviousBooking')}
    >
      {/* Service + Completed */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image source={item.image[0]} style={styles.icon} />
<<<<<<< HEAD
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {item.service}
          </Text>
=======
          <Text style={[styles.text, { color: theme.textPrimary }]}>{item.service}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>
        <View style={[styles.pending, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={setIsChecked}
<<<<<<< HEAD
            tintColors={{ true: '#42BA86', false: theme.textPrimary }} // text color for unchecked
          />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Completed
          </Text>
=======
            tintColors={{ true: "#42BA86", false: theme.textPrimary }} // text color for unchecked
          />
          <Text style={[styles.text, { color: theme.textPrimary }]}>Completed</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>
      </View>

      {/* Date */}
      <View style={styles.content}>
        <Image source={item.image[1]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Date :- {item.date}
        </Text>
=======
        <Text style={[styles.text, { color: theme.textPrimary }]}>Date :- {item.date}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image source={item.image[2]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Time :- {item.time}
        </Text>
=======
        <Text style={[styles.text, { color: theme.textPrimary }]}>Time :- {item.time}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Amount */}
      <View style={styles.content}>
        <Image source={item.image[3]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Amount :- ₹{item.price}
        </Text>
=======
        <Text style={[styles.text, { color: theme.textPrimary }]}>Amount :- ₹{item.price}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Rating */}
      <View style={styles.content}>
        <Image source={item.image[4]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Rating :- {item.rating}
        </Text>
=======
        <Text style={[styles.text, { color: theme.textPrimary }]}>Rating :- {item.rating}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Rebook Button */}
      <TouchableOpacity>
<<<<<<< HEAD
        <Text
          style={[
            styles.button,
            { color: theme.textPrimary, backgroundColor: COLORS.primaryz },
          ]}
        >
          Rebook
        </Text>
=======
        <Text style={[styles.button, { color: theme.textPrimary ,backgroundColor : COLORS.primaryz}]} >Rebook</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flexDirection: 'column',
    width: '90%',
    minHeight: hp('25%'),
    marginVertical: hp('1.5%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
    gap: hp('1%'),
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  text: {
    fontSize: wp('3.5%'),
    color: '#000000', // fallback
    fontWeight: '500',
  },
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('5%'),
  },
  checkBox: {
    width: wp('4%'),
    height: wp('4%'),
  },
  button: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('7%'),
    fontWeight: '600',
    fontSize: wp('3%'),
    marginTop: hp('1%'),
    textAlign: 'center',
    alignSelf: 'flex-start',
=======
    flexDirection: "column",
    width: "90%",
    minHeight: hp("25%"),
    marginVertical: hp("1.5%"),
    alignSelf: "center",
    borderRadius: wp("4%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    justifyContent: "center",
    gap: hp("1%"),
  },
  pendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2.5%"),
  },
  icon: {
    width: wp("6%"),
    height: wp("6%"),
    resizeMode: "contain",
    marginRight: wp("2%"),
  },
  text: {
    fontSize: wp("3.5%"),
    color: "#000000", // fallback
    fontWeight: "500",
  },
  pending: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("5%"),
  },
  checkBox: {
    width: wp("4%"),
    height: wp("4%"),
  },
  button: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.8%"),
    borderRadius: wp("7%"),
    fontWeight: "600",
    fontSize: wp("3%"),
    marginTop: hp("1%"),
    textAlign: "center",
    alignSelf: "flex-start",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
});

export default PreviousBookingCard;
