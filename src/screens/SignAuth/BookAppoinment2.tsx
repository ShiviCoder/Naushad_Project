// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Head from '../../components/Head';
// import { useTheme } from '../../context/ThemeContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import COLORS from '../../utils/Colors';

// const { width } = Dimensions.get('window');

// const BookAppointmentScreen = ({ navigation }) => {
//   const { theme } = useTheme(); // ✅ Theme access
// const [selectedServices, setSelectedServices] = useState([]);  

//   const services = [
//     {
//       id: 1,
//       name: 'Shampoo',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 2,
//       name: 'Head massage',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 3,
//       name: 'Hair mask',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 4,
//       name: 'Shampoo',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 5,
//       name: 'Head massage',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 6,
//       name: 'Hair mask',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 7,
//       name: 'Shampoo',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 8,
//       name: 'Head massage',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//     {
//       id: 9,
//       name: 'Hair mask',
//       price: 499,
//       includes: 'wash, Cut, Blowdry',
//       image: require('../../assets/SHH.png'),
//     },
//   ];

//    const toggleService = (id) => {
//     setSelectedServices((prevSelected) =>
//       prevSelected.includes(id)
//         ? prevSelected.filter((item) => item !== id)
//         : [...prevSelected, id]
//     );
//   };

// const renderService = (service) => {
//    const isSelected = selectedServices.includes(service.id);
//   return (    // ✅ Add return here
//     <TouchableOpacity
//       key={service.id}
//       style={[
//         styles.serviceItem,
//         { backgroundColor: theme.card },    
//       ]}
//       onPress={() => toggleService(service.id)}
//       activeOpacity={0.8}
//     >
//       {/* Service Image */}
//       <Image source={service.image} style={styles.serviceImage} />

//       {/* Service Details */}
//       <View style={styles.serviceDetails}>
//         {/* Title + Includes */}
//         <View style={{ flex: 1 }}>
//           <Text
//             style={[styles.serviceName, { color: theme.textPrimary }]}
//             numberOfLines={1}
//           >
//             {service.name}
//           </Text>
//           <Text
//             style={[styles.serviceIncludes, { color: theme.textSecondary }]}
//             numberOfLines={1}
//           >
//             Includes: {service.includes}
//           </Text>
//         </View>

//         {/* Price + Checkbox */}
//         <View style={styles.rightSection}>
//           <Text style={[styles.price, { color: theme.textPrimary }]}>
//             ₹ {service.price}
//           </Text>
//           <View
//             style={[styles.checkbox, { borderColor: theme.textSecondary }]}
//           >
//             {isSelected && <View style={[styles.checkboxFill, { backgroundColor:COLORS.primary }]} />}
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//       {/* Header */}
//       <Head title="Book Appointment" />

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Services */}
// <View style={styles.servicesContainer}>
//   {services.map((service) => renderService(service))}
// </View>
//       </ScrollView>

//       {/* Proceed Button */}
//       <TouchableOpacity onPress={()=>navigation.navigate('PaymentScreen')} style={[styles.proceedButton, { backgroundColor: COLORS.primary }]}>
//         <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>Proceed to pay</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   serviceItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: hp("1.2%"),
//     borderRadius: wp("2%"),
//     marginBottom: hp("1.5%"),
//   },
//   serviceImage: {
//     width: wp("14%"),
//     height: wp("14%"),
//     borderRadius: wp("2%"),
//     marginRight: wp("3%"),
//   },
//   serviceDetails: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   serviceName: {
//     fontSize: wp("4%"),
//     fontWeight: "700",
//     fontFamily: "Poppins-Medium",

//   },
//   serviceIncludes: {
//     fontSize: wp("3.3%"),
//     marginTop: hp("0.3%"),
//     fontFamily: "Poppins-Medium",

//   },
//   rightSection: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent : 'flex-start',
//     gap: wp("2%"),
//     marginBottom : hp('3%')
//   },
//   price: {
//     fontSize: wp("3.8%"),
//     fontWeight: "600",
//         fontFamily: "Poppins-Medium",

//   },
//   checkbox: {
//     width: wp("4.5%"),
//     height: wp("4.5%"),
//     backgroundColor : '#D9D9D9',
//     borderRadius: wp("1%"),
//     alignSelf: "flex-start",
//     justifyContent: "center",
//   },
//   checkboxFill: {
//     width: "100%",
//     height: "100%",
//     borderRadius: wp("1%"),
//   },
//   content: { flex: 1, paddingHorizontal: wp('5%') },
//   servicesContainer: { marginTop: hp('3.125%') },
//   proceedButton: {
//   marginHorizontal: wp('5.56%'),
//   marginVertical: hp('2.5%'),
//   paddingVertical: hp('1.875%'),
//   borderRadius: wp('2%'),
//   alignItems: 'center',
// },
// proceedButtonText: { fontSize: hp('1.875%'), fontWeight: '600',    fontFamily: "Poppins-Medium",
//  },
// container: {
//   flex: 1,
// },
// });

// export default BookAppointmentScreen;



import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import Popup from '../../components/PopUp';

const BookAppointmentScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // For popup
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal toggle
  const route = useRoute();
  const { selectedDate, selectedTime } = route.params || {};
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const services = [
    { id: 1, name: 'Shampoo', price: 499, includes: 'Wash, Cut, Blowdry', image: require('../../assets/SHH.png'), description: 'Professional shampoo service including wash, cut, and blowdry.' },
    { id: 2, name: 'Head Massage', price: 599, includes: 'Oil, Massage, Relaxation', image: require('../../assets/SHH.png'), description: 'Relaxing head massage with nourishing oils for stress relief.' },
    { id: 3, name: 'Hair Mask', price: 699, includes: 'Mask, Steam, Rinse', image: require('../../assets/SHH.png'), description: 'Deep conditioning mask for smooth and shiny hair.' },
    { id: 4, name: 'Shampoo', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
    { id: 5, name: 'Head massage', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
    { id: 6, name: 'Hair mask', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
    { id: 7, name: 'Shampoo', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
    { id: 8, name: 'Head massage', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
    { id: 9, name: 'Hair mask', price: 499, includes: 'wash, Cut, Blowdry', image: require('../../assets/SHH.png') },
  ];

  // Open modal when service is pressed
  const handleServicePress = (service) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };

  // Handle "Select" button inside modal
  const handleSelectService = () => {
    if (selectedService) {
      setSelectedServices((prevSelected) =>
        prevSelected.includes(selectedService.id)
          ? prevSelected.filter((id) => id !== selectedService.id) // Unselect
          : [...prevSelected, selectedService.id] // Select
      );
    }
    setIsModalVisible(false);
  };

  // Handle Proceed button press without API call
  const handleProceed = () => {
    if (selectedServices.length === 0) {
      setPopupMessage('Please select at least one service.');
      setPopupVisible(true);
      return;
    }
    // Gather selected service details
    const selectedServiceDetails = services
      .filter((service) => selectedServices.includes(service.id))
      .map((srv) => ({
        serviceName: srv.name,
        price: srv.price,
      }));

    navigation.navigate('PaymentScreen', {
      services: selectedServiceDetails,
      totalPrice: selectedServiceDetails.reduce((sum, item) => sum + item.price, 0),
      selectedDate,
      selectedTime,
    });
  };

  const renderService = (service) => {
    const isSelected = selectedServices.includes(service.id);
    return (
      <TouchableOpacity
        key={service.id}
        style={[styles.serviceItem, { backgroundColor: theme.card }]}
        onPress={() => handleServicePress(service)}
        activeOpacity={0.8}
      >
        <Image source={service.image} style={styles.serviceImage} />
        <View style={styles.serviceDetails}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.serviceName, { color: theme.textPrimary }]} numberOfLines={1}>
              {service.name}
            </Text>
            <Text style={[styles.serviceIncludes, { color: theme.textSecondary }]} numberOfLines={1}>
              Includes: {service.includes}
            </Text>
          </View>

          <View style={styles.rightSection}>
            <Text style={[styles.price, { color: theme.textPrimary }]}>
              ₹ {service.price}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setSelectedServices((prevSelected) =>
                  prevSelected.includes(service.id)
                    ? prevSelected.filter((id) => id !== service.id)
                    : [...prevSelected, service.id]
                );
              }}
              style={[styles.checkbox, { borderColor: theme.textSecondary }]}
            >
              {isSelected && (
                <Icon name="checkmark" size={wp('5%')} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Book Appointment" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesContainer}>
          {services.map((service) => renderService(service))}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleProceed}
        style={[styles.proceedButton, { backgroundColor: COLORS.primary }]}
      >
        <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>
          Proceed to Pay
        </Text>
      </TouchableOpacity>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      {/* Popup Modal */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: '#fff' }]}>
            {selectedService && (
              <>
                <Image source={selectedService.image} style={styles.modalImage} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {selectedService.name}
                </Text>
                <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
                  {selectedService.includes}
                </Text>
                <Text style={[styles.modalPrice, { color: theme.textPrimary }]}>
                  ₹ {selectedService.price}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  >
                    <Text style={{ color: '#000' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSelectService}
                    style={[
                      styles.modalButton,
                      {
                        backgroundColor: selectedServices.includes(selectedService?.id)
                          ? '#ff4444' // red for Unselect
                          : COLORS.primary, // main color for Select
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff' }}>
                      {selectedServices.includes(selectedService?.id)
                        ? 'Unselect'
                        : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: wp('5%') },
  servicesContainer: { marginTop: hp('3%') },

  serviceItem: {
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
  price: { fontSize: wp('3.8%'), fontWeight: '600', fontFamily: 'Poppins-Medium' },
  checkbox: {
    width: wp('6%'),
    height: wp('6%'),
    backgroundColor: '#D9D9D9',
    borderRadius: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButton: {
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 14, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: hp('80%'),
    justifyContent: 'center',
  },
  modalImage: {
    width: wp('70%'),
    height: hp('40%'),
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: wp('6%'),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: wp('4.5%'),
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default BookAppointmentScreen;
