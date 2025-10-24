<<<<<<< HEAD
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
=======
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import Head from '../../components/Head';
import { PackageData } from '../../components/PackageData';
<<<<<<< HEAD
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
=======
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
type RootStackParamList = {
<<<<<<< HEAD
  OurPackages: undefined;
  PackageDetails: { item: PackageData };
};

type PackageDetailsRouteProp = RouteProp<RootStackParamList, 'PackageDetails'>;

const PackageDetails = () => {
  const route = useRoute<PackageDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { item } = route.params;
  const { theme } = useTheme();
  console.log('Hello');
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Head title="Our Packages" />
      <Image style={styles.img} source={item.image} />
      <View style={styles.detail}>
        <View style={styles.titleContain}>
          <Text style={[styles.titleTxt, { color: theme.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.priceTxt, { color: theme.textPrimary }]}>
            {item.price}
          </Text>
        </View>
        <Text style={[styles.aboutTxt, { color: theme.textPrimary }]}>
          "{item.about}"
        </Text>
        <Text style={[styles.discountTxt, { color: theme.textPrimary }]}>
          {item.discount}
        </Text>
      </View>

      <View style={styles.serviceListContain}>
        <Text style={[styles.serviceListHeadTxt, { color: theme.textPrimary }]}>
          Service List
        </Text>
        {item.serviceList?.map((service, index) => (
          <View key={index} style={styles.ServiceListTxtContain}>
            <Text>✅</Text>
            <Text style={[styles.serviceListTxt, { color: theme.textPrimary }]}>
              {service}
            </Text>
          </View>
        )) || (
          <Text style={{ color: theme.textPrimary }}>
            No services available
          </Text>
        )}
=======
  OurPackages: undefined,
  PackageDetails: { item: PackageData }
}

type PackageDetailsRouteProp = RouteProp<RootStackParamList, 'PackageDetails'>

const PackageDetails = () => {
  const route = useRoute<PackageDetailsRouteProp>()
  const navigation = useNavigation<any>()
  const { item } = route.params
  const {theme} = useTheme();
console.log("Hello")
  return (
   
      <SafeAreaView style={[styles.container,{backgroundColor : theme.background}]}>
      <Head title='Our Packages' />
      <Image style={styles.img} source={item.image} />
      <View style={styles.detail}>
        <View style={styles.titleContain}>
          <Text style={[styles.titleTxt,{color : theme.textPrimary}]}>{item.title}</Text>
          <Text style={[styles.priceTxt,{color : theme.textPrimary}]}>{item.price}</Text>
        </View>
        <Text style={[styles.aboutTxt,{color : theme.textPrimary}]}>"{item.about}"</Text>
        <Text style={[styles.discountTxt,{color : theme.textPrimary}]}>{item.discount}</Text>
      </View>

      <View style={styles.serviceListContain}>
        <Text style={[styles.serviceListHeadTxt,{color : theme.textPrimary}]}>Service List</Text>
       {item.serviceList?.map((service, index) => (
  <View key={index} style={styles.ServiceListTxtContain}>
    <Text>✅</Text>
    <Text style={[styles.serviceListTxt,{color : theme.textPrimary}]}>{service}</Text>
  </View>
)) || (
  <Text style={{color: theme.textPrimary}}>No services available</Text>
)}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      <View style={styles.ratContain}>
        <Rating
          type="star"
          ratingCount={5}
          imageSize={wp('5%')}
          startingValue={item.rating}
<<<<<<< HEAD
          tintColor={theme.dark ? '#111' : '#fff'}
          readonly
        />
        <Text style={[styles.ratTxt, { color: theme.textPrimary }]}>
          ({item.review} reviews)
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.bookAppoint, { backgroundColor: COLORS.primary }]}
        onPress={() => {
          navigation.navigate('BookAppointmentScreen', {
            params: { image: item.image },
          });
        }}
=======
           tintColor={theme.dark ? '#111' : '#fff'}  
          readonly
        />
        <Text style={[styles.ratTxt,{color : theme.textPrimary}]}>({item.review} reviews)</Text>
      </View>

      <TouchableOpacity
        style={[styles.bookAppoint,{backgroundColor : COLORS.primary}]}
       onPress={() => {
          navigation.navigate('BookAppointmentScreen',
  {params: { image:  item.image}  }
); }}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      >
        <Text style={styles.bookAppointTxt}>Book Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
<<<<<<< HEAD
  );
};

export default PackageDetails;
=======
   
  )
}

export default PackageDetails
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    width: '90%',
    height: hp('25%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    resizeMode: 'cover',
<<<<<<< HEAD
    marginBottom: hp('3%'),
=======
    marginBottom: hp('3%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  titleTxt: {
    fontWeight: '600',
    fontSize: wp('6%'),
<<<<<<< HEAD
    color: '#000',
=======
    color: '#000'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  priceTxt: {
    fontSize: wp('5.5%'),
    fontWeight: '600',
<<<<<<< HEAD
    color: '#000',
=======
    color: '#000'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  titleContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
    marginBottom: hp('2%'),
=======
    marginBottom : hp('2%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  aboutTxt: {
    color: '#00000075',
    fontSize: wp('4%'),
    fontWeight: '500',
<<<<<<< HEAD
    marginBottom: hp('0.5%'),
=======
    marginBottom : hp('0.5%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  discountTxt: {
    fontSize: wp('3.9%'),
    color: '#42BA86',
<<<<<<< HEAD
    fontWeight: '600',
=======
    fontWeight: '600'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  detail: {
    width: '85%',
    alignSelf: 'center',
    gap: hp('0.5%'),
    marginBottom: hp('2%'),
<<<<<<< HEAD
=======

>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  serviceListHeadTxt: {
    fontSize: wp('6%'),
    fontWeight: '600',
<<<<<<< HEAD
    marginBottom: hp('1%'),
=======
    marginBottom: hp('1%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  serviceListTxt: {
    fontSize: wp('4%'),
    color: '#00000075',
<<<<<<< HEAD
    fontWeight: '400',
=======
    fontWeight : '400'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  ServiceListTxtContain: {
    flexDirection: 'row',
    gap: wp('2%'),
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: hp('0.8%'),
=======
    marginBottom: hp('0.8%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  serviceListContain: {
    width: '85%',
    alignSelf: 'center',
<<<<<<< HEAD
    marginBottom: hp('2%'),
=======
    marginBottom: hp('2%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  ratTxt: {
    fontSize: wp('4%'),
    fontWeight: '500',
<<<<<<< HEAD
    color: '#0000006E',
=======
    color: '#0000006E'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  ratContain: {
    flexDirection: 'row',
    gap: wp('5%'),
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: hp('3%'),
=======
    marginBottom: hp('3%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  bookAppoint: {
    height: hp('6%'),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('3%'),
<<<<<<< HEAD
    marginVertical: hp('3%'),
=======
    marginVertical: hp('3%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  bookAppointTxt: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#FFFFFF',
  },
<<<<<<< HEAD
});
=======
})
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
