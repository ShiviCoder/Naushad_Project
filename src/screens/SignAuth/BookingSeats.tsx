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
 const { date: selectedDate, time: selectedTime, serviceName, price, from } = route.params || {}
  const [chairs, setChairs] = useState<Chair[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)

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
    const formattedDate = selectedDate
      ? new Date(selectedDate).toISOString()
      : null
    const formattedTime = selectedTime || '00:00'

    navigation.navigate('BookAppoinment2', {
      selectedDate: formattedDate,
      selectedTime,
      selectedSeat
    })
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
              <Text style={[styles.nxtText, { color: '#fff' }]}>Next</Text>
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