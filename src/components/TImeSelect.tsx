import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Shadow } from "react-native-shadow-2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";

interface TimeSelectProps {
  selectedDate?: Date;
  onTimeSelect?: (time: string) => void; // ✅ new prop
}

const TimeSelect = ({ selectedDate, onTimeSelect }: TimeSelectProps) => {
  const { theme } = useTheme();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const slotArray = [
    "09.00", "09.30", "10.00", "10.30", "11.00", "11.30", "12.00", "12.30", "01.00", "01.30", "02.00", "02.30", "03.30"
  ];

  // ✅ Update current time periodically
  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // ✅ Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  const updateCurrentTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    setCurrentTime(currentHour + currentMinute / 60);
  };

  const parseSlot = (slot: string) => {
    const [h, m] = slot.split(".");
    return parseInt(h) + (m ? parseInt(m) / 60 : 0);
  };

  const formatSlot = (slot: string) => {
    let hour = parseInt(slot.split(".")[0]);
    let minute = slot.split(".")[1] ? parseInt(slot.split(".")[1]) : 0;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}${minute > 0 ? ":" + minute : ""} ${ampm}`;
  };

  // ✅ Check if the selected date is today
  const isToday = () => {
    if (!selectedDate) return true; // If no date selected, assume today

    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // ✅ Determine if a time slot should be disabled
  const isSlotDisabled = (slot: string) => {
    // If selected date is not today, enable all slots
    if (!isToday()) {
      return false;
    }

    // If today, disable past time slots
    const slotTime = parseSlot(slot);
    return slotTime <= currentTime;
  };
  return (
    <View style={{ paddingHorizontal: wp("2%") }}>
      <FlatList
        data={slotArray}
        numColumns={4}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          marginVertical: hp("0.8%"),
        }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedSlot === item; // ✅ check if selected
          const isPast = isSlotDisabled(item);
          return (
            <Shadow
              distance={3}
              startColor={COLORS.shadow} // yellow if selected
              offset={[4, 0]}
              style={[styles.shadowContainer, { width: wp("20%"), height: hp("4.5%") }]}
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
                onPress={() => {
                  const newValue = isSelected ? null : item;
                  setSelectedSlot(newValue);
                  if (newValue && onTimeSelect) {
                    onTimeSelect(newValue); // ✅ send selected time back to parent
                  }
                }} // ✅ update state on press
              >
                <Text
                  style={[
                    styles.slotText,
                    {
                      color: isPast ?
                        "#8a8787ff" :
                        isSelected ? '#000' : theme.textPrimary
                    }, // text color contrast
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
    marginHorizontal: wp("1%"),
    borderRadius: wp("2%"),
    minHeight: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  slotButton: {
    borderRadius: wp("2%"),
    paddingVertical: hp("1.3%"),
    paddingHorizontal: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  slotText: {
    fontWeight: "700",
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Medium",

  },
});

export default TimeSelect;
