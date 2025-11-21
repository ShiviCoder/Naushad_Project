import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Utility function to convert DD-MM-YYYY to YYYY-MM-DD
function convertDDMMYYYYtoISO(dateStr) {
  console.log('🔄 convertDDMMYYYYtoISO - Input:', dateStr);
  if (!dateStr) {
    console.log('❌ convertDDMMYYYYtoISO - No date string provided');
    return "";
  }
  
  // Check if already in YYYY-MM-DD format
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    console.log('✅ convertDDMMYYYYtoISO - Already in YYYY-MM-DD format:', dateStr);
    return dateStr;
  }
  
  const [day, month, year] = dateStr.split("-");
  const isoDate = `${year}-${month}-${day}`;
  console.log('✅ convertDDMMYYYYtoISO - Converted to YYYY-MM-DD:', isoDate);
  return isoDate;
}

// Utility function to ensure date is in YYYY-MM-DD format
function ensureYYYYMMDD(dateStr) {
  console.log('🔄 ensureYYYYMMDD - Input:', dateStr);
  if (!dateStr) {
    console.log('❌ ensureYYYYMMDD - No date string provided');
    return '';
  }

  // Extract only YYYY-MM-DD part if it includes time
  let cleanDateStr = dateStr;
  if (dateStr.includes('T')) {
    cleanDateStr = dateStr.split('T')[0];
    console.log('🔄 ensureYYYYMMDD - Extracted YYYY-MM-DD:', cleanDateStr);
  }

  // If already in YYYY-MM-DD format, return as is
  if (cleanDateStr.includes('-') && cleanDateStr.split('-')[0].length === 4) {
    console.log('✅ ensureYYYYMMDD - Already in YYYY-MM-DD format:', cleanDateStr);
    return cleanDateStr;
  }

  try {
    const d = new Date(cleanDateStr);
    if (isNaN(d)) {
      console.log('❌ ensureYYYYMMDD - Invalid date:', cleanDateStr);
      return '';
    }

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log('✅ ensureYYYYMMDD - Formatted to YYYY-MM-DD:', formattedDate);
    return formattedDate;
  } catch (error) {
    console.log('❌ ensureYYYYMMDD - Error:', error);
    return '';
  }
}

// Utility function to format time to 12-hour format for display
function formatTo12Hour(timeStr) {
  console.log('🔄 formatTo12Hour - Input:', timeStr);
  if (!timeStr) {
    console.log('❌ formatTo12Hour - No time string provided');
    return '';
  }

  // If already in 12-hour format with AM/PM, return as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    console.log('✅ formatTo12Hour - Already in 12-hour format:', timeStr);
    return timeStr;
  }

  try {
    let [hour, minute] = timeStr.split(':').map(Number);
    
    // Handle case where minute might be undefined
    if (isNaN(minute)) minute = 0;

    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const formattedTime = `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    console.log('✅ formatTo12Hour - Formatted to 12-hour:', formattedTime);
    return formattedTime;
  } catch (error) {
    console.log('❌ formatTo12Hour - Error:', error);
    return timeStr;
  }
}

// Utility function to convert 12-hour time to 24-hour format for backend
const convertTo24HourFormat = (time12h) => {
  console.log('🔄 convertTo24HourFormat - Input:', time12h);
  if (!time12h) {
    console.log('❌ convertTo24HourFormat - No time string provided');
    return '';
  }
  
  // If already in 24-hour format, return as is
  if (time12h.includes(':') && !time12h.includes('AM') && !time12h.includes('PM')) {
    console.log('✅ convertTo24HourFormat - Already in 24-hour format:', time12h);
    return time12h;
  }

  try {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours, 10);
    
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const formatted24h = `${hours.toString().padStart(2, '0')}:${minutes || '00'}`;
    console.log('✅ convertTo24HourFormat - Converted to 24-hour:', formatted24h);
    return formatted24h;
  } catch (error) {
    console.log('❌ convertTo24HourFormat - Error:', error);
    return time12h;
  }
};

const PaymentScreen = () => {
  const [method, setMethod] = useState('card');
  const [serviceList, setServiceList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const [orderId, setOrderId] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // New state for success popup
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State for incoming date and time (date will be stored in YYYY-MM-DD format)
  const [incomingDate, setIncomingDate] = useState(
    params?.date ? convertDDMMYYYYtoISO(params.date) : 
    params?.selectedDate ? ensureYYYYMMDD(params.selectedDate) : 
    null
  );
  const [incomingTime, setIncomingTime] = useState(params?.time || params?.selectedTime || null);

  console.log('📥 PaymentScreen - Route Params:', params);
  console.log('📥 PaymentScreen - Initial incomingDate (YYYY-MM-DD):', incomingDate);
  console.log('📥 PaymentScreen - Initial incomingTime:', incomingTime);

  // Process incoming date and time from params
  useEffect(() => {
    console.log('🔄 useEffect - Processing incoming date and time from params');
    
    if (params?.date) {
      const isoDate = convertDDMMYYYYtoISO(params.date);
      console.log('✅ useEffect - Setting incomingDate (YYYY-MM-DD):', isoDate);
      setIncomingDate(isoDate);
    } else if (params?.selectedDate) {
      const isoDate = ensureYYYYMMDD(params.selectedDate);
      console.log('✅ useEffect - Setting incomingDate from selectedDate (YYYY-MM-DD):', isoDate);
      setIncomingDate(isoDate);
    } else {
      console.log('❌ useEffect - No date found in params');
    }
    
    if (params?.time) {
      console.log('✅ useEffect - Setting incomingTime:', params.time);
      setIncomingTime(params.time);
    } else if (params?.selectedTime) {
      console.log('✅ useEffect - Setting incomingTime from selectedTime:', params.selectedTime);
      setIncomingTime(params.selectedTime);
    } else {
      console.log('❌ useEffect - No time found in params');
    }
  }, [params]);

  // Process incoming services from different params with proper date and time handling
  useEffect(() => {
    const processIncomingData = async () => {
      console.log('🔄 processIncomingData - Starting data processing');
      console.log('📊 processIncomingData - Current incomingDate (YYYY-MM-DD):', incomingDate);
      console.log('📊 processIncomingData - Current incomingTime:', incomingTime);
      
      let processedServices = [];

      console.log('🔄 processIncomingData - Processing params:', params);

      // Handle different parameter structures
      if (params.services && Array.isArray(params.services)) {
        console.log('✅ processIncomingData - Processing services array');
        processedServices = params.services.map(service => ({
          type: service.type || 'cart',
          serviceName: service.serviceName || service.name,
          name: service.serviceName || service.name,
          price: service.price,
          quantity: service.quantity || 1,
          image: service.image,
          date: ensureYYYYMMDD(incomingDate), // Ensure YYYY-MM-DD format
          time: formatTo12Hour(incomingTime), // Convert to 12-hour for display
          source: service.source || 'Cart'
        }));
      }
      else if (params.serviceName && params.price) {
        console.log('✅ processIncomingData - Processing single service');
        processedServices = [{
          type: 'product',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          date: ensureYYYYMMDD(incomingDate), // Ensure YYYY-MM-DD format
          time: formatTo12Hour(incomingTime), // Convert to 12-hour for display
          source: 'ProductDetails'
        }];
      }
      else if (params.item && (params.item.name || params.item.title)) {
        console.log('✅ processIncomingData - Processing package item');
        processedServices = [{
          type: 'package',
          serviceName: params.item.name || params.item.title,
          name: params.item.name || params.item.title,
          price: params.item.price,
          quantity: params.quantity || 1,
          date: ensureYYYYMMDD(incomingDate), // Ensure YYYY-MM-DD format
          time: formatTo12Hour(incomingTime), // Convert to 12-hour for display
          source: 'ProductPackages'
        }];
      }
      else if (params.serviceName && params.price) {
        console.log('✅ processIncomingData - Processing service details');
        processedServices = [{
          type: 'service',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          date: ensureYYYYMMDD(incomingDate), // Ensure YYYY-MM-DD format
          time: formatTo12Hour(incomingTime), // Convert to 12-hour for display
          source: 'ServiceDetails'
        }];
      }

      console.log('📋 processIncomingData - Processed Services with YYYY-MM-DD dates:', processedServices);

      // Storage update
      if (processedServices.length > 0) {
        console.log('💾 processIncomingData - Saving to AsyncStorage');
        await AsyncStorage.setItem('currentPaymentServices', JSON.stringify(processedServices));
        setServiceList(processedServices);
      } else {
        console.log('📂 processIncomingData - No processed services, loading from storage');
        // fallback load from storage
        const stored = await AsyncStorage.getItem('currentPaymentServices');
        if (stored) {
          const storedData = JSON.parse(stored);
          console.log('📂 processIncomingData - Loaded stored services with dates:', storedData);
          setServiceList(storedData);
        } else {
          console.log('❌ processIncomingData - No services found in storage');
        }
      }
    };

    processIncomingData();
  }, [params, incomingDate, incomingTime]);

  // Calculate total price based on services and quantities
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + (itemPrice * itemQuantity);
    }, 0);
    console.log('💰 Total Price Calculation:', total);
    return total;
  }, [serviceList]);

  // Function to get subtotal per item
  const getItemSubtotal = (item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const subtotal = price * quantity;
    console.log(`📦 getItemSubtotal - ${item.serviceName}: ${price} × ${quantity} = ${subtotal}`);
    return subtotal;
  };

  // Total quantity for all items
  const getTotalQuantity = () => {
    const totalQty = serviceList.reduce((acc, curr) => acc + Number(curr.quantity || 1), 0);
    console.log('📊 getTotalQuantity:', totalQty);
    return totalQty;
  };

  // Popup control helper
  const showPopup = (title, message) => {
    console.log('📢 showPopup:', title, message);
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // Success popup helper
  const showSuccessPopup = (message) => {
    console.log('🎉 showSuccessPopup:', message);
    setSuccessMessage(message);
    setSuccessPopupVisible(true);
    
    // Auto navigate after 2 seconds
    setTimeout(() => {
      console.log('🔄 showSuccessPopup - Auto navigating to success screen');
      setSuccessPopupVisible(false);
      navigation.replace('PaymentSuccessScreen', {
        paymentId: 'temp_payment_id', // This should come from actual payment response
        bookedServices: serviceList,
        totalAmount: totalPrice,
        appointmentDate: incomingDate, // Already in YYYY-MM-DD format
        appointmentTime: convertTo24HourFormat(incomingTime), // Convert to 24-hour for backend
      });
    }, 2000);
  };

  const clearPaymentData = async () => {
    console.log('🗑️ clearPaymentData - Clearing payment data from storage');
    await AsyncStorage.removeItem('currentPaymentServices');
    setServiceList([]);
  };

  // Fetch Razorpay order ID from backend API when screen loads or totalPrice changes
  useEffect(() => {
    const generateOrderId = async () => {
      if (totalPrice <= 0) {
        console.log("💸 No amount due, skipping order id generation.");
        return;
      }
      console.log('🔄 generateOrderId - Generating order ID for amount:', totalPrice);
      setLoadingOrderId(true);
      try {
        const response = await fetch('https://naushad.onrender.com/api/razorpay/generate-order-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalPrice, currency: 'INR' }),
        });
        const json = await response.json();
        console.log('📝 Generated Razorpay Order ID response:', json);
        if (json && json.orderId) {
          console.log('✅ Order ID generated:', json.orderId);
          setOrderId(json.orderId);
        } else if (json.data && json.data.id) {
          console.log('✅ Order ID generated from data.id:', json.data.id);
          setOrderId(json.data.id);
        } else {
          console.warn('⚠️ Could not get order ID from server response');
        }
      } catch (error) {
        console.error('❌ Error generating order ID:', error);
        showPopup('Error', 'Failed to generate payment order. Please try again.');
      } finally {
        setLoadingOrderId(false);
      }
    };

    generateOrderId();
  }, [totalPrice]);

  // Verify payment API call to backend
  const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    console.log('🔍 verifyPayment - Verifying payment');
    try {
      const response = await fetch('https://naushad.onrender.com/api/razorpay/verify-order-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }),
      });
      const json = await response.json();
      console.log('🔍 Payment verification response:', json);
      return json.success === true;
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      return false;
    }
  };

  // Book appointment API call after successful payment
  const bookAppointment = async (date, time, services) => {
    try {
      console.log('📅 Booking appointment with:');
      console.log('   Date (YYYY-MM-DD):', date);
      console.log('   Time (24-hour):', time);
      console.log('   Services:', services);
      
      const requestBody = {
        date: date, // Already in YYYY-MM-DD format
        time: time, // Now in 24-hour format
        services: services,
        totalAmount: totalPrice
      };

      console.log('📤 Sending to backend (YYYY-MM-DD date format):', requestBody);
      
      const response = await fetch('https://naushad.onrender.com/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const json = await response.json();
      console.log('📅 Appointment booking response:', json);
      
      if (json.success) {
        console.log('✅ Appointment booked successfully!');
        return { success: true, data: json };
      } else {
        console.log('❌ Appointment booking failed:', json.message);
        return { success: false, error: json.message };
      }
    } catch (error) {
      console.error('❌ Appointment booking error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle payment processing
  const handlePayment = async () => {
    console.log('🔄 handlePayment - Starting payment process');
    
    if (serviceList.length === 0) {
      console.log('❌ handlePayment - No services found');
      showPopup('No Items', 'No items found for payment.');
      return;
    }
    if (!orderId) {
      console.log('❌ handlePayment - No order ID');
      showPopup('Payment Setup', 'Payment order is not ready yet. Please wait.');
      return;
    }
    if (method === 'wallet') {
      console.log('ℹ️ handlePayment - Wallet method selected (not available)');
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }

    // Get date and time from state (date is already in YYYY-MM-DD format)
    const bookingDate = incomingDate;
    let bookingTime = incomingTime;

    console.log('📅 Final Booking Details:');
    console.log('   Date (YYYY-MM-DD):', bookingDate);
    console.log('   Time:', bookingTime);
    console.log('   Services:', serviceList);

    if (!bookingDate || !bookingTime) {
      console.log('❌ handlePayment - Missing date or time');
      showPopup('Missing Information', 'Please ensure date and time are selected for booking.');
      return;
    }

    // Convert time to 24-hour format for backend
    const bookingTime24h = convertTo24HourFormat(bookingTime);
    console.log('🕒 Time conversion:', { 
      original: bookingTime, 
      converted_24h: bookingTime24h 
    });

    // Compose Razorpay payment options with order_id from backend
    const options = {
      description: 'Payment - Naushad Hair Salon',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_RB4DVzPPSyg8yG',
      amount: totalPrice * 100,
      name: 'Naushad Hair Salon',
      order_id: orderId,
      prefill: {
        email: 'customer@example.com',
        contact: '9876543210',
        name: 'Test User',
      },
      theme: { color: COLORS.primary },
    };

    let paymentData;

    try {
      console.log('💳 handlePayment - Opening Razorpay checkout');
      setProcessingPayment(true);
      paymentData = await RazorpayCheckout.open(options);
      console.log('💳 Payment Success Data:', paymentData);

      // Verify payment with backend api
      const verified = await verifyPayment(paymentData.razorpay_order_id, paymentData.razorpay_payment_id, paymentData.razorpay_signature);
      if (!verified) {
        console.log('❌ handlePayment - Payment verification failed');
        showPopup('Verification Failed', 'Payment verification failed. Please contact support.');
        setProcessingPayment(false);
        return;
      }

      console.log('✅ handlePayment - Payment verified successfully');

      // Clear stored payment services data
      await clearPaymentData();

      // Book appointment after successful payment
      const servicesArray = serviceList.map(service => service.serviceName);

      console.log('📅 Final Appointment Booking Data:');
      console.log('   Date for backend (YYYY-MM-DD):', bookingDate);
      console.log('   Time for backend (24-hour):', bookingTime24h);
      console.log('   Services:', servicesArray);

      const bookingResult = await bookAppointment(bookingDate, bookingTime24h, servicesArray);

      if (bookingResult.success) {
        console.log('✅ handlePayment - Appointment booked successfully');
        // Show success popup with image
        showSuccessPopup('Appointment booked successfully!');
      } else {
        console.log('❌ handlePayment - Appointment booking failed');
        setProcessingPayment(false);
        showPopup('Booking Failed', `Appointment booking failed: ${bookingResult.error}`);
      }
    } catch (error) {
      console.log('❌ Payment Error or Cancelled:', error);
      showPopup('Payment Failed', 'Payment was not completed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const getServiceTypeLabel = (type) => {
    const labelMap = {
      'product': 'Product',
      'package': 'Package',
      'service': 'Service',
      'cart': 'Cart Item'
    };
    const label = labelMap[type] || 'Item';
    console.log(`🏷️ getServiceTypeLabel - ${type} -> ${label}`);
    return label;
  };

  // Format date for display (convert YYYY-MM-DD to readable format)
  // Format date for display (convert YYYY-MM-DD to readable format)
const formatDateForDisplay = (dateString) => {
  console.log('🔄 formatDateForDisplay - Input:', dateString);
  if (!dateString) {
    console.log('❌ formatDateForDisplay - No date string');
    return 'Not selected';
  }
  
  // Extract only YYYY-MM-DD part if it includes time
  let cleanDateString = dateString;
  if (dateString.includes('T')) {
    cleanDateString = dateString.split('T')[0];
    console.log('🔄 formatDateForDisplay - Extracted YYYY-MM-DD:', cleanDateString);
  }
  
  try {
    const date = new Date(cleanDateString);
    if (isNaN(date)) {
      console.log('❌ formatDateForDisplay - Invalid date:', cleanDateString);
      return cleanDateString;
    }

    const formatted = date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    console.log('✅ formatDateForDisplay - Formatted for display:', formatted);
    return formatted;
  } catch (error) {
    console.log('❌ formatDateForDisplay - Error:', error);
    return cleanDateString;
  }
};

  // Success Popup Component
  const SuccessPopup = () => (
    <Modal
      visible={successPopupVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSuccessPopupVisible(false)}
    >
      <View style={styles.successPopupOverlay}>
        <View style={styles.successPopupContainer}>
          <Image 
            source={require('../../assets/images/success.png')} 
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.successPopupTitle}>Success!</Text>
          <Text style={styles.successPopupMessage}>{successMessage}</Text>
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.successLoader} />
          <Text style={styles.successRedirectText}>Redirecting to confirmation...</Text>
        </View>
      </View>
    </Modal>
  );

  // Log navigation state for debugging
  useEffect(() => {
    const state = navigation.getState();
    console.log("📌 Full Navigation State:", state);
    console.log("📌 All Routes:", state.routes);
    console.log("📌 Current Route:", state.routes[state.index]);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Head title="Payment" />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Show loading spinner if order id is loading */}
        {loadingOrderId && (
          <View style={{ paddingVertical: hp('5%') }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ textAlign: 'center', marginTop: 10, color: theme.textSecondary }}>
              Preparing payment...
            </Text>
          </View>
        )}

        {/* Services list */}
        {!loadingOrderId && (
          <>
            {serviceList.length > 0 ? (
              <View style={styles.serviceCard}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: hp('2%') }]}>
                  Order Summary ({getTotalQuantity()} {getTotalQuantity() === 1 ? 'item' : 'items'})
                </Text>
                
                {serviceList.map((srv, i) => (
                  <View key={i} style={styles.serviceBlock}>
                    <View style={styles.serviceHeader}>
                      <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>
                        {srv.serviceName || srv.name || 'Unnamed'}
                      </Text>
                      <Text style={[styles.serviceTag, { 
                        backgroundColor: srv.type === 'product' ? '#E3F2FD' : 
                                       srv.type === 'package' ? '#E8F5E8' : 
                                       srv.type === 'cart' ? '#E8EAF6' : '#FFF3E0',
                        color: srv.type === 'product' ? '#1976D2' : 
                              srv.type === 'package' ? '#2E7D32' : 
                              srv.type === 'cart' ? '#5C6BC0' : '#F57C00'
                      }]}>
                        {getServiceTypeLabel(srv.type)}
                      </Text>
                    </View>

                    <View style={styles.quantityRow}>
                      <Text style={[styles.quantityLabel, { color: theme.textSecondary }]}>
                        Quantity:
                      </Text>
                      <View style={styles.quantityBadge}>
                        <Text style={[styles.quantityValue, { color: '#fff' }]}>
                          {srv.quantity || 1}
                        </Text>
                      </View>
                      {srv.quantity > 1 && (
                        <Text style={[styles.quantityNote, { color: theme.textSecondary }]}>
                          ({srv.quantity} units)
                        </Text>
                      )}
                    </View>

                    {/* Date and Time Display */}
                    <View style={styles.datetimeRow}>
                      <View style={styles.datetimeItem}>
                        <Text style={[styles.datetimeLabel, { color: theme.textSecondary }]}>
                          📅 Date:
                        </Text>
                        <Text style={[styles.datetimeValue, { color: theme.textPrimary }]}>
                          {formatDateForDisplay(srv.date)}
                        </Text>
                      </View>
                      <View style={styles.datetimeItem}>
                        <Text style={[styles.datetimeLabel, { color: theme.textSecondary }]}>
                          🕒 Time:
                        </Text>
                        <Text style={[styles.datetimeValue, { color: theme.textPrimary }]}>
                          {srv.time || 'Not selected'}
                        </Text>
                      </View>
                    </View>

                    {/* Display raw YYYY-MM-DD date for debugging */}
                    <View style={styles.debugRow}>
                      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
                        📋 Backend Date (YYYY-MM-DD): {srv.date || 'Not set'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                        📱 From: {srv.source || 'Unknown'}
                      </Text>
                    </View>

                    <View style={styles.footerRow}>
                      <View style={styles.priceDetails}>
                        <Text style={[styles.addOnText, { color: theme.textPrimary }]}>
                          {srv.quantity > 1 ? `₹${srv.price} × ${srv.quantity}` : 'Price'}
                        </Text>
                        {srv.quantity > 1 && (
                          <Text style={[styles.unitPrice, { color: theme.textSecondary }]}>
                            Unit price: ₹{srv.price}
                          </Text>
                        )}
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: COLORS.primary }]}>
                          ₹{getItemSubtotal(srv)}
                        </Text>
                        {srv.quantity > 1 && (
                          <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                            (₹{srv.price} each)
                          </Text>
                        )}
                      </View>
                    </View>

                    {i < serviceList.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No items found for payment
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                  Please go back and select a product or service
                </Text>
              </View>
            )}

            {serviceList.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: hp('2%') }]}>
                  Select Payment Method
                </Text>

                <RadioItem
                  label="Credit / Debit Card"
                  selected={method === 'card'}
                  onPress={() => setMethod('card')}
                  primary={COLORS.primary}
                  theme={theme}
                />
                <RadioItem
                  label="UPI / Google Pay / Paytm"
                  selected={method === 'upi'}
                  onPress={() => setMethod('upi')}
                  primary={COLORS.primary}
                  theme={theme}
                />
                <RadioItem
                  label="Wallet / Salon Credits"
                  selected={method === 'wallet'}
                  onPress={() => setMethod('wallet')}
                  primary={COLORS.primary}
                  theme={theme}
                />

                <View style={styles.totalBreakdown}>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
                      Subtotal ({getTotalQuantity()} items):
                    </Text>
                    <Text style={[styles.breakdownValue, { color: theme.textPrimary }]}>
                      ₹{serviceList.reduce((acc, curr) => acc + getItemSubtotal(curr), 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
                      GST (10%):
                    </Text>
                    <Text style={[styles.breakdownValue, { color: theme.textPrimary }]}>
                      ₹{Math.round(totalPrice * 0.1).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable:</Text>
                  <Text style={[styles.totalValue, { color: theme.textPrimary }]}>
                    ₹ {totalPrice.toLocaleString('en-IN')}
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Footer Pay Button */}
      {serviceList.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.payBtn, { backgroundColor: COLORS.primary }]}
            onPress={handlePayment}
            disabled={processingPayment || loadingOrderId}
          >
            {processingPayment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payText}>Pay ₹{totalPrice.toLocaleString('en-IN')}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Success Popup */}
      <SuccessPopup />

      {/* Error Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        title={popupTitle}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
}

function RadioItem({ label, selected, onPress, primary, theme }) {
  console.log(`🔘 RadioItem - ${label}: ${selected ? 'selected' : 'not selected'}`);
  return (
    <TouchableOpacity style={styles.radioRow} activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.radioOuter,
          selected && { borderColor: primary, backgroundColor: '#FFF5E0' },
        ]}
      >
        {selected && <View style={[styles.radioDot, { backgroundColor: primary }]} />}
      </View>
      <Text style={[styles.radioText, { color: theme.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0 },
  contentContainer: { paddingHorizontal: wp('5%'), paddingVertical: hp('1.5%') },

  serviceCard: {
    borderRadius: wp('3.5%'),
    backgroundColor: '#fff',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },

  serviceBlock: { marginBottom: hp('1.5%') },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  serviceTitle: { 
    fontSize: wp('4.2%'), 
    fontWeight: '700',
    flex: 1,
    marginRight: wp('2%'),
  },
  serviceTag: { 
    fontSize: wp('3.2%'), 
    fontWeight: '600',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1%'),
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.3%'),
  },
  quantityLabel: {
    fontSize: wp('3.6%'),
    marginRight: wp('2%'),
    fontWeight: '500',
  },
  quantityBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
    marginRight: wp('2%'),
  },
  quantityValue: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
  },
  quantityNote: {
    fontSize: wp('3.2%'),
    fontStyle: 'italic',
  },
  datetimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.3%'),
  },
  datetimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datetimeLabel: {
    fontSize: wp('3.4%'),
    marginRight: wp('1%'),
    fontWeight: '500',
  },
  datetimeValue: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.3%'),
    marginBottom: hp('0.3%'),
  },
  debugText: {
    fontSize: wp('2.8%'),
    fontStyle: 'italic',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('0.3%') },
  detailText: { fontSize: wp('3.6%') },
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: hp('1%'),
    alignItems: 'flex-start',
  },
  priceDetails: {
    flex: 1,
  },
  addOnText: { fontSize: wp('3.8%'), fontWeight: '500' },
  unitPrice: {
    fontSize: wp('3.2%'),
    marginTop: hp('0.2%'),
    fontStyle: 'italic',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: { fontSize: wp('4%'), fontWeight: '700' },
  originalPrice: {
    fontSize: wp('3%'),
    marginTop: hp('0.2%'),
  },
  divider: { 
    height: 1, 
    backgroundColor: '#EEE', 
    marginTop: hp('1.2%'),
    marginBottom: hp('1.2%'),
  },
  sectionTitle: { 
    fontSize: wp('4.5%'), 
    fontWeight: '700', 
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  radioRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  radioOuter: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: wp('4%'),
    borderWidth: 2,
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
  },
  radioDot: { width: wp('3.6%'), height: wp('3.6%'), borderRadius: wp('1.8%') },
  radioText: { fontSize: wp('4%'), fontWeight: '700' },
  totalBreakdown: {
    marginTop: hp('2%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  breakdownLabel: {
    fontSize: wp('3.8%'),
  },
  breakdownValue: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  totalRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: hp('1%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: { fontSize: wp('5%'), fontWeight: '900' },
  totalValue: { marginLeft: 'auto', fontSize: wp('5%'), fontWeight: '900' },
  footer: { 
    paddingHorizontal: wp('5%'), 
    paddingVertical: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  payBtn: { 
    height: hp('6.5%'), 
    borderRadius: wp('3.8%'), 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  payText: { fontSize: wp('4.3%'), fontWeight: '800', color: '#FFFFFF' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  emptySubtext: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
  },
  // Success Popup Styles
  successPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  successPopupContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    width: '100%',
    maxWidth: wp('85%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successImage: {
    width: wp('25%'),
    height: wp('25%'),
    marginBottom: hp('2%'),
  },
  successPopupTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  successPopupMessage: {
    fontSize: wp('4%'),
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  successLoader: {
    marginBottom: hp('1%'),
  },
  successRedirectText: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default PaymentScreen;