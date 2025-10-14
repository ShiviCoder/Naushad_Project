import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Shadow } from "react-native-shadow-2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";

const TimeSelect = () => {
  const { theme } = useTheme(); // ✅ use theme
 const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const slotArray = [
    "9.00","10.00","11.00","12.00","13.00","14.00","15.00","16.00","17.00","18.00","19:00",
  ];

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + currentMinute / 60;


  const parseSlot = (slot:string) => {
    const [h,m] = slot.split(".");
    return parseInt(h) + (m ? parseInt(m)/60 : 0);
  }

  const formatSlot = (slot : string) => {
    let hour = parseInt(slot.split(".")[0]);
    let minute = slot.split(".")[1] ? parseInt(slot.split(".")[1]) : 0;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if(hour === 0) hour = 12;
    return  `${hour}${minute > 0 ? ":" + minute : ""} ${ampm}`
  }


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
          const slotTime = parseSlot(item);
          const isPast = slotTime <= currentTime;

          return (
            <Shadow
              distance={3}
              startColor={'#F6B745'} // yellow if selected
              offset={[4, 0]}
              style={[styles.shadowContainer, { width: wp("18%") , height: hp("4.5%")}]}
              paintInside={isSelected ? true : false} 
            >
              <TouchableOpacity
              disabled={isPast}
                style={[
                  styles.slotButton,
                  {
                    backgroundColor: isSelected ? '#F6B745' : theme.cardBackground, // ✅ yellow if selected
                    
                  },
                ]}
                onPress={() => setSelectedSlot(isSelected ? "" : item)} // ✅ update state on press
              >
                <Text
                  style={[
                    styles.slotText,
                    { color: isPast ? 
                      "#dadada" : 
                      isSelected ? '#000' : theme.textPrimary }, // text color contrast
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
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
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
