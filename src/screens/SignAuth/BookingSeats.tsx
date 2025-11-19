import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Head from '../../components/Head'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import COLORS from '../../utils/Colors'
import { useTheme } from '../../context/ThemeContext'
import { useNavigation, useRoute } from '@react-navigation/native'

// Dummy backend seats response
// bookedSeats array contains already booked seat numbers from backend
const fetchBookedSeats = async (): Promise<number[]> => {
  // simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve([9, 18, 7, 12]), 500)
  })
}

const BookingSeats = () => {
  const { theme } = useTheme()
  const seats = Array.from({ length: 20 }, (_, i) => i + 1)
  const navigation = useNavigation()
  const route = useRoute()
  const { selectedDate, selectedTime } = route.params || {}

  const [bookedSeats, setBookedSeats] = useState<number[]>([])
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)

  useEffect(() => {
    const loadBookedSeats = async () => {
      const data = await fetchBookedSeats()
      setBookedSeats(data)
    }
    loadBookedSeats()
  }, [])

  const onNextPress = () => {
    const formattedDate = selectedDate ? new Date(selectedDate).toISOString() : null
    const formattedTime = selectedTime || '00:00'

    console.log('📅', formattedDate, '🕒', formattedTime, 'Seat:', selectedSeat)

    
      navigation.navigate('PaymentScreen', {
        selectedDate: formattedDate,
        selectedTime,
        selectedSeat,
      })
    
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
            style={[styles.nxtButton, { backgroundColor: COLORS.primary }]}
            disabled={selectedSeat === null} // disable Next if no seat selected
          >
            <Text style={[styles.nxtText, { color: '#fff' }]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BookingSeats

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    marginBottom: hp('4%'),
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center'
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
