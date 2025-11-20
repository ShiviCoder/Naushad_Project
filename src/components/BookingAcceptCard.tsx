import { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const BookingAcceptCards = ({ item }) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const cardBackground = theme.background === '#121212' ? '#fff' : '#000';
  const textColor = theme.background === '#121212' ? '#000' : '#fff';
  const inactiveColor = textColor;
  const acceptedTextColor = isChecked ? theme.primary : textColor;

  // Format services array
  const formatServices = (services) => {
    if (!services || services.length === 0) return 'No services';
    
    try {
      // Handle both stringified arrays and regular arrays
      const serviceArray = typeof services[0] === 'string' && services[0].startsWith('[') 
        ? JSON.parse(services[0])
        : services;
      
      return Array.isArray(serviceArray) ? serviceArray.join(', ') : String(serviceArray);
    } catch (error) {
      return services.join(', ');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBackground }]}
      onPress={() => navigation.navigate('BookingAccepted', { booking: item })}
    >
      {/* Service + Checkbox */}
      <View style={styles.acceptContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image source={require('../assets/hairCut.png')} style={styles.icon} />
          <Text style={[styles.text, { color: textColor }]}>
            {formatServices(item.services)}
          </Text>
        </View>

        <View style={[styles.accept, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={setIsChecked}
            tintColors={{ true: theme.primary, false: inactiveColor }}
          />
          <Text style={[styles.text, { color: acceptedTextColor }]}>Accepted</Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.content}>
        <Image source={require('../assets/calender.png')} style={styles.icon} />
        <Text style={[styles.text, { color: textColor }]}>
          Date: {formatDate(item.date)}
        </Text>
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image source={require('../assets/stopwatch-removebg-preview.png')} style={styles.icon} />
        <Text style={[styles.text, { color: textColor }]}>
          Time: {formatTime(item.time)}
        </Text>
      </View>

      {/* Appointment Code */}
      <View style={styles.content}>
        <Image source={require('../assets/moneyBag2.png')} style={styles.icon} />
        <Text style={[styles.text, { color: textColor }]}>
          Code: {item.appointmentCode}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '90%',
    minHeight: hp('20%'),
    marginVertical: hp('1.5%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
    gap: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  text: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  accept: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  checkBox: {
    width: wp('4%'),
    height: wp('4%'),
  },
});

export default BookingAcceptCards;