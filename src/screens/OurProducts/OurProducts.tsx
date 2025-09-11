import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import FlatListComp from './FlatListComp'
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeScreen: undefined;
  OurProducts: undefined;
};

type OurProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OurProducts'>;
};

const OurProducts = ({ navigation }: OurProductsProps) => {
  return (
    <View>
      <View style={styles.HeadingContain}>
        <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('HomeScreen')} >
          <Image source={require('../../assets/OurProduct/LeftArrow.png')} />
        </TouchableOpacity>
        <Text style={styles.HeadingStyle}>Our Products</Text>
        <View style={styles.LikeImgContain}>
          <Image source={require('../../assets/OurProduct/Like.png')} />
        </View>
      </View>
      <FlatListComp />
      <View style={styles.bottomBarWrap}>
        <View style={styles.bottomNav}>
          <Icon name="home" size={22} color="#fff" />
          <Icon name="document-text-outline" size={22} color="#fff" />
          <View style={styles.fabCircle}>
            <Icon name="add" size={26} color="#000" />
          </View>
          <Icon name="hand-left-outline" size={22} color="#fff" />
          <Icon name="person-outline" size={22} color="#fff" />
        </View>
      </View>
    </View>
  )
}

export default OurProducts

const styles = StyleSheet.create({
  HeadingContain: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center'
  },
  HeadingStyle: {
    fontSize: 20,
    fontWeight: 700
  },
  LikeImgContain: {
    height: 40,
    width: 40,
    backgroundColor: '#9387871F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  touchStyle: {
    height: 40,
    width: 40
  },
  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
    marginBottom: 50,
  },
  bottomNav: {
    backgroundColor: '#111',
    width: '92%',
    height: 54,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  fabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
})