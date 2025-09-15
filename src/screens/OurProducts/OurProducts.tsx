import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity, } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FlatListComp from './FlatListComp'
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Head from '../../components/Head';
type RootStackParamList = {
  HomeScreen: undefined;
  OurProducts: undefined;
};

type OurProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OurProducts'>;
};

const OurProducts = ({ navigation }: OurProductsProps) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
     <Head title="Our Products" ></Head>
      <FlatListComp />
      <View style={styles.bottomBarWrap}>
        <View style={styles.bottomNav}>
          <Icon name="home" size={wp('6%')} color="#fff" />
          <Icon name="document-text-outline" size={wp('6%')} color="#fff" />
          <View style={styles.fabCircle}>
            <Icon name="add" size={wp('6%')} color="#000" />
          </View>
          <Icon name="hand-left-outline" size={wp('6%')} color="#fff" />
          <Icon name="person-outline" size={wp('6%')} color="#fff" />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default OurProducts

const styles = StyleSheet.create({
  HeadingContain: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: hp('2%'),
    alignItems: 'center'
  },
  HeadingStyle: {
    fontSize: wp('6%'),
    fontWeight: '700'
  },
  LikeImgContain: {
    height: wp('10%'),
    width: wp('10%'),
    backgroundColor: '#9387871F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('10%')
  },
  touchStyle: {
    height: wp('5%'),
    width: wp('10%'),
    alignItems : 'center',
    justifyContent : 'center'
  },
  iconImage : {
    height : '70%',
    width : '70%'
  },
  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp('2%'),
    alignItems: 'center',
    paddingBottom: hp('1%'),
  },
  bottomNav: {
    backgroundColor: '#111',
    width: '92%',
    height: hp('7%'),
    borderRadius: wp('10%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp('3%'),
  },
  fabCircle: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('7%'),
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
})