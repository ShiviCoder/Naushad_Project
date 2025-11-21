import React, { useState, useEffect } from 'react';
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
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { selectedDate, selectedTime } = route.params || {};
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://naushad.onrender.com/api/ourservice');
      const result = await response.json();
      
      console.log('API Response:', result);
      
      if (result.success && result.data) {
        console.log('Services data:', result.data);
        setServices(result.data);
        
        // Log each service's imageUrl
        result.data.forEach((service, index) => {
          console.log(`Service ${index + 1} - ${service.serviceName}:`, {
            imageUrl: service.imageUrl,
            price: service.price,
            title: service.title
          });
        });
      } else {
        console.log('API returned unsuccessful response:', result);
        setPopupMessage('Failed to load services');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setPopupMessage('Error loading services');
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Open modal when service is pressed
  const handleServicePress = (service) => {
    console.log('Service pressed:', service.serviceName);
    setSelectedService(service);
    setIsModalVisible(true);
  };

  // Handle "Select" button inside modal
  const handleSelectService = () => {
    if (selectedService) {
      console.log('Select/Unselect service:', selectedService.serviceName);
      setSelectedServices((prevSelected) =>
        prevSelected.includes(selectedService._id)
          ? prevSelected.filter((id) => id !== selectedService._id)
          : [...prevSelected, selectedService._id]
      );
    }
    setIsModalVisible(false);
  };

  // Handle Proceed button press
  const handleProceed = () => {
    console.log('Selected services IDs:', selectedServices);
    
    if (selectedServices.length === 0) {
      setPopupMessage('Please select at least one service.');
      setPopupVisible(true);
      return;
    }

    // Gather selected service details
    const selectedServiceDetails = services
      .filter((service) => selectedServices.includes(service._id))
      .map((srv) => ({
        serviceId: srv._id,
        serviceName: srv.serviceName,
        price: srv.price,
        title: srv.title,
        estimatedTime: srv.estimatedTime
      }));

    console.log('Selected service details:', selectedServiceDetails);
    
    const totalPrice = selectedServiceDetails.reduce((sum, item) => sum + item.price, 0);
    console.log('Total price:', totalPrice);

    navigation.navigate('PaymentScreen', {
      services: selectedServiceDetails,
      totalPrice: totalPrice,
      selectedDate,
      selectedTime,
    });
  };

  const renderService = (service) => {
    const isSelected = selectedServices.includes(service._id);
    
    console.log(`Rendering service: ${service.serviceName}`, {
      imageUrl: service.imageUrl,
      isSelected: isSelected
    });

    return (
      <TouchableOpacity
        key={service._id}
        style={[styles.serviceItem, { backgroundColor: theme.card }]}
        onPress={() => handleServicePress(service)}
        activeOpacity={0.8}
      >
        {/* Service Image from API */}
        <Image 
          source={{ uri: service.imageUrl }} 
          style={styles.serviceImage}
          onError={(error) => console.log('Image loading error:', error.nativeEvent)}
          onLoad={() => console.log('Image loaded successfully:', service.imageUrl)}
        />
        
        <View style={styles.serviceDetails}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.serviceName, { color: theme.textPrimary }]} numberOfLines={1}>
              {service.serviceName}
            </Text>
            <Text style={[styles.serviceIncludes, { color: theme.textSecondary }]} numberOfLines={1}>
              {service.title}
            </Text>
            {service.estimatedTime && (
              <Text style={[styles.estimatedTime, { color: theme.textSecondary }]}>
                Estimated time: {service.estimatedTime} mins
              </Text>
            )}
          </View>

          <View style={styles.rightSection}>
            <Text style={[styles.price, { color: theme.textPrimary }]}>
              ₹ {service.price}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                console.log('Checkbox pressed for:', service.serviceName);
                setSelectedServices((prevSelected) =>
                  prevSelected.includes(service._id)
                    ? prevSelected.filter((id) => id !== service._id)
                    : [...prevSelected, service._id]
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Head title="Book Appointment" />
        <View style={styles.loadingContainer}>
        
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Book Appointment" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesContainer}>
          {services.length > 0 ? (
            services.map((service) => renderService(service))
          ) : (
            <View style={styles.noServicesContainer}>
              <Text style={[styles.noServicesText, { color: theme.textPrimary }]}>
                No services available
              </Text>
              <TouchableOpacity onPress={fetchServices} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {services.length > 0 && (
        <TouchableOpacity
          onPress={handleProceed}
          style={[styles.proceedButton, { backgroundColor: COLORS.primary }]}
        >
          <Text style={[styles.proceedButtonText, { color: theme.textOnAccent }]}>
            Proceed to Pay
          </Text>
        </TouchableOpacity>
      )}

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      {/* Service Details Modal */}
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
                <Image 
                  source={{ uri: selectedService.imageUrl }} 
                  style={styles.modalImage}
                  onError={(error) => console.log('Modal image error:', error.nativeEvent)}
                />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {selectedService.serviceName}
                </Text>
                <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
                  {selectedService.title}
                </Text>
                {selectedService.highlights && selectedService.highlights.length > 0 && (
                  <View style={styles.highlightsContainer}>
                    <Text style={[styles.highlightsTitle, { color: theme.textPrimary }]}>
                      Highlights:
                    </Text>
                    {selectedService.highlights.map((highlight, index) => (
                      <Text key={index} style={[styles.highlight, { color: theme.textSecondary }]}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>
                )}
                {selectedService.estimatedTime && (
                  <Text style={[styles.estimatedTime, { color: theme.textSecondary }]}>
                    Estimated Time: {selectedService.estimatedTime} minutes
                  </Text>
                )}
                {selectedService.extra && (
                  <Text style={[styles.extraInfo, { color: theme.textSecondary }]}>
                    {selectedService.extra}
                  </Text>
                )}
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
                        backgroundColor: selectedServices.includes(selectedService?._id)
                          ? '#ff4444'
                          : COLORS.primary,
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff' }}>
                      {selectedServices.includes(selectedService?._id)
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  noServicesText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    marginBottom: hp('2%'),
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
  },

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
  estimatedTime: {
    fontSize: wp('3%'),
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
    fontFamily: 'Poppins-Medium' 
  },
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
    maxHeight: hp('80%'),
  },
  modalImage: {
    width: wp('70%'),
    height: hp('30%'),
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: wp('6%'),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  modalDesc: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  highlightsContainer: {
    width: '100%',
    marginBottom: 10,
  },
  highlightsTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  highlight: {
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
    fontFamily: 'Poppins-Medium',
  },
  extraInfo: {
    fontSize: wp('3.5%'),
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  modalPrice: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Poppins-Medium',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default BookAppointmentScreen;