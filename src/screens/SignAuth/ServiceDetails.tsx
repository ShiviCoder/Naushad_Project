import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import Head from '../../components/Head';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useCart } from '../../context/CartContext';

type extra = {
  product: string;
  price: number;
};

type Service = {
  name: string;
  price: number;
  desc: string;
  image: any;
  highlights: string[];
  extras: extra[];
};

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
  ServiceDetails: { item: Service };
};

const services = [
  {
    id: '1',
    name: 'Facial',
    price: '600.00',
    desc: 'Glow facial therapy',
    image: [require('../../assets/images/facial.jpg'),
    require('../../assets/images/man-service3.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    id: '2',
    name: 'Hair Coloring',
    price: '400.00',
    desc: 'Long-lasting shades',
    image: [require('../../assets/images/haircolor1.png'),
    require('../../assets/images/man-service5.jpg')
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    id: '3',
    name: 'Hair Cut',
    price: '350.00',
    desc: 'Stylish cut with blow dry',
    image: [require('../../assets/images/haircut1.png'),
    require('../../assets/images/man-service4.jpg')
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  }
];

const ServiceDetails = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceDetails'>>();
  const { item } = route.params;
  const { addToCart } = useCart();

  // multiple selection ke liye array state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // toggle logic
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((item) => item !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleSelectService = (service: Service) => {
    if (selectedServices.includes(service.id)) {
      // remove from selection
      setSelectedServices(prev => prev.filter(id => id !== service.id));
    } else {
      // add to selection
      setSelectedServices(prev => [...prev, service.id]);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.background, height: '100%' },
        ]}

      >
        <Head title="Our Services" />

        <View style={{ gap: hp('2%') }}>
          {/* Main Image */}
          <Image style={styles.image} source={item.image} />

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
          <View style={styles.highlightCont}>
            <Text style={[styles.hightlightHead, { color: theme.textPrimary }]}>
              Highlights
            </Text>

            {Array.isArray(item.highlights) && item.highlights.map((point, index) => (
              <View key={index} style={styles.highInCon}>
                <View style={[styles.circle, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.highlightTxt}>{point}</Text>
              </View>
            ))}
          </View>
          {/* Extra Services Section */}
          <View style={styles.extra}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.extraHead, { color: theme.textPrimary }]}>
                Extra
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Services')}>
                <Text style={[styles.extraHead, { color: theme.textPrimary, fontSize: wp('4%') }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={services}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: wp('1%') }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    addToCart({
                      id: item.id.toString(),
                      name: item.name,
                      price: parseFloat(item.price),
                      qty: 1, // default quantity
                    });
                    navigation.navigate('ServiceDetails', {
                      item: {
                        ...item,
                        image: item.image
                      }
                    })
                  }
                  }
                  style={styles.serviceCard}
                  activeOpacity={0.8}
                >
                  <Image source={
                    item.image[1]
                  } style={styles.serviceImage} />
                  <View style={styles.nameItem}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.servicePrice}>₹{item.price}</Text>
                  </View>
                  <Text style={styles.serviceDesc}>{item.desc}</Text>
                  <View style={{ flex: 1 }} />

                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      {
                        backgroundColor:
                          // selected color
                          COLORS.primary, // default
                      },
                    ]}
                    onPress={() => toggleSelectService(item)}
                  >
                    <Text style={styles.bookBtnText}>
                      {selectedServices.includes(item.id) ? 'Selected' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />

            {/* Book Appointment Button */}
            <TouchableOpacity
              style={[styles.BookAppointBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => {
                // Map selected services to cart items
                selectedServices.forEach(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  if (service) {
                    addToCart({
                      id: service.id,
                      name: service.name,
                      price: parseFloat(service.price),
                      qty: 1,
                    });
                  }
                });
                                                                        
                // Navigate to payment
                navigation.navigate('CloneBookAppointment', {
                  serviceName: item.title,
                  price: item.price,
                });
              }}
            >
              <Text style={[styles.BookAppointBtnTxt, { color: '#fff' }]}>
                Book Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    gap: hp('4%'),
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
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp('1.2%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
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
});
