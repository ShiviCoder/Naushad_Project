import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
  SafeAreaViewBase,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { WebView } from 'react-native-webview';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLikedProducts } from '../../context/LikedProductsContext';
import { products as ProductData } from '../OurProducts/ProductsArray';
import Head from '../../components/Head';
import { requestAppPermissions } from '../../utils/Permission';
import COLORS from '../../utils/Colors';
import RadioButton from '../../components/RadioButton';

const { width } = Dimensions.get('window');

const VideoCard = ({ videoId }: { videoId: string }) => {
  const cardWidth = wp('40%');
  const cardHeight = hp('40%'); // 16:9 ratio
  const [playing, setPlaying] = useState(false);

  const html = `
   <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent;
            height : '100%',
            width : '100%'
          }
           .video-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          iframe {
           position: absolute;
            top: 50%;
            left: 50%;
            width: 177.77%; /* 100 / (9/16) to maintain cover */
            height: 100%;
            transform: translate(-50%, -50%);
            border: 0;
          }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&fs=0&autoplay=${
    playing ? 1 : 0
  }"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  try {
    return (
      <View
        style={{
          width: cardWidth,
          height: cardHeight,
          overflow: 'hidden',
          borderRadius: wp('2%'),
          marginRight: wp('2%'),
          backgroundColor: '#dadada',
        }}
      >
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
          scrollEnabled={false}
        />

        {!playing && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -25 }, { translateY: -25 }],
              zIndex: 10,
            }}
            onPress={() => setPlaying(true)}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255,255,255,0.8)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  } catch (e) {
    console.log('Error rendering YouTubePlayer:', e);
    return <Text>Error loading video</Text>;
  }
};

const HomeScreen = () => {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ get current theme
  // Fixed Navigation handler function

  const { likedProducts } = useLikedProducts();
  const likedItems = ProductData.filter(p => likedProducts.includes(p.id));
  const [showLiked, setShowLiked] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestAppPermissions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    Animated.timing(translateY, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setRefreshing(false);
      Animated.timing(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const handleSectionNavigation = (section: string) => {
    switch (section) {
      case 'offers':
        console.log('Navigate to Special Offers Screen');
        break;
      case 'services':
        navigation.navigate('Services');
        break;
      case 'products':
        navigation.navigate('OurProducts');
        break;
      case 'videos':
        navigation.navigate('Videos');
        break;
      case 'certificates':
        navigation.navigate('Certificates');
        break;
      case 'packages':
        navigation.navigate('PackagesScreen');
        break;
      case 'productPackages':
        navigation.navigate('ProductPackageScreen');
        console.log('Navigate to Product Packages Screen');
        break;
      case 'homeServices':
        navigation.navigate('HomeServices');
        console.log('Navigate to Product Packages Screen');
        break;
      default:
        console.log('Unknown section');
    }
  };

  // Services (added short description)
  const services = [
    {
      id: '1',
      name: 'Hair Cut',
      price: '350.00',
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
      price: '400.00',
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
      id: '3',
      name: 'Facial',
      price: '600.00',
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
      id: '4',
      name: 'Hair Cut',
      price: '350.00',
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
      id: '5',
      name: 'Hair Coloring',
      price: '400.00',
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
      id: '6',
      name: 'Facial',
      price: '600.00',
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
  ];

  // Products (added rating + tag)
  const products = [
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
      id: '4',
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
      id: '5',
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
      id: '6',
      name: ['Nivea Hair spa', 'Plum FaceWash - 500ml'],
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
  ];

  // Videos row (thumbnails with play)
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTIyMjkxMiwiZXhwIjoxNzYxODI3NzEyfQ.pne-LG6PirEOcYyZcum8Fj-AGB7KiRdgUgk8cf1Q-V8';

        const res = await fetch('https://naushad.onrender.com/api/youtube', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 👈 token yahan lagta hai
          },
        });

        const data = await res.json();
        setVideos(data);
        console.log('Youtube Data:', data);
      } catch (err) {
        console.log('Error loading:', err);
      }
    };

    fetchVideos();
  }, []);

  // Certificates (two items like the mock)
  const [certificates, setCertificates] = useState<any[]>([]);
  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/certificates',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTIyMjkxMiwiZXhwIjoxNzYxODI3NzEyfQ.pne-LG6PirEOcYyZcum8Fj-AGB7KiRdgUgk8cf1Q-V8',
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      console.log('API Response:', json);

      // setCertificates to the data array from response
      setCertificates(json.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]); // fallback
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);
  // Packages (two-column cards)
  const packages = [
    {
      id: '1',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
      image: require('../../assets/pkgImage2.png'),
      discount: '🔖 Save ₹300 on festive booking',
      review: 23,
      rating: 4.5,
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
    {
      id: '2',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
      image: require('../../assets/pkgImage1.png'),
      discount: '🔖 Save ₹300 on festive booking',
      review: 23,
      rating: 4.5,
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
    {
      id: '3',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
      image: require('../../assets/pkgImage3.png'),
      discount: '🔖 Save ₹300 on festive booking',
      review: 23,
      rating: 4.5,
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
    {
      id: '4',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
      image: require('../../assets/pkgImage1.png'),
      review: 23,
      rating: 4.5,
      discount: '🔖 Save ₹300 on festive booking',
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
    {
      id: '5',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
      image: require('../../assets/pkgImage1.png'),
      review: 23,
      rating: 4.5,
      discount: '🔖 Save ₹300 on festive booking',
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
    {
      id: '6',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
      image: require('../../assets/pkgImage1.png'),
      review: 23,
      rating: 4.5,
      discount: '🔖 Save ₹300 on festive booking',
      serviceList: [
        'Cleansing & Scrubbing',
        'Steam & Blackhead Removal',
        'Relaxing Massage',
        'Hydrating Mask',
        'Skin Brightening Serum',
      ],
    },
  ];

  // Product packages (small horizontal cards)
  const [productPackages, setProductPackage] = useState([]);
  const fetchProductPackages = async () => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/product-packages',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTIyMjkxMiwiZXhwIjoxNzYxODI3NzEyfQ.pne-LG6PirEOcYyZcum8Fj-AGB7KiRdgUgk8cf1Q-V8', // Postman me jo token use kiya tha
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      console.log('Product package response : ', json);
      setProductPackage(json.data);
    } catch (err) {
      console.log('Product package error : ', err);
    }
  };

  useEffect(() => {
    fetchProductPackages();
  }, []);

  const offers = [
    {
      id: '1',
      title: 'Haircut',
      discount: '20% off',
      date: 'July 16 - July 24',
      imageMale: require('../../assets/images/man-offer.jpg'),
      imageFemale: require('../../assets/images/specialhaircut.png'),
    },
    {
      id: '2',
      title: 'Facial',
      discount: '15% off',
      date: 'July 20 - July 28',
      imageMale: require('../../assets/images/male-offer1.jpg'),
      imageFemale: require('../../assets/images/female-offer1.jpg'),
    },
    {
      id: '3',
      title: 'Spa',
      discount: '25% off',
      date: 'Aug 1 - Aug 10',
      imageMale: require('../../assets/images/male-offer2.jpg'),
      imageFemale: require('../../assets/images/female-offer2.jpg'),
    },
    {
      id: '4',
      title: 'Shaving',
      discount: '10% off',
      date: 'Aug 5 - Aug 15',
      imageMale: require('../../assets/images/male-offer3.jpg'),
      imageFemale: require('../../assets/images/female-offer3.jpg'),
    },
  ];

  const [homeServices, setHomeService] = useState([]);
  const fetchHomeServices = async () => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/home-services/',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTIyMjkxMiwiZXhwIjoxNzYxODI3NzEyfQ.pne-LG6PirEOcYyZcum8Fj-AGB7KiRdgUgk8cf1Q-V8', // Postman me jo token use kiya tha
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      console.log('Home services : ', json);
      setHomeService(json.data);
    } catch (error) {
      console.log('Home services error : ', error);
    }
  };
  useEffect(() => {
    fetchHomeServices();
  }, []);

  const [aboutData, setAboutData] = useState([]);
  const fetchAboutData = async () => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/about-salon',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTIyMjkxMiwiZXhwIjoxNzYxODI3NzEyfQ.pne-LG6PirEOcYyZcum8Fj-AGB7KiRdgUgk8cf1Q-V8',
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      console.log('About Data : ', json);
      setAboutData(json.data);
    } catch (error) {
      console.log('About Data : ', error);
    }
  };
  useEffect(() => {
    fetchAboutData();
  }, []);
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {showLiked ? (
        likedItems.length > 0 ? (
          <View
            style={{
              flex: 1,
              backgroundColor: theme.dark ? '#000' : '#fff',
              paddingVertical: hp('2%'),
              paddingHorizontal: wp('3%'),
            }}
          >
            {/* 🔹 Header (only once) */}
            <Head title="Liked Products" />

            {/* 🔹 Liked products list */}
            <FlatList
              data={likedItems}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => {
                const selectedImage = Array.isArray(item.image)
                  ? typeof item.image[0] === 'string'
                    ? { uri: item.image[0] }
                    : item.image[0]
                  : typeof item.image === 'string'
                  ? { uri: item.image }
                  : item.image;

                return (
                  <View
                    style={[
                      styles.likedProductCard,
                      {
                        backgroundColor: '#FFFFFF',
                        borderColor: theme.dark ? '#333' : '#ddd',
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductDetails', { product: item })
                      }
                    >
                      <Image
                        resizeMode="cover"
                        source={selectedImage}
                        style={styles.ImageStyle}
                      />

                      <Text numberOfLines={1} style={[styles.likedProductName]}>
                        {item.name}
                      </Text>

                      <View style={styles.OurterPriceContainer}>
                        <View style={styles.InnerPriceContainer}>
                          <Text style={[styles.priceStyle]}>{item.price}</Text>
                          <Text style={[styles.oldPriceStyle]}>
                            {item.oldPrice}
                          </Text>
                        </View>
                        <Text
                          style={[styles.DiscountStyle, { color: '#42BA86' }]}
                        >
                          {item.discount}
                        </Text>
                      </View>

                      <View style={styles.descContain}>
                        <Image
                          resizeMode="contain"
                          source={item.featureIcon}
                          style={styles.featureIconStyle}
                        />
                        <Text
                          style={[styles.DescStyle]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.OutRatContain}>
                      <View
                        style={[
                          styles.InnerRatContain,
                          {
                            backgroundColor: theme.dark ? '#0f8a43' : '#09932B',
                          },
                        ]}
                      >
                        <Text
                          style={[styles.ratingTextStyle, { color: '#fff' }]}
                        >
                          {item.rating}
                        </Text>
                        <Image
                          resizeMode="contain"
                          style={styles.starStyle}
                          source={require('../../assets/OurProduct/star1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.reviewStyle,
                          { color: theme.dark ? '#ccc' : '#ACACAC' },
                        ]}
                      >
                        ({item.reviews})
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          // 🔹 Empty state
          <View
            style={{
              flex: 1,
              backgroundColor: theme.dark ? '#000' : '#fff',
              paddingVertical: hp('2%'),
              paddingHorizontal: wp('3%'),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: wp('25%'),
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.replace('MainTabs', { from: 'Home' })}
                style={{ width: wp('5%'), height: wp('10%') }}
              >
                <Icon
                  name="chevron-back"
                  size={wp('7%')}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: wp('5%'),
                  fontWeight: 'bold',
                  color: theme.textPrimary,
                }}
              >
                Liked Products
              </Text>
            </View>

            <Text
              style={{
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('3%'),
                fontSize: wp('5%'),
                color: theme.textPrimary,
              }}
            >
              No liked products yet ❤️
            </Text>
          </View>
        )
      ) : (
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            contentContainerStyle={{ paddingBottom: hp('10%') }}
          >
            {/* Fixed Header */}
            <View
              style={[
                styles.header,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
            >
              {/* Left Section */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexShrink: 1,
                }}
              >
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/location.png')}
                    style={[
                      styles.locationbtn,
                      { tintColor: theme.textPrimary },
                    ]}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: wp('3%'),
                    width: wp('20%'),
                  }}
                >
                  <Text
                    style={[styles.welcomeText, { color: theme.textPrimary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Hi {gender === 'Male' ? 'Rahul' : 'Aanchal'} !
                  </Text>
                  <Text
                    style={[styles.locationText, { color: theme.textPrimary }]}
                  >
                    {gender === 'Male' ? 'Pune' : 'Indore'}
                  </Text>
                </View>
              </View>

              {/* Center Logo */}
              <Image
                source={require('../../assets/images/logo.png')}
                style={[styles.logo, { tintColor: theme.textPrimary }]}
              />

              {/* Right Icons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                  <Image
                    source={require('../../assets/cart2.png')}
                    style={{
                      marginLeft: wp('2%'),
                      width: wp('7%'),
                      height: wp('7%'),
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Notification')}
                >
                  <Image
                    source={require('../../assets/notification3.png')}
                    style={{
                      marginLeft: wp('2%'),
                      width: wp('7%'),
                      height: wp('7%'),
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowLiked(!showLiked)}>
                  <View
                    style={{
                      width: wp('7%'),
                      height: wp('7%'),
                      borderRadius: wp('5%'),
                      borderWidth: wp('0.4%'),
                      borderColor: '#aca6a6ff',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: wp('2%'),
                      backgroundColor: '#fff',
                    }}
                  >
                    <Image
                      source={require('../../assets/heart.png')}
                      style={{ width: wp('3.5%'), height: wp('3.5%') }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.genderToggleContainer}>
              {/* Label Row */}
              <RadioButton
                type="gender"
                selected={gender}
                onSelect={value => setGender(value)}
                labels={['Male', 'Female']}
              />
            </View>

          {/* Special Offer split card */}
          <View style={{ height: hp('27%'), marginBottom: hp('4%') }}>
            <Swiper
              autoplay
              autoplayTimeout={3}
              showsPagination
              dotStyle={{ backgroundColor: "#ccc", }}
              activeDotStyle={{ backgroundColor: COLORS.primary, }}
              paginationStyle={{ top: hp('28%') }}
            >
              {offers.map((item) => (
                <View key={item.id} style={[styles.offerCard, { backgroundColor: COLORS.primary }]}>
                  <View style={[styles.offerLeft, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.offerBig}>{item.title}</Text>
                    <Text style={styles.offerSmall}>{item.discount}</Text>
                    <Text style={styles.offerDate}>{item.date}</Text>
                    <TouchableOpacity
                      style={styles.offerBtn}
                      onPress={() => navigation.navigate("OfferScreen")}
                    >
                      <Text style={styles.offerBtnText}>Offer now</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={gender === "Male" ? item.imageMale : item.imageFemale}
                    style={styles.offerRightImage}
                  />
                </View>
              ))}
            </Swiper>
          </View>

          {/* Services Section with navigation */}
          <SectionTitle
            title="Our services"
            onPress={() => handleSectionNavigation('services')}
          />
          <FlatList
            data={services}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: wp('2%') }}
            renderItem={({ item }) => (
              <View style={styles.serviceCard}>
                <Image source={
                  gender === 'Male' ? item.image[1] : item.image[0]
                } style={styles.serviceImage} />
                <View style={styles.nameItem}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.servicePrice}>₹{item.price}</Text>
                </View>
                <Text style={styles.serviceDesc}>{item.desc}</Text>
                <View style={{ flex: 1 }} />

                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: COLORS.primary }]}
                  onPress={() =>
                    navigation.navigate('ServiceDetails', {
                      item: {
                        ...item,
                        image: gender === 'Male' ? item.image[1] : item.image[0]
                      }
                    })
                  }
                >
                  <Text style={styles.bookBtnText}>Book now</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Appointment Banner */}
          <ImageBackground
            resizeMode='cover'
            source={
              gender === 'Male'
                ? require('../../assets/images/man-banner.jpg')
                : require('../../assets/images/image1.jpg')
            }
            style={styles.appointmentBanner}

          >
            <View style={styles.overlay}>
              <Text style={styles.bannerText}>Book your appointment today</Text>
              <Text style={styles.bannerText}>
                and take your look to the next level
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("BookAppointmentScreen", { showTab: true })}
                style={[styles.bookNowBtn, { backgroundColor: COLORS.primary }]}>
                <Text style={[styles.bookBtnText, { color: '#111', fontWeight: 'bold' }]}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Products Section with navigation */}
          <SectionTitle
            title="Get our products"
            onPress={() => handleSectionNavigation('products')}
          />
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: wp('1.5%') }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductDetails", { product: { ...item, image: gender === 'Male' ? item.image[0] : item.image[1] } })}
                android_ripple={{ color: 'transparent' }}
                activeOpacity={1}

              >
                <View style={styles.productCard}>
                  <Image
                    source={
                      gender === 'Male' ? item.image[0] : item.image[1]
                    }
                    style={styles.productImage} />
                  <Text style={styles.productName} numberOfLines={2}>
                    {gender === 'Male' ? item.name[0] : item.name[1]}
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

          {/* Videos with navigation */}
          <SectionTitle
            title="Videos"
            onPress={() => handleSectionNavigation('videos')}
          />
          <FlatList
            data={videos}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: wp('3%'), marginVertical: hp('2%') }}
            renderItem={({ item }) =>
              <VideoCard videoId={item.videoId} />
            }
          />

          {/* Certificates with navigation */}
          <SectionTitle
            title="Our Certificates"
            onPress={() => handleSectionNavigation('certificates')}
          />
          <FlatList
            data={certificates}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              paddingHorizontal: wp('2%'),
              backgroundColor: COLORS.primary,
              borderRadius: wp('3%'),
              marginVertical: hp('2%')
            }}
            style={{
              marginHorizontal: wp('3%'), // FlatList ke bahar spacing
            }}
            renderItem={({ item }) => (
              <View style={styles.certItem}>
                <Image
                  source={{ uri: `https://naushad.onrender.com/${item.imageUrl}` }}
                  style={styles.certImage}
                />
              </View>
            </View>
            {/* Special Offers header with navigation */}
            <SectionTitle
              title="Special Offers"
              showSeeAll={false}
              color={theme.textPrimary}
            />

            {/* Special Offer split card */}
            <View style={{ height: hp('27%'), marginBottom: hp('4%') }}>
              <Swiper
                autoplay
                autoplayTimeout={3}
                showsPagination
                dotStyle={{ backgroundColor: '#ccc' }}
                activeDotStyle={{ backgroundColor: COLORS.primary }}
                paginationStyle={{ top: hp('28%') }}
              >
                {offers.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.offerCard,
                      { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <View
                      style={[
                        styles.offerLeft,
                        { backgroundColor: COLORS.primary },
                      ]}
                    >
                      <Text style={styles.offerBig}>{item.title}</Text>
                      <Text style={styles.offerSmall}>{item.discount}</Text>
                      <Text style={styles.offerDate}>{item.date}</Text>
                      <TouchableOpacity
                        style={styles.offerBtn}
                        onPress={() => navigation.navigate('OfferScreen')}
                      >
                        <Text style={styles.offerBtnText}>Offer now</Text>
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={
                        gender === 'Male' ? item.imageMale : item.imageFemale
                      }
                      style={styles.offerRightImage}
                    />
                  </View>
                ))}
              </Swiper>
            </View>

            {/* Services Section with navigation */}
            <SectionTitle
              title="Our services"
              onPress={() => handleSectionNavigation('services')}
            />
            <FlatList
              data={services}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: wp('2%') }}
              renderItem={({ item }) => (
                <View style={styles.serviceCard}>
                  <Image
                    source={gender === 'Male' ? item.image[1] : item.image[0]}
                    style={styles.serviceImage}
                  />
                  <View style={styles.nameItem}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.servicePrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.serviceDesc}>{item.desc}</Text>
                  <View style={{ flex: 1 }} />

                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate('ServiceDetails', {
                        item: {
                          ...item,
                          image:
                            gender === 'Male' ? item.image[1] : item.image[0],
                        },
                      })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book now</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Appointment Banner */}
            <ImageBackground
              resizeMode="cover"
              source={
                gender === 'Male'
                  ? require('../../assets/images/man-banner.jpg')
                  : require('../../assets/images/image1.jpg')
              }
              style={styles.appointmentBanner}
            >
              <View style={styles.overlay}>
                <Text style={styles.bannerText}>
                  Book your appointment today
                </Text>
                <Text style={styles.bannerText}>
                  and take your look to the next level
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BookAppointmentScreen', {
                      showTab: true,
                    })
                  }
                  style={[
                    styles.bookNowBtn,
                    { backgroundColor: COLORS.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.bookBtnText,
                      { color: '#111', fontWeight: 'bold' },
                    ]}
                  >
                    Book Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>

            {/* Products Section with navigation */}
            <SectionTitle
              title="Get our products"
              onPress={() => handleSectionNavigation('products')}
            />
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: wp('1.5%') }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      product: {
                        ...item,
                        image:
                          gender === 'Male' ? item.image[0] : item.image[1],
                      },
                    })
                  }
                  android_ripple={{ color: 'transparent' }}
                  activeOpacity={1}
                >
                  <View style={styles.productCard}>
                    <Image
                      source={gender === 'Male' ? item.image[0] : item.image[1]}
                      style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={2}>
                      {gender === 'Male' ? item.name[0] : item.name[1]}
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
                      <View
                        style={[styles.pill, { backgroundColor: '#E8F6EF' }]}
                      >
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

            {/* Videos with navigation */}
            <SectionTitle
              title="Videos"
              onPress={() => handleSectionNavigation('videos')}
            />
            <FlatList
              data={videos}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                paddingHorizontal: wp('3%'),
                marginVertical: hp('2%'),
              }}
              renderItem={({ item }) => <VideoCard videoId={item.videoId} />}
            />

            {/* Certificates with navigation */}
            <SectionTitle
              title="Our Certificates"
              onPress={() => handleSectionNavigation('certificates')}
            />
            <FlatList
              data={certificates}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              contentContainerStyle={{
                paddingHorizontal: wp('2%'),
                backgroundColor: COLORS.primary,
                borderRadius: wp('3%'),
                marginVertical: hp('2%'),
              }}
              style={{
                marginHorizontal: wp('3%'), // FlatList ke bahar spacing
              }}
              renderItem={({ item }) => (
                <View style={styles.certItem}>
                  <Image
                    source={{
                      uri: `https://naushad.onrender.com/${item.imageUrl}`,
                    }}
                    style={styles.certImage}
                  />
                  <Text numberOfLines={2} style={styles.certCaption}>
                    {item.title}
                  </Text>
                </View>
              )}
            />

            {/* About our salon - No "See all" button needed */}
            <SectionTitle title="About our salon" showSeeAll={false} />

            <View
              style={[
                styles.aboutContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <FlatList
                data={aboutData}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={item => {
                  return (
                    <View
                      style={[
                        styles.aboutBox,
                        { backgroundColor: theme.textPrimary },
                      ]}
                    >
                      <Image
                        source={item.icon}
                        style={{ width: wp('5%'), height: wp('5%') }}
                      />
                      <Text
                        style={[styles.aboutTop, { color: theme.background }]}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.aboutBottom,
                          { color: theme.background },
                        ]}
                      >
                        {item.value}
                      </Text>
                    </View>
                  );
                }}
                contentContainerStyle={{ paddingHorizontal: wp('2%') }}
              />
            </View>

            {/* Our Packages (2-up grid) with navigation */}
            <SectionTitle
              title="Our Packages"
              onPress={() => handleSectionNavigation('packages')}
            />
            <FlatList
              data={packages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: wp('2%') }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.packageCard,
                    { backgroundColor: COLORS.secondary },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text style={styles.packageTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.packagePrice}>{item.price}</Text>
                  </View>
                  <View style={{ marginTop: hp('2%') }}>
                    <Text style={styles.packageLabel}>
                      <Text style={styles.packageLabelText}>Services:- </Text>
                      <Text style={styles.packageValue}>{item.services}</Text>
                    </Text>
                    <Text style={[styles.packageLabel, { marginTop: 4 }]}>
                      <Text style={styles.packageLabelText}>About:- </Text>
                      <Text style={styles.packageValue}>{item.about}</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.packageBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate('PackageDetails', { item })
                    }
                  >
                    <Text style={styles.packageBtnText}>Book now</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Product Packages (horizontal small cards) with navigation */}
            <SectionTitle
              title="Product Packages"
              onPress={() => handleSectionNavigation('productPackages')}
            />
            <FlatList
              data={productPackages}
              horizontal
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              } // ✅ fallback
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginHorizontal: wp('2%'),
                    paddingVertical: hp('2%'),
                    marginBottom: hp('2%'),
                  }}
                >
                  <Shadow
                    distance={3}
                    startColor={COLORS.shadow}
                    offset={[0, 13]}
                    style={{ borderRadius: wp('4%') }}
                  >
                    <View
                      style={{
                        width: wp('35%'),
                        height: hp('23%'),
                        backgroundColor: '#EDEDED',
                        borderRadius: wp('4%'),
                        overflow: 'hidden',
                        alignItems: 'center',
                      }}
                    >
                      {/* === Folded Top Corners === */}
                      <Svg
                        height={hp('25%')}
                        width={wp('35%')}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                      >
                        {/* Left Fold */}
                        <Polygon
                          points={`0,0 ${wp('6%')},0 0,${wp('6%')}`}
                          fill={theme.background}
                        />
                        {/* Right Fold */}
                        <Polygon
                          points={`${wp('35%')},0 ${
                            wp('35%') - wp('6%')
                          },0 ${wp('35%')},${wp('6%')}`}
                          fill={theme.background}
                        />
                      </Svg>

                      {/* === Header Hexagon === */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          alignItems: 'center',
                        }}
                      >
                        <Svg height={hp('6%')} width={wp('22%')}>
                          <Polygon
                            points={`0,0 ${wp('22%')},0 ${wp('22%')},${hp(
                              '3%',
                            )} ${wp('11%')},${hp('6%')} 0,${hp('3%')}`}
                            fill={COLORS.primary}
                          />
                        </Svg>
                        <Text
                          style={{
                            position: 'absolute',
                            top: hp('1%'),
                            color: 'white',
                            fontWeight: '600',
                            fontSize: hp('1.1%'),
                            alignSelf: 'center',
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {/* === Content === */}
                      <View style={{ marginTop: hp('8%'), width: '85%' }}>
                        <Text
                          style={{ fontSize: hp('1.3%'), fontWeight: '500' }}
                        >
                          Rate:-{' '}
                          <Text style={{ fontWeight: '700' }}>
                            ₹ {item.price}
                          </Text>
                        </Text>
                        <Text
                          style={{ fontSize: hp('1.3%'), fontWeight: '500' }}
                        >
                          Products:-{' '}
                          <Text style={{ fontWeight: '700' }}>
                            {item.products}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            marginTop: hp('1%'),
                            fontStyle: 'italic',
                            fontSize: hp('1.3%'),
                            color: COLORS.primary,
                            textAlign: 'center',
                          }}
                        >
                          {item.tagline}
                        </Text>
                      </View>

                      {/* === Button === */}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductPakage', { item })
                        }
                        style={{
                          backgroundColor: COLORS.primary,
                          paddingVertical: hp('0.8%'),
                          paddingHorizontal: wp('5%'),
                          borderRadius: wp('5%'),
                          marginTop: hp('1.5%'),
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: hp('1.3%'),
                          }}
                        >
                          Book now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Shadow>
                </View>
              )}
            />

            <SectionTitle
              title="Home services"
              onPress={() => handleSectionNavigation('homeServices')}
            />
            <FlatList
              data={homeServices}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              contentContainerStyle={{ paddingHorizontal: wp('2%') }}
              renderItem={({ item }) => (
                <View style={styles.serviceCard}>
                  <Image source={item.image} style={styles.serviceImage} />
                  <View style={styles.nameItem}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.servicePrice}>₹ {item.price}</Text>
                  </View>
                  <Text style={styles.serviceDesc}>{item.description}</Text>
                  <View style={{ flex: 1 }} />

                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate('ServiceDetails', {
                        item: { ...item, image: item.image },
                      })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book now</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

// Updated SectionTitle component with navigation support
const SectionTitle = ({
  title,
  onPress,
  showSeeAll = true,
}: {
  title: string;
  onPress?: () => void;
  showSeeAll?: boolean;
}) => {
  const { theme } = useTheme(); // ✅ get current theme

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: '#3939ebff' }]}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: hp('4%')
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
  },
  welcomeText: {
    fontSize: wp('3%'),
    fontWeight: '700',
    color: '#8E8E93',
    fontFamily: 'Poppins-Medium',
  },
  headerstyle: {
    alignSelf: 'center',
  },
  locationText: {
    fontSize: wp('4%'), // ↓ smaller than name
    fontWeight: '500', // regular weight
    color: '#090909ff',
    fontFamily: 'Poppins-Medium', // lighter grey (#8E8E93 ≈ iOS system grey)
  },
  locationbtn: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: '#7575759C',
  },
  topRightCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp('40%'), // Reduced from 154
    height: hp('10%'), // Reduced from 87
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  genderToggleContainer: {
    marginHorizontal: hp('2%'),
  },
  genderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('20%'),
    marginBottom: 8,
  },
  genderText: {
    fontSize: wp('3%'),
    fontWeight: '600',
  },
  genderToggle: {
    width: wp('15%'),
    height: hp('3%'),
    borderRadius: wp('5%'),
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleThumb: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    borderRadius: wp('5%'),
  },
  searchFilContain: {
    width: '97%',
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    marginHorizontal: wp('2%'),
    borderRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    marginVertical: hp('1%'),
    height: hp('5%'),
    borderWidth: wp('0.3%'),
    borderColor: '#dddddd1d',
    elevation: 1,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp('0.1%'),
    fontSize: wp('4%'),
    color: '#0e0d0dff',
    fontFamily: 'Poppins-Medium',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: hp('1%'), // Increased from 18
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18, // Increased from 16
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  seeAll: {
    color: '#20B2A6',
    fontWeight: '600',
    fontSize: 14,
  },
  // Offer split card
  offerCard: {
    marginHorizontal: wp('2%'),
    marginVertical: hp('2%'),
    borderRadius: wp('4%'), // Increased from 12
    elevation: 4, // Increased from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    height: hp('25%'),
    width: '93%',
    alignSelf: 'center',
  },
  offerLeft: {
    paddingHorizontal: wp('4%'), // Increased from 14
    justifyContent: 'flex-start',
    width: '50%',
  },
  offerBig: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: '#fff',
    marginTop: hp('2%'), // Changed from #ece8e8ff
    fontFamily: 'Poppins-Medium',
  },
  offerSmall: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff', // Changed from #f1ececff
    marginTop: hp('0.5%'),
    fontFamily: 'Poppins-Medium',
  },
  offerDate: {
    color: '#fff', // Changed from #eae9e3ff
    marginTop: hp('0.5%'),
    fontFamily: 'Poppins-Medium',
  },
  offerRightImage: {
    width: '50%', // Increased from 150
    resizeMode: 'cover',
    height: '100%',
    borderRadius: 0,
  },
  offerBtn: {
    backgroundColor: '#fff',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    marginTop: hp('4%'),
    // alignSelf: 'flex-start',
    paddingHorizontal: wp('2%'),
    // width:134.81,
    // height:32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBtnText: {
    color: '#111',
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },

  // Updated service card styles to match the design exactly
  serviceCard: {
    width: wp('38%'),
    marginHorizontal: wp('2%'),
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
    alignSelf: 'flex-start',
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
  appointmentBanner: {
    marginHorizontal: wp('4%'),
    marginVertical: hp('2%'), // Increased from 6
    height: hp('25%'),
    // borderRadius: 50, // Increased from 12
    overflow: 'hidden',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(232, 227, 227, 0.54)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#0c0b0bff',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  bookNowBtn: {
    paddingHorizontal: wp('5%'),
    borderRadius: wp('50%'),
    marginTop: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
  },

  productCard: {
    width: wp('40%'), // Increased from 160
    marginHorizontal: wp('2%'), // Increased from 5
    marginVertical: hp('2%'),
    borderRadius: wp('4%'), // Increased from 12
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'), // Increased from 10
  },
  productImage: {
    width: '100%',
    height: hp('13%'), // Increased from 90
    borderRadius: wp('3%'), // Increased from 10
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

  videoCard: {
    marginVertical: hp('3%'),
    marginHorizontal: wp('2%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
    backgroundColor: '#eee',
  },

  certItem: {
    width: wp('40%'),
    // backgroundColor: '#fff7dd',
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    marginHorizontal: wp('2'),
  },
  certImage: {
    width: wp('40%'),
    height: hp('15%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
  },
  certCaption: {
    fontSize: wp('3%'),
    textAlign: 'center',
    color: '#0d0d0dff',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: hp('2%'),
    paddingHorizontal: wp('1%'),
  },
  aboutBox: {
    width: wp('28%'),
    height: hp('15%'),
    backgroundColor: '#0a0a0aff',
    borderRadius: wp('5%'),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    elevation: 1,
    flexDirection: 'column',
    gap: hp('1%'),
  },
  aboutTop: {
    fontSize: wp('3.5%'),
    fontWeight: '800',
    color: '#f1eaeaff',
    textAlign: 'center',
  },
  aboutBottom: {
    fontSize: wp('3.5%'),
    fontWeight: '800',
    color: '#f4eeeeff',
    fontFamily: 'Poppins-Medium',
  },
  packageCard: {
    width: wp('65%'), // screen width ka 65%
    height: hp('22%'), // screen height ka 22%
    borderRadius: wp('3%'), // borderRadius bhi responsive
    borderWidth: wp('0.3%'), // borderWidth responsive
    borderColor: '#E5D4B1',
    paddingHorizontal: wp('4%'), // horizontal padding responsive
    paddingVertical: hp('2%'), // vertical padding responsive
    marginHorizontal: wp('1%'), // horizontal margin responsive
    marginVertical: hp('2%'), // vertical margin responsive
    elevation: 4,
    shadowOffset: { width: 0, height: hp('0.1%') }, // responsive shadow
    shadowOpacity: 0.08,
    shadowRadius: wp('5%'),        // shadow radius responsive
    borderTopRightRadius: wp('1%'),
    borderBottomLeftRadius: wp('1%'),
  },
  packageTitle: {
    fontSize: wp('4%'),
    fontWeight: '800',
    flex: 1,
    marginRight: wp('3%'),
    color: '#333',
    lineHeight: 20,
    fontFamily: 'Poppins-Medium',
  },
  packagePrice: {
    color: '#B07813',
    fontWeight: '800',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  packageLabel: {
    fontSize: wp('3.5%'),
    lineHeight: hp('3%'),
    fontFamily: "Poppins-Medium"
  },
  packageLabelText: {
    color: '#42BA86',
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  packageValue: {
    color: '#060606ff',
    fontWeight: '600',
    width: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  packageBtn: {
    // width:57,
    // height:21,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  packageBtnText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp('2%'), // Increased from 16
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: '#1A1A1A', // Darker
    width: '90%', // Reduced from 92%
    height: hp('8%'), // Increased from 54
    borderRadius: wp('205'), // Increased from 28
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabCircle: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('50%'),
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  cardWrapper: {
    // margin: wp("2%"),
    alignItems: 'center',
    marginHorizontal: wp('3%'),
    overflow: 'visible',
    justifyContent: 'space-evenly',
  },
  foldSvg: {
    position: 'absolute',
    top: -1,
    left: 0,
    zIndex: 2,
  },
  headerText: {
    position: 'absolute',
    fontSize: wp('2%'),
    fontWeight: '500',
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  cardContent: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: wp('2%'),
  },
  rate: {
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
    fontFamily: 'Poppins-Medium',
  },
  products: {
    fontSize: wp('2.8%'),
    marginBottom: hp('1%'),
    fontFamily: 'Poppins-Medium',
  },
  about: {
    fontSize: wp('2.5%'),
    fontStyle: 'italic',
    color: '#D19B00',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#FFC107',
    borderRadius: wp('5%'),
    minWidth: wp('18%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  footerCon: {
    alignSelf: 'center',
  },
  iconImage: {
    height: '70%',
    width: '70%',
    alignSelf: 'center',
  },
  likeImgContainer: {
    height: wp('7%'),
    marginVertical: hp('1%'),
    width: wp('7%'),
    backgroundColor: '#9387871F',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: wp('10%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedProductCard: {
    width: wp('44%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    elevation: 5,
    marginVertical: hp('1%'),
    marginHorizontal: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    height: hp('35%'),
  },
  ImageStyle: {
    width: wp('40%'),
    height: wp('30%'),
    borderRadius: wp('5%'),
    marginBottom: hp('3%'),
  },
  OuterPriceContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    gap: wp('2.5%'),
    marginBottom: hp('1%'),
  },
  InnerPriceContainer: {
    flexDirection: 'row',
    gap: wp('1.5%'),
  },
  priceStyle: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  featureIconStyle: {
    width: wp('4%'),
    height: hp('2%'),
  },
  starStyle: {
    width: wp('3.2%'),
    height: wp('3.2%'),
  },
  starContainer: {
    backgroundColor: '#f1ff23',
  },
  descContain: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    gap: wp('1%'),
    marginBottom: hp('1%'),
  },
  OutRatContain: {
    width: '100%',
    flexDirection: 'row',
    gap: wp('2%'),
    alignItems: 'center',
  },
  InnerRatContain: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#09932B',
    borderRadius: wp('3%'),
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('1.5%'),
  },
  ratingTextStyle: {
    fontSize: wp('3.2%'),
    marginRight: wp('1%'),
  },
  likedProductName: {
    fontSize: wp('4%'),
    alignSelf: 'flex-start',
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  DescStyle: {
    flex: 1,
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  oldPriceStyle: {
    color: 'gray',
    fontSize: wp('3.5%'),
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  DiscountStyle: {
    color: '#42BA86',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  reviewStyle: {
    marginLeft: wp('1%'),
    fontSize: wp('3.2%'),
  },
  likedIconImage: {
    height: '70%',
    width: '70%',
    alignSelf: 'center',
  },
  likedLikeImgContainer: {
    height: wp('7%'),
    marginVertical: hp('1%'),
    width: wp('7%'),
    backgroundColor: '#9387871F',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: wp('10%'),
  },
});
