<<<<<<< HEAD
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
=======
import { StyleSheet, Text, View, FlatList, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import React, { useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import FlatListComp from '../OurProducts/FlatListComp';
import ProductData from '../../components/useProductData';
import ProductCard from '../OurProducts/ProductCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

const products = [
<<<<<<< HEAD
  {
    id: '1',
    name: ['Face Wash — 100 ml', 'Golden Glow Peel Off'],
    price: '₹299',
    offer: '25%OFF',
    rating: '4.1',
    tag: '100% natural oil',
    image: [
      require('../../assets/images/male-product1.jpg'),
      require('../../assets/images/female-product1.jpg'),
    ],
    description: '100% natural oil',
    reviews: 5802,
  },
  {
    id: '2',
    name: ['Det Fairness Cream', 'Plum FaceWash - 500ml'],
    price: '₹299',
    offer: '33%OFF',
    rating: '4.1',
    tag: 'Instant visible result',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product2.jpg'),
    ],
    description: 'Smooth & shiny hair',
    reviews: 3100,
  },
  {
    id: '3',
    name: ['Detan — Face', 'Foaming Face Wash Gel'],
    price: '₹299',
    offer: '33%OFF',
    rating: '4.1',
    tag: 'Instant visible result',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg'),
    ],
    description: 'Smooth & shiny hair',
    reviews: 3100,
  },
  {
    id: '4',
    name: ['Nivea Hair Cream', 'Foaming Fash Wash Gel'],
    price: '₹299',
    offer: '20%OFF',
    rating: '4.1',
    tag: 'Salon grade',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg'),
    ],
    description: 'Detox & deep clean',
    reviews: 2750,
  },
  {
    id: '5',
    name: ['Shave Cream ', 'MediCube Hair Mask'],
    price: '₹299',
    offer: '25%OFF',
    rating: '4.1',
    tag: '100% natural oil',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product3.jpg'),
    ],
    description: 'Anti-dandruff formula',
    reviews: 3300,
  },
  {
    id: '6',
    name: ['Detan — Face', 'Foaming Face Wash'],
    price: '₹299',
    offer: '33%OFF',
    rating: '4.1',
    tag: 'Instant visible result',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg'),
    ],
    description: 'Smooth & shiny hair',
    reviews: 3100,
  },
  {
    id: '7',
    name: ['Nivea Hair spa', 'Plum FaceWash 50ml'],
    price: '₹299',
    offer: '20%OFF',
    rating: '4.1',
    tag: 'Salon grade',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product2.jpg'),
    ],
    description: 'Smooth & shiny hair',
    reviews: 3100,
  },
  {
    id: '8',
    name: ['Shave Cream ', 'MediCube Hair Mask'],
    price: '₹299',
    offer: '25%OFF',
    rating: '4.1',
    tag: '100% natural oil',
    image: [
      require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product3.jpg'),
    ],
    description: 'Anti-dandruff formula',
    reviews: 3300,
  },
];

const services = [
  {
    id: '1',
    name: 'Hair Cut',
    price: '₹350.00',
    desc: 'Stylish cut with blow dry',
    image: [
      require('../../assets/images/haircut1.png'),
      require('../../assets/images/man-service1.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '2',
    name: 'Hair Coloring',
    price: '₹400.00',
    desc: 'Long-lasting shades',
    image: [
      require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '3',
    name: 'Hair Coloring',
    price: '₹400.00',
    desc: 'Long-lasting shades',
    image: [
      require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service2.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '4',
    name: 'Facial',
    price: '₹600.00',
    desc: 'Glow facial therapy',
    image: [
      require('../../assets/images/facial.jpg'),
      require('../../assets/images/man-service3.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '5',
    name: 'Hair Cut',
    price: '₹350.00',
    desc: 'Stylish cut with blow dry',
    image: [
      require('../../assets/images/haircut1.png'),
      require('../../assets/images/man-service4.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '6',
    name: 'Hair Coloring',
    price: '₹400.00',
    desc: 'Long-lasting shades',
    image: [
      require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '7',
    name: 'Facial',
    price: '₹600.00',
    desc: 'Glow facial therapy',
    image: [
      require('../../assets/images/facial.jpg'),
      require('../../assets/images/man-service6.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
  {
    id: '8',
    name: 'Hair Coloring',
    price: '₹400.00',
    desc: 'Long-lasting shades',
    image: [
      require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg'),
    ],
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [
      { product: 'beard cut', price: 500 },
      { product: 'beard cut', price: 900 },
    ],
  },
];

const Catelog = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Products');
  const data = activeTab === 'Products' ? products : 'Services';
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Head title="Catelog" />
      <View style={styles.toggleContainer}>
=======
   {
      id: '1',
      name: ['Face Wash — 100 ml', "Golden Glow Peel Off"],
      price: '₹299',
      offer: '25%OFF',
      rating: '4.1',
      tag: '100% natural oil',
      image: [require('../../assets/images/male-product1.jpg'),
      require('../../assets/images/female-product1.jpg')
      ],
      description: '100% natural oil',
      reviews: 5802,
    },
    {
      id: '2',
      name: ['Det Fairness Cream', "Plum FaceWash - 500ml"],
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product2.jpg')
      ],
      description: 'Smooth & shiny hair',
      reviews: 3100,
    },
     {
      id: '3',
      name: ['Detan — Face', 'Foaming Face Wash Gel'],
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg')
      ],
      description: 'Smooth & shiny hair',
      reviews: 3100,
    },
    {
      id: '4',
      name: ['Nivea Hair Cream', 'Foaming Fash Wash Gel'],
      price: '₹299',
      offer: '20%OFF',
      rating: '4.1',
      tag: 'Salon grade',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg')
      ],
      description: 'Detox & deep clean',
      reviews: 2750,
    },
    {
      id: '5',
      name: ['Shave Cream ', 'MediCube Hair Mask'],
      price: '₹299',
      offer: '25%OFF',
      rating: '4.1',
      tag: '100% natural oil',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product3.jpg')
      ],
      description: 'Anti-dandruff formula',
      reviews: 3300,
    },
    {
      id: '6',
      name: ['Detan — Face', 'Foaming Face Wash'],
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product4.jpg')
      ],
      description: 'Smooth & shiny hair',
      reviews: 3100,
    },
    {
      id: '7',
      name: ['Nivea Hair spa', "Plum FaceWash 50ml"],
      price: '₹299',
      offer: '20%OFF',
      rating: '4.1',
      tag: 'Salon grade',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product2.jpg')
      ],
      description: 'Smooth & shiny hair',
      reviews: 3100,
    },
    {
      id: '8',
      name: ['Shave Cream ', 'MediCube Hair Mask'],
      price: '₹299',
      offer: '25%OFF',
      rating: '4.1',
      tag: '100% natural oil',
      image: [require('../../assets/images/male-product11.jpg'),
      require('../../assets/images/female-product3.jpg')
      ],
      description: 'Anti-dandruff formula',
      reviews: 3300,
    },
];

const services = [
    {
      id: '1',
      name: 'Hair Cut',
      price: '₹350.00',
      desc: 'Stylish cut with blow dry',
      image: [require('../../assets/images/haircut1.png'),
      require('../../assets/images/man-service1.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
      {
      id: '2',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg')],
      highlights: ['Wash & trim included', 'Modern Styling', '1hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
    {
      id: '3',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service2.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
    {
      id: '4',
      name: 'Facial',
      price: '₹600.00',
      desc: 'Glow facial therapy',
      image: [require('../../assets/images/facial.jpg'),
      require('../../assets/images/man-service3.jpg'),],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
    {
      id: '5',
      name: 'Hair Cut',
      price: '₹350.00',
      desc: 'Stylish cut with blow dry',
      image: [require('../../assets/images/haircut1.png'),
      require('../../assets/images/man-service4.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
    {
      id: '6',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
    {
      id: '7',
      name: 'Facial',
      price: '₹600.00',
      desc: 'Glow facial therapy',
      image: [require('../../assets/images/facial.jpg'),
      require('../../assets/images/man-service6.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
      {
      id: '8',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
      require('../../assets/images/man-service5.jpg')
      ],
      highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
      extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
    },
  ];

const Catelog = () => {
    const { theme } = useTheme();
     const [activeTab, setActiveTab] = useState('Products');
     const data = activeTab === 'Products' ? products : 'Services';
       const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Head title="Catelog" />
             <View style={styles.toggleContainer}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftButton,
<<<<<<< HEAD
            activeTab === 'Products' && [
              styles.activeButton,
              { backgroundColor: COLORS.primary },
            ],
=======
            activeTab === 'Products' && [styles.activeButton,{backgroundColor : COLORS.primary}],
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
            activeTab === 'Services' && [
              styles.activeButton,
              { backgroundColor: COLORS.primary },
            ],
=======
            activeTab === 'Services' &&  [styles.activeButton,{backgroundColor : COLORS.primary}],
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
          ]}
          onPress={() => setActiveTab('Services')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'Services' && styles.activeText,
            ]}
          >
<<<<<<< HEAD
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
          contentContainerStyle={{
            paddingHorizontal: wp('3%'),
            alignSelf: 'center',
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  product: { ...item, image: item.image[0] },
                })
              }
              android_ripple={{ color: 'transparent' }}
              activeOpacity={1}
            >
              <View style={styles.productCard}>
                <Image source={item.image[0]} style={styles.productImage} />
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name[1]}
                </Text>
                <Text style={styles.productPrice}>
                  {item.price}{' '}
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
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: wp('2%'),
            alignSelf: 'center',
          }}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={item.image[1]} style={styles.serviceImage} />
              <View style={styles.nameItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price}</Text>
              </View>
              <Text style={styles.serviceDesc}>{item.desc}</Text>
              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: COLORS.primary }]}
                onPress={() =>
                  navigation.navigate('ServiceDetails', {
                    item: { ...item, image: item.image[0] },
                  })
                }
              >
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
=======
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
        onPress={() => navigation.navigate("ProductDetails", { product: { ...item, image: item.image[0] } })}
        android_ripple={{ color: 'transparent' }}
        activeOpacity={1}
      >
        <View style={styles.productCard}>
          <Image
            source={item.image[0]}
            style={styles.productImage} 
          />
          <Text style={styles.productName} numberOfLines={2}>
            {item.name[1]}
          </Text>
          <Text style={styles.productPrice}>
            {item.price}{' '}
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


 {activeTab === 'Services' && <FlatList
             data={services}
             
             showsHorizontalScrollIndicator={false}
             keyExtractor={item => item.id}
             numColumns={2}
             contentContainerStyle={{ paddingHorizontal: wp('2%') , alignSelf : 'center' }}
             renderItem={({ item }) => (
               <View style={styles.serviceCard}>
                 <Image source={
                 item.image[1] 
                 } style={styles.serviceImage} />
                 <View style={styles.nameItem}>
                   <Text style={styles.serviceName}>{item.name}</Text>
                   <Text style={styles.servicePrice}>{item.price}</Text>
                 </View>
                 <Text style={styles.serviceDesc}>{item.desc}</Text>
                 <TouchableOpacity style={[styles.bookBtn,{backgroundColor : COLORS.primary}]} onPress={() => navigation.navigate('ServiceDetails', {
                   item: { ...item, image: item.image[0] }
                 })}>
                   <Text style={styles.bookBtnText}>Book now</Text>
                 </TouchableOpacity>
               </View>
             )}
           />}
        </SafeAreaView>
    );
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
};

export default Catelog;

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
=======

const styles = StyleSheet.create({
    container: {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
<<<<<<< HEAD
    marginHorizontal: wp('4%'), // responsive horizontal margin
    marginVertical: hp('1%'), // responsive vertical margin
    backgroundColor: '#948a8aff',
    borderRadius: wp('2%'), // responsive radius
    padding: wp('2%'), // responsive padding
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp('1.8%'), // responsive vertical padding
=======
    marginHorizontal: wp('4%'),   // responsive horizontal margin
    marginVertical: hp('1%'),     // responsive vertical margin
    backgroundColor: '#948a8aff',
    borderRadius: wp('2%'),       // responsive radius
    padding: wp('2%'),          // responsive padding
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp('1.8%'),  // responsive vertical padding
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
  activeButton: {},
  toggleText: {
    fontSize: wp('4%'), // responsive font size
=======
  activeButton: {
  },
  toggleText: {
    fontSize: wp('4%'),           // responsive font size
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    fontWeight: '500',
    color: '#f4efefff',
  },
  activeText: {
    color: '#f5f0f0ff',
  },
<<<<<<< HEAD
  productCard: {
=======
 productCard: {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
    height: hp('31%'),
=======
    height : hp('31%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  productImage: {
    width: '100%',
    height: hp('13%'), // Increased from 90
<<<<<<< HEAD
    borderRadius: wp('3%'), // Increased from 10
=======
    borderRadius: wp('3%') // Increased from 10
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  productName: {
    marginTop: hp('1%'),
    fontWeight: '700',
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
=======
    fontFamily: "Poppins-Medium"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  productPrice: {
    color: '#777',
    marginTop: hp('0.3%'),
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
=======
    fontFamily: "Poppins-Medium"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('3%'),
    backgroundColor: '#F0F0F0',
<<<<<<< HEAD
    alignSelf: 'flex-start',
=======
    alignSelf: 'flex-start'
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  pillText: {
    fontSize: wp('3%'),
    marginLeft: wp('1%'),
    color: '#333',
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
  },
  serviceCard: {
=======
    fontFamily: "Poppins-Medium"
  },
 serviceCard: {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
    flex: 1,
    fontFamily: 'Poppins-Medium',
=======
    flex: 1
    , fontFamily: "Poppins-Medium"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  servicePrice: {
    fontSize: wp('3%'),
    fontWeight: '500',
<<<<<<< HEAD
    color: '#0a0909ff',
    fontFamily: 'Poppins-Medium',
=======
    color: '#0a0909ff'
    , fontFamily: "Poppins-Medium"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
    marginTop: hp('1%'),
=======
    marginTop: hp('1%')
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  bookBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: wp('3%'),
<<<<<<< HEAD
    fontFamily: 'Poppins-Medium',
=======
    fontFamily: "Poppins-Medium"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
});
