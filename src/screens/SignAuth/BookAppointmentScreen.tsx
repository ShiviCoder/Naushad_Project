import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calender from '../../components/Calender';
import TimeSelect from '../../components/TImeSelect';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../../components/Head';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';

type RootStackParamList = {
  BookAppointmentScreen: {
    image?: any;
    showTab?: boolean;
    from?: any;
    serviceName?: string;
    price?: string;
  };
};

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

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const route =
    useRoute<RouteProp<RootStackParamList, 'BookAppointmentScreen'>>();
  const navigation = useNavigation<any>();

  const { image, serviceName, price, from, showTab } = route.params || {};
  const showBack = from !== 'bottomBar';

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [loadingTimes, setLoadingTimes] = useState(false);
  const [unavailableTimes, setUnavailableTimes] = useState<Set<string>>(
    new Set(),
  );

  // IMPORTANT: Define your fixed slots here (same as you show in TimeSelect)
  // If your TimeSelect uses different slots, replace this list with that exact list.
  const TIME_SLOTS = useMemo(
    () => [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ],
    [],
  );

  const data = [
    'image',
    'selectMonth',
    'calendar',
    'selectTime',
    'timeSelect',
    'nextButton',
  ];

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForAPI = (time: string): string => {
    if (!time) return time;

    if (time.includes(':')) {
      const parts = time.split(':');
      if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    if (time.includes('.')) {
      const parts = time.split('.');
      if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    return time;
  };

  const checkTimeAvailability = useCallback(
    async (date: Date, time: string) => {
      try {
        const formattedDate = formatDateForAPI(date);
        const formattedTime = formatTimeForAPI(time);

        const apiUrl = `https://naushad.onrender.com/api/appointments/chairs/${formattedDate}/${formattedTime}`;
        const response = await fetch(apiUrl);
        const json: ChairsResponse = await response.json();

        // available if ANY chair is available
        return (
          json?.success === true &&
          Array.isArray(json.data) &&
          json.data.some(ch => ch.isChairAvailable)
        );
      } catch (e) {
        console.error('❌ checkTimeAvailability error:', e);
        // If API fails, better to treat as unavailable (so user doesn’t book wrongly)
        return false;
      }
    },
    [],
  );

  // ✅ This is the missing piece: build unavailable times for the whole selected date.
  const checkDateAvailability = useCallback(
    async (date: Date) => {
      setLoadingTimes(true);
      try {
        const checks = TIME_SLOTS.map(async slot => {
          const ok = await checkTimeAvailability(date, slot);
          return { slot: formatTimeForAPI(slot), ok };
        });

        // Run in parallel (fast) [web:18]
        const results = await Promise.all(checks);

        const nextUnavailable = new Set<string>();
        results.forEach(r => {
          if (!r.ok) nextUnavailable.add(r.slot);
        });

        setUnavailableTimes(nextUnavailable);

        // If previously selected time becomes unavailable, reset it
        if (selectedTime) {
          const formattedSelected = formatTimeForAPI(selectedTime);
          if (nextUnavailable.has(formattedSelected)) {
            setSelectedTime(null);
          }
        }
      } catch (e) {
        console.error('❌ checkDateAvailability error:', e);
        setUnavailableTimes(new Set(TIME_SLOTS.map(t => formatTimeForAPI(t))));
      } finally {
        setLoadingTimes(false);
      }
    },
    [TIME_SLOTS, checkTimeAvailability, selectedTime],
  );

  useEffect(() => {
    if (selectedDate) checkDateAvailability(selectedDate);
  }, [selectedDate, checkDateAvailability]);

  const onNextPress = async () => {
    if (!selectedDate) {
      setPopupMessage('Please select a date');
      setPopupVisible(true);
      return;
    }
    if (!selectedTime) {
      setPopupMessage('Please select a time');
      setPopupVisible(true);
      return;
    }

    const formattedDate = formatDateForAPI(selectedDate);
    const formattedTime = formatTimeForAPI(selectedTime);

    // quick local guard: if already known unavailable, block
    if (unavailableTimes.has(formattedTime)) {
      setPopupMessage(
        'No chairs available for selected time. Please choose another time.',
      );
      setPopupVisible(true);
      return;
    }

    // server guard: double check latest availability
    const ok = await checkTimeAvailability(selectedDate, selectedTime);
    if (!ok) {
      setPopupMessage(
        'No chairs available for selected time. Please choose another time.',
      );
      setPopupVisible(true);
      // refresh list
      checkDateAvailability(selectedDate);
      return;
    }

    navigation.navigate('BookingSeats', {
      serviceName,
      price,
      date: formattedDate,
      time: formattedTime,
      from: from || 'regular',
    });
  };

  const handlePopupClose = () => setPopupVisible(false);

  const handleTimeSelect = async (time: string) => {
    const formatted = formatTimeForAPI(time);

    // If already marked unavailable, just block instantly (no API call)
    if (unavailableTimes.has(formatted)) {
      setPopupMessage(
        'No chairs available for this time. Please select another time.',
      );
      setPopupVisible(true);
      return;
    }

    setSelectedTime(time);
  };

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'image':
        return (
          <View>
            {image ? (
              <Image source={image} style={styles.img} />
            ) : (
              <Image
                source={require('../../assets/images/facial.jpg')}
                style={styles.img}
              />
            )}
          </View>
        );

      case 'selectMonth':
        return (
          <Text style={[styles.Text, { color: theme.textPrimary }]}>
            Select Date
          </Text>
        );

      case 'calendar':
        return (
          <View style={styles.calenderContainer}>
            <Calender
              onDateSelect={date => {
                setSelectedDate(date);
                setSelectedTime(null);
                setUnavailableTimes(new Set());
              }}
            />
          </View>
        );

      case 'selectTime':
        return (
          <Text style={[styles.Text, { color: theme.textPrimary }]}>
            Select Time {loadingTimes ? '(Checking...)' : ''}
          </Text>
        );

      case 'timeSelect':
        return (
          <View style={styles.timeContainer}>
            <TimeSelect
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              times={TIME_SLOTS}
              unavailableTimes={Array.from(unavailableTimes)}
              onTimeSelect={handleTimeSelect}
              loading={loadingTimes}
            />
          </View>
        );

      case 'nextButton':
        return (
          <View style={styles.nxt}>
            <TouchableOpacity
              onPress={onNextPress}
              style={[
                styles.nxtButton,
                {
                  backgroundColor:
                    selectedDate && selectedTime ? COLORS.primary : '#ccc',
                },
              ]}
              disabled={!selectedDate || !selectedTime || loadingTimes}
            >
              <Text style={[styles.nxtText, { color: '#fff' }]}>
                {loadingTimes ? 'Checking...' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      <Head title="Bookings" showBack={showBack} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={{
          paddingBottom: from === 'bottomBar' ? hp('25%') : hp('15%'),
          paddingHorizontal: wp('3%'),
        }}
        showsVerticalScrollIndicator={false}
      />

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={handlePopupClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  img: {
    width: wp('85%'),
    height: hp('20%'),
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    borderRadius: wp('2%'),
  },
  Text: {
    fontSize: wp('4%'),
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('2%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '800',
  },
  calenderContainer: {
    marginHorizontal: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  timeContainer: {
    marginHorizontal: wp('1%'),
    marginBottom: hp('1%'),
  },
  nxt: {
    marginHorizontal: wp('2%'),
    marginTop: hp('2%'),
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
