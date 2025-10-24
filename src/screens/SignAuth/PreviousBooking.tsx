<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // ✅ import theme
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
=======
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import Head from "../../components/Head";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext"; // ✅ import theme
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

export default function BookingAccepted() {
  const { theme } = useTheme(); // ✅ get current theme

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
=======
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      <Head title="Booking Details" />

      <ScrollView style={styles.container}>
        {/* Status Section */}
<<<<<<< HEAD
        <View
          style={[styles.statusCard, { backgroundColor: theme.background }]}
        >
=======
        <View style={[styles.statusCard, { backgroundColor: theme.background}]}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          <Text style={[styles.statusText, { color: theme.textPrimary }]}>
            Premium Haircut
          </Text>

          <View style={styles.dateRow}>
            <View
<<<<<<< HEAD
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp('2%'),
              }}
            >
              <Icon
                name="calendar-outline"
                size={hp('3%')}
                color={theme.textPrimary}
              />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                15 Aug 2025
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#42BA86' }]}
            >
=======
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp('2%') }}
            >
              <Icon name="calendar-outline" size={hp("3%")} color={theme.textPrimary} />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>15 Aug 2025</Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#42BA86" }]}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
              <Text style={[styles.actionText]}>Completed</Text>
            </TouchableOpacity>
          </View>

<<<<<<< HEAD
          <Text style={[styles.price, { color: theme.textPrimary }]}>
            ₹ 500
          </Text>
=======
          <Text style={[styles.price, { color: theme.textPrimary }]}>₹ 500</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          <Text style={[styles.desc, { color: theme.textPrimary }]}>
            Professional haircut with styling included.
          </Text>
        </View>

        {/* User Info */}
<<<<<<< HEAD
        <View style={[styles.userCard, { backgroundColor: theme.background }]}>
          <Text style={[styles.client, { color: theme.textPrimary }]}>
            Client Name :
          </Text>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            Rahul Sharma
          </Text>
          <Text style={[styles.userPhone, { color: theme.textPrimary }]}>
            +91 9876543210
          </Text>
=======
        <View style={[styles.userCard, { backgroundColor: theme.background}]}>
          <Text style={[styles.client, { color: theme.textPrimary }]}>Client Name :</Text>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>Rahul Sharma</Text>
          <Text style={[styles.userPhone, { color: theme.textPrimary }]}>+91 9876543210</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
<<<<<<< HEAD
          <Icon name="location" size={hp('2.6%')} color={theme.textPrimary} />
          <Text style={[styles.locationText, { color: theme.textPrimary }]}>
            123, Main Street, City
          </Text>
=======
          <Icon name="location" size={hp("2.6%")} color={theme.textPrimary} />
          <Text style={[styles.locationText, { color: theme.textPrimary }]}>123, Main Street, City</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>

        {/* Actions */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
<<<<<<< HEAD
            style={[
              styles.actionBtn,
              {
                backgroundColor: COLORS.primary,
                width: '100%',
                paddingVertical: hp('2%'),
              },
            ]}
=======
            style={[styles.actionBtn, {
              backgroundColor: COLORS.primary, width: '100%', paddingVertical: hp('2%')
            }]}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          >
            <Text style={[styles.actionText]}>Rebook Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
<<<<<<< HEAD
  container: { padding: wp('4%') },

  // Status Card
  statusCard: {
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: { fontSize: wp('6%'), fontWeight: 'bold' },
  price: { fontSize: wp('6%'), fontWeight: 'bold', marginBottom: hp('1.5%') },
  desc: { fontSize: wp('5%') },

  // Date Row
  dateRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: hp('2%'),
  },
  dateText: { marginLeft: wp('2%'), fontSize: wp('4%'), fontWeight: '500' },

  // User Card
  userCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: wp('3%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: hp('0.5%'),
  },
  userName: { fontSize: wp('4.5%'), fontWeight: '600' },
  userPhone: { fontSize: wp('4.5%'), marginTop: hp('0.3%'), fontWeight: '600' },
  client: { fontSize: wp('5%'), fontWeight: '600' },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
    marginLeft: wp('1%'),
  },
  locationText: { fontSize: wp('4.5%'), marginLeft: wp('2%') },

  // Action Buttons
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('4%'),
  },
  actionBtn: {
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { color: '#fff', fontSize: wp('4.5%'), fontWeight: '600' },
=======
  container: { padding: wp("4%") },

  // Status Card
  statusCard: {
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: { fontSize: wp("6%"), fontWeight: "bold" },
  price: { fontSize: wp("6%"), fontWeight: "bold", marginBottom: hp("1.5%") },
  desc: { fontSize: wp("5%") },

  // Date Row
  dateRow: { flexDirection: "column", alignItems: "flex-start", marginVertical: hp("2%") },
  dateText: { marginLeft: wp("2%"), fontSize: wp("4%"), fontWeight: '500' },

  // User Card
  userCard: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: wp("3%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: hp('0.5%')
  },
  userName: { fontSize: wp("4.5%"), fontWeight: "600" },
  userPhone: { fontSize: wp("4.5%"), marginTop: hp("0.3%"), fontWeight: "600" },
  client: { fontSize: wp("5%"), fontWeight: "600" },

  // Location
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("3%"), marginLeft: wp("1%") },
  locationText: { fontSize: wp("4.5%"), marginLeft: wp("2%") },

  // Action Buttons
  buttonSection: { flexDirection: "row", justifyContent: "space-between", marginVertical: hp('4%') },
  actionBtn: { paddingVertical: hp("1.2%"), paddingHorizontal: wp("6%"), borderRadius: wp("3%"), alignItems: "center", justifyContent: 'center' },
  actionText: { color: "#fff", fontSize: wp("4.5%"), fontWeight: "600" },
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});
