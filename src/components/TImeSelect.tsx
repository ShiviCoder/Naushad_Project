import { View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { Shadow } from "react-native-shadow-2";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";



const TimeSelect = () => {



  const slotArray = [
    "9.00",
    "10.00",
    "11.00",
    "12.00",
    "13.00",
    "14.00",
    "15.00",
    "16.00",
    "17.00",
    "18.00",
  ];

  return (
    <View style={{ paddingHorizontal: wp("2%") }}>
      <FlatList
       // ✅ force re-render on column change
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
            startColor="#f7c744"
            offset={[4, 0]}
            style={[styles.shadowContainer, { width: wp("18%") }]} // ✅ equal spacing
          >
            <TouchableOpacity style={styles.slotButton}>
              <Text style={styles.slotText}>{item}</Text>
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
    backgroundColor: "#fff",
    borderRadius: wp("2%"),
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  slotText: {
    color: "#000",
    fontWeight: "600",
    fontSize: wp("3.5%"),
  },
});

export default TimeSelect;