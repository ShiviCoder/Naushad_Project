import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";

interface TimeSelectProps {
  selectedDate?: Date;
  onTimeSelect?: (time: string) => void;
}

const TimeSelect = ({ selectedDate, onTimeSelect }: TimeSelectProps) => {
  const { theme } = useTheme();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const slotArray = [
    "09.00", "09.30", "10.00", "10.30",
    "11.00", "11.30", "12.00", "12.30",
    "13.00", "13.30", "14.00", "14.30", "15.30"
  ];

  // 🕒 Update current time every minute
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime(hours + minutes / 60);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Reset selection when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // ⏰ Convert slot string like "09.30" → 9.5 hours
  const parseSlot = (slot: string) => {
    const [h, m] = slot.split(".");
    return parseInt(h, 10) + (m ? parseInt(m, 10) / 60 : 0);
  };

  // 🕤 Format slot for display
  const formatSlot = (slot: string) => {
    let [hour, minute] = slot.split(".").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}${minute ? `:${minute}` : ""} ${ampm}`;
  };

  // 🚫 Determine if slot should be disabled
 const isSlotDisabled = (slot: string) => {
  if (!selectedDate) return false;

  const now = new Date();
  const selected = new Date(selectedDate);

  // ---- DATE COMPARISON ----
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();

  const selYear = selected.getFullYear();
  const selMonth = selected.getMonth();
  const selDate = selected.getDate();

  const isPastMonth =
    selYear < todayYear ||
    (selYear === todayYear && selMonth < todayMonth);

  const isFutureMonth =
    selYear > todayYear ||
    (selYear === todayYear && selMonth > todayMonth);

  const isToday =
    selYear === todayYear &&
    selMonth === todayMonth &&
    selDate === todayDate;

  const isPastDate =
    selYear === todayYear &&
    selMonth === todayMonth &&
    selDate < todayDate;

  // ---- LOGIC ----
  if (isPastMonth || isPastDate) return true;      // disable all in past
  if (isFutureMonth || selDate > todayDate) return false;  // enable all in future

  // ---- TODAY ----
  if (isToday) {
    const slotTime = parseSlot(slot); // convert to decimal hours
    return slotTime <= currentTime;   // disable past times
  }

  return false;
};
  return (
    <View style={{ paddingHorizontal: wp("2%") }}>
      <FlatList
        data={slotArray}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: "flex-start", marginVertical: hp("0.8%") }}
        renderItem={({ item }) => {
          const isSelected = selectedSlot === item;
          const isDisabled = isSlotDisabled(item);
          return (
            <Shadow
              distance={3}
              startColor={COLORS.shadow}
              offset={[4, 0]}
              style={[styles.shadowContainer, { width: wp("20%"), height: hp("4.5%") }]}
            >
              <TouchableOpacity
                disabled={isDisabled}
                style={[
                  styles.slotButton,
                  {
                    backgroundColor: isSelected
                      ? COLORS.primary
                      : theme.cardBackground,
                    opacity: isDisabled ? 0.6 : 1
                  },
                ]}
                onPress={() => {
                  const newValue = isSelected ? null : item;
                  setSelectedSlot(newValue);
                  if (newValue && onTimeSelect) onTimeSelect(newValue);
                }}
              >
                <Text
                  style={[
                    styles.slotText,
                    {
                      color: isDisabled
                        ? "#8a8787ff"
                        : isSelected
                        ? "#000"
                        : theme.textPrimary,
                    },
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
    justifyContent: "center",
    alignItems: "center",
  },
  slotButton: {
    borderRadius: wp("2%"),
    paddingVertical: hp("1.3%"),
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
