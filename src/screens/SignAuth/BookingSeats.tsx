import { BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Head from '../../components/Head'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import COLORS from '../../utils/Colors'
import { useTheme } from '../../context/ThemeContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Dummy backend seats response
const fetchBookedSeats = async (): Promise<number[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([9, 18, 7, 12]), 500)
  })
}

const BookingSeats = () => {
  const { theme } = useTheme()
  const seats = Array.from({ length: 20 }, (_, i) => i + 1)
  const navigation = useNavigation()
  const route = useRoute()
  
  // Get all parameters including the source information
  const { 
    date: selectedDate, 
    time: selectedTime, 
    serviceName, 
    price,
    from,
  } = route.params || {}

  const [bookedSeats, setBookedSeats] = useState<number[]>([])
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)

  useEffect(() => {
    const loadBookedSeats = async () => {
      const data = await fetchBookedSeats()
      setBookedSeats(data)
    }
    loadBookedSeats()
  }, [])

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); 
      return true; 
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  // Add debug logging to check the source
  useEffect(() => {
    console.log('📋 BookingSeats Route Params:', route.params)
    console.log('📍 Source (from):', from)
    console.log('📅 Selected Date (raw):', selectedDate)
    console.log('📅 Selected Date (as Date):', selectedDate ? new Date(selectedDate) : 'No date')
    console.log('📅 Selected Date (local):', selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No date')
    console.log('🕒 Selected Time:', selectedTime)
  }, [route.params])

  const onNextPress = () => {
    // FIX: Use the date as-is without timezone conversion
    const formattedDate = selectedDate || null
    const formattedTime = selectedTime || '00:00'

    console.log('📍 Navigation Source:', from)
    console.log('📅 Formatted Date:', formattedDate)
    console.log('🕒 Formatted Time:', formattedTime)
    console.log('💺 Selected Seat:', selectedSeat)

    // Conditional navigation based on source
    if (from === 'PackageDetails' || from === 'Our-Packages') {
      // Navigate to Payment Screen when coming from Packages
      console.log('🚀 Navigating to Payment Screen')
      navigation.navigate('PaymentScreen', {
        selectedDate: formattedDate, // Use the date as-is
        selectedTime: formattedTime,
        selectedSeat,
        serviceName,
        price,
      })
    } else {
      // Default navigation to BookAppointment2
      console.log('🚀 Navigating to BookAppointment2 Screen')
      navigation.navigate('BookAppoinment2', {
        selectedDate: formattedDate, // Use the date as-is
        selectedTime: formattedTime,
        selectedSeat,
        serviceName,
        price,
      })
    }
  }

  const renderItem = ({ item }: { item: number }) => {
    const isBooked = bookedSeats.includes(item)
    const isSelected = selectedSeat === item

    let tintColor = '#a09797ff' // available by default
    if (isBooked) tintColor = COLORS.primary
    else if (isSelected) tintColor = 'green'

    return (
      <TouchableOpacity
        disabled={isBooked}
        onPress={() => setSelectedSeat(item)}
        style={{ alignItems: 'center', margin: wp('1%') }}
      >
        <Image
          source={require('../../assets/seats.png')}
          style={{ width: wp('15%'), height: wp('15%') }}
          tintColor={tintColor}
        />
        <Text style={{ color: theme.textPrimary, marginTop: hp('0.1%'), fontSize: wp('4%') }}>
          {item}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
   <SafeAreaView style={{flex :1}}>
     <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Booking" showBack={true} />

      <View style={{ padding: wp('3%') }}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Please confirm your seat
        </Text>

        <FlatList
          data={seats}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          contentContainerStyle={{
            paddingBottom: hp('15%'),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.nxt}>
          <TouchableOpacity
            onPress={onNextPress}
            style={[styles.nxtButton, { 
              backgroundColor: selectedSeat ? COLORS.primary : '#ccc' 
            }]}
            disabled={selectedSeat === null}
          >
            <Text style={[styles.nxtText, { color: '#fff' }]}>
              {(from === 'PackageDetails' || from === 'Our-Packages') ? 'Proceed to Payment' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
   </SafeAreaView>
  )
}

export default BookingSeats

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    marginBottom: hp('1%'),
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    textAlign: 'center'
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    padding: wp('2%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: wp('2%'),
    marginHorizontal: wp('5%'),
  },
  dateTimeText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center'
  },
  debugText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    fontStyle: 'italic'
  },
  nxt: {
    marginHorizontal: wp('2%'),
    marginTop: hp('5%'),
    width: '93%',
    alignSelf: 'center'
  },
  nxtButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  nxtText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  }
})