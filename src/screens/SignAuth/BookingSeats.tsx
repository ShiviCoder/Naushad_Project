import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Head from '../../components/Head'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import COLORS from '../../utils/Colors'
import { useTheme } from '../../context/ThemeContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Chair {
  _id: string
  chairNumber: number
  isChairAvailable: boolean
  subAdminId: string
  subAdminEmail: string
  __v: number
  createdAt: string
  updatedAt: string
}

interface ChairsResponse {
  success: boolean
  message: string
  data: Chair[]
}

const BookingSeats = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  
  // Get all parameters including the source information
  const { 
    selectedDate, 
    selectedTime, 
    serviceName, 
    price,
    from,
  } = route.params || {}

  const [chairs, setChairs] = useState<Chair[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)

  // Add debug logging to check the source and parameters
  useEffect(() => {
    console.log('📋 BookingSeats Route Params:', route.params)
    console.log('📍 Source (from):', from)
    console.log('📅 Selected Date (raw):', selectedDate)
    console.log('📅 Selected Date (as Date):', selectedDate ? new Date(selectedDate) : 'No date')
    console.log('📅 Selected Date (local):', selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No date')
    console.log('🕒 Selected Time:', selectedTime)
    console.log('💼 Service Name:', serviceName)
    console.log('💰 Price:', price)
  }, [route.params])

  useEffect(() => {
    const fetchChairs = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://naushad.onrender.com/api/appointments/get-chairs'
        )
        const data: ChairsResponse = await response.json()

        if (data.success) {
          setChairs(data.data)
        } else {
          console.error('Failed to fetch chairs:', data.message)
        }
      } catch (error) {
        console.error('Error fetching chairs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChairs()
  }, [])

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [navigation])

  const onNextPress = () => {
    // FIX: Use the date as-is without timezone conversion
    const formattedDate = selectedDate || null
    const formattedTime = selectedTime || '00:00'

    console.log('📍 Navigation Source:', from)
    console.log('📅 Formatted Date:', formattedDate)
    console.log('🕒 Formatted Time:', formattedTime)
    console.log('💺 Selected Seat:', selectedSeat)
    console.log('💼 Service Name:', serviceName)
    console.log('💰 Price:', price)

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

  // ************************************
  // TOGGLE SELECTION + LIMIT TO 1 SEAT
  // ************************************
  const handleSeatPress = (seatNumber: number, isAvailable: boolean) => {
    if (!isAvailable) return
    if (selectedSeat === seatNumber) {
      setSelectedSeat(null)      // unselect on second tap
    } else {
      setSelectedSeat(seatNumber) // allow only one seat
    }
  }

  const renderItem = ({ item }: { item: Chair }) => {
    const isAvailable = item.isChairAvailable
    const isSelected = selectedSeat === item.chairNumber

    let tintColor = '#a09797ff'
    if (!isAvailable) tintColor = 'red'
    else if (isSelected) tintColor = 'green'

    return (
      <TouchableOpacity
        disabled={!isAvailable}
        onPress={() => handleSeatPress(item.chairNumber, isAvailable)}
        style={{ alignItems: 'center', margin: wp('1%') }}
      >
        <Image
          source={require('../../assets/seats.png')}
          style={{
            width: wp('15%'),
            height: wp('15%'),
            opacity: isAvailable ? 1 : 0.5
          }}
          tintColor={tintColor}
        />

        <Text
          style={{
            color: theme.textPrimary,
            marginTop: hp('0.1%'),
            fontSize: wp('4%'),
            opacity: isAvailable ? 1 : 0.5
          }}
        >
          {item.chairNumber}
        </Text>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Head title="Booking" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={COLORS.primary} 
            style={styles.activityIndicator}
          />
          <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
            Loading seats...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Head title="Booking" showBack={true} />

        <View style={{ padding: wp('3%') }}>
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Please confirm your seat
          </Text>

          {/* Date and Time Display */}
          <View style={[styles.dateTimeContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.dateTimeText, { color: theme.textPrimary }]}>
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No date selected'}
            </Text>
            <Text style={[styles.dateTimeText, { color: theme.textPrimary }]}>
              {selectedTime || 'No time selected'}
            </Text>
            {(serviceName || price) && (
              <View style={styles.serviceInfo}>
                {serviceName && (
                  <Text style={[styles.serviceText, { color: theme.textPrimary }]}>
                    Service: {serviceName}
                  </Text>
                )}
                {price && (
                  <Text style={[styles.serviceText, { color: theme.textPrimary }]}>
                    Price: ${price}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Debug information */}
          <Text style={[styles.debugText, { color: theme.textSecondary }]}>
            Source: {from || 'Not specified'}
          </Text>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#a09797ff' }]}
              />
              <Text style={[styles.legendText, { color: theme.textPrimary }]}>
                Available
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
              <Text style={[styles.legendText, { color: theme.textPrimary }]}>
                Unavailable
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: 'green' }]}
              />
              <Text style={[styles.legendText, { color: theme.textPrimary }]}>
                Selected
              </Text>
            </View>
          </View>

          <FlatList
            data={chairs}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
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
              style={[
                styles.nxtButton,
                {
                  backgroundColor: selectedSeat ? COLORS.primary : '#ccc'
                }
              ]}
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
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityIndicator: {
    marginBottom: hp('2%')
  },
  loadingText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium'
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
  },
  dateTimeText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: hp('0.5%')
  },
  serviceInfo: {
    marginTop: hp('1%'),
    alignItems: 'center'
  },
  serviceText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('0.3%')
  },
  debugText: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    fontStyle: 'italic',
    textAlign: 'center'
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('2%')
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('1%')
  },
  legendColor: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%')
  },
  legendText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular'
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
    borderRadius: wp('2%')
  },
  nxtText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center'
  }
})