import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Calender from '../../components/Calender';
import TimeSelect from '../../components/TImeSelect';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Head from '../../components/Head';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from '../../context/ThemeContext'; // ✅ import useTheme

type RootStackParamList = {
  BookAppointmentScreen: { image?: any };  // optional
};

export default function BookAppointmentScreen() {
  const { theme } = useTheme(); // ✅ use theme
  const route = useRoute<RouteProp<RootStackParamList, "BookAppointmentScreen">>();
  const { image } = route.params || {};
  const navigation = useNavigation();

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <Head title="Book Appointment" />
      <View style={styles.container}>
        <View>
          {image ? (
            <Image source={image} style={styles.img} />
          ) : (
            <Image source={require('../../assets/images/facial.jpg')} style={styles.img}/>
          )}
        </View>

        <Text style={[styles.Text, { color: theme.textPrimary }]}>Select Date</Text>
        <View style={styles.calenderContainer}>
          <Calender />
        </View>

        <Text style={[styles.Text, { color: theme.textPrimary }]}>Select Time</Text>
        <View style={styles.timeContainer}>
          <TimeSelect />
        </View>

        <View style={styles.nxt}>
          <TouchableOpacity onPress={()=>navigation.navigate('BookAppoinment2')} style={[styles.nxtButton, { backgroundColor: '#F6B745' }]}>
            <Text style={[styles.nxtText, { color: '#fff' }]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: wp("4%"),
    marginBottom: hp("0%"),
  },
  container: {
    paddingHorizontal: wp("3%"),
  },
  img: {
    width: wp("85%"),
    height: hp("20%"),
    resizeMode: "cover",
    alignSelf: "center",
    marginBottom: hp('1%'),
    borderRadius: wp('2%'),
  },
  Text: {
    fontSize: wp("4%"),
    paddingVertical: hp("0.2%"),
    paddingHorizontal: wp("2%"),
    fontFamily: "Poppins-Regular",
    fontWeight: "800",
  },
  calenderContainer: {
    marginHorizontal: wp("2%"),
    marginBottom: hp("0.5%"),
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
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
  },
  nxtText: {
    fontSize: wp("4%"),
    fontWeight: "500",
  },
});
