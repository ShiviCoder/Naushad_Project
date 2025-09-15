import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Calender() {
  const [selected, setSelected] = useState("");

  // 📌 Custom locale
  LocaleConfig.locales["en"] = {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  };
  LocaleConfig.defaultLocale = "en";

  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        hideExtraDays={true}
        monthFormat={"MMMM"}
        renderArrow={(direction) =>
          direction === "left" ? (
            <Icon name="chevron-back" size={wp("6%")} color="#0e0d0dff" />
          ) : (
            <Icon name="chevron-forward" size={wp("6%")} color="#0e0d0dff" />
          )
        }
        dayComponent={({ date }) => {
          if (!date) return null;

          const isSelected = selected === date.dateString;
          const today = new Date();
          const isToday =
            today.getFullYear() === date.year &&
            today.getMonth() + 1 === date.month &&
            today.getDate() === date.day;

          return (
            <TouchableOpacity
              onPress={() => setSelected(date.dateString)}
              activeOpacity={0.7}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: wp("6%"),
                height: wp("6%"),
                backgroundColor: isSelected ? "#facc15" : "#fff",
                borderRadius: wp("50%"),
                padding: wp("0.5%"),
              }}
            >
              <Text
                style={{
                  color: isSelected ? "#000" : isToday ? "#4caf50" : "#000",
                  fontWeight: isSelected || isToday ? "700" : "400",
                  fontSize: wp("3.5%"),
                }}
              >
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
       theme={{
    monthTextColor: "#000",
    arrowColor: "#000",
    textDayFontSize: wp("3.5%"),
    textMonthFontSize: wp("4%"),
    textDayHeaderFontSize: wp("3.5%"),

    // 👇 Compact Calendar Spacing
    "stylesheet.calendar.main": {
      week: {
        marginTop: hp('0.6%'),
        marginBottom: hp('0.6%'),
        flexDirection: "row",
        justifyContent: "space-around",
      },
    },
    "stylesheet.calendar.header": {
      header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        paddingHorizontal: wp("2%"),
      },
      monthText: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 2,
        width: 32,
        textAlign: "center",
        fontSize: wp("3.2%"),
        color: "#000",
      },
    },
  }}
      />
    </View>
  );
}