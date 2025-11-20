import { StyleSheet, Text, View, FlatList, TouchableOpacity, useWindowDimensions, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
  const data = activeTab === 'Products' ? products : 'Services';
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [products,setProducts] = useState([]);
  const [loading ,setLoading] = useState(false);
  const { addToCart } = useCart();
  
  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }


  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';
      const response = await fetch('https://naushad.onrender.com/api/ourservice', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json();
      setServices(data);
      console.log("Services data", data);
      console.log(" Catelog Services token", token);
    } catch (error) {
      console.log("Error loading:", error);
    } finally { 
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const [gender, setGender] = useState("male");

  useEffect(() => {
    const loadGender = async () => {
      const savedGender = await AsyncStorage.getItem("selectedGender");

      console.log("Loaded Gender:", savedGender);

      // Fallback to male if null/undefined/"null"
      if (!savedGender || savedGender === "null") {
        setGender("male");
      } else {
        setGender(savedGender);
      }

      // ⭐ Remove saved gender so next time fresh value will be used
      await AsyncStorage.removeItem("selectedGender");
      console.log("Old gender removed from AsyncStorage");
    };

    loadGender();
  }, []);
  const fetchProducts = async (selectedGender) => {
    try {
      setLoading(true); 
      const token = await getToken();
      if (!token) return;

      // 🔥 Final Gender (priority → function param > state > default)
      const g = (selectedGender || gender || "male").toLowerCase().trim();
      console.log("Selected Gender (Products):", g);

      const res = await fetch("https://naushad.onrender.com/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("📦 Product Full Response:", json);

      if (!json?.success) return;

      let data = json.data || [];

      // 🔥 FINAL FILTER (exact same as product-packages)
      data = data.filter((item) =>
        String(item.gender || "")
          .trim()
          .toLowerCase() === g
      );

      console.log("Filtered Products:", data);

      setProducts(data);
    } catch (error) {
      console.log("🔥 Product error:", error);
    }
    finally{
      setLoading(false); // stop loader
    }
  };
  useEffect(() => {
    fetchProducts(gender);
  }, [gender]);

  if (loading) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Catelog" />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftButton,
            activeTab === 'Products' && [styles.activeButton, { backgroundColor: COLORS.primary }],
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
            activeTab === 'Services' && [styles.activeButton, { backgroundColor: COLORS.primary }],
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
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: wp('3%'), alignSelf: 'center' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { product: { ...item, image: item.image } })}
              android_ripple={{ color: 'transparent' }}
              activeOpacity={1}
            >
              <View style={styles.productCard}>
                <Image
                  source={{uri : item.image}}
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

      {activeTab === 'Services' &&
        <FlatList
          data={services.data}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: wp('2%') }}
          numColumns={2}
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
                    qty: 1, // default quantity
                  });
                  navigation.navigate('ServiceDetails', {
                    item: {
                      ...item,
                      image: item.imageUrl
                    }
                  })
                }
                }
              >
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          )}
        />}
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
    marginHorizontal: wp('4%'),   // responsive horizontal margin
    marginVertical: hp('1%'),     // responsive vertical margin
    backgroundColor: '#948a8aff',
    borderRadius: wp('2%'),       // responsive radius
    padding: wp('2%'),          // responsive padding
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp('1.8%'),  // responsive vertical padding
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
  activeButton: {
  },
  toggleText: {
    fontSize: wp('4%'),           // responsive font size
    fontWeight: '500',
    color: '#f4efefff',
  },
  activeText: {
    color: '#f5f0f0ff',
  },
  productCard: {
    width: wp('43%'), // Increased from 160
    marginHorizontal: wp('2%'), // Increased from 5
    marginVertical: hp('1%'),
    borderRadius: wp('4%'), // Increased from 12
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'), // Increased from 10
    height: hp('31%')
  },
  productImage: {
    width: '100%',
    height: hp('13%'), // Increased from 90
    borderRadius: wp('3%') // Increased from 10
  },
  productName: {
    marginTop: hp('1%'),
    fontWeight: '700',
    fontFamily: "Poppins-Medium"
  },
  productPrice: {
    color: '#777',
    marginTop: hp('0.3%'),
    fontFamily: "Poppins-Medium"
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('3%'),
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start'
  },
  pillText: {
    fontSize: wp('3%'),
    marginLeft: wp('1%'),
    color: '#333',
    fontFamily: "Poppins-Medium"
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
    flex: 1
    , fontFamily: "Poppins-Medium"
  },
  servicePrice: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#0a0909ff'
    , fontFamily: "Poppins-Medium"
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
    marginTop: hp('1%')
  },
  bookBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: wp('3%'),
    fontFamily: "Poppins-Medium"
  },
});
