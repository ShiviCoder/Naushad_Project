import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Calender from '../../components/Calender';
import TimeSelect from '../../components/TImeSelect';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Head from '../../components/Head';


export default function BookAppointmentScreen() {

  return (

    <View style={styles.mainContainer}>
      <Head title="Book Appointment" ></Head>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.mainImage}>
            <Image style={styles.img} source={require('../../assets/bookImage.png')} />
          </View>

          <Text style={styles.Text}>Select Date</Text>

          <View style={styles.calenderContainer}>
            <Calender />
          </View>

          <Text style={styles.Text}>Select Time</Text>
          <View style={styles.timeContainer}>
            <TimeSelect />
          </View>

          <View style={styles.nxt}>
            <TouchableOpacity style={styles.nxtButton}>
              <Text style={styles.nxtText}>Next</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>


  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: wp("4%"),
    marginBottom: hp("0%"),
    backgroundColor: "#fff",
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("2%"),
    gap: wp("20%"), // responsive spacing
  },
  headIcon: {
    width: wp("6%"),
    height: wp("6%"),
    resizeMode: "contain",
  },
  headText: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  container: {
    padding: wp("3%"),
  },
  img: {
    width: wp("85%"), // takes 85% of screen width
    height: hp("20%"), // adjusts height based on screen
    resizeMode: "contain",
    alignSelf: "center",
  },
  Text: {
    fontSize: wp("4%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("2%"),
    fontFamily: "Poppins-Regular",
    fontWeight: "800",
  },
  calenderContainer: {
    marginHorizontal: wp("2%"),
    marginBottom: hp("1%"),
  },
  timeContainer: {
    marginHorizontal: wp("1%"),
    marginBottom: hp("1%"),
  },
  nxt: {
    marginHorizontal: wp("4%"),
    alignItems: "flex-end",
  },
  nxtButton: {
    backgroundColor: "#F6B745",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
  },
  nxtText: {
    color: "#ffffff",
    fontSize: wp("4%"),
    fontWeight: "500",
  },
});