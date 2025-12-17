import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FlatListComp from '../OurProducts/FlatListComp';
import ProductCard from '../OurProducts/ProductCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Catelog = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Products');
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [gender, setGender] = useState('male');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log('token accept');
    return token;
  };

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

  // 🔥 PROPER FETCH PRODUCTS - EXACT FROM PACKAGES REFERENCE
  const fetchProducts = async (selectedGender = null) => {
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

      console.log('🔍 Fetching products for gender:', finalGender);

      const res = await fetch('https://naushad.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log('📦 Products Full Response:', json);

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

      console.log(
        '✅ Filtered Products for',
        finalGender,
        ':',
        data.length,
        'items',
      );
      setProducts(data);
    } catch (error) {
      console.log('🔥 Products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PROPER FETCH SERVICES - EXACT FROM PACKAGES REFERENCE
  const fetchServices = async (selectedGender = null) => {
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

      console.log('🔍 Fetching services for gender:', finalGender);

      const response = await fetch(
        'https://naushad.onrender.com/api/ourservice',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log('📦 Services Full Response:', data);

      if (!data?.success || !data.data) {
        console.log('❌ API response not successful');
        return;
      }

      let rawServices = data.data || [];

      // 🔥 FILTER BY VALIDATED GENDER - EXACT FROM PACKAGES
      const genderFilteredServices = rawServices.filter(
        service =>
          String(service.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      console.log(
        '✅ Filtered Services for',
        finalGender,
        ':',
        genderFilteredServices.length,
        'items',
      );
      setServices(genderFilteredServices);
    } catch (error) {
      console.log('🔥 Services fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch both products and services whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchProducts(gender);
      fetchServices(gender);
    }
  }, [gender]);

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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Head title="Catelog" />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftButton,
            activeTab === 'Products' && [
              styles.activeButton,
              { backgroundColor: COLORS.primary },
            ],
          ]}
          onPress={() => setActiveTab('Products')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'Products' && styles.activeText,
            ]}
          >
            Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.rightButton,
            activeTab === 'Services' && [
              styles.activeButton,
              { backgroundColor: COLORS.primary },
            ],
          ]}
          onPress={() => setActiveTab('Services')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'Services' && styles.activeText,
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Products' && (
        <FlatList
          data={products}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || index.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: wp('3%'),
            alignSelf: 'center',
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No products available for {gender}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  product: { ...item, image: item.image },
                })
              }
              android_ripple={{ color: 'transparent' }}
              activeOpacity={1}
            >
              <View style={styles.productCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  ₹{item.price}{' '}
                  <Text style={{ color: '#29A244' }}>({item.offer})</Text>
                </Text>

                {/* rating + tag pills */}
                <View
                  style={{
                    flexDirection: 'column',
                    gap: wp('2%'),
                    marginTop: hp('1%'),
                    flexWrap: 'wrap',
                  }}
                >
                  <View style={styles.pill}>
                    <Icon name="star" size={wp('3%')} color="#29A244" />
                    <Text style={styles.pillText}>{item.rating}</Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: '#E8F6EF' }]}>
                    <Text
                      style={[styles.pillText, { color: '#29A244' }]}
                      numberOfLines={1}
                    >
                      {item.tag}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {activeTab === 'Services' && (
        <FlatList
          data={services}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: wp('2%') }}
          numColumns={2}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No services available for {gender}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.serviceImage}
              />
              <View style={styles.nameItem}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text style={styles.servicePrice}>₹{item.price}</Text>
              </View>
              <Text style={styles.serviceDesc}>{item.title}</Text>
              <View style={{ flex: 1 }} />

              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: COLORS.primary }]}
                onPress={() => {
                  addToCart({
                    id: item._id.toString(),
                    name: item.serviceName,
                    price: item.price,
                    qty: 1,
                  });
                  navigation.navigate('ServiceDetails', {
                    item: {
                      ...item,
                      image: item.imageUrl,
                    },
                  });
                }}
              >
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Catelog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    backgroundColor: '#948a8aff',
    borderRadius: wp('2%'),
    padding: wp('2%'),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1.8%'),
  },
  leftButton: {
    marginRight: wp('0.5%'),
  },
  rightButton: {
    marginLeft: wp('0.5%'),
  },
  activeButton: {},
  toggleText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#f4efefff',
  },
  activeText: {
    color: '#f5f0f0ff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    textAlign: 'center',
  },
  productCard: {
    width: wp('43%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    borderRadius: wp('4%'),
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    height: hp('31%'),
  },
  productImage: {
    width: '100%',
    height: hp('13%'),
    borderRadius: wp('3%'),
  },
  productName: {
    marginTop: hp('1%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  productPrice: {
    color: '#777',
    marginTop: hp('0.3%'),
    fontFamily: 'Poppins-Medium',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('3%'),
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: wp('3%'),
    marginLeft: wp('1%'),
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  serviceCard: {
    width: wp('42%'),
    height: hp('25%'),
    marginHorizontal: wp('3%'),
    marginVertical: hp('1%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: wp('2%'),
  },
  serviceImage: {
    width: '100%',
    height: hp('12%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    resizeMode: 'cover',
  },
  nameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#060505ff',
    flex: 1,
    fontFamily: 'Poppins-Medium',
  },
  servicePrice: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#0a0909ff',
    fontFamily: 'Poppins-Medium',
  },
  serviceDesc: {
    color: '#1111118A',
    fontSize: wp('2.5%'),
    marginBottom: hp('0.5%'),
  },
  bookBtn: {
    paddingVertical: hp('0.3%'),
    borderRadius: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('20%'),
    height: hp('3%'),
    marginTop: hp('1%'),
  },
  bookBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
  },
});
