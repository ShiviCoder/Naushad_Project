import React from 'react';
<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
=======
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Head from '../../components/Head';
<<<<<<< HEAD
import packageData, { PackageData } from '../../components/PackageData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  PackagesScreen: undefined;
  PackageDetails: { item: PackageData };
};
=======
import packageData, {PackageData} from '../../components/PackageData';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
type RootStackParamList = {
  PackagesScreen: undefined;
  PackageDetails: {item: PackageData}
}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

<<<<<<< HEAD
const PackagesScreen = () => {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Head title="Our Packages"></Head>

      {/* Packages List */}
      <View style={{ paddingHorizontal: wp('1.5%') }}>
        <FlatList
          data={packageData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('2%') }}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <Shadow
                distance={wp('2%')}
                startColor={COLORS.shadow}
                offset={[0, 0]}
                style={[
                  styles.mainContainer,
                  { backgroundColor: COLORS.secondary },
                ]}
              >
                {/* Text Section */}
                <View style={styles.mainText}>
                  <View style={styles.title}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                  <Text style={styles.serviceText}>
                    Services:{' '}
                    <Text style={{ color: '#000' }}>{item.services}</Text>
                  </Text>
                  <Text style={styles.aboutText}>
                    About: <Text style={{ color: '#000' }}>{item.about}</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PackageDetails', { item })
                    }
                    style={[
                      styles.bookNowButton,
                      { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
                {/* Image Section */}
                <View style={styles.mainImage}>
                  <Image source={item.image} style={styles.Image} />
                </View>
              </Shadow>
            </View>
          )}
        />
      </View>
=======

const PackagesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={[styles.container,{backgroundColor : theme.background}]}>
      {/* Header */}
     <Head title="Our Packages" ></Head>

      {/* Packages List */}
     <View style={{paddingHorizontal : wp('1.5%')}}>
       <FlatList
        data={packageData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('2%') }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Shadow
              distance={wp('2%')}
              startColor={COLORS.shadow}
              offset={[0, 0]}
              style={[styles.mainContainer,{backgroundColor : COLORS.secondary}]}
            >
              {/* Text Section */}
              <View style={styles.mainText}>
                <View style={styles.title}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
                <Text style={styles.serviceText}>
                  Services: <Text style={{ color: '#000' }}>{item.services}</Text>
                </Text>
                <Text style={styles.aboutText}>
                  About: <Text style={{ color: '#000' }}>{item.about}</Text>
                </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('PackageDetails', {item})} style={[styles.bookNowButton,{backgroundColor : COLORS.primary}]}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
              {/* Image Section */}
              <View style={styles.mainImage}>
                <Image source={item.image} style={styles.Image} />
              </View>
            </Shadow>
          </View>
        )}
      />
     </View>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
<<<<<<< HEAD
    paddingBottom: hp('7%'),
=======
    paddingBottom : hp('7%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
<<<<<<< HEAD
    gap: wp('25%'),
=======
    gap: wp('25%'), 
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  headIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  headText: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  cardWrapper: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
<<<<<<< HEAD
    width: '100%',
=======
    width: '100%'

>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: wp('4%'),
    paddingLeft: wp('3%'),
    marginBottom: hp('1%'),
<<<<<<< HEAD
    alignItems: 'stretch',
=======
    alignItems: 'stretch',   
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    justifyContent: 'space-between',
    height: hp('22%'),
  },
  mainText: {
    flex: 1,
    marginRight: wp('3%'),
    justifyContent: 'center',
    gap: hp('1.2%'),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('6%'),
    marginBottom: hp('0.5%'),
  },
  titleText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#B07813',
  },
  serviceText: {
    fontSize: wp('3.5%'),
    color: '#42BA86',
    marginBottom: hp('0.5%'),
  },
  aboutText: {
    fontSize: wp('3.5%'),
    color: '#42BA86',
    marginBottom: hp('1%'),
  },
  bookNowButton: {
    backgroundColor: '#FFD700',
    borderRadius: wp('10%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  mainImage: {
<<<<<<< HEAD
    width: wp('35%'),
    height: '100%',
=======
    width: wp('35%'),  
    height: '100%',    
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    overflow: 'hidden',
    borderTopRightRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
  },
  Image: {
    width: '100%',
<<<<<<< HEAD
    height: '100%',
    resizeMode: 'cover',
  },
});

export default PackagesScreen;
=======
    height: '100%', 
    resizeMode: 'cover'
  },
});

export default PackagesScreen;
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
