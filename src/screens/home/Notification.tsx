import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  RefreshControl,
  BackHandler,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ✅ Create a separate component for notification item to use hooks properly
const NotificationItem = ({ item, index, theme, onPress, onDelete }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const iconData = getNotificationIcon(item.type);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleDeletePress = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log(`🗑️ Deleting notification with ID: ${item._id}`);
    await onDelete(item._id);
    setIsDeleting(false);
  };

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Animated.View
        style={[
          styles.notificationItem,
          { 
            backgroundColor: theme.card,
            transform: [{ translateX }],
            opacity,
            shadowColor: theme.dark ? '#000' : COLORS.primary,
          },
        ]}
      >
        {/* Icon with colored background */}
        <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
          <Icon name={iconData.icon} size={wp('5.5%')} color={iconData.color} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {item.title || 'Notification'}
            </Text>
            <Text style={[styles.time, { color: theme.textSecondary }]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
          
          <Text style={[styles.message, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.message}
          </Text>

          {/* Status indicator */}
          <View style={styles.statusIndicator}>
            <View style={[styles.dot, { backgroundColor: iconData.color }]} />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              {item.type || 'info'}
            </Text>
          </View>
        </View>

        {/* Delete Icon */}
        <TouchableOpacity 
          style={[
            styles.deleteIconButton, 
            { 
              backgroundColor: isDeleting 
                ? theme.dark ? '#444' : '#e2e8f0' 
                : 'rgba(239, 68, 68, 0.1)',
            }
          ]}
          onPress={handleDeletePress}
          disabled={isDeleting}
        >
          <Icon 
            name={isDeleting ? "hourglass-empty" : "delete"} 
            size={wp('4.5%')} 
            color={isDeleting ? theme.textSecondary : '#ef4444'} 
          />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ✅ Notification Detail Modal Component
const NotificationDetailModal = ({ visible, notification, onClose, theme, onDelete }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(hp('100%')));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: hp('100%'),
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!notification) return null;

  const iconData = getNotificationIcon(notification.type);

  const handleDeleteFromModal = async () => {
    console.log(`🗑️ Deleting notification from modal with ID: ${notification._id}`);
    await onDelete(notification._id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.modalContainer, 
            { 
              backgroundColor: theme.modalBackground || '#ffffff',
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <View style={[styles.modalIconContainer, { backgroundColor: iconData.bg }]}>
                <Icon name={iconData.icon} size={wp('6%')} color={iconData.color} />
              </View>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Notification Details
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.dark ? '#333' : '#f1f5f9' }]}
              onPress={onClose}
            >
              <Icon name="close" size={wp('5%')} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Notification Title */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Title</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {notification.title || 'Notification'}
              </Text>
            </View>

            {/* Notification Message */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Message</Text>
              <Text style={[styles.detailMessage, { color: theme.textPrimary }]}>
                {notification.message}
              </Text>
            </View>

            {/* Notification Type */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Type</Text>
              <View style={styles.typeBadge}>
                <View style={[styles.typeDot, { backgroundColor: iconData.color }]} />
                <Text style={[styles.typeText, { color: theme.textPrimary }]}>
                  {notification.type || 'info'}
                </Text>
              </View>
            </View>

            {/* Timestamp */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formatDetailedTime(notification.createdAt)}
              </Text>
            </View>

            {/* Notification ID */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Notification ID</Text>
              <Text style={[styles.detailId, { color: theme.textSecondary }]}>
                {notification._id}
              </Text>
            </View>

            {/* Additional Information */}
            {(notification.additionalData || notification.data) && (
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Additional Info
                </Text>
                <View style={[styles.additionalInfoBox, { backgroundColor: theme.dark ? '#333' : '#f8fafc' }]}>
                  <Text style={[styles.additionalInfoText, { color: theme.textSecondary }]}>
                    {JSON.stringify(notification.additionalData || notification.data, null, 2)}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={[styles.modalFooter, { borderTopColor: theme.dark ? '#333' : '#e2e8f0' }]}>
            <TouchableOpacity 
              style={[styles.deleteButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
              onPress={handleDeleteFromModal}
            >
              <Icon name="delete" size={wp('4%')} color="#ef4444" style={styles.deleteButtonIcon} />
              <Text style={[styles.deleteButtonText, { color: '#ef4444' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ✅ Helper functions outside the component
const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return { icon: 'check-circle', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    case 'warning':
      return { icon: 'warning', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    case 'error':
      return { icon: 'error', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    case 'info':
      return { icon: 'info', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
    default:
      return { icon: 'notifications', color: COLORS.primary, bg: 'rgba(139, 92, 246, 0.1)' };
  }
};

// ✅ Format time function
const formatTime = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

// ✅ Format detailed time function
const formatDetailedTime = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (minutes < 1) return `Just now • ${formattedDate}`;
  if (minutes < 60) return `${minutes} minutes ago • ${formattedDate}`;
  if (hours < 24) return `${hours} hours ago • ${formattedDate}`;
  if (days < 7) return `${days} days ago • ${formattedDate}`;
  return formattedDate;
};

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible]);

  // ✅ Handle notification press
  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  // ✅ Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  // ✅ Get User ID from AsyncStorage
  const getUserId = async () => {
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
  };

  // ✅ Fetch user notifications
  const getUserNotifications = async () => {
    try {
      console.log('🔄 Starting to fetch notifications...');
      
      const user_Id = await getUserId();
      
      if (!user_Id) {
        console.log('❌ Cannot fetch notifications: No userId available');
        setNotifications([]);
        return;
      }

      console.log('👤 Using userId for API call:', user_Id);

      const url = `https://naushad.onrender.com/api/notification/get-all-notifications-by-userId/${user_Id}`;
      console.log('🔗 API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📩 Full API Response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Notifications fetched successfully');
        console.log('📋 Number of notifications:', data.data?.length || 0);
        setNotifications(data.data || []);
      } else {
        console.log('❌ API returned success: false');
        setNotifications([]);
      }
    } catch (error) {
      console.log('❌ Error fetching notifications:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        stack: error.stack
      });
      setNotifications([]);
    }
  };

  // ✅ Delete individual notification
  const deleteNotification = async (notificationId) => {
    try {
      console.log(`🗑️ Starting to delete notification with ID: ${notificationId}`);
      
      if (!notificationId) {
        console.log('❌ Cannot delete: No notification ID provided');
        return false;
      }

      const url = `https://naushad.onrender.com/api/notification/delete-notification-by-notificationId/${notificationId}`;
      console.log('🔗 Delete API URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📩 Delete API Response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Notification deleted successfully');
        
        // Remove the deleted notification from the local state
        setNotifications(prevNotifications => 
          prevNotifications.filter(notification => notification._id !== notificationId)
        );
        
        console.log('🔄 Notifications list updated after deletion');
        return true;
      } else {
        console.log('❌ Delete API returned success: false');
        return false;
      }
    } catch (error) {
      console.log('❌ Error deleting notification:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        stack: error.stack
      });
      return false;
    }
  };

  // ✅ Delete all notifications with animation
  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Delete all notifications one by one
    notifications.forEach(notification => {
      deleteNotification(notification._id);
    });
  };

  // ✅ Pull-to-refresh animation
  const onRefresh = async () => {
    setRefreshing(true);

    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await getUserNotifications();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  useEffect(() => {
    console.log('🚀 NotificationsScreen mounted, fetching notifications...');
    getUserNotifications();
  }, []);

  // ✅ Render each notification using the separate component
  const renderNotificationItem = ({ item, index }) => (
    <NotificationItem 
      item={item} 
      index={index} 
      theme={theme} 
      onPress={handleNotificationPress}
      onDelete={deleteNotification}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <Animated.ScrollView
        style={{ transform: [{ translateY }] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={theme.card}
          />
        }
      >
        {/* Header */}
        <Head
          title="Notifications"
          rightComponent={
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {/* <TouchableOpacity 
                onPress={handleDeleteAll} 
                style={[
                  styles.deleteButton, 
                  { 
                    backgroundColor: notifications.length === 0 
                      ? theme.dark ? '#333' : '#e2e8f0' 
                      : 'rgba(239, 68, 68, 0.1)',
                  }
                ]}
                disabled={notifications.length === 0}
              >
                <Icon 
                  name="delete-sweep" 
                  size={wp('5.5%')} 
                  color={notifications.length === 0 
                    ? theme.textSecondary 
                    : '#ef4444'
                  } 
                />
              </TouchableOpacity> */}
            </Animated.View>
          }
        />

        {/* Stats Bar */}
        {notifications.length > 0 && (
          <View style={[styles.statsBar, { backgroundColor: theme.card }]}>
            <Text style={[styles.statsText, { color: theme.textSecondary }]}>
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </Text>
            <View style={[styles.statsDivider, { backgroundColor: theme.textSecondary }]} />
            <Text style={[styles.statsText, { color: COLORS.primary }]}>
              All caught up! 🎉
            </Text>
          </View>
        )}

        {/* Notification List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={renderNotificationItem}
          style={[styles.list, { backgroundColor: theme.background }]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Animated.View 
                style={[
                  styles.emptyIcon,
                  { 
                    backgroundColor: theme.dark ? '#333' : '#f1f5f9',
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <Icon name="notifications-off" size={wp('15%')} color={theme.textSecondary} />
              </Animated.View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No notifications yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                We'll notify you when something new arrives
              </Text>
              {/* <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: COLORS.primary }]}
                onPress={getUserNotifications}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
                <Icon name="refresh" size={wp('4%')} color="#fff" style={styles.refreshIcon} />
              </TouchableOpacity> */}
            </View>
          }
        />
      </Animated.ScrollView>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        visible={modalVisible}
        notification={selectedNotification}
        onClose={handleCloseModal}
        theme={theme}
        onDelete={deleteNotification}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deleteButton: {
    padding: wp('3%'),
    borderRadius: wp('3%'),
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('3%'),
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
  },
  statsText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
  statsDivider: {
    width: 1,
    height: hp('2%'),
    marginHorizontal: wp('3%'),
    opacity: 0.3,
  },
  list: {
    flex: 1,
    paddingHorizontal: wp('2%'),
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2.5%'),
    marginHorizontal: wp('3%'),
    marginBottom: hp('1.5%'),
    alignItems: 'center',
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('0.8%'),
  },
  title: {
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    flex: 1,
    marginRight: wp('2%'),
  },
  message: {
    fontSize: wp('3.6%'),
    lineHeight: hp('2.4%'),
    marginBottom: hp('1.2%'),
    fontFamily: 'Poppins-Regular',
  },
  time: {
    fontSize: wp('2.8%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.75%'),
    marginRight: wp('1.5%'),
  },
  statusText: {
    fontSize: wp('2.6%'),
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  deleteIconButton: {
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
    marginLeft: wp('2%'),
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp('10%'),
    paddingHorizontal: wp('10%'),
  },
  emptyIcon: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: wp('4.8%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: hp('2.8%'),
    marginBottom: hp('4%'),
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('4%')
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    marginRight: wp('2%'),
  },
  refreshIcon: {
    marginLeft: wp('1%'),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  modalContainer: {
    width: '100%',
    maxHeight: hp('80%'),
    borderRadius: wp('6%'),
    overflow: 'hidden',
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
  },
  modalContent: {
    padding: wp('5%'),
    maxHeight: hp('60%'),
  },
  detailSection: {
    marginBottom: hp('3%'),
  },
  detailLabel: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    marginBottom: hp('1%'),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginBottom: hp('0.5%'),
  },
  detailMessage: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    lineHeight: hp('2.8%'),
  },
  detailId: {
    fontSize: wp('2.8%'),
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  typeDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('2%'),
  },
  typeText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  additionalInfoBox: {
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
  },
  additionalInfoText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Regular',
    lineHeight: hp('2.4%'),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('4%'),
    flex: 1,
    marginRight: wp('2%'),
    justifyContent: 'center',
  },
  deleteButtonIcon: {
    marginRight: wp('2%'),
  },
  deleteButtonText: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  actionButton: {
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    flex: 1,
    marginLeft: wp('2%'),
  },
  actionButtonText: {
    color: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
});