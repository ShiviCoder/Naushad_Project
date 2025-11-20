import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const BookingPendingCard = ({ item }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Format services array
  const formatServices = (services) => {
    console.log('🔄 formatServices - Input:', services);
    
    if (!services || services.length === 0) return 'No services';
    
    try {
      // If services is a string that looks like JSON, parse it
      if (typeof services === 'string' && services.startsWith('[')) {
        const parsedServices = JSON.parse(services);
        console.log('✅ formatServices - Parsed JSON string:', parsedServices);
        return Array.isArray(parsedServices) ? parsedServices.join(', ') : String(parsedServices);
      }
      
      // If services is already an array
      if (Array.isArray(services)) {
        console.log('✅ formatServices - Already an array:', services);
        return services.join(', ');
      }
      
      // If it's a single service object with serviceName
      if (typeof services === 'object' && services.serviceName) {
        console.log('✅ formatServices - Single service object:', services.serviceName);
        return services.serviceName;
      }
      
      // Default case - handle single string
      console.log('✅ formatServices - Default case:', String(services));
      return String(services);
    } catch (error) {
      console.log('❌ formatServices - Error:', error);
      return String(services);
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

  // Get services from the item prop - UPDATED
  const getServices = () => {
    console.log('📋 BookingPendingCard - Item:', item);
    
    // Try different possible properties where services might be stored
    if (item.service) { // ADDED THIS - check for singular 'service'
      return formatServices(item.service);
    } else if (item.services) {
      return formatServices(item.services);
    } else if (item.serviceName) {
      return formatServices([item.serviceName]);
    } else if (item.serviceList) {
      return formatServices(item.serviceList);
    } else if (item.bookedServices) {
      // If bookedServices is an array of objects with serviceName
      if (Array.isArray(item.bookedServices) && item.bookedServices[0]?.serviceName) {
        return formatServices(item.bookedServices.map(service => service.serviceName));
      }
      return formatServices(item.bookedServices);
    }
    
    return 'No services';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('BookingPending', { booking: item })}
    >
      {/* Service + Pending Status */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image style={styles.icon} source={require('../assets/facial.png')} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {getServices()}
          </Text>
        </View>

        <View style={[styles.content, { gap: wp('0%'), marginBottom: hp('-0.8%') }]}>
          <Image style={styles.icon} source={require('../assets/pending.png')} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>Pending</Text>
        </View>
      </View>

      {/* Date */}
      <View style={[styles.content, { marginVertical: hp('-0.2%') }]}>
        <Image style={styles.icon} source={require('../assets/calender.png')} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Date: {formatDate(item.date)}
        </Text>
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image style={styles.icon} source={require('../assets/stopwatch-removebg-preview.png')} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Time: {formatTime(item.time)}
        </Text>
      </View>

      {/* Appointment Code */}
      <View style={styles.content}>
        <Image style={styles.icon} source={require('../assets/moneyBag2.png')} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Code: {item.appointmentCode || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#ACACAC8A',
    width: '90%',
    minHeight: hp('20%'),
    marginVertical: hp('1.5%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
    gap: hp('1%'),
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  text: {
    fontSize: wp('3.5%'),
    color: '#000',
    fontWeight: '500',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default BookingPendingCard;