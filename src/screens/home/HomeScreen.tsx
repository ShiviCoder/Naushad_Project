import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList, ImageBackground, Dimensions, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme } from "../../context/ThemeContext";
import {WebView} from 'react-native-webview';


  const VideoCard = ({ videoId }: { videoId: string }) => {
  const cardWidth = wp("40%");
  const cardHeight = hp('40%') // 16:9 ratio
  const [playing , setPlaying] = useState(false);
  
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
          src="https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&fs=0&autoplay=${playing ? 1 : 0}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  ` 

  try {
    return (
      <View
        style={{
          width: cardWidth,
          height: cardHeight,
          overflow: "hidden",
          borderRadius: wp("2%"),
          marginRight: wp("2%"),
          backgroundColor: "#dadada",
        }}
      >
        <WebView
        originWhitelist={["*"]}
        source={{ html }}
       style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
        scrollEnabled={false}
      />
        
  {!playing && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
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
              backgroundColor: "rgba(255,255,255,0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>▶</Text>
          </View>
        </TouchableOpacity>
      )}
       </View>
    
    );
  } catch (e) {
    console.log("Error rendering YouTubePlayer:", e);
    return <Text>Error loading video</Text>;
  }
};


const HomeScreen = () => {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ get current theme
  // Fixed Navigation handler function


  const [refreshing , setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;  
  const onRefresh = () => {
     setRefreshing(true);
    Animated.timing(translateY,{
      toValue : 50,
      duration : 300,
      useNativeDriver : true,
    }).start();
    setTimeout(()=>{
      setRefreshing(false);
      Animated.timing(translateY,{
        toValue : 0,
        useNativeDriver:true,
      }).start();
    },1500);
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
        navigation.navigate('Videos')
        break;
      case 'certificates':
        navigation.navigate('Certificates')
        break;
      case 'packages':
        navigation.navigate('PackagesScreen');
        break;
      case 'productPackages':
        navigation.navigate('ProductPackageScreen');
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
      price: '₹350.00',
      desc: 'Stylish cut with blow dry',
      image: [require('../../assets/images/haircut1.png'),
        require('../../assets/images/man-service1.jpg')
      ],
    },
    {
      id: '2',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
         require('../../assets/images/man-service2.jpg')
      ],
    },
    {
      id: '3',
      name: 'Facial',
      price: '₹600.00',
      desc: 'Glow facial therapy',
      image: [require('../../assets/images/facial.jpg'),
         require('../../assets/images/man-service3.jpg')
      ],
    },
    {
      id: '4',
      name: 'Hair Cut',
      price: '₹350.00',
      desc: 'Stylish cut with blow dry',
      image: [require('../../assets/images/haircut1.png'),
         require('../../assets/images/man-service4.jpg')
      ],
    },
    {
      id: '5',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: [require('../../assets/images/haircolor1.png'),
         require('../../assets/images/man-service5.jpg')
      ],
    },
    {
      id: '6',
      name: 'Facial',
      price: '₹600.00',
      desc: 'Glow facial therapy',
      image: [require('../../assets/images/facial.jpg'),
         require('../../assets/images/man-service6.jpg')
      ],
    },
  ];

  // Products (added rating + tag)
  const products = [
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
    },
    {
      id: '2',
      name: ['Det Fairness Cream', "Plum FaceWash - 500ml"],
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
       image: [require('../../assets/images/male-product2.png'),
        require('../../assets/images/female-product2.jpg')
      ],
    },
    {
      id: '3',
      name: ['Nivea Hair Cream','Foaming Fash Wash Gel'],
      price: '₹299',
      offer: '20%OFF',
      rating: '4.1',
      tag: 'Salon grade',
       image: [require('../../assets/images/male-product11.jpg'),
        require('../../assets/images/female-product4.jpg')
      ],
    },
    {
      id: '4',
      name: ['Shave Cream ','MediCube Hair Mask'],
      price: '₹299',
      offer: '25%OFF',
      rating: '4.1',
      tag: '100% natural oil',
       image: [require('../../assets/images/male-product12.png'),
        require('../../assets/images/female-product3.jpg')
      ],
    },
    {
      id: '5',
      name: ['Detan — Face', 'Foaming Face Wash Gel'],
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
      image: [require('../../assets/images/male-product2.png'),
        require('../../assets/images/female-product4.jpg')
      ],
    },
    {
      id: '6',
      name: ['Nivea Hair spa',"Plum FaceWash - 500ml"],
      price: '₹299',
      offer: '20%OFF',
      rating: '4.1',
      tag: 'Salon grade',
       image: [require('../../assets/images/male-product11.jpg'),
        require('../../assets/images/female-product2.jpg')
      ],
    },
  ];

  // Videos row (thumbnails with play)
  const videos = [
    { id: '1', videoId: 'LepsdGtPOzs' },
    { id: '2', videoId: 'yyc7nKGlJnc' },
    { id: '4', videoId: 'hNXWf6wS4aE' },
    {id : '5', videoId : 'TKPNhEf1ZTQ'},
  ];

  // Certificates (two items like the mock)
  const certificates = [
    {
      id: '1',
      title: 'Hair Styling Certificate',
      image: require('../../assets/images/certificate1.png'),
    },
    {
      id: '2',
      title: 'Certified Hair Cutting Expert',
      image: require('../../assets/images/certificate2.png'),
    },
    {
      id: '3',
      title: 'Hair Styling Certificate',
      image: require('../../assets/images/certificate1.png'),
    },
    {
      id: '4',
      title: 'Certified Hair Cutting Expert',
      image: require('../../assets/images/certificate2.png'),
    },
  ];

  // Packages (two-column cards)
  const packages = [

    {
      id: '1',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
    },
    {
      id: '2',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
    },
    {
      id: '3',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
    },
    {
      id: '4',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
    },
    {
      id: '5',
      title: 'Basic hair cut package',
      price: '₹ 499',
      services: 'Haircut , Shampoo',
      about: 'Perfect for daily grooming',
    },
    {
      id: '6',
      title: 'Deluxe Facial package',
      price: '₹ 899',
      services: 'Exfoliation , Massage',
      about: 'Refresh & glow routine',
    },
  ];

  // Product packages (small horizontal cards)
  const productPackages = [
    {
      id: '1',
      title: 'Grooming Deluxe',
      rate: '₹699',
      line1: ['Facewash, scrub, mask','shaving, beard trimming, head massage'],
      tag: 'Ideal for oily skin',
    },
    {
      id: '2',
      title: 'Glow & Go Pack',
      rate: '₹599',
      line1: ['Facewash, Bleach, Threading','Beard & Mustache Services'],
      tag: 'Quick glow for party',
    },
    {
      id: '3',
      title: 'Beard Care Pro',
      rate: '₹499',
      line1: ['Medicure, Penicure','Clean-up & De-tan'],
      tag: 'Shape & nourish',
    },
    {
      id: '4',
      title: 'Hair Care Kit',
      rate: '₹799',
      line1:  ['Shampoo, Serum, Mask','Hair Styling, Treaming'],
      tag: 'Repair & shine',
    },
    {
      id: '5',
      title: 'Grooming Deluxe',
      rate: '₹699',
      line1: ['Facewash, Threading','Beard & Mustache Services'],
      tag: 'Ideal for oily skin',
    },
    {
      id: '6',
      title: 'Glow & Go Pack',
      rate: '₹599',
      line1: ['Bleach, Threading','Hair Cutting & Hair Coloring'],
      tag: 'Quick glow for party',
    },
    {
      id: '7',
      title: 'Beard Care Pro',
      rate: '₹499',
      line1: ['Hair Coloring, Hair Cutting',"Beard Trimming & Hair Massage"],
      tag: 'Shape & nourish',
    },
    {
      id: '8',
      title: 'Hair Care Kit',
      rate: '₹799',
      line1: ['Shampoo, Serum, Mask','Hair Styling, Treaming'],
      tag: 'Repair & shine',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F6B745']} />
        }
        contentContainerStyle={{ paddingBottom: hp('10%') }}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('3%') }}>
            <TouchableOpacity>
              <Image
                source={require('../../assets/location.png')}
                style={[styles.locationbtn, { tintColor: theme.textPrimary }]}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column' }}>
              <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
                Hi {gender === 'Male' ? 'Rahul' : 'Aanchal'}  !
              </Text>
              <Text style={[styles.locationText, { color: theme.textPrimary }]}>
                 {gender === 'Male' ? 'Pune' : 'Indore'} 
              </Text>
            </View>
          </View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={[styles.logo, { tintColor: theme.textPrimary }]}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Image
                source={require('../../assets/cart2.png')}
                style={{ marginLeft: wp('5%'), width: wp('7%'), height: wp('7%'), }}
              />
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <Image
                source={require('../../assets/notification3.png')}
                style={{ marginLeft: wp('2%'), width: wp('7%'), height: wp('7%'), }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.genderSelection}>
          {['Male', 'Female'].map(g => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g as 'Male' | 'Female')}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
            >
              {/* Radio outer circle */}
              <View
                style={[
                  styles.radioOuter,
                  gender === g && styles.radioOuterActive,
                  { borderColor: theme.textPrimary } // circle color dynamic
                ]}
              >
                {/* Radio inner circle if selected */}
                {gender === g && <View style={styles.radioInner} />}
              </View>
              {/* Text */}
              <Text style={{ ...styles.genderText, color: theme.textPrimary }}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar with filter */}
        <View style={styles.searchFilContain}>
          {/* Search Bar */}
          <View style={[styles.searchBar, { flex: 0.90 }]}>
            <Icon name="search" size={wp('5%')} color="#9E9E9E" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#9E9E9E"
              style={styles.searchInput}
            />
          </View>

          {/* Filter Icon */}

          <TouchableOpacity style={styles.filterIconBtn}>
            <Image
              source={require('../../assets/filter.png')}
              style={{
                width: wp('13%'), height: wp('13%'), borderRadius: 100,
                resizeMode: 'cover',
              }}

            />
          </TouchableOpacity>

        </View>


        {/* Special Offers header with navigation */}
        <SectionTitle title="Special Offers" showSeeAll={false} color={theme.textPrimary} />

        {/* Special Offer split card */}
        <View style={styles.offerCard}>
          <View style={styles.offerLeft}>
            <Text style={styles.offerBig}>Haircut</Text>
            <Text style={styles.offerSmall}>20% off</Text>
            <Text style={styles.offerDate}>July 16-July 24</Text>
            <TouchableOpacity style={styles.offerBtn} onPress={() => navigation.navigate('OfferScreen')}>
              <Text style={styles.offerBtnText}>Offer now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={
      gender === 'Male'
        ? require('../../assets/images/man-offer.jpg') // <-- Male ke liye image
        : require('../../assets/images/specialhaircut.png') // <-- Female ke liye image
    }
            style={styles.offerRightImage}
          />
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
          contentContainerStyle={{ paddingHorizontal: wp('4%') }}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={
                gender === 'Male' ? item.image[1] : item.image[0]
              } style={styles.serviceImage} />
              <View style={styles.nameItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price}</Text>
              </View>
              <Text style={styles.serviceDesc}>{item.desc}</Text>
              <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Services')}>
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
        ? require('../../assets/images/man-banner.jpg') // <-- Male ke liye image
        : require('../../assets/images/image1.jpg')
          }
          style={styles.appointmentBanner}

        >
          <View style={styles.overlay}>
            <Text style={styles.bannerText}>Book your appointment today</Text>
            <Text style={styles.bannerText}>
              and take your look to the next level
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("BookAppointmentScreen")}
              style={styles.bookNowBtn}>
              <Text style={[styles.bookBtnText, { color: '#111' }]}>Book Appointment</Text>
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
          contentContainerStyle={{ paddingHorizontal: wp('4%') }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("OurProducts")}
              android_ripple={{ color: 'transparent' }}
              activeOpacity={1}

            >
              <View style={styles.productCard}>
                <Image 
                source = {
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
          contentContainerStyle={{ paddingHorizontal: wp('3%') }}
          renderItem={({ item }) =>
            <VideoCard videoId={item.videoId} />
          }
        />

        {/* Certificates with navigation */}
        <SectionTitle
          title="Our Certificates"
          onPress={() => handleSectionNavigation('certificates')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp('2%'), backgroundColor: '#F6B745', marginHorizontal: wp('2%'), borderRadius: wp('3%') }}
        >
          {certificates.map(c => (
            <View key={c.id} style={styles.certItem}>
              <Image source={c.image} style={styles.certImage} />
              <Text numberOfLines={2} style={styles.certCaption}>
                {c.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* About our salon - No "See all" button needed */}
        <SectionTitle title="About our salon" showSeeAll={false} />

        <View style={[styles.aboutContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.aboutBox, { backgroundColor: theme.textPrimary }]}>
            <Image
              source={require("../../assets/images/calender9.png")}
              style={{ width: wp("5%"), height: wp("5%") }}
            />
            <Text style={[styles.aboutTop, { color: theme.background }]}>
              Founded Year
            </Text>
            <Text style={[styles.aboutBottom, { color: theme.background }]}>
              2002
            </Text>
          </View>

          <View style={[styles.aboutBox, { backgroundColor: theme.textPrimary }]}>
            <Image
              source={require("../../assets/people.png")}
              style={{ width: wp("5%"), height: wp("5%"), }}
            />
            <Text style={[styles.aboutTop, { color: theme.background }]}>
              Employees
            </Text>
            <Text style={[styles.aboutBottom, { color: theme.background }]}>
              12
            </Text>
          </View>

          <View style={[styles.aboutBox, { backgroundColor: theme.textPrimary }]}>
            <Image
              source={require("../../assets/sheild.png")}
              style={{ width: wp("5%"), height: wp("5%"), }}
            />
            <Text style={[styles.aboutTop, { color: theme.background }]}>
              Hygiene
            </Text>
            <Text style={[styles.aboutBottom, { color: theme.background }]}>
              98%
            </Text>
          </View>
        </View>


        {/* Our Packages (2-up grid) with navigation */}
        <SectionTitle
          title="Our Packages"
          onPress={() => handleSectionNavigation('packages')}
        />
        <FlatList data={packages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: wp('4%') }}
          renderItem={({ item }) => (
            <View style={styles.packageCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={styles.packageTitle} numberOfLines={2}>{item.title}</Text>
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
              <TouchableOpacity style={styles.packageBtn} onPress={() => navigation.navigate('PackagesScreen')}>
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
          keyExtractor={i => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: wp("2%"), paddingVertical: hp('4%') }}>
              <Shadow
                distance={3}
                startColor="#F6B74540"
                offset={[0, 13]}
                style={{ borderRadius: wp("4%") }}
              >
                <View
                  style={{
                    width: wp("35%"),
                    height: hp("23%"),
                    backgroundColor: "#EDEDED",
                    borderRadius: wp("4%"),
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  {/* === Folded Top Corners === */}
                  <Svg
                    height={hp("25%")}
                    width={wp("35%")}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  >
                    {/* Left Fold */}
                    <Polygon
                      points={`0,0 ${wp("6%")},0 0,${wp("6%")}`}
                      fill={theme.background}
                    />
                    {/* Right Fold */}
                    <Polygon
                      points={`${wp("35%")},0 ${wp("35%") - wp("6%")},0 ${wp("35%")},${wp("6%")}`}
                      fill={theme.background}
                    />

                  </Svg>

                  {/* === Header Hexagon === */}
                  <View style={{ position: "absolute", top: 0, alignItems: "center" }}>
                    <Svg height={hp("6%")} width={wp("22%")}>
                      <Polygon
                        points={`0,0 ${wp("22%")},0 ${wp("22%")},${hp("3%")} ${wp("11%")},${hp("6%")} 0,${hp("3%")}`}
                        fill="#F6B745"
                      />
                    </Svg>
                    <Text
                      style={{
                        position: "absolute",
                        top: hp("1%"),
                        color: "white",
                        fontWeight: "600",
                        fontSize: hp("1.1%"),
                        alignSelf: 'center'
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>

                  {/* === Content === */}
                  <View style={{ marginTop: hp("8%"), width: "85%" }}>
                    <Text style={{ fontSize: hp("1.3%"), fontWeight: "500" }}>
                      Rate:- <Text style={{ fontWeight: "700" }}>₹ {item.rate}</Text>
                    </Text>
                    <Text style={{ fontSize: hp("1.3%"), fontWeight: "500" }}>
                      Products:- <Text style={{ fontWeight: "700" }}>{gender === 'Male' ? item.line1[1] : item.line1[0]}</Text>
                    </Text>
                    <Text
                      style={{
                        marginTop: hp("1%"),
                        fontStyle: "italic",
                        fontSize: hp("1.3%"),
                        color: "#d19a33",
                        textAlign: "center",
                      }}
                    >
                      {item.tag}
                    </Text>
                  </View>

                  {/* === Button === */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProductPackageScreen')}
                    style={{
                      backgroundColor: "#F6B745",
                      paddingVertical: hp("0.8%"),
                      paddingHorizontal: wp("5%"),
                      borderRadius: wp("5%"),
                      marginTop: hp("1.5%"),
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600", fontSize: hp("1.3%") }}>
                      Book now
                    </Text>
                  </TouchableOpacity>
                </View>
              </Shadow>
            </View>
          )}
        />
      </ScrollView>
</Animated.View>
      {/* Bottom Navigation (rounded dark bar) */}

    </View>
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
          <Text style={[styles.seeAll, { color: theme.textSecondary }]}>
            See all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: hp('1%') },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'), // Add proper top padding
  },
  welcomeText: {
    fontSize: wp('3%'),         // ↓ slightly smaller
    fontWeight: '700',       // bolder to match mock
    color: '#8E8E93',
    fontFamily: "Poppins-Medium"
  },
  headerstyle: {
    alignSelf: 'center'
  },
  locationText: {
    fontSize: wp('4%'),         // ↓ smaller than name
    fontWeight: '500',       // regular weight
    color: '#090909ff'
    , fontFamily: "Poppins-Medium"         // lighter grey (#8E8E93 ≈ iOS system grey)
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
    height: hp('10%'),  // Reduced from 87
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
  },

  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Increased from 6
    paddingHorizontal: wp('1%'),
  },
  genderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'), // Increased from 14
    // Increased from 8

    // borderColor: '#eee7e7ff',
    // borderRadius: 25,      // Increased from 20
    // backgroundColor: '#f7f0f0ff',
  },
  genderBtnActive: {
    // borderColor: '#fdfdfdff',
    // backgroundColor: '#FFF8E5'
  },
  genderText: {
    marginLeft: wp('3%'),
    color: '#0b0b0bff',
    fontFamily: "Poppins-Medium"


  },
  genderTextActive: {
    color: '#111',
    fontWeight: '600'
  },
  radioOuter: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#9E9E9E'
  },
  radioOuterActive: {
    borderColor: '#9E9E9E',
  },
  radioInner: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: 4,
    backgroundColor: '#2988FC',
    position: 'absolute',
    top: 2.5,
    left: 2.5,
  },
  searchFilContain: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%')
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    marginHorizontal: wp('2%'),
    borderRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    marginVertical: hp('1%'),
    height: hp('5%'),
    borderWidth: wp('0.3%'),
    borderColor: '#dddddd1d',
    elevation: 1
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp('0.1%'),
    fontSize: wp('4%'),
    color: '#0e0d0dff'
    , fontFamily: "Poppins-Medium"
  },
  filterIconBtn: {
    flex: 0.10,                // fixed 15% space
    aspectRatio: 1,            // always square (portrait/landscape)
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 25, // Increased from 18
    marginBottom: 5,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18, // Increased from 16
    fontWeight: '700' // Increased from bold
    , fontFamily: "Poppins-Medium"
  },
  seeAll: {
    color: '#20B2A6',
    fontWeight: '600',
    fontSize: 14,
  },


  // Offer split card
  offerCard: {
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    borderRadius: wp('4%'), // Increased from 12
    backgroundColor: '#F6B745',
    elevation: 4, // Increased from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    height: hp('25%'),
    width: '91%',
  },
  offerLeft: {
    backgroundColor: '#F6B745',
    paddingHorizontal: wp('4%'), // Increased from 14
    justifyContent: 'flex-start',
    width: '50%'
  },
  offerBig: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: '#fff',
    marginTop: hp('2%') // Changed from #ece8e8ff
    , fontFamily: "Poppins-Medium"
  },
  offerSmall: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff', // Changed from #f1ececff
    marginTop: hp('0.5%')
    , fontFamily: "Poppins-Medium"
  },
  offerDate: {
    color: '#fff', // Changed from #eae9e3ff
    marginTop: hp('0.5%')
    , fontFamily: "Poppins-Medium"
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
  offerBtnText: { color: '#111', fontWeight: '700', fontFamily: "Poppins-Medium" },

  // Updated service card styles to match the design exactly
  serviceCard: {
    width: wp('38%'),
    height: hp('25%'),
    marginHorizontal: wp('1%'),
    marginVertical: hp('2%'),
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
    backgroundColor: '#F6B745',
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
  appointmentBanner: {
    marginHorizontal: wp('5%'),
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
    fontFamily: "Poppins-Medium"
  },
  bookNowBtn: {
    backgroundColor: '#F6B745',
    paddingHorizontal: wp('5%'),
    borderRadius: wp('50%'),
    marginTop: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%')
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
    paddingHorizontal: wp('2%') // Increased from 10
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

  videoCard: {
    marginVertical: hp('2%'),
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
    marginHorizontal: wp('2%')
  },
  certImage: {
    width: wp('40%'),
    height: hp('15%'),
    resizeMode: 'contain',
    marginBottom: hp('1%')
  },
  certCaption: {
    fontSize: wp('3%'),
    textAlign: 'center',
    color: '#0d0d0dff',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: "Poppins-Medium"
  },
  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
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
    gap: hp('1%')
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
    fontFamily: "Poppins-Medium"
  },
  packageCard: {
    width: wp('65%'),
    height: hp('22%'),
    backgroundColor: '#FFEED0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5D4B1',
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
  },
  packageTitle: {
    fontSize: wp('4%'),
    fontWeight: '800',
    flex: 1,
    marginRight: wp('3%'),
    color: '#333',
    lineHeight: 20,
    fontFamily: "Poppins-Medium"
  },
  packagePrice: {
    color: '#B07813',
    fontWeight: '800',
    fontSize: wp('4%'),
    fontFamily: "Poppins-Medium"


  },
  packageLabel: {
    fontSize: wp('3.5%'),
    lineHeight: hp('3%'),
    fontFamily: "Poppins-Medium"

  },
  packageLabelText: {
    color: '#42BA86',
    fontWeight: '600',
    fontFamily: "Poppins-Medium"

  },
  packageValue: {
    color: '#060606ff',
    fontWeight: '600',
    width: wp('4%'),
    fontFamily: "Poppins-Medium"

  },
  packageBtn: {
    // width:57,
    // height:21,
    alignSelf: 'flex-start',
    backgroundColor: '#F6B745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12
  },
  packageBtnText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: "Poppins-Medium"
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
    position: "absolute",
    fontSize: wp("2%"),
    fontWeight: '500',
    color: "#FFFFFF",
    alignSelf: 'center',
    marginTop: hp('1%')
  },
  cardContent: {
    width: "90%",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: wp('2%')
  },
  rate: {
    fontSize: wp("3%"),
    marginBottom: hp("0.5%"),
    fontFamily: "Poppins-Medium"
  },
  products: {
    fontSize: wp("2.8%"),
    marginBottom: hp("1%"),
    fontFamily: "Poppins-Medium"
  },
  about: {
    fontSize: wp("2.5%"),
    fontStyle: "italic",
    color: "#D19B00",
    marginBottom: hp("0.5%"),
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#FFC107",
    borderRadius: wp("5%"),
    minWidth: wp("18%"),
    paddingVertical: hp("1%"),
    alignItems: "center",
    justifyContent: 'center'
  },
  bookText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("3%"),
    fontFamily: "Poppins-Medium"
  },
  bold: {
    fontWeight: "bold",
    fontFamily: "Poppins-Medium"
  },
  footerCon: {
    alignSelf: 'center'
  },
  iconImage: {
    height: '70%',
    width: '70%',
    alignSelf: 'center'
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
  loaderContainer : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  }
});
