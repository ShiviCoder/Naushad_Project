import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../../../utils/Colors';
import Popup from '../../../../components/PopUp';
import Head from '../../../../components/Head';
import { useTheme } from '../../../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Utility function to ensure date is in YYYY-MM-DD format
function ensureYYYYMMDD(dateStr) {
  console.log('🔄 ensureYYYYMMDD - Input:', dateStr);
  if (!dateStr) {
    console.log('❌ ensureYYYYMMDD - No date string provided');
    return '';
  }

  // If it's already just the date part in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.log('✅ ensureYYYYMMDD - Already in YYYY-MM-DD format:', dateStr);
    return dateStr;
  }

  // If it's an ISO string with time (like "2025-11-26T00:00:00.000Z"), extract only the date part
  if (dateStr.includes('T')) {
    const datePart = dateStr.split('T')[0];
    console.log(
      '✅ ensureYYYYMMDD - Extracted date from ISO string:',
      datePart,
    );

    // Validate the extracted date
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  // If it's a Date object, format it
  if (dateStr instanceof Date) {
    const year = dateStr.getFullYear();
    const month = String(dateStr.getMonth() + 1).padStart(2, '0');
    const day = String(dateStr.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    console.log(
      '✅ ensureYYYYMMDD - Formatted Date object to YYYY-MM-DD:',
      formatted,
    );
    return formatted;
  }

  // For any other format, try to parse it
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.log('❌ ensureYYYYMMDD - Invalid date string:', dateStr);
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    console.log(
      '✅ ensureYYYYMMDD - Parsed and formatted to YYYY-MM-DD:',
      formatted,
    );
    return formatted;
  } catch (error) {
    console.log('❌ ensureYYYYMMDD - Error:', error);
    return '';
  }
}

// Utility function to ensure time is in 24-hour format (HH:MM)
function ensure24HourTime(timeStr) {
  console.log('🔄 ensure24HourTime - Input:', timeStr);
  if (!timeStr) {
    console.log('❌ ensure24HourTime - No time string provided');
    return '';
  }

  // Replace dots with colons if needed
  let cleanTime = timeStr.replace(/\./g, ':');

  // If already in proper 24-hour format (HH:MM), return as is
  if (/^\d{1,2}:\d{2}$/.test(cleanTime)) {
    const [hours, minutes] = cleanTime.split(':');
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const result = `${formattedHours}:${formattedMinutes}`;
    console.log(
      '✅ ensure24HourTime - Already in 24-hour format, normalized:',
      result,
    );
    return result;
  }

  // If it's in 12-hour format with AM/PM, convert to 24-hour
  if (cleanTime.includes('AM') || cleanTime.includes('PM')) {
    try {
      const [time, modifier] = cleanTime.split(' ');
      let [hours, minutes] = time.split(':');

      hours = parseInt(hours, 10);

      if (modifier === 'PM' && hours < 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      const result = `${hours.toString().padStart(2, '0')}:${minutes || '00'}`;
      console.log(
        '✅ ensure24HourTime - Converted from 12-hour to 24-hour:',
        result,
      );
      return result;
    } catch (error) {
      console.log(
        '❌ ensure24HourTime - Error converting 12-hour format:',
        error,
      );
      return '';
    }
  }

  console.log('❌ ensure24HourTime - Unrecognized time format:', timeStr);
  return '';
}

// Utility function to format time to 12-hour format for display
function formatTo12Hour(timeStr) {
  console.log('🔄 formatTo12Hour - Input:', timeStr);
  if (!timeStr) {
    console.log('❌ formatTo12Hour - No time string provided');
    return '';
  }

  // First ensure it's in 24-hour format
  const time24h = ensure24HourTime(timeStr);

  try {
    const [hours, minutes] = time24h.split(':');
    const hourNum = parseInt(hours, 10);

    let displayHour = hourNum % 12;
    if (displayHour === 0) displayHour = 12;

    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const result = `${displayHour}:${minutes} ${ampm}`;

    console.log('✅ formatTo12Hour - Formatted to 12-hour:', result);
    return result;
  } catch (error) {
    console.log('❌ formatTo12Hour - Error:', error);
    return time24h;
  }
}

const PackagePayementScreen = () => {
  const [method, setMethod] = useState('wallet');
  const [serviceList, setServiceList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // State for incoming date, time, and chair number
  const [incomingDate, setIncomingDate] = useState(
    params?.date
      ? ensureYYYYMMDD(params.date)
      : params?.selectedDate
      ? ensureYYYYMMDD(params.selectedDate)
      : null,
  );
  const [incomingTime, setIncomingTime] = useState(
    params?.time
      ? ensure24HourTime(params.time)
      : params?.selectedTime
      ? ensure24HourTime(params.selectedTime)
      : null,
  );
  const [incomingChairNumber, setIncomingChairNumber] = useState(
    params?.selectedSeat || params?.chairNumber || null,
  );

  console.log('📥 PaymentScreen - Route Params:', params);
  console.log(
    '📥 PaymentScreen - Initial incomingDate (YYYY-MM-DD):',
    incomingDate,
  );
  console.log(
    '📥 PaymentScreen - Initial incomingTime (24-hour):',
    incomingTime,
  );
  console.log(
    '📥 PaymentScreen - Initial incomingChairNumber:',
    incomingChairNumber,
  );

  // Check if date and time are available
  const hasDateTime = useMemo(() => {
    const hasDate = !!incomingDate && incomingDate.trim() !== '';
    const hasTime = !!incomingTime && incomingTime.trim() !== '';
    console.log('📅 hasDateTime check - Date:', hasDate, 'Time:', hasTime);
    return hasDate && hasTime;
  }, [incomingDate, incomingTime]);

  // Memoized totalPrice to prevent recalculation
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + itemPrice * itemQuantity;
    }, 0);
    console.log('💰 Total Price Calculation:', total);
    return total;
  }, [serviceList]);

  // Memoized hasSufficientBalance
  const hasSufficientBalance = useMemo(() => {
    return walletBalance >= totalPrice;
  }, [walletBalance, totalPrice]);

  // Memoized getItemSubtotal
  const getItemSubtotal = useCallback(item => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const subtotal = price * quantity;
    console.log(
      `📦 getItemSubtotal - ${item.serviceName}: ${price} × ${quantity} = ${subtotal}`,
    );
    return subtotal;
  }, []);

  // Memoized getTotalQuantity
  const getTotalQuantity = useCallback(() => {
    const totalQty = serviceList.reduce(
      (acc, curr) => acc + Number(curr.quantity || 1),
      0,
    );
    console.log('📊 getTotalQuantity:', totalQty);
    return totalQty;
  }, [serviceList]);

  // Memoized getServiceTypeLabel
  const getServiceTypeLabel = useCallback(type => {
    const labelMap = {
      product: 'Product',
      package: 'Package',
      service: 'Service',
      cart: 'Cart Item',
    };
    const label = labelMap[type] || 'Item';
    console.log(`🏷️ getServiceTypeLabel - ${type} -> ${label}`);
    return label;
  }, []);

  // Function to get userId from AsyncStorage
  const getUserId = useCallback(async () => {
    try {
      console.log('🔍 Starting to fetch user ID from AsyncStorage...');

      // Try multiple methods to get userId
      const storedUserId = await AsyncStorage.getItem('userId');
      const userDataString = await AsyncStorage.getItem('userData');

      console.log('📦 Direct userId from AsyncStorage:', storedUserId);
      console.log('📦 userData from AsyncStorage:', userDataString);

      let finalUserId = storedUserId;

      // If no direct userId, try to extract from userData
      if (!finalUserId && userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          console.log('📊 Parsed userData:', userData);

          // Check different possible locations for userId
          if (userData.user && userData.user._id) {
            finalUserId = userData.user._id;
            console.log('✅ Found userId in userData.user._id:', finalUserId);
          } else if (userData._id) {
            finalUserId = userData._id;
            console.log('✅ Found userId in userData._id:', finalUserId);
          } else if (userData.id) {
            finalUserId = userData.id;
            console.log('✅ Found userId in userData.id:', finalUserId);
          }
        } catch (parseError) {
          console.log('❌ Error parsing userData:', parseError);
        }
      }

      if (finalUserId) {
        console.log('🎯 Final userId to be used:', finalUserId);
        setUserId(finalUserId);
        return finalUserId;
      } else {
        console.log('❌ No userId found in any storage location');
        return null;
      }
    } catch (error) {
      console.log('❌ Error getting userId:', error);
      return null;
    }
  }, []);

  // Fetch wallet balance - memoized with useCallback
  const fetchWalletBalance = useCallback(async () => {
    try {
      console.log('💰 Fetching wallet balance...');
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log('❌ No token found for wallet fetch');
        return;
      }

      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('💰 Wallet API Response:', data);

      if (data.success) {
        setWalletBalance(data.data.totalWalletAmount || 0);
        console.log('💰 Wallet Balance:', data.data.totalWalletAmount);
      } else {
        console.log('❌ Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('❌ Wallet fetch error:', error);
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  // 🔥 NAVIGATE TO ADD FUNDS SCREEN
  const navigateToAddFunds = useCallback(() => {
    console.log('💰 Navigating to FundAddScreen');
    navigation.navigate('BookAppoinementFundAdd', {
      requiredAmount: totalPrice - walletBalance,
      returnScreen: 'PaymentScreen',
      returnParams: params,
    });
  }, [navigation, totalPrice, walletBalance, params]);

  // Process incoming services - FIXED VERSION
  const processIncomingData = useCallback(async () => {
    console.log('🔄 processIncomingData - Starting data processing');
    console.log(
      '📊 processIncomingData - Current incomingDate (YYYY-MM-DD):',
      incomingDate,
    );
    console.log(
      '📊 processIncomingData - Current incomingTime (24-hour):',
      incomingTime,
    );
    console.log(
      '📊 processIncomingData - Current incomingChairNumber:',
      incomingChairNumber,
    );
    console.log('📊 processIncomingData - Has DateTime:', hasDateTime);

    let processedServices = [];

    console.log('🔄 processIncomingData - Processing params:', params);

    // Handle different parameter structures - FIXED SERVICE NAME EXTRACTION
    if (params.services && Array.isArray(params.services)) {
      console.log('✅ processIncomingData - Processing services array');
      console.log('Number of services in array:', params.services.length);

      processedServices = params.services.map(service => {
        console.log('Processing service object:', service);

        // Extract service name from multiple possible fields
        const serviceName =
          service.serviceName ||
          service.name ||
          service.title ||
          'Unnamed Service';
        console.log('Extracted service name:', serviceName);

        return {
          type: service.type || 'package',
          serviceName: serviceName,
          name: serviceName,
          price: service.price,
          quantity: service.quantity || 1,
          image: service.image,
          date: hasDateTime ? ensureYYYYMMDD(incomingDate) : null,
          time: hasDateTime ? formatTo12Hour(incomingTime) : null,
          backendTime: hasDateTime ? ensure24HourTime(incomingTime) : null,
          chairNumber: incomingChairNumber,
          source: service.source || 'Package Booking',
          // Include additional fields for debugging
          _id: service._id || service.serviceId,
          estimatedTime: service.estimatedTime,
          originalData: service, // Store original for debugging
        };
      });
    } else if (params.serviceName && params.price) {
      console.log('✅ processIncomingData - Processing single service');
      processedServices = [
        {
          type: 'product',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          date: hasDateTime ? ensureYYYYMMDD(incomingDate) : null,
          time: hasDateTime ? formatTo12Hour(incomingTime) : null,
          backendTime: hasDateTime ? ensure24HourTime(incomingTime) : null,
          chairNumber: incomingChairNumber,
          source: 'ProductDetails',
        },
      ];
    } else if (params.item && (params.item.name || params.item.title)) {
      console.log('✅ processIncomingData - Processing package item');
      processedServices = [
        {
          type: 'package',
          serviceName: params.item.name || params.item.title,
          name: params.item.name || params.item.title,
          price: params.item.price,
          quantity: params.quantity || 1,
          date: hasDateTime ? ensureYYYYMMDD(incomingDate) : null,
          time: hasDateTime ? formatTo12Hour(incomingTime) : null,
          backendTime: hasDateTime ? ensure24HourTime(incomingTime) : null,
          chairNumber: incomingChairNumber,
          source: 'ProductPackages',
        },
      ];
    } else if (params.serviceName && params.price) {
      console.log('✅ processIncomingData - Processing service details');
      processedServices = [
        {
          type: 'service',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          date: hasDateTime ? ensureYYYYMMDD(incomingDate) : null,
          time: hasDateTime ? formatTo12Hour(incomingTime) : null,
          backendTime: hasDateTime ? ensure24HourTime(incomingTime) : null,
          chairNumber: incomingChairNumber,
          source: 'ServiceDetails',
        },
      ];
    }

    console.log(
      '📋 processIncomingData - Processed Services:',
      processedServices.map(s => ({
        name: s.serviceName,
        price: s.price,
        quantity: s.quantity,
      })),
    );

    // Storage update
    if (processedServices.length > 0) {
      console.log('💾 processIncomingData - Saving to AsyncStorage');
      await AsyncStorage.setItem(
        'currentPaymentServices',
        JSON.stringify(processedServices),
      );
      setServiceList(processedServices);
    } else {
      console.log(
        '📂 processIncomingData - No processed services, loading from storage',
      );
      // fallback load from storage
      const stored = await AsyncStorage.getItem('currentPaymentServices');
      if (stored) {
        const storedData = JSON.parse(stored);
        console.log(
          '📂 processIncomingData - Loaded stored services:',
          storedData,
        );
        setServiceList(storedData);
      } else {
        console.log('❌ processIncomingData - No services found in storage');
      }
    }
  }, [params, incomingDate, incomingTime, incomingChairNumber, hasDateTime]);

  // Process incoming date, time, and chair number from params
  useEffect(() => {
    console.log(
      '🔄 useEffect - Processing incoming date, time, and chair number from params',
    );

    if (params?.date) {
      const isoDate = ensureYYYYMMDD(params.date);
      console.log('✅ useEffect - Setting incomingDate (YYYY-MM-DD):', isoDate);
      setIncomingDate(isoDate);
    } else if (params?.selectedDate) {
      const isoDate = ensureYYYYMMDD(params.selectedDate);
      console.log(
        '✅ useEffect - Setting incomingDate from selectedDate (YYYY-MM-DD):',
        isoDate,
      );
      setIncomingDate(isoDate);
    } else {
      console.log('❌ useEffect - No date found in params');
    }

    if (params?.time) {
      const time24h = ensure24HourTime(params.time);
      console.log('✅ useEffect - Setting incomingTime (24-hour):', time24h);
      setIncomingTime(time24h);
    } else if (params?.selectedTime) {
      const time24h = ensure24HourTime(params.selectedTime);
      console.log(
        '✅ useEffect - Setting incomingTime from selectedTime (24-hour):',
        time24h,
      );
      setIncomingTime(time24h);
    } else {
      console.log('❌ useEffect - No time found in params');
    }

    // Set chair number
    if (params?.selectedSeat || params?.chairNumber) {
      const chairNum = params.selectedSeat || params.chairNumber;
      console.log('✅ useEffect - Setting incomingChairNumber:', chairNum);
      setIncomingChairNumber(chairNum);
    } else {
      console.log('❌ useEffect - No chair number found in params');
    }
  }, [params]);

  // Load all data - memoized with useCallback
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Get userId first
      const fetchedUserId = await getUserId();
      console.log('👤 LoadAllData - Fetched User ID:', fetchedUserId);

      // Process other data
      await processIncomingData();
      await fetchWalletBalance();
    } finally {
      setIsLoading(false);
    }
  }, [getUserId, processIncomingData, fetchWalletBalance]);

  // Load data on mount and params change
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Navigation debug effect
  useEffect(() => {
    const state = navigation.getState();
    console.log('📌 Full Navigation State:', state);
    console.log('📌 All Routes:', state.routes);
    console.log('📌 Current Route:', state.routes[state.index]);
  }, []);

  // 🔥 FIXED BACK HANDLER - ALWAYS GO TO MAINTABS
  const handleBackPress = useCallback(() => {
    console.log('🔙 Back pressed - Navigating to MainTabs');

    // 🔥 ALWAYS NAVIGATE TO MAINTABS
    navigation.navigate('MainTabs');

    return true; // Prevent default back action
  }, [navigation]);

  // 🔥 Set up back handler - FIXED
  useEffect(() => {
    console.log('🔧 Setting up back handlers - ALWAYS to MainTabs');

    // Software back button (Header back button)
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      console.log('🔙 Software back button pressed');
      e.preventDefault();
      handleBackPress();
    });

    // Hardware back button (Android)
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    // Cleanup
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, handleBackPress]);

  // Stable popup functions
  const showPopup = useCallback((title, message) => {
    console.log('📢 showPopup:', title, message);
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  const showSuccessPopup = useCallback(
    message => {
      console.log('🎉 showSuccessPopup:', message);
      setSuccessMessage(message);
      setSuccessPopupVisible(true);

      // Auto navigate after 2 seconds
      setTimeout(() => {
        console.log('🔄 showSuccessPopup - Auto navigating to success screen');
        setSuccessPopupVisible(false);
        navigation.replace('PaymentSuccessScreen', {
          bookedServices: serviceList,
          totalAmount: totalPrice,
          appointmentDate: incomingDate,
          appointmentTime: incomingTime,
          chairNumber: incomingChairNumber,
          paymentMethod: method,
        });
      }, 2000);
    },
    [
      serviceList,
      totalPrice,
      incomingDate,
      incomingTime,
      incomingChairNumber,
      method,
      navigation,
    ],
  );

  const clearPaymentData = useCallback(async () => {
    console.log('🗑️ clearPaymentData - Clearing payment data from storage');
    await AsyncStorage.removeItem('currentPaymentServices');
    setServiceList([]);
  }, []);

  // Book appointment API call - Updated with userId
  const bookAppointment = useCallback(
    async (date, time, services) => {
      try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');

        // Get userId from state or fetch it
        let bookingUserId = userId;
        if (!bookingUserId) {
          bookingUserId = await getUserId();
        }

        console.log('🔑 Token from storage:', token ? 'Present' : 'Missing');
        console.log('👤 User ID for booking:', bookingUserId);

        if (!token) {
          console.log('❌ No token found');
          return {
            success: false,
            error: 'Authentication required. Please login again.',
          };
        }

        if (!bookingUserId) {
          console.log('❌ No user ID found');
          return {
            success: false,
            error: 'User information not found. Please login again.',
          };
        }

        console.log('📅 Booking appointment with:');
        console.log('   Date (YYYY-MM-DD):', date);
        console.log('   Time (24-hour):', time);
        console.log('   Services:', services);
        console.log('   Chair Number:', incomingChairNumber);
        console.log('   User ID:', bookingUserId);
        console.log('   Total Amount:', totalPrice);

        // Prepare services array for backend
        const servicesArray = serviceList.map(service => ({
          serviceId: service._id || service.serviceId,
          serviceName: service.serviceName,
          price: service.price,
          quantity: service.quantity || 1,
          type: service.type || 'package',
        }));

        // Enhanced request body with proper structure including userId
        const requestBody = {
          date: date,
          time: time,
          services: servicesArray, // Send full service objects, not just names
          totalAmount: totalPrice,
          chairNo: incomingChairNumber,
          userId: bookingUserId,
          // Add these common required fields
          serviceType: 'appointment',
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'wallet',
        };

        console.log(
          '📤 Sending to backend:',
          JSON.stringify(requestBody, null, 2),
        );

        const response = await fetch(
          'https://naushad.onrender.com/api/appointments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          },
        );

        const responseText = await response.text();
        console.log('📥 Raw API Response:', responseText);
        console.log('📊 Response Status:', response.status);
        console.log('📊 Response OK:', response.ok);

        let json;
        try {
          json = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          console.error('❌ Response that failed to parse:', responseText);
          return {
            success: false,
            error: `Server returned invalid JSON: ${response.status}`,
            status: response.status,
          };
        }

        console.log('📅 Appointment booking response:', json);

        if (response.ok && json.success) {
          console.log('✅ Appointment booked successfully!');
          console.log('📋 Appointment data:', json.data);
          return { success: true, data: json };
        } else {
          console.log(
            '❌ Appointment booking failed:',
            json.message || 'Unknown error',
          );
          console.log('❌ Full error response:', json);
          return {
            success: false,
            error: json.message || `Server error: ${response.status}`,
            status: response.status,
            details: json,
          };
        }
      } catch (error) {
        console.error('❌ Appointment booking network error:', error);
        return {
          success: false,
          error: `Network error: ${error.message}`,
        };
      }
    },
    [totalPrice, incomingChairNumber, userId, getUserId, serviceList],
  );

  // Handle booking process
  const handleBooking = useCallback(async () => {
    console.log('🔄 handleBooking - Starting booking process');

    if (serviceList.length === 0) {
      console.log('❌ handleBooking - No services found');
      showPopup('No Items', 'No items found for booking.');
      return;
    }

    // Check wallet balance
    if (!hasSufficientBalance) {
      console.log('❌ handleBooking - Insufficient wallet balance');
      showPopup(
        'Insufficient Balance',
        `You need ₹${
          totalPrice - walletBalance
        } more in your wallet.\n\nCurrent Balance: ₹${walletBalance}\nOrder Total: ₹${totalPrice}`,
      );
      return;
    }

    // Get date and time from state (already in correct formats)
    const bookingDate = incomingDate; // Already in YYYY-MM-DD format
    const bookingTime = incomingTime; // Already in 24-hour format

    console.log('📅 Final Booking Details:');
    console.log('   Date (YYYY-MM-DD):', bookingDate);
    console.log('   Time (24-hour):', bookingTime);
    console.log('   Chair Number:', incomingChairNumber);
    console.log('   Services:', serviceList);
    console.log('   Wallet Balance:', walletBalance);
    console.log('   Has Sufficient Balance:', hasSufficientBalance);
    console.log('   User ID:', userId);

    // Check if date and time are required but missing
    if (!bookingDate || !bookingTime) {
      console.log('❌ handleBooking - Missing date or time');
      showPopup(
        'Missing Information',
        'Please ensure date and time are selected for booking.',
      );
      return;
    }

    // Verify the formats
    console.log('✅ Verified Formats:');
    console.log(
      '   Date format correct:',
      /^\d{4}-\d{2}-\d{2}$/.test(bookingDate),
    );
    console.log('   Time format correct:', /^\d{2}:\d{2}$/.test(bookingTime));

    // Check if userId is available
    if (!userId) {
      console.log('❌ handleBooking - No user ID found');
      showPopup('User Error', 'Unable to identify user. Please login again.');
      return;
    }

    try {
      console.log('📝 handleBooking - Starting appointment booking');
      setProcessingPayment(true);

      // Book appointment directly
      const servicesArray = serviceList.map(service => service.serviceName);

      console.log('📅 Final Appointment Booking Data:');
      console.log('   Date for backend (YYYY-MM-DD):', bookingDate);
      console.log('   Time for backend (24-hour):', bookingTime);
      console.log('   Chair Number:', incomingChairNumber);
      console.log('   Services:', servicesArray);
      console.log('   Payment Method: wallet');
      console.log('   Wallet Balance Used:', totalPrice);
      console.log('   User ID for notification:', userId);

      const bookingResult = await bookAppointment(
        bookingDate,
        bookingTime,
        servicesArray,
      );

      if (bookingResult.success) {
        console.log('✅ handleBooking - Appointment booked successfully');
        // Clear stored payment services data
        await clearPaymentData();
        // Show success popup with image
        showSuccessPopup('Appointment booked successfully using Wallet!');
      } else {
        console.log('❌ handleBooking - Appointment booking failed');
        showPopup(
          'Booking Failed',
          `Appointment booking failed: ${bookingResult.error}`,
        );
      }
    } catch (error) {
      console.log('❌ Booking Error:', error);
      showPopup(
        'Booking Failed',
        'Booking was not completed. Please try again.',
      );
    } finally {
      setProcessingPayment(false);
    }
  }, [
    serviceList,
    hasSufficientBalance,
    walletBalance,
    totalPrice,
    incomingDate,
    incomingTime,
    incomingChairNumber,
    userId,
    showPopup,
    bookAppointment,
    clearPaymentData,
    showSuccessPopup,
  ]);

  // Format date for display (convert YYYY-MM-DD to readable format)
  const formatDateForDisplay = useCallback(dateString => {
    console.log('🔄 formatDateForDisplay - Input:', dateString);
    if (!dateString) {
      console.log('❌ formatDateForDisplay - No date string');
      return 'Not selected';
    }

    // Extract only YYYY-MM-DD part if it includes time
    let cleanDateString = dateString;
    if (dateString.includes('T')) {
      cleanDateString = dateString.split('T')[0];
      console.log(
        '🔄 formatDateForDisplay - Extracted YYYY-MM-DD:',
        cleanDateString,
      );
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
        day: 'numeric',
      });
      console.log(
        '✅ formatDateForDisplay - Formatted for display:',
        formatted,
      );
      return formatted;
    } catch (error) {
      console.log('❌ formatDateForDisplay - Error:', error);
      return cleanDateString;
    }
  }, []);

  // Stable RadioItem onPress
  const handleRadioPress = useCallback(() => {
    setMethod('wallet');
  }, []);

  // Success Popup Component - memoized
  const SuccessPopup = useMemo(
    () => (
      <Modal
        visible={successPopupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessPopupVisible(false)}
      >
        <View style={styles.successPopupOverlay}>
          <View style={styles.successPopupContainer}>
            <Image
              source={require('../../../../assets/images/success.png')}
              style={styles.successImage}
              resizeMode="contain"
            />
            <Text style={styles.successPopupTitle}>Success!</Text>
            <Text style={styles.successPopupMessage}>{successMessage}</Text>
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.successLoader}
            />
            <Text style={styles.successRedirectText}>
              Redirecting to confirmation...
            </Text>
          </View>
        </View>
      </Modal>
    ),
    [successPopupVisible, successMessage],
  );

  // Full screen loading
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <Head title="Payment" />
        <ScrollView
          style={styles.loadingScroll}
          contentContainerStyle={styles.loadingContainer}
          showsVerticalScrollIndicator={false}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* 🔥 PASS handleBackPress TO HEAD COMPONENT */}
      <Head title="Payment" onBackPress={handleBackPress} />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Services list */}
        {serviceList.length > 0 ? (
          <View style={styles.serviceCard}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textPrimary, marginBottom: hp('2%') },
              ]}
            >
              Order Summary ({getTotalQuantity()}{' '}
              {getTotalQuantity() === 1 ? 'item' : 'items'})
            </Text>

            {serviceList.map((srv, i) => (
              <View key={i} style={styles.serviceBlock}>
                <View style={styles.serviceHeader}>
                  <Text
                    style={[styles.serviceTitle, { color: theme.textPrimary }]}
                  >
                    {srv.serviceName || srv.name || 'Unnamed Service'}
                  </Text>
                  <Text
                    style={[
                      styles.serviceTag,
                      {
                        backgroundColor:
                          srv.type === 'product'
                            ? '#E3F2FD'
                            : srv.type === 'package'
                            ? '#E8F5E8'
                            : srv.type === 'cart'
                            ? '#E8EAF6'
                            : '#FFF3E0',
                        color:
                          srv.type === 'product'
                            ? '#1976D2'
                            : srv.type === 'package'
                            ? '#2E7D32'
                            : srv.type === 'cart'
                            ? '#5C6BC0'
                            : '#F57C00',
                      },
                    ]}
                  >
                    {getServiceTypeLabel(srv.type)}
                  </Text>
                </View>

                <View style={styles.quantityRow}>
                  <Text
                    style={[
                      styles.quantityLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Quantity:
                  </Text>
                  <View style={styles.quantityBadge}>
                    <Text style={[styles.quantityValue, { color: '#fff' }]}>
                      {srv.quantity || 1}
                    </Text>
                  </View>
                  {srv.quantity > 1 && (
                    <Text
                      style={[
                        styles.quantityNote,
                        { color: theme.textSecondary },
                      ]}
                    >
                      ({srv.quantity} units)
                    </Text>
                  )}
                </View>

                {hasDateTime && (
                  <>
                    <View style={styles.datetimeRow}>
                      <View style={styles.datetimeItem}>
                        <Text
                          style={[
                            styles.datetimeLabel,
                            { color: theme.textSecondary },
                          ]}
                        >
                          📅 Date:
                        </Text>
                        <Text
                          style={[
                            styles.datetimeValue,
                            { color: theme.textPrimary },
                          ]}
                        >
                          {formatDateForDisplay(srv.date)}
                        </Text>
                      </View>
                      <View style={styles.datetimeItem}>
                        <Text
                          style={[
                            styles.datetimeLabel,
                            { color: theme.textSecondary },
                          ]}
                        >
                          🕒 Time:
                        </Text>
                        <Text
                          style={[
                            styles.datetimeValue,
                            { color: theme.textPrimary },
                          ]}
                        >
                          {srv.time || 'Not selected'}
                        </Text>
                      </View>
                    </View>

                    {/* Chair Number Row */}
                    {incomingChairNumber && (
                      <View style={styles.chairRow}>
                        <Text
                          style={[
                            styles.chairLabel,
                            { color: theme.textSecondary },
                          ]}
                        >
                          💺 Chair Number:
                        </Text>
                        <Text
                          style={[
                            styles.chairValue,
                            { color: theme.textPrimary },
                          ]}
                        >
                          {incomingChairNumber}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                <View style={styles.detailRow}>
                  <Text
                    style={[styles.detailText, { color: theme.textSecondary }]}
                  >
                    📱 From: {srv.source || 'Package Booking'}
                  </Text>
                  {srv.estimatedTime && (
                    <Text
                      style={[
                        styles.detailText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      ⏱️ Duration: {srv.estimatedTime} mins
                    </Text>
                  )}
                </View>

                <View style={styles.footerRow}>
                  <View style={styles.priceDetails}>
                    <Text
                      style={[styles.addOnText, { color: theme.textPrimary }]}
                    >
                      {srv.quantity > 1
                        ? `₹${srv.price} × ${srv.quantity}`
                        : 'Price'}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text
                        style={[
                          styles.unitPrice,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Unit price: ₹{srv.price}
                      </Text>
                    )}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: COLORS.primary }]}>
                      ₹{getItemSubtotal(srv)}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text
                        style={[
                          styles.originalPrice,
                          { color: theme.textSecondary },
                        ]}
                      >
                        (₹{srv.price} each)
                      </Text>
                    )}
                  </View>
                </View>

                {i < serviceList.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No items found for booking
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Please go back and select a product or service
            </Text>
          </View>
        )}

        {serviceList.length > 0 && (
          <>
            {/* Wallet Balance Card */}
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Image
                  source={require('../../../../assets/wallet.png')}
                  style={styles.walletIcon}
                />
                <Text style={styles.walletTitle}>Salon Wallet</Text>
              </View>

              {loadingWallet ? (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={styles.walletLoader}
                />
              ) : (
                <>
                  <Text style={styles.walletBalanceLabel}>
                    Available Balance
                  </Text>
                  <Text style={styles.walletBalanceAmount}>
                    ₹ {walletBalance.toLocaleString('en-IN')}
                  </Text>

                  <View style={styles.balanceStatus}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: hasSufficientBalance
                            ? '#4CAF50'
                            : '#F44336',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: hasSufficientBalance ? '#4CAF50' : '#F44336',
                        },
                      ]}
                    >
                      {hasSufficientBalance
                        ? 'Sufficient balance for booking'
                        : 'Insufficient balance'}
                    </Text>
                  </View>

                  {/* 🔥 Show required amount and Add Funds button when insufficient */}
                  {!hasSufficientBalance && (
                    <View style={styles.requiredAmountContainer}>
                      <Text style={styles.requiredAmountText}>
                        Required: ₹
                        {(totalPrice - walletBalance).toLocaleString('en-IN')}
                      </Text>
                      <TouchableOpacity
                        style={styles.addFundsButton}
                        onPress={navigateToAddFunds}
                      >
                        <Text style={styles.addFundsButtonText}>Add Funds</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textPrimary, marginTop: hp('2%') },
              ]}
            >
              Payment Method
            </Text>

            {/* Only Wallet Payment Option */}
            <RadioItem
              label="Wallet / Salon Credits"
              selected={method === 'wallet'}
              onPress={handleRadioPress}
              primary={COLORS.primary}
              theme={theme}
            />

            {/* Total Amount */}
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
                Total Payable:
              </Text>
              <Text style={[styles.totalValue, { color: theme.textPrimary }]}>
                ₹ {totalPrice.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Balance Comparison */}
            <View style={styles.balanceComparison}>
              <View style={styles.comparisonRow}>
                <Text
                  style={[
                    styles.comparisonLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Wallet Balance:
                </Text>
                <Text
                  style={[styles.comparisonValue, { color: theme.textPrimary }]}
                >
                  ₹{walletBalance.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.comparisonRow}>
                <Text
                  style={[
                    styles.comparisonLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Booking Total:
                </Text>
                <Text
                  style={[styles.comparisonValue, { color: theme.textPrimary }]}
                >
                  ₹{totalPrice.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer Book Button */}
      {serviceList.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          {hasSufficientBalance ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.payBtn,
                {
                  backgroundColor: COLORS.primary,
                  opacity: processingPayment ? 0.7 : 1,
                },
              ]}
              onPress={handleBooking}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>
                  Confirm Booking - ₹{totalPrice.toLocaleString('en-IN')}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.insufficientBalanceFooter}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.confirmBtn, { backgroundColor: '#CCCCCC' }]}
                disabled={true}
              >
                <Text style={[styles.confirmBtnText, { color: '#666' }]}>
                  Insufficient Balance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.addFundsBtn}
                onPress={navigateToAddFunds}
              >
                <Image
                  source={require('../../../../assets/wallet.png')}
                  style={styles.addFundsIcon}
                />
                <Text style={styles.addFundsBtnText}>
                  Add ₹{(totalPrice - walletBalance).toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Success Popup */}
      {SuccessPopup}

      {/* Error Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        title={popupTitle}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

function RadioItem({ label, selected, onPress, primary, theme }) {
  console.log(
    `🔘 RadioItem - ${label}: ${selected ? 'selected' : 'not selected'}`,
  );
  return (
    <TouchableOpacity
      style={styles.radioRow}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.radioOuter,
          selected && { borderColor: primary, backgroundColor: '#FFF5E0' },
        ]}
      >
        {selected && (
          <View style={[styles.radioDot, { backgroundColor: primary }]} />
        )}
      </View>
      <Text style={[styles.radioText, { color: theme.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0 },
  contentContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  },

  // NEW: Loading styles
  loadingScroll: {
    flex: 1,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('20%'),
  },

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
  // New styles for chair number row
  chairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.3%'),
  },
  chairLabel: {
    fontSize: wp('3.4%'),
    marginRight: wp('1%'),
    fontWeight: '500',
  },
  chairValue: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    color: COLORS.primary,
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('0.3%'),
  },
  detailText: { fontSize: wp('3.2%') },
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
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
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
    justifyContent: 'center',
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
  // Wallet Card Styles
  walletCard: {
    backgroundColor: COLORS.primary,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  walletIcon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: '#fff',
    marginRight: wp('3%'),
  },
  walletTitle: {
    fontSize: wp('4.5%'),
    color: '#fff',
    fontWeight: '700',
  },
  walletLoader: {
    marginVertical: hp('2%'),
  },
  walletBalanceLabel: {
    color: '#fff',
    fontSize: wp('3.8%'),
    opacity: 0.9,
    marginTop: hp('1%'),
  },
  walletBalanceAmount: {
    color: '#fff',
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  balanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
  },
  statusIndicator: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('2%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  // 🔥 Required Amount Container (inside wallet card)
  requiredAmountContainer: {
    marginTop: hp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requiredAmountText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    flex: 1,
  },
  addFundsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  addFundsButtonText: {
    color: COLORS.primary,
    fontSize: wp('3.8%'),
    fontWeight: '700',
  },
  // Balance Comparison Styles
  balanceComparison: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginTop: hp('2%'),
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  comparisonLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  comparisonValue: {
    fontSize: wp('4%'),
    fontWeight: '700',
  },
  // 🔥 Insufficient Balance Footer Styles
  insufficientBalanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  confirmBtnText: {
    fontSize: wp('4%'),
    fontWeight: '700',
  },
  addFundsBtn: {
    flex: 1,
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
  },
  addFundsIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#fff',
    marginRight: wp('2%'),
  },
  addFundsBtnText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
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

export default PackagePayementScreen;
