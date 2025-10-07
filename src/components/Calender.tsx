import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";

export default function Calender() {
  const { theme } = useTheme(); // ✅ use theme
  const [selected, setSelected] = useState("");

  // Custom locale
  LocaleConfig.locales["en"] = {
    monthNames: [
      "January","February","March","April","May","June","July","August","September","October","November","December",
    ],
    monthNamesShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    dayNamesShort: ["S","M","T","W","T","F","S"],
  };
  LocaleConfig.defaultLocale = "en";

  return (
    <View>
      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        hideExtraDays={true}
        monthFormat={"MMMM"}
        minDate={new Date().toISOString().split("T")[0]}
        renderArrow={(direction) =>
          direction === "left" ? (
            <Icon name="chevron-back" size={wp("6%")} color={theme.textPrimary} />
          ) : (
            <Icon name="chevron-forward" size={wp("6%")} color={theme.textPrimary} />
          )
        }
        dayComponent={({ date }) => {
          if (!date) return null;

          const isSelected = selected === date.dateString;
          const today = new Date();
          const currentDate = new Date(date.year , date.month - 1, date.day);
          const isToday =
            today.getFullYear() === date.year &&
            today.getMonth() + 1 === date.month &&
            today.getDate() === date.day;

            const isPast = currentDate < new Date(new Date().setHours(0,0,0,0));

          return (
            <TouchableOpacity
            disabled={isPast}
               onPress={() =>
        setSelected(isSelected ? "" : date.dateString) // ✅ toggle selection
      }
              activeOpacity={0.7}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: wp("6%"),
                height: wp("6%"),
                backgroundColor: isSelected ? '#F6B745' : theme.cardBackground,
                borderRadius: wp("50%"),
                padding: wp("0.5%"),
              }}
            >
              <Text
                style={{
                  color: isPast
            ? "#dadada" // past date color
            : isSelected
            ? theme.textPrimary
            : isToday
            ? "orange"
            : theme.textSecondary,
                  fontWeight: isSelected || isToday ? "700" : "600",
                  fontSize: wp("3.5%"),
                }}
              >
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
        theme={{
          backgroundColor: theme.background,
          calendarBackground: theme.cardBackground,
          monthTextColor: theme.textPrimary,
          arrowColor: theme.textPrimary,
          textDayFontSize: wp("3.5%"),
          textMonthFontSize: wp("4%"),
          textDayHeaderFontSize: wp("3.5%"),

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
              color: theme.textPrimary,
                  fontFamily: "Poppins-Medium",

            },
            dayHeader: {
              marginTop: 2,
              marginBottom: 2,
              width: 32,
              textAlign: "center",
              fontSize: wp("3.2%"),
              color: theme.textSecondary,
                  fontFamily: "Poppins-Medium",

            },
          },
        }}
      />
    </View>
  );
}
