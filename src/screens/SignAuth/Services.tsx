import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // ✅ import your theme hook
import Head from '../../components/Head';


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

const categories = [
  { name: 'Haircut', image: require('../../assets/images/haircut.jpg') },
  { name: 'Hair coloring', image: require('../../assets/images/haircolor.jpg') },
  { name: 'Facial', image: require('../../assets/images/facial.jpg') },
  { name: 'Beard', image: require('../../assets/images/beard.jpg') },
  { name: 'Nail', image: require('../../assets/images/nail.jpg') },
  { name: 'Haircut', image: require('../../assets/images/haircut.jpg') },
  { name: 'Hair coloring', image: require('../../assets/images/haircolor.jpg') },
  { name: 'Facial', image: require('../../assets/images/facial.jpg') },
  { name: 'Beard', image: require('../../assets/images/beard.jpg') },
  { name: 'Nail', image: require('../../assets/images/nail.jpg') },
];

const services: Service[] = [
  {
    name: 'Hair Cut',
    price: 350,
    desc: 'Stylish cut with blow dry',
    image: require('../../assets/images/images_11.png'),
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    name: 'Hair coloring',
    price: 500,
    desc: 'Stylish cut with blow dry',
    image: require('../../assets/images/image_1.png'),
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    name: 'Facial',
    price: 700,
    desc: 'For healthy, radiant skin',
    image: require('../../assets/images/images__13.png'),
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    name: 'Beard Trim',
    price: 299,
    desc: 'Shape and stylish beard',
    image: require('../../assets/images/images__14.png'),
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
  {
    name: 'Nail art',
    price: 300,
    desc: 'Creative nails',
    image: require('../../assets/images/images__15.png'),
    highlights: ['Wash & trim included', 'Modern Styling', '1 hr Duration'],
    extras: [{ product: 'beard cut', price: 500 }, { product: 'beard cut', price: 900 }],
  },
];

export default function ServicesScreen() {
  const [storySelect, setStorySelect] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Head title="Services" />
      {/* Services List */}
      <FlatList
        horizontal
        data={categories}
        style={{ height: hp('18%'), paddingBottom: hp('2%') }}

        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: hp('1%'),
          paddingHorizontal: wp('2%'),
          paddingBottom: hp('1%')

        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => setStorySelect(index)}>
            <View
              style={{
                width: wp('19%'),
                height: wp('19%'),
                borderRadius: wp('20%') / 2,
                borderColor: storySelect === index ? '#F6B745' : 'transparent',
                borderWidth: wp('0.7%'),
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp('0.5%'),
                // white border background
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: wp('16%'),   // slightly smaller than parent
                  height: wp('16%'),
                  borderRadius: wp('16%') / 2,
                  resizeMode: 'cover',
                }}
              />
            </View>

            <Text style={[styles.categoryText, { color: theme.textPrimary }]}>{item.name}</Text>

          </TouchableOpacity>
        )}
      />
      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.MainView, { backgroundColor: theme.card }]}>
            <View style={styles.imgContainer}>
              <Image source={item.image} style={styles.sectionImage} />
            </View>
            <View style={styles.rightContainer}>
              <Text style={[styles.mainText, { color: theme.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.price, { color: theme.textSecondary }]}>₹{item.price}</Text>
              <Text style={[styles.desc, { color: theme.textSecondary }]}>{item.desc}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => 
                  navigation.navigate('ServiceDetails', { item })
                }
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoryScroll: {
    paddingHorizontal: wp('2%')
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: wp('4%'),
    width: wp('20%')
  },
  categoryImage: {
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('10%'),
    marginBottom: hp('0.5%')
  },
  categoryText: {
    fontSize: wp('3.2%'),
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: wp('4%'),
    fontFamily: 'Poppins-Medium'
  },
  MainView: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('1%'),
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  imgContainer: {
    height: hp('20%'),
    width: wp('35%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sectionImage: {
    width: '100%',
    alignSelf: 'flex-end',
    height: '90%',
    resizeMode: 'cover',
  },
  mainText: {
    fontSize: wp('5%'),
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Poppins-Medium'
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium'
  },
  desc: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium'
  },
  bookButton: {
    backgroundColor: '#F6B745',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium'
  },
});
