import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Head from "../../components/Head";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookingAccepted() {
  const { theme } = useTheme();
  const route = useRoute();
  
  // Get booking data from navigation params
  const { 
    booking, 
    serviceName = "Premium Haircut", 
    date = "15 Aug 2025", 
    time = "10:00 AM", 
    price = "500",
    appointmentCode = "N/A",
    status = "accepted"
  } = route.params || {};

  // State for user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('📋 BookingAccepted - Route Params:', route.params);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching user profile for BookingAccepted...');
        
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token) {
          console.log('❌ No token found');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('🔑 Token found, making API request...');
        
        const response = await fetch('https://naushad.onrender.com/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log('✅ User profile response:', json);

        if (json.user || json.data) {
          const user = json.user || json.data || json;
          console.log('👤 User data extracted:', user);
          setUserData(user);
        } else {
          console.log('⚠️ No user data found in response');
          setUserData({});
        }
        
      } catch (error) {
        console.log('❌ Error fetching user profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Format user name
  const getUserName = () => {
    if (!userData) return "Loading...";
    
    return userData.fullName || 
           userData.name || 
           userData.username || 
           `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
           'User';
  };

  // Format phone number
  const getUserPhone = () => {
    if (!userData) return "Loading...";
    
    const phone = userData.phone || userData.phoneNumber || userData.mobile;
    
    if (phone === null || phone === undefined || phone === 'null') {
      return 'Phone not provided';
    }
    
    return phone;
  };

  // Get actual phone number for calling/messaging
  const getContactPhone = () => {
    if (!userData) return "+919876543210"; // Fallback number
    
    const phone = userData.phone || userData.phoneNumber || userData.mobile;
    
    if (phone && phone !== 'null' && phone !== 'Phone not provided') {
      // Format phone number for calling
      return phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    }
    
    return "+919876543210"; // Fallback number
  };

  // Format address
  const getUserAddress = () => {
    if (!userData) return "Loading...";
    
    if (userData.address) {
      if (typeof userData.address === 'object') {
        return userData.address.fullAddress || 
               `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''}`.trim() ||
               'Address not available';
      }
      return userData.address;
    }
    
    return userData.location || 'Address not available';
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (!userData) return require("../../assets/images/bookUser.png");
    
    const avatar = userData.avatar || userData.image || userData.profilePicture;
    
    if (avatar && avatar !== 'null' && avatar !== '') {
      return { uri: avatar };
    }
    
    return require("../../assets/images/bookUser.png");
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      if (!dateString) return "15 Aug 2025";
      
      if (dateString.includes(' ')) return dateString;
      
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString || "15 Aug 2025";
    }
  };

  // Format time for display
  const formatDisplayTime = (timeString) => {
    try {
      if (!timeString) return "10:00 AM";
      
      if (timeString.includes('AM') || timeString.includes('PM')) return timeString;
      
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString || "10:00 AM";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'accepted':
      case 'confirmed': return COLORS.primary;
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#D33333';
      default: return COLORS.primary;
    }
  };

  // Format price
  const formatPrice = (priceValue) => {
    if (!priceValue && priceValue !== 0) return "500";
    
    const numericPrice = Number(priceValue);
    return isNaN(numericPrice) ? String(priceValue) : numericPrice.toString();
  };

  // Phone call functionality
  const dialCall = (num) => {
    const url = `tel:${num}`;
    Linking.openURL(url).catch(() => { });
  };

  // WhatsApp functionality
  const openWhatsApp = async (num, text) => {
    const encoded = encodeURIComponent(text);
    const waScheme = `whatsapp://send?phone=${num}&text=${encoded}`;
    try {
      const supported = await Linking.canOpenURL(waScheme);
      if (supported) {
        await Linking.openURL(waScheme);
        return;
      }
    } catch { }
    const digits = num.replace(/[^\d]/g, "");
    const waMe = `https://wa.me/${digits}?text=${encoded}`;
    Linking.openURL(waMe).catch(() => { });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
        <Head title="Booking Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Head title="Booking Details" />

      <ScrollView style={styles.container}>
        {/* Status Section */}
        <View style={[styles.statusCard, { backgroundColor: theme.background }]}>
          <Text style={[styles.statusText, { color: theme.textPrimary }]}>
            {serviceName}
          </Text>

          <View style={styles.dateRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp('1%') }}>
              <Icon name="calendar-outline" size={hp("3%")} color={theme.textPrimary} />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                {formatDisplayDate(date)}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp('1%') }}>
              <Icon name="time-outline" size={hp("3%")} color={theme.textPrimary} />
              <Text style={[styles.dateText, { color: theme.textPrimary, marginLeft: wp('2%') }]}>
                {formatDisplayTime(time)}
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                { backgroundColor: getStatusColor(status) }
              ]}
            >
              <Text style={[styles.actionText]}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Accepted'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.desc, { color: theme.textPrimary }]}>
            Professional service with quality care included.
          </Text>
        </View>

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: theme.background }]}>
          <Image
            source={getUserAvatar()}
            style={styles.userImg}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>
              {getUserName()}
            </Text>
            <Text style={[styles.userPhone, { color: theme.textPrimary }]}>
              {getUserPhone()}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Icon name="location" size={hp("2.6%")} color={theme.textPrimary} />
          <Text style={[styles.locationText, { color: theme.textPrimary }]}>
            {getUserAddress()}
          </Text>
        </View>

        {/* Actions - Call and Message */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => dialCall(getContactPhone())}
          >
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.primary, flex: 1, marginLeft: wp("4%") }]}
            onPress={() => openWhatsApp(getContactPhone(), `Hello ${getUserName()}, regarding your ${serviceName} appointment`)}
          >
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: wp("4%"),
    paddingBottom: hp('5%')
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    fontWeight: '500',
  },

  // Status Card
  statusCard: {
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statusText: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp('1%'),
  },
  price: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
  },
  desc: {
    fontSize: wp("4.5%"),
    marginTop: hp("1%"),
    lineHeight: hp('2.8%'),
  },
  appointmentCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  appointmentCode: {
    fontSize: wp("4%"),
    marginLeft: wp("2%"),
    fontWeight: "500",
  },

  // Date Row
  dateRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: hp("1%"),
  },
  dateText: {
    marginLeft: wp("2%"),
    fontSize: wp("4%"),
    fontWeight: '500',
  },

  // User Card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  userImg: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("7%"),
    marginRight: wp("4%"),
  },
  userInfo: {
    flex: 1,
  },
  userName: { 
    fontSize: wp("4.5%"), 
    fontWeight: "600",
    marginBottom: hp('0.5%'),
  },
  userPhone: { 
    fontSize: wp("4.2%"), 
    fontWeight: "500",
  },

  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("3%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  locationText: { 
    fontSize: wp("4.2%"), 
    marginLeft: wp("3%"),
    flex: 1,
    lineHeight: hp('2.5%'),
  },

  // Action Buttons
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("4%"),
    marginBottom: hp("5%"),
    gap: wp("2%"),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: hp("1.2%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("6%"),
  },
  actionText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});