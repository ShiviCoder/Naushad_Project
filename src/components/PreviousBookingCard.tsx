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

const PreviousBookingCard = ({ item }) => {
  const [isChecked, setIsChecked] = useState(true); // Default to checked for completed bookings
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Format services array
  const formatServices = (services) => {
    if (!services || services.length === 0) return 'No services';
    
    try {
      const serviceArray = typeof services[0] === 'string' && services[0].startsWith('[') 
        ? JSON.parse(services[0])
        : services;
      
      return Array.isArray(serviceArray) ? serviceArray.join(', ') : String(serviceArray);
    } catch (error) {
      return services.join(', ');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: COLORS.secondary }]}
      onPress={() => navigation.navigate('PreviousBooking', { booking: item })}
    >
      {/* Service + Status */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image source={require('../assets/hairCut.png')} style={styles.icon} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {formatServices(item.services)}
          </Text>
        </View>
        <View style={[styles.pending, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={setIsChecked}
            tintColors={{ true: "#42BA86", false: theme.textPrimary }}
          />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {item.appointmentStatus === 'Completed' ? 'Completed' : 'Cancelled'}
          </Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.content}>
        <Image source={require('../assets/calender.png')} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Date: {formatDate(item.date)}
        </Text>
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image source={require('../assets/stopwatch-removebg-preview.png')} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Time: {formatTime(item.time)}
        </Text>
      </View>

      {/* Appointment Code */}
      <View style={styles.content}>
        <Image source={require('../assets/moneyBag2.png')} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Code: {item.appointmentCode}
        </Text>
      </View>

      {/* Rebook Button */}
      <TouchableOpacity onPress={() => navigation.navigate('BookAppointmentScreen', { booking: item })}>
        <Text style={[styles.button, { color: theme.textPrimary, backgroundColor: COLORS.primary }]}>
          Rebook
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "90%",
    minHeight: hp("22%"),
    marginVertical: hp("1.5%"),
    alignSelf: "center",
    borderRadius: wp("4%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    justifyContent: "center",
    gap: hp("1%"),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#000000",
    fontWeight: "500",
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  pending: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
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
  },
});

export default PreviousBookingCard;