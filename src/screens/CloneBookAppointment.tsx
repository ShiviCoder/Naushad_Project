import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import Calender from '../components/Calender';
import TimeSelect from '../components/TImeSelect';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import BottomNavbar from '../components/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../components/Head';
import COLORS from '../utils/Colors';
import Popup from '../components/PopUp';

type RootStackParamList = {
  BookAppointmentScreen: {
    image?: any;
    showTab?: boolean;
    from?: any;
    serviceName?: string;
    price?: string;
  };
  PaymentScreen: {
    serviceName?: string;
    price?: string;
    date?: string;
    time?: string;
  };
};

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'BookAppointmentScreen'>>();
  const navigation = useNavigation<any>();
  const { image, showTab = false, serviceName, price } = route.params || {};
  const showBack = !showTab; // if tab visible → back button hide, else show

  // Popup state - can be removed since no validation needed now
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);


  const data = [
    'image',
    'selectMonth',
    'calendar',
    'selectTime',
    'timeSelect',
    'nextButton'
  ];

  // Handler for "Next" button press - no validation, directly navigate
  const onNextPress = () => {
    console.log("🧾 Service params:", route.params);
    console.log("📅 Selected Date (string):", selectedDate?.toISOString());
    console.log("🕒 Selected Time (state):", selectedTime);

    if (!selectedDate) {
      console.log("❌ No date selected yet");
      return;
    }

    navigation.navigate('PaymentScreen', {
      serviceName,
      price,
      date: selectedDate.toDateString(),
      time: selectedTime,
    });
  };
  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'image':
        return (
          <View>
            {image ? (
              <Image source={image} style={styles.img} />
            ) : (
              <Image
                source={require('../assets/images/facial.jpg')}
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
            {/* Removed any onMonthChange prop */}
            <Calender
              onDateSelect={(date) => {
                console.log("📅 Received from Calender:", date.toDateString());
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
            {/* Removed any onTimeChange prop */}
            <TimeSelect selectedDate={selectedDate} onTimeSelect={setSelectedTime} />
          </View>
        );
      case 'nextButton':
        return (
          <View style={styles.nxt}>
            <TouchableOpacity
              onPress={onNextPress}
              style={[styles.nxtButton, { backgroundColor: COLORS.primary }]}
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
        keyExtractor={(item) => item}
        contentContainerStyle={{
          paddingBottom: hp('3%'),
          paddingHorizontal: wp('3%')
        }}
        showsVerticalScrollIndicator={false}
      />
      {/* Popup component retained but not used */}
      <Popup visible={popupVisible} message={popupMessage} onClose={handlePopupClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    justifyContent: 'center'
  },
  headText: {
    fontSize: wp('5%'),
    fontWeight: 'bold'
  },
  img: {
    width: wp('85%'),
    height: hp('20%'),
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    borderRadius: wp('2%')
  },
  Text: {
    fontSize: wp('4%'),
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('2%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '800'
  },
  calenderContainer: { 
    marginHorizontal: wp('2%'), 
    marginBottom: hp('0.5%') 
  },
  timeContainer: { 
    marginHorizontal: wp('1%'), 
    marginBottom: hp('1%') 
  },
  nxt: {
    marginHorizontal: wp('2%'),
    marginTop: hp('2%'),
    width: '30%',
    alignSelf: 'flex-end'
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
    alignSelf: 'center',
  }
});