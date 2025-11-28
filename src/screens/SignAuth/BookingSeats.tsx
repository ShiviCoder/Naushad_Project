import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Head from '../../components/Head';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Chair {
  _id: string;
  chairNumber: number;
  isChairAvailable: boolean;
  subAdminId: string;
  subAdminEmail: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface ChairsResponse {
  success: boolean;
  message: string;
  data: Chair[];
}

// Helper functions for formatting
const ensureYYYYMMDD = (dateStr: any): string => {
  if (!dateStr) return '';
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr))
    return dateStr;
  if (typeof dateStr === 'string' && dateStr.includes('T'))
    return dateStr.split('T')[0];
  if (dateStr instanceof Date) {
    const year = dateStr.getFullYear();
    const month = String(dateStr.getMonth() + 1).padStart(2, '0');
    const day = String(dateStr.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, '0');
      const day = String(dateStr.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch {}
  return '';
};

const ensureHHmm = (timeStr: any): string => {
  if (!timeStr) return '';
  let cleanTime = String(timeStr).replace(/\./g, ':');
  if (/^\d{1,2}:?\d{2}$/.test(cleanTime)) {
    let parts = cleanTime.split(':');
    if (parts.length === 2) {
      let h = parts[0].padStart(2, '0');
      let m = parts[1].padStart(2, '0');
      return `${h}:${m}`;
    } else if (cleanTime.length === 4) {
      return `${cleanTime.slice(0, 2)}:${cleanTime.slice(2)}`;
    } else if (cleanTime.length === 3) {
      return `0${cleanTime[0]}:${cleanTime.slice(1)}`;
    }
  }
  return cleanTime;
};

const BookingSeats = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    date: selectedDate,
    time: selectedTime,
    serviceName,
    price,
    from,
  } = route.params || {};

  const [chairs, setChairs] = useState<Chair[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChairs = async () => {
      try {
        setLoading(true);
        setError(null);

        const dateForAPI = ensureYYYYMMDD(selectedDate);
        const timeForAPI = ensureHHmm(selectedTime);

        const apiUrl = `https://naushad.onrender.com/api/appointments/chairs/${dateForAPI}/${timeForAPI}`;
        console.log('🌐 Fetching chairs from API:', apiUrl);

        const response = await fetch(apiUrl);
        const data: ChairsResponse = await response.json();

        console.log('📦 API Response:', JSON.stringify(data, null, 2));

        if (data.success) {
          setChairs(data.data);
        } else {
          setError(data.message || 'Failed to fetch chairs');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('💥 Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate && selectedTime) {
      fetchChairs();
    } else {
      setError('Missing date or time');
      setLoading(false);
    }
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const onNextPress = () => {
    console.log('✅ Selected Chair Number:', selectedSeat);

    if (!selectedSeat) {
      console.log('❌ No chair selected, cannot proceed');
      return;
    }

    // Pass chair number with consistent key name
    navigation.navigate('BookAppoinment2', {
      selectedDate,
      selectedTime,
      selectedSeat,
      chairNumber: selectedSeat, // Add this line for consistency
      serviceName,
      price,
      from,
    });
  };

  const handleSeatPress = (seatNumber: number, isAvailable: boolean) => {
    if (!isAvailable) return;

    if (selectedSeat === seatNumber) {
      setSelectedSeat(null);
      console.log('❌ Chair Deselected:', seatNumber);
    } else {
      setSelectedSeat(seatNumber);
      console.log('✅ Chair Selected:', seatNumber);
      console.log('📋 Currently Selected Chair:', seatNumber);
    }
  };

  const renderItem = ({ item }: { item: Chair }) => {
    const isAvailable = item.isChairAvailable;
    const isSelected = selectedSeat === item.chairNumber;
    let tintColor = '#a09797ff';
    if (!isAvailable) tintColor = 'red';
    else if (isSelected) tintColor = 'green';

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
            opacity: isAvailable ? 1 : 0.5,
          }}
          tintColor={tintColor}
        />
        <Text
          style={{
            color: theme.textPrimary,
            marginTop: hp('0.1%'),
            fontSize: wp('4%'),
            opacity: isAvailable ? 1 : 0.5,
          }}
        >
          {item.chairNumber}
        </Text>
      </TouchableOpacity>
    );
  };

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
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Head title="Booking" showBack={true} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText]}>{error}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.retryButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Head title="Booking" showBack={true} />
        <View style={{ padding: wp('3%') }}>
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Please confirm your seat
          </Text>

          {/* <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              📅 Date: {selectedDate}
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              🕒 Time: {selectedTime}
            </Text>
            {selectedSeat && (
              <Text
                style={[
                  styles.infoText,
                  { color: COLORS.primary, fontWeight: 'bold' },
                ]}
              >
                💺 Selected Chair: {selectedSeat}
              </Text>
            )}
          </View> */}

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
            keyExtractor={item => item._id}
            numColumns={5}
            contentContainerStyle={{
              paddingBottom: hp('15%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, { color: theme.textSecondary }]}
                >
                  No seats available for this time slot
                </Text>
              </View>
            )}
          />

          <View style={styles.nxt}>
            <TouchableOpacity
              onPress={onNextPress}
              style={[
                styles.nxtButton,
                { backgroundColor: selectedSeat ? COLORS.primary : '#ccc' },
              ]}
              disabled={selectedSeat === null}
            >
              <Text style={[styles.nxtText, { color: '#fff' }]}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookingSeats;

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  infoText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    marginVertical: hp('0.3%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    marginBottom: hp('2%'),
  },
  loadingText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  errorText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    color: 'red',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  retryButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('2%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
  legendColor: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  legendText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    padding: wp('5%'),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  nxt: {
    marginHorizontal: wp('2%'),
    marginTop: hp('5%'),
    width: '93%',
    alignSelf: 'center',
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
  },
});
