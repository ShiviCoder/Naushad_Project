import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Head from '../../components/Head';
import COLORS from '../../utils/Colors';

const PendingBookingsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get initial data from navigation params if available
  useEffect(() => {
    if (route.params?.pendingBookings) {
      // Sort the received bookings by latest first
      const sortedBookings = sortBookingsByLatest(route.params.pendingBookings);
      setPendingBookings(sortedBookings);
      setLoading(false);
    } else {
      fetchPendingBookings();
    }
    fetchUserData();
  }, []);

  const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
  };

  const fetchUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        const userInfo = parsed?.user ? parsed.user : parsed;
        setUser(userInfo);
      }
    } catch (error) {
      console.log("❌ Error loading user data:", error);
    }
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

  // Function to sort bookings by latest first
  const sortBookingsByLatest = (bookings) => {
    return bookings.sort((a, b) => {
      // Prioritize by date fields: createdAt -> updatedAt -> date
      const dateA = new Date(a.createdAt || a.updatedAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || b.date || 0);
      return dateB - dateA; // Latest first
    });
  };

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const user_Id = await fetchUserId();
      
      if (!token || !user_Id) {
        setPendingBookings([]);
        setLoading(false);
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
        const pending = data.data.filter(item => 
          item.appointmentStatus === "Pending" || 
          item.appointmentStatus === "pending"
        );
        
        const sortedBookings = sortBookingsByLatest(pending);
        setPendingBookings(sortedBookings);
      } else {
        setPendingBookings([]);
      }
    } catch (err) {
      console.error('❌ Error fetching pending bookings:', err);
      setPendingBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingBookings();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  // Helper function to show how recent the booking is
  const getBookingRecency = (booking) => {
    try {
      const bookingDate = new Date(booking.createdAt || booking.updatedAt || booking.date || 0);
      const now = new Date();
      const diffTime = Math.abs(now - bookingDate);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return formatDate(booking.createdAt || booking.date);
      }
    } catch (error) {
      return '';
    }
  };

  const getServiceIcon = (serviceType) => {
    if (!serviceType) return 'cut-outline';
    
    const service = String(serviceType).toLowerCase();
    
    if (service.includes('hair') || service.includes('cut') || service.includes('style')) {
      return 'cut-outline';
    } else if (service.includes('facial') || service.includes('skin') || service.includes('beauty')) {
      return 'sparkles-outline';
    } else if (service.includes('massage') || service.includes('spa') || service.includes('relax')) {
      return 'hand-left-outline';
    } else if (service.includes('nail') || service.includes('mani') || service.includes('pedi')) {
      return 'finger-print-outline';
    } else if (service.includes('wax') || service.includes('hair removal')) {
      return 'flame-outline';
    } else if (service.includes('makeup') || service.includes('cosmetic')) {
      return 'color-palette-outline';
    } else if (service.includes('package') || service.includes('combo')) {
      return 'gift-outline';
    } else if (service.includes('home') || service.includes('visit')) {
      return 'home-outline';
    }
    
    return 'cut-outline'; // default icon
  };

  const getServiceIconColor = (serviceType) => {
    if (!serviceType) return COLORS.primary;
    
    const service = String(serviceType).toLowerCase();
    
    if (service.includes('hair')) return '#8B4513';
    if (service.includes('facial')) return '#FF69B4';
    if (service.includes('massage')) return '#32CD32';
    if (service.includes('nail')) return '#FF6347';
    if (service.includes('wax')) return '#FFA500';
    if (service.includes('makeup')) return '#9370DB';
    if (service.includes('package')) return '#20B2AA';
    if (service.includes('home')) return '#4682B4';
    
    return COLORS.primary;
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const renderDetailItem = (icon, label, value, color = theme.textPrimary) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIconContainer}>
        <Icon name={icon} size={wp('4.5%')} color={COLORS.primary} />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color }]} numberOfLines={2}>
          {value || 'Not specified'}
        </Text>
      </View>
    </View>
  );

  const renderBookingItem = ({ item, index }) => {
    const serviceIcon = getServiceIcon(item.services?.[0]);
    const iconColor = getServiceIconColor(item.services?.[0]);
    const servicesText = Array.isArray(item.services) ? item.services.join(', ') : 'Service';
    const recencyText = getBookingRecency(item);

    return (
      <View style={[styles.bookingCard, { backgroundColor: theme.background }]}>
        {/* Header with status and booking code */}
        <View style={styles.cardHeader}>
          <View style={styles.statusRecencyContainer}>
            <View style={[styles.statusBadge, { backgroundColor: '#FFA500' }]}>
              <Icon name="time-outline" size={wp('3%')} color="#fff" style={styles.statusIcon} />
              <Text style={styles.statusText}>PENDING</Text>
            </View>
            {recencyText && (
              <Text style={[styles.recencyText, { color: theme.textSecondary }]}>
                {recencyText}
              </Text>
            )}
          </View>
          <Text style={[styles.bookingCode, { color: theme.textPrimary }]}>
            #{item.appointmentCode || `BOOK-${index + 1}`}
          </Text>
        </View>

        {/* Service Information */}
        <View style={styles.serviceInfo}>
          <View style={[styles.serviceIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Icon name={serviceIcon} size={wp('6%')} color={iconColor} />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={[styles.serviceName, { color: theme.textPrimary }]} numberOfLines={2}>
              {servicesText}
            </Text>
            <Text style={[styles.serviceType, { color: theme.textSecondary }]}>
              {item.serviceType || 'Salon Service'}
            </Text>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.timeInfo}>
          <View style={styles.timeItem}>
            <Icon name="calendar-outline" size={wp('4%')} color="#666" />
            <Text style={[styles.timeText, { color: theme.textPrimary }]}>
              {formatDate(item.date || item.fromDateTime)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Icon name="time-outline" size={wp('4%')} color="#666" />
            <Text style={[styles.timeText, { color: theme.textPrimary }]}>
              {formatTime(item.time)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.detailsBtn]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="information-circle-outline" size={wp('4%')} color="#fff" style={styles.btnIcon} />
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
        <Icon name="checkmark-done-outline" size={wp('15%')} color={COLORS.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        No Pending Bookings
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {user?.firstName ? `Hi ${user.firstName}! ` : ''}You don't have any pending bookings at the moment.
      </Text>
      <TouchableOpacity 
        style={[styles.bookNowBtn, { backgroundColor: COLORS.primary }]}
        onPress={() => navigation.navigate('Services')}
      >
        <Icon name="calendar-outline" size={wp('4%')} color="#fff" style={styles.bookNowIcon} />
        <Text style={styles.bookNowText}>Book New Service</Text>
      </TouchableOpacity>
    </View>
  );

  const BookingDetailsModal = () => {
    if (!selectedBooking) return null;

    const servicesText = Array.isArray(selectedBooking.services) ? selectedBooking.services.join(', ') : 'Not specified';
    const serviceIcon = getServiceIcon(selectedBooking.services?.[0]);
    const iconColor = getServiceIconColor(selectedBooking.services?.[0]);
    const recencyText = getBookingRecency(selectedBooking);

    return (
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Booking Details
              </Text>
              <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
                <Icon name="close" size={wp('6%')} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Status and Recency */}
              <View style={styles.modalStatusContainer}>
                <View style={[styles.modalStatusBadge, { backgroundColor: '#FFA500' }]}>
                  <Icon name="time-outline" size={wp('4%')} color="#fff" />
                  <Text style={styles.modalStatusText}>PENDING APPROVAL</Text>
                </View>
                {recencyText && (
                  <Text style={[styles.modalRecencyText, { color: theme.textSecondary }]}>
                    Booked {recencyText}
                  </Text>
                )}
              </View>

              {/* Service Information */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Icon name="business-outline" size={wp('4.5%')} color={COLORS.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Service Details
                  </Text>
                </View>
                <View style={styles.serviceDetailContainer}>
                  <View style={[styles.serviceIconLarge, { backgroundColor: `${iconColor}20` }]}>
                    <Icon name={serviceIcon} size={wp('8%')} color={iconColor} />
                  </View>
                  <View style={styles.serviceInfoLarge}>
                    <Text style={[styles.serviceNameLarge, { color: theme.textPrimary }]}>
                      {servicesText}
                    </Text>
                    <Text style={[styles.serviceTypeLarge, { color: theme.textSecondary }]}>
                      {selectedBooking.serviceType || 'Salon Service'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Date & Time */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Icon name="time-outline" size={wp('4.5%')} color={COLORS.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Date & Time
                  </Text>
                </View>
                {renderDetailItem('calendar-outline', 'Appointment Date', formatDate(selectedBooking.date || selectedBooking.fromDateTime))}
                {renderDetailItem('time-outline', 'Appointment Time', formatTime(selectedBooking.time))}
                {selectedBooking.duration && renderDetailItem('hourglass-outline', 'Duration', selectedBooking.duration)}
              </View>

              {/* Booking Information */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Icon name="document-text-outline" size={wp('4.5%')} color={COLORS.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Booking Information
                  </Text>
                </View>
                {renderDetailItem('barcode-outline', 'Booking Code', selectedBooking.appointmentCode)}
                {renderDetailItem('person-outline', 'Customer Email', selectedBooking.email)}
                {selectedBooking.chairNo && renderDetailItem('business-outline', 'Chair Number', selectedBooking.chairNo)}
                {selectedBooking.createdAt && renderDetailItem('calendar-clear-outline', 'Booking Created', formatDate(selectedBooking.createdAt))}
              </View>

              {/* Additional Information */}
              {(selectedBooking.staff || selectedBooking.notes) && (
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <Icon name="ellipsis-horizontal-outline" size={wp('4.5%')} color={COLORS.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      Additional Information
                    </Text>
                  </View>
                  {selectedBooking.staff && renderDetailItem('people-outline', 'Assigned Staff', selectedBooking.staff)}
                  {selectedBooking.notes && renderDetailItem('document-outline', 'Special Notes', selectedBooking.notes)}
                </View>
              )}

              {/* Status Information */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Icon name="information-circle-outline" size={wp('4.5%')} color={COLORS.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Status Information
                  </Text>
                </View>
                <View style={[styles.statusInfo, { backgroundColor: `${COLORS.primary}10` }]}>
                  <Icon name="information-circle" size={wp('5%')} color={COLORS.primary} />
                  <Text style={[styles.statusInfoText, { color: theme.textPrimary }]}>
                    Your booking is currently pending approval from the salon. You will be notified once it's confirmed.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
                onPress={closeDetailsModal}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Pending Bookings" showBack={true} />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
            Loading pending bookings...
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id || String(Math.random())}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            pendingBookings.length === 0 && { flex: 1 }
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            pendingBookings.length > 0 ? (
              <View style={styles.headerInfo}>
                <View style={styles.headerTitleRow}>
                  <Icon name="time-outline" size={wp('5%')} color={COLORS.primary} />
                  <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                    Pending Bookings ({pendingBookings.length})
                  </Text>
                </View>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                  Showing latest bookings first
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  headerInfo: {
    marginBottom: hp('3%'),
    paddingHorizontal: wp('1%'),
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    marginLeft: wp('2%'),
  },
  headerSubtitle: {
    fontSize: wp('3.8%'),
    lineHeight: hp('2.5%'),
    fontStyle: 'italic',
  },
  bookingCard: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
  },
  statusRecencyContainer: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  statusIcon: {
    marginRight: wp('1%'),
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('3%'),
  },
  recencyText: {
    fontSize: wp('2.8%'),
    fontStyle: 'italic',
  },
  bookingCode: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  serviceIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  serviceType: {
    fontSize: wp('3.2%'),
  },
  timeInfo: {
    marginBottom: hp('1.5%'),
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  timeText: {
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    minWidth: wp('35%'),
  },
  detailsBtn: {
    backgroundColor: COLORS.primary,
  },
  btnIcon: {
    marginRight: wp('1.5%'),
  },
  detailsBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('3.5%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
    marginTop: hp('5%'),
  },
  emptyIconContainer: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
    marginBottom: hp('4%'),
    lineHeight: hp('3%'),
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('5%'),
  },
  bookNowIcon: {
    marginRight: wp('2%'),
  },
  bookNowText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('4%'),
  },
  modalContainer: {
    width: '100%',
    maxHeight: hp('85%'),
    borderRadius: wp('5%'),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  closeButton: {
    padding: wp('1%'),
  },
  modalContent: {
    maxHeight: hp('65%'),
    padding: wp('4%'),
  },
  modalStatusContainer: {
    marginBottom: hp('3%'),
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  modalStatusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('3.2%'),
    marginLeft: wp('1.5%'),
  },
  modalRecencyText: {
    fontSize: wp('3.2%'),
    fontStyle: 'italic',
  },
  modalSection: {
    marginBottom: hp('3%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  serviceDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
  },
  serviceIconLarge: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  serviceInfoLarge: {
    flex: 1,
  },
  serviceNameLarge: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  serviceTypeLarge: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
    padding: wp('3%'),
    backgroundColor: '#F8F9FA',
    borderRadius: wp('3%'),
  },
  detailIconContainer: {
    marginRight: wp('3%'),
    marginTop: wp('0.5%'),
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: wp('3.2%'),
    color: '#666',
    marginBottom: hp('0.5%'),
    fontWeight: '500',
  },
  detailValue: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    lineHeight: hp('2.5%'),
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp('3%'),
    borderRadius: wp('3%'),
  },
  statusInfoText: {
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
    flex: 1,
    lineHeight: hp('2.5%'),
  },
  modalFooter: {
    padding: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  modalButton: {
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default PendingBookingsScreen;