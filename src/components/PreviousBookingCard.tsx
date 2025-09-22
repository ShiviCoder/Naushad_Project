import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import CheckBox from "@react-native-community/checkbox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const PreviousBookingCard = ({ item }) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ get current theme

  return (
    <TouchableOpacity
      style={styles.container} // background unchanged
      onPress={() => navigation.navigate('PreviousBooking')}
    >
      {/* Service + Completed */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image source={item.image[0]} style={styles.icon} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>{item.service}</Text>
        </View>
        <View style={[styles.pending, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={setIsChecked}
            tintColors={{ true: "#42BA86", false: theme.textPrimary }} // text color for unchecked
          />
          <Text style={[styles.text, { color: theme.textPrimary }]}>Completed</Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.content}>
        <Image source={item.image[1]} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>Date :- {item.date}</Text>
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image source={item.image[2]} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>Time :- {item.time}</Text>
      </View>

      {/* Amount */}
      <View style={styles.content}>
        <Image source={item.image[3]} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>Amount :- ₹{item.price}</Text>
      </View>

      {/* Rating */}
      <View style={styles.content}>
        <Image source={item.image[4]} style={styles.icon} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>Rating :- {item.rating}</Text>
      </View>

      {/* Rebook Button */}
      <TouchableOpacity>
        <Text style={[styles.button, { color: theme.textPrimary }]} >Rebook</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FCDBA040", // ✅ background unchanged
    width: wp("90%"),
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
    backgroundColor: "#F6B745",
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
