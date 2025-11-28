import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Head from '../../components/Head';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
  ServiceDetails: { item: any };
  BookAppointmentScreen: { serviceName: string; title: string; price: number; quantity: number };
};

const ServiceDetails = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceDetails'>>();
  const { item } = route.params;
  const { addToCart } = useCart();

  // State for extra services from API
  const [extraServices, setExtraServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  };

  // Fetch extra services from API
  const fetchExtraServices = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // Filter out the current service to show only other services as extras
      const otherServices = data.data.filter((service: any) => service._id !== item._id);
      setExtraServices(otherServices.slice(0, 5)); // Limit to 5 extra services
    } catch (err) {
      console.log('Fetch extra services error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtraServices();
  }, [item]);

  // Toggle service selection
  const toggleSelectService = (service: any) => {
    if (selectedServices.includes(service._id)) {
      setSelectedServices(prev => prev.filter(id => id !== service._id));
    } else {
      setSelectedServices(prev => [...prev, service._id]);
    }
  };

  // Parse highlights if they are stored as stringified array
  const parseHighlights = (highlights: any) => {
    if (!highlights || !Array.isArray(highlights)) return [];

    if (highlights.length > 0 && typeof highlights[0] === 'string' && highlights[0].startsWith('[')) {
      try {
        return JSON.parse(highlights[0]);
      } catch (error) {
        console.log('Error parsing highlights:', error);
        return highlights;
      }
    }
    return highlights;
  };

  const handleBookAppointment = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'Please log in first.');
        return;
      }

      const mainPrice = item.price * quantity;
      let extraTotal = 0;

      // Add selected extra services to cart and calculate total
      for (const serviceId of selectedServices) {
        const service = extraServices.find(s => s._id === serviceId);
        if (service) {
          extraTotal += service.price;

          // Add to cart via API
          const response = await fetch('https://naushad.onrender.com/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              productId: service._id,
              name: service.serviceName,
              price: service.price,
              qty: 1,
              image: service.imageUrl || '',
            }),
          });

          const res = await response.json();
          if (!response.ok || !res.success) {
            console.log('Add to cart failed:', res);
          }
        }
      }

      const totalPrice = mainPrice + extraTotal;

      navigation.navigate('BookAppointmentScreen', {
        serviceName: item.serviceName,
        title: item.title,
        price: totalPrice,
        quantity: quantity,
        from: 'PackageDetails'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const highlights = parseHighlights(item.highlights);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Head title="Our Services" />

      {loading ? (
        <View style={[styles.fullScreenLoading, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />

        </View>
      ) : (
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: theme.background },
          ]}
        >
          <View style={{ gap: hp('2%') }}>
            {/* Main Image */}
            <Image
              style={styles.image}
              source={{ uri: item.imageUrl }}
            />

            {/* Name and Price */}
            <View style={styles.nameCont}>
              <Text style={[styles.name, { color: theme.textPrimary }]}>
                {item.serviceName}
              </Text>
              <Text style={[styles.price, { color: theme.textPrimary }]}>
                ₹{item.price}
              </Text>
            </View>

            {/* Description */}
            <Text style={[styles.desc, { color: theme.subtext }]}>
              "{item.title}"
            </Text>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <View style={styles.highlightCont}>
                <Text style={[styles.hightlightHead, { color: theme.textPrimary }]}>
                  Highlights
                </Text>

                {highlights.map((point: string, index: number) => (
                  <View key={index} style={styles.highInCon}>
                    <View style={[styles.circle, { backgroundColor: COLORS.primary }]} />
                    <Text style={styles.highlightTxt}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Quantity Selector */}
            {/* <View style={styles.quantityContainer}>
              <Text style={[styles.quantityLabel, { color: theme.textPrimary }]}>
                Quantity:
              </Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.quantityText, { color: theme.textPrimary }]}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => prev + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Extra Services Section */}
            <View style={styles.extra}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.extraHead, { color: theme.textPrimary }]}>
                  Extra Services
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('ServicesScreen')}>
                  <Text style={[styles.extraHead, { color: theme.textPrimary, fontSize: wp('4%') }]}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={extraServices}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item._id}
                contentContainerStyle={{ paddingHorizontal: wp('1%') }}
                renderItem={({ item: service }) => (
                  <TouchableOpacity
                    style={styles.serviceCard}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: service.imageUrl }}
                      style={styles.serviceImage}
                    />
                    <View style={styles.nameItem}>
                      <Text style={styles.serviceName}>{service.serviceName}</Text>
                      <Text style={styles.servicePrice}>₹{service.price}</Text>
                    </View>
                    <Text style={styles.serviceDesc}>{service.title}</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      style={[
                        styles.bookBtn,
                        {
                          backgroundColor: selectedServices.includes(service._id)
                            ? COLORS.secondary
                            : COLORS.primary,
                        },
                      ]}
                      onPress={() => toggleSelectService(service)}
                    >
                      <Text style={styles.bookBtnText}>
                        {selectedServices.includes(service._id) ? 'Selected' : 'Select'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />

              {/* Book Appointment Button */}
              <TouchableOpacity
                style={[styles.BookAppointBtn, { backgroundColor: COLORS.primary }]}
                onPress={handleBookAppointment}
              >
                <Text style={[styles.BookAppointBtnTxt, { color: '#fff' }]}>
                  Book Appointment - ₹{item.price * quantity}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    gap: hp('4%'),
    flex: 1,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: hp('25%'),
    alignSelf: 'center',
    borderRadius: wp('3%'),
  },
  nameCont: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  name: {
    fontSize: hp('3%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  price: {
    fontSize: hp('2.2%'),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  desc: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
    color: '#00000075',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'justify',
    fontFamily: 'Poppins-Medium',
  },
  highlightCont: {
    gap: hp('1.5%'),
    width: '90%',
    alignSelf: 'center',
  },
  highInCon: {
    flexDirection: 'row',
    gap: wp('4%'),
    alignItems: 'center',
  },
  circle: {
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: 999,
  },
  highlightTxt: {
    color: '#00000075',
    fontSize: hp('1.6%'),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  hightlightHead: {
    fontSize: hp('2.2%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  extraHead: {
    fontSize: hp('3%'),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  extra: {
    width: '90%',
    alignSelf: 'center',
    gap: hp('0.3%'),
  },
  BookAppointBtn: {
    width: '90%',
    paddingVertical: hp('2%'),
    borderRadius: wp('3%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  BookAppointBtnTxt: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  quantityContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  quantityLabel: {
    fontSize: hp('2%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
  },
  quantityButton: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: hp('2%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  serviceCard: {
    width: wp('38%'),
    marginHorizontal: wp('1.5%'),
    marginVertical: hp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: wp('2%'),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: hp('25%'),
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
    width: '100%',
  },
  serviceName: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#060505ff',
    flex: 1,
    fontFamily: "Poppins-Medium"
  },
  servicePrice: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#0a0909ff',
    fontFamily: "Poppins-Medium"
  },
  serviceDesc: {
    color: '#1111118A',
    fontSize: wp('2.5%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'flex-start'
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
  loadingText: {
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    fontFamily: 'Poppins-Medium',
  },
});