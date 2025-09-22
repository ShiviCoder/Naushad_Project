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

const allBookings = [
  ...BookingAcceptData.map(item => ({ ...item, type: "accept" })),
  ...BookingPendingData.map(item => ({ ...item, type: "pending" })),
  ...PreviousBookingData.map(item => ({ ...item, type: "previous" }))
];

const BookingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ new theme context

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headContainer}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Icon name="chevron-back" size={wp('7%')} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headText, { color: theme.textPrimary }]}>Bookings</Text>
      </View>

      {/* RadioButton component */}
      <RadioButton />

      <FlatList
        data={allBookings}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp("6%") }}
        keyExtractor={(item, index) => item.id + "-" + index}
        renderItem={({ item, index }) => {
          if (item.type === "previous") {
            const isFirstPrevious = index === 0 || allBookings[index - 1].type !== "previous";

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
      <BottomNavbar/>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    justifyContent: "flex-start",
    gap: wp('30%')
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
