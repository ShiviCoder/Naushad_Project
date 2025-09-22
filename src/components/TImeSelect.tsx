import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import React from "react";
import { Shadow } from "react-native-shadow-2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";

const TimeSelect = () => {
  const { theme } = useTheme(); // ✅ use theme

  const slotArray = [
    "9.00","10.00","11.00","12.00","13.00","14.00","15.00","16.00","17.00","18.00",
  ];

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
        renderItem={({ item }) => (
          <Shadow
            distance={3}
            startColor='#F6B745' // ✅ shadow color dynamic
            offset={[4, 0]}
            paintInside = {false}
            style={[styles.shadowContainer, { width: wp("18%") }]}
          >
            <TouchableOpacity style={[styles.slotButton, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.slotText, { color: theme.textPrimary }]}>{item}</Text>
            </TouchableOpacity>
          </Shadow>
        )}
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
    fontWeight: "600",
    fontSize: wp("3.5%"),
  },
});

export default TimeSelect;
