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
  const [isChecked] = useState(true); // Always checked, no setter used
  const navigation = useNavigation();
  const { theme } = useTheme();
  const cardBackground = theme.background === '#121212' ? '#fff' : '#000';
  const textColor = theme.background === '#121212' ? '#000' : '#fff';
  const acceptedTextColor = theme.primary;

  // Format services array
  const formatServices = services => {
    console.log('🔄 formatServices - Input:', services);

    if (!services || services.length === 0) return 'No services';

    try {
      let serviceArray = services;

      if (typeof services === 'string' && services.startsWith('[')) {
        serviceArray = JSON.parse(services);
        console.log('✅ formatServices - Parsed JSON string:', serviceArray);
      }

      if (Array.isArray(serviceArray)) {
        console.log('✅ formatServices - Already an array:', serviceArray);
        return serviceArray.join(', ');
      }

      if (typeof serviceArray === 'object' && serviceArray.serviceName) {
        console.log(
          '✅ formatServices - Single service object:',
          serviceArray.serviceName,
        );
        return serviceArray.serviceName;
      }

      console.log('✅ formatServices - Default case:', String(serviceArray));
      return String(serviceArray);
    } catch (error) {
      console.log('❌ formatServices - Error:', error);
      return String(services);
    }
  };

  // Get services for navigation
  const getServices = () => {
    console.log('📋 BookingAcceptCards - Item:', item);

    if (item.service) {
      return formatServices(item.service);
    } else if (item.services) {
      return formatServices(item.services);
    } else if (item.serviceName) {
      return formatServices([item.serviceName]);
    } else if (item.serviceList) {
      return formatServices(item.serviceList);
    } else if (item.bookedServices) {
      if (
        Array.isArray(item.bookedServices) &&
        item.bookedServices[0]?.serviceName
      ) {
        return formatServices(
          item.bookedServices.map(service => service.serviceName),
        );
      }
      return formatServices(item.bookedServices);
    }

    return 'No services';
  };

  // Format date
  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = timeString => {
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

  // Get price from item
  const getPrice = () => {
    return (
      item.totalAmount ||
      item.price ||
      item.amount ||
      item.totalPrice ||
      item.servicePrice ||
      '500'
    );
  };

  // Handle navigation to booking accepted screen
  const handlePress = () => {
    console.log(
      '📍 Navigation - Passing booking data to BookingAccepted:',
      item,
    );

    navigation.navigate('BookingAccepted', {
      booking: item,
      serviceName: getServices(),
      date: item.date,
      time: item.time,
      price: getPrice(),
      appointmentCode: item.appointmentCode,
      status: item.status || 'accepted',
      chairNo: item.chairNo || 'Not assigned',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBackground }]}
      onPress={handlePress}
    >
      {/* Service + Checkbox */}
      <View style={styles.acceptContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image
            source={require('../assets/hairCut.png')}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: textColor }]}>
            {getServices()}
          </Text>
        </View>

        <View style={[styles.accept, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={() => {}} // No-op, prevents unchecking
            tintColors={{ true: theme.primary, false: textColor }}
            disabled={true} // Optional: fully disable interaction
          />
          <Text style={[styles.text, { color: acceptedTextColor }]}>
            Accepted
          </Text>
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
        <Image
          source={require('../assets/stopwatch-removebg-preview.png')}
          style={styles.icon}
        />
        <Text style={[styles.text, { color: textColor }]}>
          Time: {formatTime(item.time)}
        </Text>
      </View>

      {/* Appointment Code */}
      <View style={styles.content}>
        <Image
          source={require('../assets/moneyBag2.png')}
          style={styles.icon}
        />
        <Text style={[styles.text, { color: textColor }]}>
          Code: {item.appointmentCode || 'N/A'}
        </Text>
      </View>

      {/* Chair Number - NEW SECTION */}
      {item.chairNo && (
        <View style={styles.content}>
          <Image
            source={require('../assets/chair-icon.png')}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: textColor }]}>
            Chair: {item.chairNo}
          </Text>
        </View>
      )}
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
