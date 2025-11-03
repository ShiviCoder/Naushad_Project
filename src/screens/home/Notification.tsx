import React, { useState, useRef } from 'react';
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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      icon: '📢',
      title: 'New offer 20% off',
      message: 'Get 20% off on all grooming packages. Offer till 15 Aug.',
      time: '2h ago',
      hasGreenDot: false,
    },
    {
      id: '2',
      icon: '🏢',
      title: 'Booking Confirmed',
      message: 'Your hair spa is booked for 12 Aug at 3:00 pm.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '3',
      icon: '🎁',
      title: 'Invite & Earn Rewards',
      message: 'Share the app with friends and earn free services.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '4',
      icon: '🏢',
      title: 'Booking Confirmed',
      message: 'Your hair spa is booked for 12 Aug at 3:00 pm.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '5',
      icon: '🎁',
      title: 'Invite & Earn Rewards',
      message: 'Share the app with friends and earn free services.',
      time: '2 days ago',
      hasGreenDot: false,
    },
  ]);

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    // Pull down animation
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    // Simulate fetch delay (e.g., network request)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Push back up animation
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.card }]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.iconText, { color: theme.textPrimary }]}>{item.icon}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>
          {item.hasGreenDot && <View style={styles.greenDot} />}
        </View>
        <Text style={[styles.message, { color: theme.textSecondary }]}>{item.message}</Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>{item.time}</Text>
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
        {/* 🔹 Header (moves together on pull) */}
        <Head
          title="Notification"
          rightComponent={
            <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteButton}>
              <Icon name="delete-outline" size={wp('6%')} color={theme.textPrimary} />
            </TouchableOpacity>
          }
        />

        {/* 🔹 Notification List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          style={[styles.list, { backgroundColor: theme.background }]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  title: {
    fontSize: wp('4.3%'),
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
  },
  greenDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#34C759',
    marginLeft: wp('2%'),
  },
  message: {
    fontSize: wp('3.7%'),
    lineHeight: hp('2.5%'),
    marginBottom: hp('0.5%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  time: {
    fontSize: wp('2.7%'),
    fontFamily: 'Poppins-Medium',
  },
});
