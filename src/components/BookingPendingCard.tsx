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
    if (!services || services.length === 0) return 'No services';
    
    try {
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
      style={styles.container}
      onPress={() => navigation.navigate('BookingPending', { booking: item })}
    >
      {/* Service + Pending Status */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image style={styles.icon} source={require('../assets/facial.png')} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {formatServices(item.services)}
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
          Code: {item.appointmentCode}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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