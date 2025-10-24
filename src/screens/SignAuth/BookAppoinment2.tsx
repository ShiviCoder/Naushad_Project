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
<<<<<<< HEAD
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
=======
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const { width } = Dimensions.get('window');

const BookAppointmentScreen = ({ navigation }) => {
  const { theme } = useTheme(); // ✅ Theme access
  const [selectedService, setSelectedService] = useState(null);
<<<<<<< HEAD
=======
  
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

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
    {
      id: 4,
      name: 'Shampoo',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 5,
      name: 'Head massage',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 6,
      name: 'Hair mask',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 7,
      name: 'Shampoo',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 8,
      name: 'Head massage',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
    {
      id: 9,
      name: 'Hair mask',
      price: 499,
      includes: 'wash, Cut, Blowdry',
      image: require('../../assets/SHH.png'),
    },
  ];

<<<<<<< HEAD
  const renderService = service => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceItem,
        { backgroundColor: theme.card },
        selectedService === service.id && {
          borderColor: theme.secondary, // highlight border
        },
      ]}
      onPress={() => setSelectedService(service.id)}
      activeOpacity={0.8}
    >
      {/* Service Image */}
      <Image source={service.image} style={styles.serviceImage} />

      {/* Service Details */}
      <View style={styles.serviceDetails}>
        {/* Title + Includes */}
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.serviceName, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {service.name}
          </Text>
          <Text
            style={[styles.serviceIncludes, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            Includes: {service.includes}
          </Text>
        </View>

        {/* Price + Checkbox */}
        <View style={styles.rightSection}>
          <Text style={[styles.price, { color: theme.textPrimary }]}>
            ₹ {service.price}
          </Text>
          <View style={[styles.checkbox, { borderColor: theme.textSecondary }]}>
            {selectedService === service.id && (
              <View
                style={[
                  styles.checkboxFill,
                  { backgroundColor: theme.secondary },
                ]}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
=======

const renderService = (service) => (
  <TouchableOpacity
    key={service.id}
    style={[
      styles.serviceItem,
      { backgroundColor: theme.card },
      selectedService === service.id && {
        borderColor: theme.secondary, // highlight border
      },
    ]}
    onPress={() => setSelectedService(service.id)}
    activeOpacity={0.8}
  >
    {/* Service Image */}
    <Image source={service.image} style={styles.serviceImage} />

    {/* Service Details */}
    <View style={styles.serviceDetails}>
      {/* Title + Includes */}
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.serviceName, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {service.name}
        </Text>
        <Text
          style={[styles.serviceIncludes, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          Includes: {service.includes}
        </Text>
      </View>

      {/* Price + Checkbox */}
      <View style={styles.rightSection}>
        <Text style={[styles.price, { color: theme.textPrimary }]}>
          ₹ {service.price}
        </Text>
        <View
          style={[styles.checkbox, { borderColor: theme.textSecondary }]}
        >
          {selectedService === service.id && (
            <View
              style={[
                styles.checkboxFill,
                { backgroundColor: theme.secondary },
              ]}
            />
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      {/* Header */}
      <Head title="Book Appointment" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Services */}
<<<<<<< HEAD
        <View style={styles.servicesContainer}>
          {services.map(service => renderService(service))}
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[styles.proceedButton, { backgroundColor: COLORS.primary }]}
      >
        <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>
          Proceed to pay
        </Text>
=======
<View style={styles.servicesContainer}>
  {services.map((service) => renderService(service))}
</View>
      </ScrollView>

      {/* Proceed Button */}
      <TouchableOpacity style={[styles.proceedButton, { backgroundColor: COLORS.primary }]}>
        <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>Proceed to pay</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
<<<<<<< HEAD
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp('1.2%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
  },
  serviceImage: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  serviceDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: wp('4%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  serviceIncludes: {
    fontSize: wp('3.3%'),
    marginTop: hp('0.3%'),
    fontFamily: 'Poppins-Medium',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: wp('2%'),
    marginBottom: hp('3%'),
  },
  price: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  checkbox: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    backgroundColor: '#D9D9D9',
    borderRadius: wp('1%'),
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  checkboxFill: {
    width: '100%',
    height: '100%',
    borderRadius: wp('1%'),
=======
    flexDirection: "row",
    alignItems: "center",
    padding: hp("1.2%"),
    borderRadius: wp("2%"),
    marginBottom: hp("1.5%"),
  },
  serviceImage: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("2%"),
    marginRight: wp("3%"),
  },
  serviceDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: wp("4%"),
    fontWeight: "700",
    fontFamily: "Poppins-Medium",

  },
  serviceIncludes: {
    fontSize: wp("3.3%"),
    marginTop: hp("0.3%"),
    fontFamily: "Poppins-Medium",

  },
  rightSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent : 'flex-start',
    gap: wp("2%"),
    marginBottom : hp('3%')
  },
  price: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
        fontFamily: "Poppins-Medium",

  },
  checkbox: {
    width: wp("4.5%"),
    height: wp("4.5%"),
    backgroundColor : '#D9D9D9',
    borderRadius: wp("1%"),
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  checkboxFill: {
    width: "100%",
    height: "100%",
    borderRadius: wp("1%"),
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  content: { flex: 1, paddingHorizontal: wp('5%') },
  servicesContainer: { marginTop: hp('3.125%') },
  proceedButton: {
<<<<<<< HEAD
    marginHorizontal: wp('5.56%'),
    marginVertical: hp('2.5%'),
    paddingVertical: hp('1.875%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: hp('1.875%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  container: {
    flex: 1,
  },
=======
  marginHorizontal: wp('5.56%'),
  marginVertical: hp('2.5%'),
  paddingVertical: hp('1.875%'),
  borderRadius: wp('2%'),
  alignItems: 'center',
},
proceedButtonText: { fontSize: hp('1.875%'), fontWeight: '600',    fontFamily: "Poppins-Medium",
 },
container: {
  flex: 1,
},
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});

export default BookAppointmentScreen;
