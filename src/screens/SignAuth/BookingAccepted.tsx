import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Platform } from "react-native";
import React from "react";
import Head from "../../components/Head";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
// :white_check_mark: import theme
export default function BookingAccepted() {
  const { theme } = useTheme(); // :white_check_mark: get current theme
  // Phone to use for Call/WhatsApp (taken from your UI)
  const phoneNumber = "+919876543210";
  // Open system dialer with number prefilled
  const dialCall = (num: string) => {
    const url = `tel:${num}`;
    Linking.openURL(url).catch(() => { });
  };
  // Open WhatsApp chat; fallback to wa.me if scheme not available
  const openWhatsApp = async (num: string, text: string) => {
    const encoded = encodeURIComponent(text);
    const waScheme = `whatsapp://send?phone=${num}&text=${encoded}`;
    try {
      const supported = await Linking.canOpenURL(waScheme);
      if (supported) {
        await Linking.openURL(waScheme);
        return;
      }
    } catch { }
    const digits = num.replace(/[^\d]/g, "");
    const waMe = `https://wa.me/${digits}?text=${encoded}`;
    Linking.openURL(waMe).catch(() => { });
  };
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Head title="Booking Details" />
      <ScrollView style={styles.container}>
        {/* Status Section */}
        <View style={[styles.statusCard, { backgroundColor: theme.background }]}>
          <Text style={[styles.statusText, { color: theme.textPrimary }]}>Accepted</Text>
          <View style={styles.dateRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp('2%') }}>
              <Icon name="calendar-outline" size={hp("3%")} color={theme.textPrimary} />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>15 Aug 2025</Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
              <Text style={[styles.actionText]}>Accepted</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.price, { color: theme.textPrimary }]}>₹ 500</Text>
          <Text style={[styles.desc, { color: theme.textPrimary }]}>
            Professional haircut with styling included.
          </Text>
        </View>
        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: theme.background }]}>
          <Image
            source={require("../../assets/images/bookUser.png")}
            style={styles.userImg}
          />
          <View>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>Rahul Sharma</Text>
            <Text style={[styles.userPhone, { color: theme.textPrimary }]}>+91 9876543210</Text>
          </View>
        </View>
        {/* Location */}
        <View style={styles.locationRow}>
          <Icon name="location" size={hp("2.6%")} color={theme.textPrimary} />
          <Text style={[styles.locationText, { color: theme.textPrimary }]}>123, Main Street, City</Text>
        </View>
        {/* Actions */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => dialCall(phoneNumber)}
          >
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.primary, flex: 1, marginLeft: wp("4%") }]}
            onPress={() => openWhatsApp(phoneNumber, "Hello Rahul ")}
          >
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: wp("4%"),
    paddingBottom: hp('5%')
  },
  // Status Card
  statusCard: {
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: wp("6%"),
    fontWeight: "bold",
  },
  price: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
  },
  desc: {
    fontSize: wp("5%"),
  },
  // Date Row
  dateRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: hp("2%"),
  },
  dateText: {
    marginLeft: wp("2%"),
    fontSize: wp("4%"),
    fontWeight: '500',
  },
  // User Card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userImg: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("7%"),
    marginRight: wp("3%"),
  },
  userName: { fontSize: wp("4.5%"), fontWeight: "600" },
  userPhone: { fontSize: wp("4.5%"), marginTop: hp("0.3%"), fontWeight: "600" },
  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("3%"),
    marginLeft: wp("1%"),
  },
  locationText: { fontSize: wp("4.5%"), marginLeft: wp("2%") },
  // Action Buttons
 buttonSection: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: hp("4%"),
  marginBottom: hp("5%"),
  gap: wp("2%"), // adds equal spacing between buttons (modern RN)
},

actionBtn: {
  flex: 1, // 👈 makes both buttons equal width
  paddingVertical: hp("1.2%"),
  borderRadius: wp("3%"),
  alignItems: "center",
  justifyContent: "center",
},

actionText: {
  color: "#fff",
  fontSize: wp("4.5%"),
  fontWeight: "600",
},
});