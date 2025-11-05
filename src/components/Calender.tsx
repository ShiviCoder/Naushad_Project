import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";

interface CalenderProps {
  onDateSelect?: (date: Date | null) => void;
}

export default function Calender({ onDateSelect }: CalenderProps) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState("");
  const [visibleMonth, setVisibleMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // 🗓 Custom locale setup
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

  const handleDatePress = (dateString: string) => {
  if (selected === dateString) {
    // 👇 If the same date is tapped again → unselect
    setSelected("");
    if (selected === dateString) {
  setSelected("");
  return; // don't call onDateSelect at all
}
  } else {
    // ✅ Otherwise, select the new date
    const [year, month, day] = dateString.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    setSelected(dateString);

    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  }
};

  // 🧭 Logic: disable left arrow when in current month
  const today = new Date();
  const isCurrentMonth =
    visibleMonth.month === today.getMonth() + 1 &&
    visibleMonth.year === today.getFullYear();

  return (
    <View>
      <Calendar
        onDayPress={(day) => handleDatePress(day.dateString)}
        hideExtraDays={true}
        monthFormat={"MMMM"}
        minDate={new Date().toISOString().split("T")[0]}
        onMonthChange={(month) =>
          setVisibleMonth({ month: month.month, year: month.year })
        }
        disableArrowLeft={isCurrentMonth}
        renderArrow={(direction) => (
          <Icon
            name={
              direction === "left" ? "chevron-back" : "chevron-forward"
            }
            size={wp("6%")}
            color={
              direction === "left" && isCurrentMonth
                ? "#999" // faded when disabled
                : theme.textPrimary
            }
          />
        )}
        dayComponent={({ date }) => {
          if (!date) return null;

          const isSelected = selected === date.dateString;
          const today = new Date();
          const currentDate = new Date(date.year, date.month - 1, date.day);
          const isToday =
            today.getFullYear() === date.year &&
            today.getMonth() + 1 === date.month &&
            today.getDate() === date.day;

          const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <TouchableOpacity
              disabled={isPast}
              onPress={() => handleDatePress(date.dateString)}
              activeOpacity={0.7}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: wp("6%"),
                height: wp("6%"),
                backgroundColor: isSelected
                  ? COLORS.primary
                  : theme.cardBackground,
                borderRadius: wp("50%"),
                padding: wp("0.5%"),
              }}
            >
              <Text
                style={{
                  color: isPast
                    ? "#dadada"
                    : isSelected
                    ? theme.textPrimary
                    : isToday
                    ? COLORS.primary
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
              marginTop: hp("0.6%"),
              marginBottom: hp("0.6%"),
              flexDirection: "row",
              justifyContent: "space-around",
            },
          },
          "stylesheet.calendar.header": {
            header: {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: hp("1%"),
              marginBottom: hp("1%"),
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
