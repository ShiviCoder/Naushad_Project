import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const BookAppointmentScreen = ({ navigation }) => {
  const { theme } = useTheme(); // ✅ Theme access
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('13:00');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');

  const services = [
    {
      id: 1,
      name: 'Shampoo',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 2,
      name: 'Head massage',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 3,
      name: 'Hair mask',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
  ];

  const dates = [
    { day: 'S', date: '' },
    { day: 'M', date: '' },
    { day: 'T', date: 1 },
    { day: 'W', date: 2 },
    { day: 'T', date: 3 },
    { day: 'F', date: 4 },
    { day: 'S', date: 5 },
    { day: 'S', date: 6 },
    { day: '', date: 7 },
    { day: '', date: 8 },
    { day: '', date: 9 },
    { day: '', date: 10 },
    { day: '', date: 11 },
    { day: '', date: 12 },
    { day: '', date: 13 },
    { day: '', date: 14 },
    { day: '', date: 15 },
    { day: '', date: 16 },
    { day: '', date: 17 },
    { day: '', date: 18 },
    { day: '', date: 19 },
    { day: '', date: 20 },
    { day: '', date: 21 },
    { day: '', date: 22 },
  ];

  const morningSlots = ['9:00', '10:00', '11:00'];
  const afternoonSlots = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

 const renderService = (service) => (
  <TouchableOpacity
    key={service.id}
    style={[
      styles.serviceItem,
      { backgroundColor: theme.card },
      selectedService === service.id && {
        borderColor: theme.accent,
        borderWidth: 2, // selected state border
      },
    ]}
    onPress={() => setSelectedService(service.id)}
    activeOpacity={0.8}
  >
    {/* Service Image */}
    <Image source={service.image} style={styles.serviceImage} />

    {/* Service Details */}
    <View style={styles.serviceDetails}>
      <Text
        style={[
          styles.serviceName,
          { color: theme.textPrimary },
        ]}
        numberOfLines={1}
      >
        {service.name}
      </Text>
      <Text
        style={[
          styles.serviceIncludes,
          { color: theme.textSecondary },
        ]}
        numberOfLines={1}
      >
        Includes: {service.includes}
      </Text>
    </View>

    {/* Price + Checkbox */}
    <View style={styles.priceContainer}>
      <Text style={[styles.price, { color: theme.textPrimary }]}>
        ₹ {service.price}
      </Text>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: theme.textSecondary,
          },
        ]}
      >
        {selectedService === service.id && (
          <View
            style={[
              styles.checkboxFill,
              { backgroundColor: theme.accent },
            ]}
          />
        )}
      </View>
    </View>
  </TouchableOpacity>
);

  const renderDateItem = (item, index) => (
  <TouchableOpacity
    key={index}
    style={[
      styles.dateItem,
      selectedDate === item.date && {
        backgroundColor: '#F6B745', // always yellow when selected
        borderRadius: wp('5.56%'),
      },
    ]}
    onPress={() => item.date && setSelectedDate(item.date)}
  >
    {item.day && (
      <Text
        style={[
          styles.dayText,
          {
            color:
              selectedDate === item.date
                ? '#000' // black text on yellow
                : theme.textPrimary,
          },
        ]}
      >
        {item.day}
      </Text>
    )}

    {item.date && (
      <Text
        style={[
          styles.dateText,
          {
            color:
              selectedDate === item.date
                ? '#000' // black text on yellow
                : theme.textPrimary,
          },
        ]}
      >
        {item.date}
      </Text>
    )}
  </TouchableOpacity>
);

 const renderTimeSlot = (time, isSelected) => (
  <TouchableOpacity
    key={time}
    style={[
      styles.timeSlot,
      {
        backgroundColor: isSelected ? '#F6B745' : theme.background, // selected always yellow
        borderColor: isSelected ? '#F6B745' : theme.border,
      },
    ]}
    onPress={() => setSelectedTimeSlot(time)}
  >
    <Text
      style={{
        color: isSelected ? '#000' : theme.textPrimary, // text black when yellow
      }}
    >
      {time}
    </Text>
  </TouchableOpacity>

  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Head title="Book Appointment" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Services */}
        <View style={styles.servicesContainer}>{services.map(renderService)}</View>

        {/* Select Date */}
       

          {/* Date Filter Buttons */}
          
        
        
      </ScrollView>

      {/* Proceed Button */}
      <TouchableOpacity style={[styles.proceedButton, { backgroundColor:'#F6B745'}]}>
        <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>Proceed to pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: hp('5.56%') },
  servicesContainer: { marginTop: hp('3.125%') },
   serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  serviceImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
  },
  serviceIncludes: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  checkbox: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    borderWidth: 1,
    borderRadius: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFill: {
    width: '70%',
    height: '70%',
    borderRadius: wp('1%'),
  },
  sectionContainer: { marginTop: hp('1.25%') },
  sectionTitle: { fontSize: hp('2.25%'), fontWeight: '600', marginBottom: 15 },
  dateFilters: { flexDirection: 'row', marginBottom: hp('1.875%') },
  filterButton: {
    paddingHorizontal: wp('5.56%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2.78%'),
    marginRight: wp('2.78%'),
  },
  filterText: { fontSize: hp('1.5%'), fontWeight: '600' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dateItem: {
    width: width / 8 - 5,
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.25%'),
  },
  dayText: { fontSize: hp('1.75%'), marginBottom: hp('0.25%'), fontWeight: 'bold' },
  dateText: { fontSize: hp('1.75%'), fontWeight: '500' },
  timeSection: { marginBottom: hp('2.25%') },
  timeSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('1.875%') },
  timeIndicator: { width: wp('2.22%'), height: hp('1%'), borderRadius: wp('1.11%') },
  timeSectionTitle: { fontSize: hp('2%'), fontWeight: '600' },
  timeSlots: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('2.78%') },
  timeSlot: { paddingHorizontal: wp('5.56%'), paddingVertical: hp('1.25%'), borderRadius: wp('2.22%'), borderWidth: wp('0.28%') },
  timeText: { fontSize: hp('1.25%'), fontWeight: 'bold' },
  proceedButton: {
    marginHorizontal: wp('5.56%'),
    marginVertical: hp('2.5%'),
    paddingVertical: hp('1.875%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  proceedButtonText: { fontSize: hp('1.875%'), fontWeight: '600' },
});

export default BookAppointmentScreen;
