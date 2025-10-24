import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlatListComp from './FlatListComp';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Head from '../../components/Head';
import BottomNavbar from '../../components/BottomNavbar';
import { products as ProductData } from '../../screens/OurProducts/ProductsArray';
import { useLikedProducts } from '../../context/LikedProductsContext';

type RootStackParamList = {
  HomeScreen: undefined;
  OurProducts: undefined;
};

type OurProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OurProducts'>;
};

const OurProducts = ({ navigation }: OurProductsProps) => {
  const { likedProducts, toggleLike } = useLikedProducts();
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const filteredProducts = showLikedOnly
    ? ProductData.filter(p => likedProducts.includes(p.id))
    : ProductData;
  console.log('Filtered Products:', filteredProducts);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Head title="Our Products" />
      <FlatListComp
        products={filteredProducts}
        likedProducts={likedProducts}
        onToggleLike={toggleLike}
      />
    </SafeAreaView>
  );
};

export default OurProducts;

const styles = StyleSheet.create({
  HeadingContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: hp('2%'),
    alignItems: 'center',
  },
  HeadingStyle: {
    fontSize: wp('6%'),
    fontWeight: '700',
  },
  LikeImgContain: {
    height: wp('10%'),
    width: wp('10%'),
    backgroundColor: '#9387871F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('10%'),
  },
  touchStyle: {
    height: wp('5%'),
    width: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    height: '70%',
    width: '70%',
  },
});
