import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ProductData from '../../components/ProductData';
import Card from '../../components/Cards';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductPackageScreen = () => {
  const {theme} = useTheme();
  const [numColumns , setNumColumns] = useState(2);
  
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setNumColumns(width > height ? 4 : 2); // landscape → 5, portrait → 2
    };

    updateOrientation(); // initial check
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => subscription?.remove();
  }, []);

  return (
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom : hp('4%')
  
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

  // ✅ Card styling (use inside Card.js if you want consistency)
  container: {
    backgroundColor: '#EDEDED',
    borderRadius: wp('1%'),
    paddingBottom: hp('4%'),
    alignItems: 'center',
    shadowColor: '#f7c744',
    marginHorizontal: wp('10%'),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    width: wp('42%'),
    height: hp('18%'),
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    height: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    position: 'absolute',
    fontSize: wp('2.8%'),
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cardContent: {
    width: '80%',
    justifyContent: 'flex-start',
  },
  rate: {
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
  },
  products: {
    fontSize: wp('2.5%'),
    marginBottom: hp('1%'),
  },
  about: {
    fontSize: wp('2.2%'),
    fontStyle: 'italic',
    color: '#D19B00',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#FFC107',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('5%'),
    width: wp('15%'),
    alignSelf: 'center',
  },
  bookText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('2.5%'),
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  footerCon: {
    alignItems: 'center',
  },
});

export default ProductPackageScreen;
