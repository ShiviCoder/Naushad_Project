import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioButton from '../../components/RadioButton';
import BookingAcceptCards from '../../components/BookingAcceptCard';
import BookingPendingCard from '../../components/BookingPendingCard';
import PreviousBookingCard from '../../components/PreviousBookingCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Head from '../../components/Head';

const filters = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "accept" },
  { label: "Pending", value: "pending" },
]

const BookingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from AsyncStorage
  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('👤 Fetched User ID from Storage:', storedUserId);
      setUserId(storedUserId);
      return storedUserId;
    } catch (err) {
      console.error('❌ Error fetching user ID:', err);
      return null;
    }
  };

  // Fetch bookings from API with user ID
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      const user_Id = await fetchUserId();
      
      console.log('🔑 Fetched Token:', token);
      console.log('👤 Fetched User ID:', user_Id);
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      if (!user_Id) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // API call with user ID as parameter
      const apiUrl = `https://naushad.onrender.com/api/appointments/fetch-by-userId/${user_Id}`;
      console.log('📡 API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Response Status:', response.status);

      const data = await response.json();
      console.log('📦 API Response Data:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  // Process and categorize bookings
  const processBookings = () => {
    const accepted = [];
    const pending = [];
    const previous = [];

    bookings.forEach(item => {
      // Format services array properly
      let services = [];
      try {
        if (Array.isArray(item.services)) {
          services = item.services.map(service => {
            if (typeof service === 'string' && service.startsWith('[')) {
              return JSON.parse(service.replace(/'/g, '"')).join(', ');
            }
            return service;
          });
        }
      } catch (err) {
        console.log('Error parsing services:', err);
        services = item.services || [];
      }

      const bookingItem = {
        id: item._id,
        service: services.join(', ') || 'No services',
        date: item.date,
        time: item.time,
        price: 0, // You might want to add price to your API response
        appointmentStatus: item.appointmentStatus,
        email: item.email,
        appointmentCode: item.appointmentCode,
        fromDateTime: item.fromDateTime,
        toDateTime: item.toDateTime,
        image: getImagesForService(services[0]) // Get appropriate images based on service
      };

      // Categorize based on status
      if (item.appointmentStatus === "Accepted") {
        accepted.push({ ...bookingItem, type: "accept" });
      } else if (item.appointmentStatus === "Pending") {
        pending.push({ ...bookingItem, type: "pending" });
      } else {
        previous.push({ ...bookingItem, type: "previous" });
      }
    });

    return { accepted, pending, previous };
  };

  // Helper function to get appropriate images based on service type
  const getImagesForService = (service) => {
    const defaultIcons = [
      require('../../assets/hairCut.png'),
      require('../../assets/calender.png'),
      require('../../assets/stopwatch-removebg-preview.png'),
      require('../../assets/moneyBag2.png'),
      require('../../assets/pending.png')
    ];

    const facialIcons = [
      require('../../assets/facial.png'),
      require('../../assets/calender.png'),
      require('../../assets/stopwatch-removebg-preview.png'),
      require('../../assets/moneyBag2.png'),
      require('../../assets/pending.png')
    ];

    const starIcons = [
      require('../../assets/hairCut.png'),
      require('../../assets/calender.png'),
      require('../../assets/stopwatch-removebg-preview.png'),
      require('../../assets/moneyBag2.png'),
      require('../../assets/star.png')
    ];

    if (service && service.toLowerCase().includes('facial')) {
      return facialIcons;
    }
    
    return defaultIcons;
  };

  const { accepted, pending, previous } = processBookings();

  // Combine all bookings for display
  const allBookings = [
    ...accepted,
    ...pending,
    ...previous
  ];

  const filteredBookings = allBookings.filter(item => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "accept") return item.type === 'accept';
    if (selectedFilter === "pending") return item.type === "pending";
    return false;
  });

  const renderBookingItem = ({ item, index }) => {
    if (item.type === "previous" && selectedFilter === "all") {
      const isFirstPrevious = index === 0 || filteredBookings[index - 1].type !== "previous";
      return (
        <View>
          {isFirstPrevious && (
            <Text style={[styles.heading, { color: theme.textPrimary }]}>
              Previous Bookings
            </Text>
          )}
          <PreviousBookingCard item={item} />
        </View>
      );
    } else if (item.type === "accept") {
      return <BookingAcceptCards item={item} />;
    } else if (item.type === "pending") {
      return <BookingPendingCard item={item} />;
    } else {
      return null;
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.textPrimary }]}>
            Loading bookings...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textPrimary }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={fetchBookings}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    let message = '';
    switch (selectedFilter) {
      case 'all':
        message = 'No bookings found';
        break;
      case 'accept':
        message = 'No accepted bookings';
        break;
      case 'pending':
        message = 'No pending bookings';
        break;
      default:
        message = 'No bookings available';
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textPrimary }]}>
          {message}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <Head title='Bookings' showBack={false} />
      
      {/* RadioButton component */}
      <RadioButton
        type='status'
        selected={selectedFilter}
        onSelect={value => {
          console.log('Selected Value ', value);
          setSelectedFilter(value);
        }}
      />

      {filteredBookings.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredBookings}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp("15%") }}
          keyExtractor={(item, index) => item.id + "-" + index}
          renderItem={renderBookingItem}
          ListEmptyComponent={renderEmptyState}
          refreshing={loading}
          onRefresh={fetchBookings}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    justifyContent: "center",
  },
  headText: {
    fontSize: wp("5%"),
    fontWeight: 'bold',
  },
  container: {
    paddingTop: hp("2%"),
  },
  heading: {
    fontSize: wp("6%"),
    fontWeight: "500",
    marginVertical: hp("1.5%"),
    marginLeft: wp("4%"),
    fontFamily: 'Poppins-Medium'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
    marginTop: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  retryButton: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  retryText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
});

export default BookingScreen;