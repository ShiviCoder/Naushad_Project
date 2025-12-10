import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
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

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const route =
    useRoute<RouteProp<RootStackParamList, 'BookAppointmentScreen'>>();
  const navigation = useNavigation<any>();

  const { image, serviceName, price, from, showTab } = route.params || {};

  // Show back button only when NOT from bottom bar
  const showBack = from !== 'bottomBar';

  console.log('🔍 BookAppointmentScreen - From:', from, 'ShowTab:', showTab);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const data = [
    'image',
    'selectMonth',
    'calendar',
    'selectTime',
    'timeSelect',
    'nextButton',
  ];

  // Format date to YYYY-MM-DD (without timezone conversion)
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time to HH:mm (24-hour format with colon)
  const formatTimeForAPI = (time: string): string => {
    // If time is already in correct format (HH:mm), return as is
    if (time && time.includes(':')) {
      const parts = time.split(':');
      if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    // If time has period instead of colon (e.g., "09.00")
    if (time && time.includes('.')) {
      const parts = time.split('.');
      if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    // Default return
    return time;
  };

  const onNextPress = () => {
    console.log('🧾 Service params:', route.params);
    console.log('📅 Selected Date:', selectedDate?.toDateString());
    console.log('🕒 Selected Time (raw):', selectedTime);

    if (!selectedDate) {
      console.log('❌ No date selected yet');
      setPopupMessage('Please select a date');
      setPopupVisible(true);
      return;
    }

    if (!selectedTime) {
      console.log('❌ No time selected yet');
      setPopupMessage('Please select a time');
      setPopupVisible(true);
      return;
    }

    // Format date for API (YYYY-MM-DD)
    const formattedDate = formatDateForAPI(selectedDate);
    // Format time for API (HH:mm with colon)
    const formattedTime = formatTimeForAPI(selectedTime);
    const dateString = selectedDate.toDateString(); // Human readable format

    console.log('✅ Formatted Date for API:', formattedDate);
    console.log('✅ Formatted Time for API:', formattedTime);
    console.log('✅ Date String:', dateString);
    console.log('📍 Navigation Source:', from);
    console.log('🌐 Final API URL will be:');
    console.log(
      `   https://naushad.onrender.com/api/appointments/chairs/${formattedDate}/${formattedTime}`,
    );

    // Navigate to BookingSeats with formatted date and time
    console.log('🚀 Navigating to BookingSeats with:');
    console.log('   📅 date:', formattedDate);
    console.log('   🕒 time:', formattedTime);
    console.log('   🎯 serviceName:', serviceName);
    console.log('   💰 price:', price);

    navigation.navigate('BookingSeats', {
      serviceName,
      price,
      date: formattedDate, // Pass formatted date (YYYY-MM-DD)
      time: formattedTime, // Pass formatted time (HH:mm with colon)
      from: from || 'regular',
    });
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
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
            Select Month
          </Text>
        );
      case 'calendar':
        return (
          <View style={styles.calenderContainer}>
            <Calender
              onDateSelect={date => {
                console.log('📅 Received from Calender:', date.toDateString());
                console.log('📅 Formatted for API:', formatDateForAPI(date));
                setSelectedDate(date);
              }}
            />
          </View>
        );
      case 'selectTime':
        return (
          <Text style={[styles.Text, { color: theme.textPrimary }]}>
            Select Time
          </Text>
        );
      case 'timeSelect':
        return (
          <View style={styles.timeContainer}>
            <TimeSelect
              selectedDate={selectedDate}
              onTimeSelect={time => {
                console.log('🕒 Time selected (raw):', time);
                console.log(
                  '🕒 Time formatted for API:',
                  formatTimeForAPI(time),
                );
                setSelectedTime(time);
              }}
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
              disabled={!selectedDate || !selectedTime}
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
  mainContainer: {
    flex: 1,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    justifyContent: 'center',
  },
  headText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
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
