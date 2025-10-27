import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import Head from '../../components/Head';
import { PackageData } from '../../components/PackageData';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
type RootStackParamList = {
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
      </View>

      <View style={styles.ratContain}>
        <Rating
          type="star"
          ratingCount={5}
          imageSize={wp('5%')}
          startingValue={item.rating}
           tintColor={theme.dark ? '#111' : '#fff'}  
          readonly
        />
        <Text style={[styles.ratTxt,{color : theme.textPrimary}]}>({item.review} reviews)</Text>
      </View>

      <TouchableOpacity
        style={[styles.bookAppoint,{backgroundColor : COLORS.primary}]}
       onPress={() => {
          navigation.navigate('CloneBookAppointment'
); }}
      >
        <Text style={styles.bookAppointTxt}>Book Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
   
  )
}

export default PackageDetails

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
    marginBottom: hp('3%')
  },
  titleTxt: {
    fontWeight: '600',
    fontSize: wp('6%'),
    color: '#000'
  },
  priceTxt: {
    fontSize: wp('5.5%'),
    fontWeight: '600',
    color: '#000'
  },
  titleContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom : hp('2%')
  },
  aboutTxt: {
    color: '#00000075',
    fontSize: wp('4%'),
    fontWeight: '500',
    marginBottom : hp('0.5%')
  },
  discountTxt: {
    fontSize: wp('3.9%'),
    color: '#42BA86',
    fontWeight: '600'
  },
  detail: {
    width: '85%',
    alignSelf: 'center',
    gap: hp('0.5%'),
    marginBottom: hp('2%'),

  },
  serviceListHeadTxt: {
    fontSize: wp('6%'),
    fontWeight: '600',
    marginBottom: hp('1%')
  },
  serviceListTxt: {
    fontSize: wp('4%'),
    color: '#00000075',
    fontWeight : '400'
  },
  ServiceListTxtContain: {
    flexDirection: 'row',
    gap: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('0.8%')
  },
  serviceListContain: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: hp('2%')
  },
  ratTxt: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#0000006E'
  },
  ratContain: {
    flexDirection: 'row',
    gap: wp('5%'),
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: hp('3%')
  },
  bookAppoint: {
    height: hp('6%'),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('3%'),
    marginVertical: hp('3%')
  },
  bookAppointTxt: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
