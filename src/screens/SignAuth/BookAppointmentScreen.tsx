import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import Calender from '../../components/Calender';
import TimeSelect from '../../components/TImeSelect';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import BottomNavbar from '../../components/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../../components/Head';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';

type RootStackParamList = {
  BookAppointmentScreen: { image?: any; showTab?: boolean; from?: any };
};

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const route =
    useRoute<
      RouteProp<
        { BookAppointmentScreen: { showTab?: boolean; from?: any; image?: any } },
        'BookAppointmentScreen'
      >
    >();

  const { image, showTab = false } = route.params || {};
  const navigation = useNavigation();
  const showBack = !showTab; // if tab visible → back button hide, else show

  // Only month and time is required!
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const data = [
    'image',
    'selectMonth',
    'calendar',
    'selectTime',
    'timeSelect',
    'nextButton'
  ];

  // Handler for "Next" button press
  const onNextPress = () => {
    if (!selectedMonth || !selectedTime) {
      setPopupMessage('Please select both month and time before proceeding.');
      setPopupVisible(true);
      return;
    }
    navigation.navigate('PaymentScreen');
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
            {/* Pass handlers to Calendar to update month selection */}
            <Calender
              // You must implement or ensure Calender calls this with the selected month string
              onMonthChange={(month: string) => setSelectedMonth(month)}
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
            {/* Pass handler to TimeSelect to update time selection */}
            <TimeSelect
              // You must implement or ensure TimeSelect calls this with the selected time string
              onTimeChange={(time: string) => setSelectedTime(time)}
            />
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
          paddingBottom: hp('15%'),
          paddingHorizontal: wp('3%')
        }}
        showsVerticalScrollIndicator={false}
      />

      {showTab && <BottomNavbar />}

      {/* Popup Component for alert */}
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
  calenderContainer: { marginHorizontal: wp('2%'), marginBottom: hp('0.5%') },
  timeContainer: { marginHorizontal: wp('1%'), marginBottom: hp('1%') },
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
