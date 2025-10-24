import React, { useState } from 'react';
import {
<<<<<<< HEAD
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
=======
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
<<<<<<< HEAD
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
=======
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen = ({ navigation }) => {
<<<<<<< HEAD
  const { theme } = useTheme(); // theme le liya

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
      message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
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
      icon: '🚫',
      title: 'Booking Cancelled',
      message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '5',
      icon: '👨‍⚕️',
      title: 'New Spa Package',
      message: 'Try our relax & rejuvenate package at 15% off.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '6',
      icon: '🏢',
      title: 'Booking Confirmed',
      message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '7',
      icon: '🎁',
      title: 'Invite & Earn Rewards',
      message: 'Share the app with friends and earn free services.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '8',
      icon: '🚫',
      title: 'Booking Cancelled',
      message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '9',
      icon: '👨‍⚕️',
      title: 'New Spa Package',
      message: 'Try our relax & rejuvenate package at 15% off.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '10',
      icon: '🏢',
      title: 'Booking Confirmed',
      message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
    {
      id: '11',
      icon: '🎁',
      title: 'Invite & Earn Rewards',
      message: 'Share the app with friends and earn free services.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '12',
      icon: '🚫',
      title: 'Booking Cancelled',
      message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
      time: '2 days ago',
      hasGreenDot: false,
    },
    {
      id: '13',
      icon: '👨‍⚕️',
      title: 'New Spa Package',
      message: 'Try our relax & rejuvenate package at 15% off.',
      time: 'Yesterday',
      hasGreenDot: true,
    },
  ]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.card }]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.iconText, { color: theme.textPrimary }]}>
          {item.icon}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {item.title}
          </Text>
          {item.hasGreenDot && <View style={styles.greenDot} />}
        </View>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <Head
        title="Notification"
        rightComponent={
          <TouchableOpacity
            onPress={handleDeleteAll}
            style={styles.deleteButton}
          >
            <Icon
              name="delete-outline"
              size={wp('6%')}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        }
      />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotificationItem}
        style={[styles.list, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: wp('3%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
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
    fontSize: wp('4.5%'),
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
    fontSize: wp('4%'),
    lineHeight: hp('2.5%'),
    marginBottom: hp('0.5%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  time: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
  },
=======
    const { theme } = useTheme(); // theme le liya

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
            message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
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
            icon: '🚫',
            title: 'Booking Cancelled',
            message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
            time: '2 days ago',
            hasGreenDot: false,
        },
        {
            id: '5',
            icon: '👨‍⚕️',
            title: 'New Spa Package',
            message: 'Try our relax & rejuvenate package at 15% off.',
            time: 'Yesterday',
            hasGreenDot: true,
        },
         {
            id: '6',
            icon: '🏢',
            title: 'Booking Confirmed',
            message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
            time: 'Yesterday',
            hasGreenDot: true,
        },
        {
            id: '7',
            icon: '🎁',
            title: 'Invite & Earn Rewards',
            message: 'Share the app with friends and earn free services.',
            time: '2 days ago',
            hasGreenDot: false,
        },
        {
            id: '8',
            icon: '🚫',
            title: 'Booking Cancelled',
            message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
            time: '2 days ago',
            hasGreenDot: false,
        },
        {
            id: '9',
            icon: '👨‍⚕️',
            title: 'New Spa Package',
            message: 'Try our relax & rejuvenate package at 15% off.',
            time: 'Yesterday',
            hasGreenDot: true,
        },
         {
            id: '10',
            icon: '🏢',
            title: 'Booking Confirmed',
            message: 'your hair spa is booked for 12 Aug at 3:00 pm.',
            time: 'Yesterday',
            hasGreenDot: true,
        },
        {
            id: '11',
            icon: '🎁',
            title: 'Invite & Earn Rewards',
            message: 'Share the app with friends and earn free services.',
            time: '2 days ago',
            hasGreenDot: false,
        },
        {
            id: '12',
            icon: '🚫',
            title: 'Booking Cancelled',
            message: 'Your Beard Trim appointment on 10 Aug was cancelled.',
            time: '2 days ago',
            hasGreenDot: false,
        },
        {
            id: '13',
            icon: '👨‍⚕️',
            title: 'New Spa Package',
            message: 'Try our relax & rejuvenate package at 15% off.',
            time: 'Yesterday',
            hasGreenDot: true,
        },
    ]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleDeleteAll = () => {
        setNotifications([]);
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

            {/* Header */}
            <Head title='Notification' rightComponent={
                       <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteButton}>
                    <Icon name="delete-outline" size={wp('6%')} color={theme.textPrimary} />
                </TouchableOpacity>
                    } />
           

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotificationItem}
                style={[styles.list, { backgroundColor: theme.background }]}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Navigation */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: wp('3%'),
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: '600',
            fontFamily: "Poppins-Medium" 

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
            fontFamily: "Poppins-Medium" 

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
        fontSize: wp('4.5%'),
        flex: 1,
        fontFamily: "Poppins-Medium" ,
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
        fontSize: wp('4%'),
        lineHeight: hp('2.5%'),
        marginBottom: hp('0.5%'),
        fontWeight: 'bold',
            fontFamily: "Poppins-Medium" 

    },
    time: {
        fontSize: wp('3%'),
            fontFamily: "Poppins-Medium" 

    },
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});

export default NotificationsScreen;
