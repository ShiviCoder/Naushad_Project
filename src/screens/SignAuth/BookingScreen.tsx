import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioButton from '../../components/RadioButton';
import BookingAcceptCards from '../../components/BookingAcceptCard';
import { BookingAcceptData, BookingPendingData, PreviousBookingData } from '../../components/BookingAcceptData';
import BookingPendingCard from '../../components/BookingPendingCard';
import PreviousBookingCard from '../../components/PreviousBookingCard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from "../../context/ThemeContext";
import BottomNavbar from '../../components/BottomNavbar';
import Head from '../../components/Head';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const allBookings = [
  ...BookingAcceptData.map(item => ({ ...item, type: "accept" })),
  ...BookingPendingData.map(item => ({ ...item, type: "pending" })),
  ...PreviousBookingData.map(item => ({ ...item, type: "previous" }))
];

const filters = [
  {label : "All", value: "all"},
  {label : "Accepted" , value : "accept"},
  {label : "Pending", value : "pending"},
]

const BookingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ new theme context
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredBookings = allBookings.filter(item=>{
    if(selectedFilter === "all") return true;
    if(selectedFilter === "accept") return item.type === 'accept';
    if(selectedFilter === "pending") return item.type === "pending";
    return false;
  });

  return (
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
      />

      <FlatList
        data={filteredBookings}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp("6%") }}
        keyExtractor={(item, index) => item.id + "-" + index}
        renderItem={({ item, index }) => {
          if (item.type === "previous" && selectedFilter === "all") {
            const isFirstPrevious = index === 0 || filteredBookings[index - 1].type !== "previous";

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
          } else if (item.type === "accept") {
            return <BookingAcceptCards item={item} />;
          } else if (item.type === "pending") {
            return <BookingPendingCard item={item} />;
          } else {
            return null;
          }
        }}
      />
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default BookingScreen;
