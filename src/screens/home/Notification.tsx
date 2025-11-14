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

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ✅ Delete all notifications
  const handleDeleteAll = () => {
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

      const userId = parsed?.user?._id;
      console.log('✅ User ID:', userId);

      // ✅ Use GET method and append userId to URL
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

      // ✅ Use correct path to data
      setNotifications(data.data || []);
    } catch (error) {
      console.log('❌ Error getting user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // ✅ Render each notification
  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.card }]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.iconText, { color: theme.textPrimary }]}>🔔</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Notification</Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {item.message}
        </Text>
        {/* <Text style={[styles.time, { color: theme.textSecondary }]}>
          {new Date(item.createdAt).toLocaleString()}
        </Text> */}
      </View>
    </View>
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
          />
        }
      >
        {/* Header */}
        <Head
          title="Notification"
          rightComponent={
            <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteButton}>
              <Icon name="delete-outline" size={wp('6%')} color={theme.textPrimary} />
            </TouchableOpacity>
          }
        />

        {/* Notification List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id.toString()} // ✅ Fix unique key warning
          renderItem={renderNotificationItem}
          style={[styles.list, { backgroundColor: theme.background }]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No notifications yet
              </Text>
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
    padding: wp('2%'),
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginBottom: 1,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  iconText: {
    fontSize: wp('7%'),
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp('4.3%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  message: {
    fontSize: wp('3.7%'),
    lineHeight: hp('2.5%'),
    marginBottom: hp('0.5%'),
    fontFamily: 'Poppins-Regular',
  },
  time: {
    fontSize: wp('2.9%'),
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  emptyText: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },
});
