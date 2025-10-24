<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RadioButton from '../../components/RadioButton';
import BookingAcceptCards from '../../components/BookingAcceptCard';
import {
  BookingAcceptData,
  BookingPendingData,
  PreviousBookingData,
} from '../../components/BookingAcceptData';
=======
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioButton from '../../components/RadioButton';
import BookingAcceptCards from '../../components/BookingAcceptCard';
import { BookingAcceptData, BookingPendingData, PreviousBookingData } from '../../components/BookingAcceptData';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import BookingPendingCard from '../../components/BookingPendingCard';
import PreviousBookingCard from '../../components/PreviousBookingCard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD
import { useTheme } from '../../context/ThemeContext';
=======
import { useTheme } from "../../context/ThemeContext";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import BottomNavbar from '../../components/BottomNavbar';
import Head from '../../components/Head';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const allBookings = [
<<<<<<< HEAD
  ...BookingAcceptData.map(item => ({ ...item, type: 'accept' })),
  ...BookingPendingData.map(item => ({ ...item, type: 'pending' })),
  ...PreviousBookingData.map(item => ({ ...item, type: 'previous' })),
];

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Accepted', value: 'accept' },
  { label: 'Pending', value: 'pending' },
];
=======
  ...BookingAcceptData.map(item => ({ ...item, type: "accept" })),
  ...BookingPendingData.map(item => ({ ...item, type: "pending" })),
  ...PreviousBookingData.map(item => ({ ...item, type: "previous" }))
];

const filters = [
  {label : "All", value: "all"},
  {label : "Accepted" , value : "accept"},
  {label : "Pending", value : "pending"},
]
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

const BookingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ new theme context
  const [selectedFilter, setSelectedFilter] = useState('all');

<<<<<<< HEAD
  const filteredBookings = allBookings.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'accept') return item.type === 'accept';
    if (selectedFilter === 'pending') return item.type === 'pending';
=======
  const filteredBookings = allBookings.filter(item=>{
    if(selectedFilter === "all") return true;
    if(selectedFilter === "accept") return item.type === 'accept';
    if(selectedFilter === "pending") return item.type === "pending";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    return false;
  });

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      <Head title="Bookings" showBack={false} />
      {/* RadioButton component */}
      <RadioButton
        type="status"
        selected={selectedFilter}
        onSelect={value => {
          console.log('Selected Value ', value);
          setSelectedFilter(value);
        }}
=======
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <Head title='Bookings' showBack={false}/>
      {/* RadioButton component */}
      <RadioButton 
      type='status'
      selected={selectedFilter}
      onSelect={value => 
       { console.log('Selected Value ',value);
        setSelectedFilter(value);}
      }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      />

      <FlatList
        data={filteredBookings}
        style={styles.container}
        showsVerticalScrollIndicator={false}
<<<<<<< HEAD
        contentContainerStyle={{ paddingBottom: hp('6%') }}
        keyExtractor={(item, index) => item.id + '-' + index}
        renderItem={({ item, index }) => {
          if (item.type === 'previous' && selectedFilter === 'all') {
            const isFirstPrevious =
              index === 0 || filteredBookings[index - 1].type !== 'previous';
=======
        contentContainerStyle={{ paddingBottom: hp("6%") }}
        keyExtractor={(item, index) => item.id + "-" + index}
        renderItem={({ item, index }) => {
          if (item.type === "previous" && selectedFilter === "all") {
            const isFirstPrevious = index === 0 || filteredBookings[index - 1].type !== "previous";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

            return (
              <>
                {isFirstPrevious && (
                  <Text style={[styles.heading, { color: theme.textPrimary }]}>
                    Previous Bookings
                  </Text>
                )}
                <PreviousBookingCard item={item} />
              </>
            );
<<<<<<< HEAD
          } else if (item.type === 'accept') {
            return <BookingAcceptCards item={item} />;
          } else if (item.type === 'pending') {
=======
          } else if (item.type === "accept") {
            return <BookingAcceptCards item={item} />;
          } else if (item.type === "pending") {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
            return <BookingPendingCard item={item} />;
          } else {
            return null;
          }
        }}
      />
<<<<<<< HEAD
=======
    
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    justifyContent: 'center',
  },
  headText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  container: {
    paddingTop: hp('2%'),
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: '500',
    marginVertical: hp('1.5%'),
    marginLeft: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
=======
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    justifyContent: "center",
    
  },
  headText: {
    fontSize: wp("5%"),
    fontWeight: 'bold',
  },
  container: {
    paddingTop: hp("2%"),
  },
  heading: {
    fontSize: wp("6%"),
    fontWeight: "500",
    marginVertical: hp("1.5%"),
    marginLeft: wp("4%"),
    fontFamily: 'Poppins-Medium'
  }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});

export default BookingScreen;
