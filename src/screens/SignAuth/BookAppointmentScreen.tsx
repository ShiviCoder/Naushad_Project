import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import Calender from '../../components/Calender';
import TimeSelect from '../../components/TImeSelect';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from '../../context/ThemeContext';
import BottomNavbar from '../../components/BottomNavbar';

type RootStackParamList = {
  BookAppointmentScreen: { image?: any };
};

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, "BookAppointmentScreen">>();
  const { image } = route.params || {};
  const navigation = useNavigation();

  // FlatList ke liye ek dummy data array
  const data = ['image', 'selectDate', 'calendar', 'selectTime', 'timeSelect', 'nextButton'];

  const renderItem = ({ item }: { item: string }) => {
    switch(item) {
      case 'image':
        return (
          <View>
            {image ? (
              <Image source={image} style={styles.img} />
            ) : (
              <Image source={require('../../assets/images/facial.jpg')} style={styles.img} />
            )}
          </View>
        );
      case 'selectDate':
        return <Text style={[styles.Text, { color: theme.textPrimary }]}>Select Date</Text>;
      case 'calendar':
        return <View style={styles.calenderContainer}><Calender /></View>;
      case 'selectTime':
        return <Text style={[styles.Text, { color: theme.textPrimary }]}>Select Time</Text>;
      case 'timeSelect':
        return <View style={styles.timeContainer}><TimeSelect /></View>;
      case 'nextButton':
        return (
          <View style={styles.nxt}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BookAppoinment2')}
              style={[styles.nxtButton, { backgroundColor: '#F6B745' }]}
            >
              <Text style={[styles.nxtText, { color: '#fff' }]}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headContainer}>
        <Text style={[styles.headText, { color: theme.textPrimary }]}>Bookings</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingBottom: hp("15%"), paddingHorizontal: wp("3%") }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1 
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    justifyContent: "center",
  },
  headText: { 
    fontSize: wp("5%"), 
    fontWeight: 'bold' 
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
    fontFamily: "Poppins-Medium",
    fontWeight: "800",
  },
  calenderContainer: { marginHorizontal: wp("2%"), marginBottom: hp("0.5%") },
  timeContainer: { marginHorizontal: wp("1%"), marginBottom: hp("1%") },
  nxt: { marginHorizontal: wp("4%"), alignItems: "flex-end", marginTop: hp("2%") },
  nxtButton: { paddingVertical: hp("1%"), paddingHorizontal: wp("4%"), borderRadius: wp("2%") },
  nxtText: { fontSize: wp("4%"), fontWeight: "500" ,    fontFamily: "Poppins-Medium",
},
});
