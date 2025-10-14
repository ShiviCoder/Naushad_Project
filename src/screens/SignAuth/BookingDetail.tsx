import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const BookingDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>

        {/* Booking Status */}
        <Text style={styles.statusTitle}>Accepted</Text>

        {/* Date */}
        <View style={styles.row}>
          <Icon name="calendar-outline" size={18} color="#000" />
          <Text style={styles.dateText}>15 Aug 2025</Text>
        </View>

        {/* Status Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Accepted</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>₹ 500</Text>

        {/* Service Description */}
        <Text style={styles.description}>
          Professional haircut with styling included.
        </Text>

        {/* Customer Info */}
        <View style={styles.profileRow}>
          <Image
            source={require('../../assets/images/rahul.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.customerName}>Rahul sharma</Text>
            <Text style={styles.phone}>+91 9876543210</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.row}>
          <Icon name="location-pin" size={24} color="#000" />
          <Text style={styles.address}>123, Main Street, City</Text>
        </View>

        {/* Call & Message Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#42BA86' }]}>
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#237BCE' }]}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="document-text-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="hand-left-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: '#fff',
      paddingHorizontal: 20,
       paddingTop: 100 },

  // Header
  header: {
     flexDirection: 'row',
      alignItems: 'center',
       marginBottom: 20 ,
    },
  headerTitle: {
     fontSize: 30,
      fontWeight: 'bold',
       marginLeft: 10 ,
    },

  // Booking Status
  statusTitle: {
     fontSize: 22,
      fontWeight: '700',
       marginBottom: 8 ,
       width:137,
       height:42,
    },

  // Date Row
  row: {
     flexDirection: 'row',
      alignItems: 'center',
       marginBottom: 8 
    },
  dateText: {
     marginLeft: 6,
      fontSize: 14,
       color: '#000',
       width:291 ,
       height:23,
       fontWeight:'bold'
    },

  // Badge
  badge: {
    backgroundColor: '#42BA86',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
    width:114,
    height:30,
    padding:50,
  },
  badgeText: {
     color: '#fff',
      fontSize: 15,
       fontWeight: 'condensed',
       alignSelf:'center'
     },

  // Price
  price: {
     fontSize: 24,
      fontWeight: 'bold',
       marginBottom: 10 ,
       width:82,
       height:41,
    },

  // Description
  description: {
     fontSize: 23,
      color: '#0d0d0dff',
       marginBottom: 20 ,
       width:315,
       height:60,
       fontWeight:'condensed'
       
    },

  // Customer Info
  profileRow: {
     flexDirection: 'row',
      alignItems: 'center',
       marginBottom: 14
     },
  profileImage: {
     width: 97,
      height: 97,
       borderRadius: 27.5,
        marginRight: 12 
    },
  customerName: {
     fontSize: 24,
      fontWeight: 'bold' ,
      width:171,
      height:36,
    },
  phone: {
     fontSize: 24,
      color: '#0a0909ff',
       marginTop: 2 ,
        width:190,
      height:36,
    },

  // Address
  address: {
     marginLeft: 6,
      fontSize: 24,
       color: '#000',
       width:236,
       height:30, 
    },

  // Buttons
  buttonRow: {
     flexDirection: 'row',
      justifyContent: 'space-between',
       marginTop: 20 
    },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width:144,
    height:41,
  },
  buttonText: {
     color: '#fff',
      fontSize: 24,
       fontWeight: '600' 
    },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    marginTop: 10,
  },
  navItem: {
     alignItems: 'center',
      justifyContent: 'center' },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
});

export default BookingDetailsScreen;
