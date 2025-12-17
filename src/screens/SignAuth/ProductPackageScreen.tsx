import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import Svg, { Polygon } from 'react-native-svg';

import ProductData from '../../components/useProductData';
import Card from '../../components/Cards';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';

const ProductPackageScreen = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [productData, setProductData] = useState([]);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [gender, setGender] = useState('male');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log('token accept');
    return token;
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // ✅ PROPER GENDER LOGIC - EXACT FROM PACKAGES REFERENCE
  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');
        console.log('Loaded Gender:', savedGender);

        // ✅ PROPER GENDER LOGIC: saved > default
        if (savedGender && savedGender !== 'null') {
          const normalizedGender = savedGender.toLowerCase().trim();
          setGender(
            normalizedGender === 'male' || normalizedGender === 'female'
              ? normalizedGender
              : 'male',
          );
          console.log('✅ Valid Gender Set:', normalizedGender);
        } else {
          console.log('⚠️ No valid saved gender, using default: male');
        }

        // ⭐ Clear saved gender after use for fresh value next time
        await AsyncStorage.removeItem('selectedGender');
        console.log('🗑️ Old gender cleared from AsyncStorage');
      } catch (error) {
        console.log('❌ Gender load error:', error);
        setGender('male'); // Fallback to default
      }
    };

    loadGender();
  }, []);

  // 🔥 PROPER FETCH PRODUCT PACKAGES - EXACT FROM PACKAGES REFERENCE
  const fetchProductPackages = async (selectedGender = null) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        console.log('❌ No token available');
        return;
      }

      // 🔥 PROPER GENDER PRIORITY: selectedGender > state > default
      let finalGender = 'male';
      if (selectedGender) {
        finalGender = selectedGender.toLowerCase().trim();
      } else if (gender && gender !== 'null') {
        finalGender = gender.toLowerCase().trim();
      }

      // ✅ Validate gender value
      if (!['male', 'female'].includes(finalGender)) {
        finalGender = 'male';
      }

      console.log('🔍 Fetching product packages for gender:', finalGender);

      const response = await fetch(
        `https://naushad.onrender.com/api/product-packages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      console.log('📦 Product Packages Full Response:', json);

      if (!json?.success) {
        console.log('❌ API response not successful');
        return;
      }

      let data = json.data || [];

      // 🔥 FILTER BY VALIDATED GENDER - EXACT FROM PACKAGES
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      // Process data for display
      data = data.map(item => ({
        ...item,
        displayName: item.name || 'Package',
        displayDescription: item.description || 'No description',
        displayItems: Array.isArray(item.items)
          ? item.items.join(', ')
          : item.items || 'N/A',
      }));

      console.log(
        '✅ Filtered Product Packages for',
        finalGender,
        ':',
        data.length,
        'items',
      );
      setProductData(data);
    } catch (err) {
      console.log('🔥 Product package fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch product packages whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchProductPackages(gender);
    }
  }, [gender]);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setNumColumns(width > height ? 4 : 2);
    };

    updateOrientation();
    const subscription = Dimensions.addEventListener(
      'change',
      updateOrientation,
    );

    return () => subscription?.remove();
  }, []);

  // Calculate card dimensions based on screen size
  const getCardDimensions = () => {
    const screenWidth = Dimensions.get('window').width;
    const padding = wp('3.5%') * 2;
    const gap = wp('2%') * (numColumns - 1);
    const cardWidth = (screenWidth - padding - gap) / numColumns;

    return {
      width: cardWidth,
      height: hp('28%'),
    };
  };

  const ProductPackageCard = ({ item, index, cardWidth }) => {
    const dimensions = getCardDimensions();
    const isFirstRow = index < numColumns;

    return (
      <View
        style={[
          styles.cardWrapper,
          { width: dimensions.width },
          isFirstRow && styles.firstCard,
        ]}
      >
        <Shadow
          distance={3}
          startColor={COLORS.shadow}
          offset={[0, 13]}
          style={styles.shadowStyle}
        >
          <View
            style={[
              styles.cardContainer,
              {
                width: dimensions.width,
                height: dimensions.height,
              },
            ]}
          >
            {/* Folded Corners */}
            <Svg
              height={hp('5%')}
              width={dimensions.width}
              style={styles.foldSvg}
            >
              <Polygon
                points={`0,0 ${wp('6%')},0 0,${wp('6%')}`}
                fill={theme.background || '#fff'}
              />
              <Polygon
                points={`${dimensions.width},0 ${
                  dimensions.width - wp('6%')
                },0 ${dimensions.width},${wp('6%')}`}
                fill={theme.background || '#fff'}
              />
            </Svg>

            {/* Header Hexagon */}
            <View style={styles.headerContainer}>
              <Svg height={hp('6%')} width={dimensions.width * 0.7}>
                <Polygon
                  points={`0,0 ${dimensions.width * 0.7},0 ${
                    dimensions.width * 0.7
                  },${hp('3%')} ${dimensions.width * 0.35},${hp('6%')} 0,${hp(
                    '3%',
                  )}`}
                  fill={COLORS.primary}
                />
              </Svg>
              <Text style={styles.headerText} numberOfLines={1}>
                {item.displayName || 'Package'}
              </Text>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.rateText}>
                Rate:-{' '}
                <Text style={styles.boldText}>₹ {item.price || '0'}</Text>
              </Text>
              <Text style={styles.productsText} numberOfLines={2}>
                Products:-{' '}
                <Text style={styles.boldText}>{item.displayItems}</Text>
              </Text>
              <Text style={styles.descriptionText} numberOfLines={2}>
                {item.displayDescription}
              </Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductPakage', { item })}
              style={styles.bookButton}
            >
              <Text style={styles.bookButtonText}>Buy now</Text>
            </TouchableOpacity>
          </View>
        </Shadow>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const dimensions = getCardDimensions();
    return (
      <ProductPackageCard
        item={item}
        index={index}
        cardWidth={dimensions.width}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Head title="Product Packages" />
      </View>

      {productData.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No product packages found for {gender}
          </Text>
        </View>
      ) : (
        <View style={styles.flatListWrapper}>
          <FlatList
            data={productData}
            numColumns={numColumns}
            key={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.flatListContent,
              {
                paddingTop: hp('1%'),
                paddingBottom: hp('10%'),
              },
            ]}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id || item._id || index}`}
            ListFooterComponent={<View style={{ height: hp('2%') }} />}
            scrollEnabled={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  flatListWrapper: {
    flex: 1,
    marginTop: hp('1%'),
  },
  flatListContent: {
    flexGrow: 1,
    paddingHorizontal: wp('1.5%'),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    paddingHorizontal: wp('0.5%'),
    marginLeft: 5,
    marginRight: 5,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  firstCard: {
    marginTop: hp('-2%'),
  },
  shadowStyle: {
    borderRadius: wp('4%'),
  },
  cardContainer: {
    backgroundColor: '#EDEDED',
    borderRadius: wp('4%'),
    overflow: 'hidden',
    alignItems: 'center',
  },
  foldSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  headerText: {
    position: 'absolute',
    top: hp('1%'),
    width: '90%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: wp('3%'),
    paddingHorizontal: wp('1%'),
  },
  contentContainer: {
    marginTop: hp('8%'),
    width: '85%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  rateText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginBottom: hp('0.5%'),
    color: '#000',
  },
  productsText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginBottom: hp('1%'),
    lineHeight: wp('4%'),
    color: '#000',
  },
  boldText: {
    fontWeight: '700',
    color: '#000',
  },
  descriptionText: {
    fontStyle: 'italic',
    fontSize: wp('3%'),
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: wp('3.8%'),
    marginBottom: hp('1%'),
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    marginBottom: hp('1.5%'),
    marginTop: 'auto',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp('3%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ProductPackageScreen;
