import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
=======
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ProductData from '../../components/useProductData';
import Card from '../../components/Cards';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import useProductData from '../../components/useProductData';

const ProductPackageScreen = () => {
<<<<<<< HEAD
  const { theme } = useTheme();
  const [numColumns, setNumColumns] = useState(2);
  const ProductData = useProductData();

=======
  const {theme} = useTheme();
  const [numColumns , setNumColumns] = useState(2);
  const ProductData = useProductData();
  
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setNumColumns(width > height ? 4 : 2); // landscape → 5, portrait → 2
    };

    updateOrientation(); // initial check
<<<<<<< HEAD
    const subscription = Dimensions.addEventListener(
      'change',
      updateOrientation,
    );
=======
    const subscription = Dimensions.addEventListener('change', updateOrientation);
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

    return () => subscription?.remove();
  }, []);

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Head title="Product Packages"></Head>
      <View style={{ paddingHorizontal: wp('3.5%') }}>
        <FlatList
          data={ProductData}
          numColumns={numColumns}
          key={numColumns}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            paddingBottom: hp('10%'),
            paddingTop: hp('2%'),
          }}
          renderItem={({ item }) => <Card item={item} />}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: hp('4%') }} />}
        />
=======
    <SafeAreaView style={[styles.mainContainer,{backgroundColor : theme.background}]}>
      {/* Header */}
      <Head title="Product Packages"></Head>
      <View style={{paddingHorizontal : wp('3.5%')}}>
        <FlatList
        data={ProductData}
        numColumns={numColumns}
          key={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: hp('10%'),
          paddingTop: hp('2%'),
        }}
        renderItem={({ item }) => <Card item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: hp('4%') }} />}
      /> 
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
<<<<<<< HEAD
    paddingBottom: hp('4%'),
=======
    paddingBottom : hp('4%')
  
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    gap: wp('20%'),
  },
  iconImage: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  headText: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProductPackageScreen;
