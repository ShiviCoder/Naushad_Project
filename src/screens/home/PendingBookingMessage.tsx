import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const PendingBookingMessage = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
  };

  const fetchUserId = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        const userInfo = parsed?.user ? parsed.user : parsed;
        return userInfo._id;
      }
      return null;
    } catch (error) {
      console.log("❌ Error fetching user ID:", error);
      return null;
    }
  };

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const user_Id = await fetchUserId();
      
      if (!token || !user_Id) {
        setPendingBookings([]);
        return;
      }

      const apiUrl = `https://naushad.onrender.com/api/appointments/fetch-by-userId/${user_Id}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Filter only pending bookings and sort by latest first
        const pending = data.data
          .filter(item => 
            item.appointmentStatus === "Pending" || 
            item.appointmentStatus === "pending"
          )
          .sort((a, b) => {
            // Sort by createdAt date (newest first)
            const dateA = new Date(a.createdAt || a.updatedAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.updatedAt || b.date || 0);
            return dateB - dateA; // Latest first
          });
        
        setPendingBookings(pending);
      } else {
        setPendingBookings([]);
      }
    } catch (err) {
      console.error('❌ Error fetching pending bookings:', err);
      setPendingBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.primary + '20' }]}>
        <Text style={[styles.message, { color: theme.textPrimary }]}>
          Checking bookings...
        </Text>
      </View>
    );
  }

  if (pendingBookings.length === 0) {
    return null; // Don't show anything if no pending bookings
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: '#FFA50020', borderLeftColor: '#FFA500' }]}
      onPress={() => {
        navigation.navigate('PendingBookingsScreen', { 
          pendingBookings: pendingBookings 
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Icon name="time-outline" size={wp('5%')} color="#FFA500" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Pending Booking</Text>
          <Text style={styles.subtitle}>
            You have {pendingBookings.length} pending booking(s)
          </Text>
          {/* Show latest booking date if available */}
          {pendingBookings.length > 0 && pendingBookings[0].date && (
            <Text style={styles.latestDate}>
              Latest: {formatLatestDate(pendingBookings[0].date)}
            </Text>
          )}
        </View>
        <Icon name="chevron-forward" size={wp('4%')} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

// Helper function to format the latest booking date
const formatLatestDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Format as "15 Dec" or similar short format
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  } catch (error) {
    return '';
  }
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    padding: wp('3%'),
    borderRadius: wp('3%'),
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  title: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('0.3%'),
  },
  subtitle: {
    fontSize: wp('3.2%'),
    color: '#666',
    marginBottom: hp('0.2%'),
  },
  latestDate: {
    fontSize: wp('2.8%'),
    color: '#FFA500',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  message: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
  },
});

export default PendingBookingMessage;