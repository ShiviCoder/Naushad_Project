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
const NotificationItem = ({ item, index, theme }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const iconData = getNotificationIcon(item.type);

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

  return (
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
        
        <Text style={[styles.message, { color: theme.textSecondary }]}>
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

      {/* Action button */}
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: theme.dark ? '#333' : '#f1f5f9' }]}
      >
        <Icon name="chevron-right" size={wp('4.5%')} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
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

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

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

    setNotifications([]);
  };

  // ✅ Pull-to-refresh animation
  const onRefresh = async () => {
    setRefreshing(true);

    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    await getUserData();
    setRefreshing(false);
  };

  // ✅ Fetch user notifications
  const getUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (!stored) {
        console.log('⚠️ No user data found');
        return null;
      }
      const parsed = JSON.parse(stored);
      console.log('✅ User fetched:', parsed);

      const userId = parsed?._id;
      console.log('✅ User ID:', userId);

      const url = `https://naushad.onrender.com/api/notification/get-all-notifications-by-userId/${userId}`;
      console.log('🔗 Fetching URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      console.log('📩 Notifications fetched:', data);

      setNotifications(data.data || []);
    } catch (error) {
      console.log('❌ Error getting user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // ✅ Render each notification using the separate component
  const renderNotificationItem = ({ item, index }) => (
    <NotificationItem item={item} index={index} theme={theme} />
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
              <TouchableOpacity 
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
              </TouchableOpacity>
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
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: COLORS.primary }]}
                onPress={getUserData}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
                <Icon name="refresh" size={wp('4%')} color="#fff" style={styles.refreshIcon} />
              </TouchableOpacity>
            </View>
          }
        />
      </Animated.ScrollView>
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
  actionButton: {
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
    marginLeft: wp('2%'),
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
});