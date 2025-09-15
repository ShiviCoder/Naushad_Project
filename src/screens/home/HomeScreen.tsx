import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { s } from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const HomeScreen = () => {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const navigation = useNavigation();

  // Fixed Navigation handler function
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
        console.log('Navigate to Videos Screen');
        break;
      case 'certificates':
        console.log('Navigate to Certificates Screen');
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
      image: require('../../assets/images/haircut1.png'),
    },
    {
      id: '2',
      name: 'Hair Coloring',
      price: '₹400.00',
      desc: 'Long-lasting shades',
      image: require('../../assets/images/haircolor1.png'),
    },
    {
      id: '3',
      name: 'Facial',
      price: '₹600.00',
      desc: 'Glow facial therapy',
      image: require('../../assets/images/facial.jpg'),
    },
  ];

  // Products (added rating + tag)
  const products = [
    {
      id: '1',
      name: 'Beard oil  —  100 ml',
      price: '₹299',
      offer: '25%OFF',
      rating: '4.1',
      tag: '100% natural oil',
      image: require('../../assets/images/beardoil.png'),
    },
    {
      id: '2',
      name: 'Detan — Face',
      price: '₹299',
      offer: '33%OFF',
      rating: '4.1',
      tag: 'Instant visible result',
      image: require('../../assets/images/detan.png'),
    },
    {
      id: '3',
      name: 'Hair spa',
      price: '₹299',
      offer: '20%OFF',
      rating: '4.1',
      tag: 'Salon grade',
      image: require('../../assets/images/hairspa.webp'),
    },
  ];

  // Videos row (thumbnails with play)
  const videos = [
    { id: '1', thumb: require('../../assets/images/haircut1.png') },
    { id: '2', thumb: require('../../assets/images/hairspa.webp') },
    { id: '3', thumb: require('../../assets/images/haircolor1.png') },
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
  ];

  // Product packages (small horizontal cards)
  const productPackages = [
    {
      id: '1',
      title: 'Grooming Deluxe',
      rate: '₹699',
      line1: 'Facewash, scrub, mask',
      tag: 'Ideal for oily skin',
    },
    {
      id: '2',
      title: 'Glow & Go Pack',
      rate: '₹599',
      line1: 'Facewash, Bleach, Threading',
      tag: 'Quick glow for party',
    },
    {
      id: '3',
      title: 'Beard Care Pro',
      rate: '₹499',
      line1: 'Oil, Balm, Comb',
      tag: 'Shape + nourish',
    },
    {
      id: '4',
      title: 'Hair Care Kit',
      rate: '₹799',
      line1: 'Shampoo, Serum, Mask',
      tag: 'Repair + shine',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity>
                <Image
                  source={require('../../assets/location.png')}
                  style={styles.locationbtn}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'column', marginLeft: s(4) }}>
            <Text style={styles.welcomeText}>Hi Aanchal !</Text>
            <Text style={styles.locationText}>Indore</Text>
          </View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Image
                source={require('../../assets/cart2.png')}
                style={{ marginLeft: 20, width: 24, height: 24 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <Image
                source={require('../../assets/notification3.png')}
                style={{ marginLeft: 15, width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender Selection (radio-like) */}
        <View style={styles.genderSelection}>
          {['Male', 'Female'].map(g => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g as 'Male' | 'Female')}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  gender === g && styles.radioOuterActive,
                ]}
              >
                {gender === g ? <View style={styles.radioInner} /> : null}
              </View>
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.genderTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar with filter */}
        <View style={styles.searchFilContain}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#9E9E9E" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#9E9E9E"
              style={styles.searchInput}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.filterIconBtn}>
              <Image
                source={require('../../assets/filter.png')}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Offers header with navigation */}
        <SectionTitle
          title="Special Offers"
          onPress={() => handleSectionNavigation('offers')}
        />

        {/* Special Offer split card */}
        <View style={styles.offerCard}>
          <View style={styles.offerLeft}>
            <Text style={styles.offerBig}>Haircut</Text>
            <Text style={styles.offerSmall}>20% off</Text>
            <Text style={styles.offerDate}>July 16–July 24</Text>
            <TouchableOpacity style={styles.offerBtn}>
              <Text style={styles.offerBtnText}>Offer now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/images/specialhaircut.png')}
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
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={item.image} style={styles.serviceImage} />
              <View style={styles.nameItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price}</Text>
              </View>
              <Text style={styles.serviceDesc}>{item.desc}</Text>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Appointment Banner */}
        <ImageBackground
          source={require('../../assets/images/image1.jpg')}
          style={styles.appointmentBanner}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.bannerText}>Book your appointment today</Text>
            <Text style={styles.bannerText}>
              and take your look to the next level
            </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('BookAppointmentScreen')} style={styles.bookNowBtn}>
              <Text style={styles.bookBtnText}>Book Appointment</Text>
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
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>
                {item.price}{' '}
                <Text style={{ color: '#29A244' }}>({item.offer})</Text>
              </Text>

              {/* rating + tag pills */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  marginTop: 4,
                  flexWrap: 'wrap',
                }}
              >
                <View style={styles.pill}>
                  <Icon name="star" size={12} color="#29A244" />
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
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <Image source={item.thumb} style={styles.videoImage} />
              <View style={styles.playOverlay}>
                <Icon name="play" size={24} color="#fff" />
              </View>
            </View>
          )}
        />

        {/* Certificates with navigation */}
        <SectionTitle
          title="Our Certificates"
          onPress={() => handleSectionNavigation('certificates')}
        />
        <View style={styles.certStrip}>
          {certificates.map(c => (
            <View key={c.id} style={styles.certItem}>
              <Image source={c.image} style={styles.certImage} />
              <Text numberOfLines={2} style={styles.certCaption}>
                {c.title}
              </Text>
            </View>
          ))}
        </View>

        {/* About our salon - No "See all" button needed */}
        <SectionTitle title="About our salon" showSeeAll={false} />
        <View style={styles.aboutContainer}>
          <View style={styles.aboutBox}>
            <Icon name="calendar-outline" size={20} color="#333" />
            <Text style={styles.aboutTop}>Founded Year</Text>
            <Text style={styles.aboutBottom}>2002</Text>
          </View>
          <View style={styles.aboutBox}>
            <Icon name="people-outline" size={20} color="#333" />
            <Text style={styles.aboutTop}>Employees</Text>
            <Text style={styles.aboutBottom}>12</Text>
          </View>
          <View style={styles.aboutBox}>
            <Icon name="shield-checkmark-outline" size={20} color="#333" />
            <Text style={styles.aboutTop}>Hygiene</Text>
            <Text style={styles.aboutBottom}>98%</Text>
          </View>
        </View>

        {/* Our Packages (2-up grid) with navigation */}
        <SectionTitle
          title="Our Packages"
          onPress={() => handleSectionNavigation('packages')}
        />
        <View style={styles.packageGrid}>
          {packages.map(p => (
            <View key={p.id} style={styles.packageCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.packageTitle}>{p.title}</Text>
                <Text style={styles.packagePrice}>{p.price}</Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Text style={styles.packageLabel}>
                  Services:-{' '}
                  <Text style={styles.packageValue}>{p.services}</Text>
                </Text>
                <Text style={[styles.packageLabel, { marginTop: 2 }]}>
                  About:- <Text style={styles.packageValue}>{p.about}</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.packageBtn}>
                <Text style={styles.packageBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

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
            <View style={styles.smallPackCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <Text style={styles.smallPackTitle}>{item.title}</Text>
                <Text style={styles.smallPackRate}>{item.rate}</Text>
              </View>
              <Text style={styles.smallPackLine}>{item.line1}</Text>
              <Text style={styles.smallPackTag}>{item.tag}</Text>
              <TouchableOpacity style={styles.smallPackBtn}>
                <Text style={styles.smallPackBtnText}>See more</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      {/* Bottom Navigation (rounded dark bar) */}
      <View style={styles.bottomBarWrap}>
        <View style={styles.bottomNav}>
          <Icon name="home" size={22} color="#fff" />
          <Icon name="document-text-outline" size={22} color="#fff" />
          <View style={styles.fabCircle}>
            <Icon name="add" size={26} color="#000" />
          </View>
          <Icon name="hand-left-outline" size={22} color="#fff" />
          <TouchableOpacity onPress={()=>navigation.navigate('AccountScreen')}>
            <Icon name="person-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {showSeeAll && (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(15),
    paddingTop: s(30), // Add proper top padding
  },
  welcomeText: {
    fontSize: s(11), // ↓ slightly smaller
    fontWeight: '700', // bolder to match mock
    color: '#8E8E93', // primary text colour
    lineHeight: s(13),
  },

  locationText: {
    fontSize: s(14), // ↓ smaller than name
    fontWeight: '500', // regular weight
    color: '#090909ff', // lighter grey (#8E8E93 ≈ iOS system grey)
  },
  locationbtn: {
    width: s(19),
    height: s(26),
    tintColor: '#7575759C',
  },

  cart: {
    width: 24,
    height: 24,
    marginLeft: 40,
  },
  logo: {
    width: s(154), // Reduced from 154
    height: s(87), // Reduced from 87
    resizeMode: 'contain',
  },
  headerIcons: { flexDirection: 'row' },

  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Increased from 6
    paddingHorizontal: s(5),
    gap: 20, // Increased from 16
  },
  genderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16), // Increased from 14
    paddingVertical: s(10), // Increased from 8

    borderColor: '#E5E5E5',
    // borderRadius: 25,      // Increased from 20
    backgroundColor: '#fff',
  },
  genderBtnActive: {
    // borderColor: '#fdfdfdff',
    // backgroundColor: '#FFF8E5'
  },
  genderText: {
    marginLeft: 8,
    color: '#0b0b0bff',
  },
  genderTextActive: {
    color: '#111',
    fontWeight: '600',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: '#0b0b0bff',
  },
  radioOuterActive: {
    borderColor: '#0e0e0eff',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2988FC',
    position: 'absolute',
    top: 2.5,
    left: 2.5,
  },
  searchFilContain: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    
  },
  searchBar: {
    flexDirection: 'row',
    marginHorizontal: 15,
    borderRadius: 22, // Slightly less rounded
    paddingHorizontal: 16,
    paddingVertical: 10, // Reduced from 12
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8, // Add top margin
    width: 320,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  

  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    paddingVertical: 2,
    fontSize: 15,
    color: '#0e0d0dff',
  },

  filterIconBtn: {
    width: 40, // Smaller than previous 34
    height: 40, // Smaller than previous 34
    borderRadius: 50, // Half of width/height
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
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
    fontWeight: '700', // Increased from bold
  },
  seeAll: {
    color: '#20B2A6',
    fontWeight: '600',
    fontSize: 14,
  },

  // Offer split card
  offerCard: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16, // Increased from 12
    backgroundColor: '#fff',
    elevation: 4, // Increased from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    height: hp(22),
    width: wp(90),
    alignSelf: 'center'
  },
  offerLeft: {
    flex: 1.2, // Adjusted ratio
    backgroundColor: '#F6B745',
    padding: 18, // Increased from 14
    justifyContent: 'center',
  },
  offerBig: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff', // Changed from #ece8e8ff
  },
  offerSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff', // Changed from #f1ececff
    marginTop: 2,
  },
  offerDate: {
    color: '#fff', // Changed from #eae9e3ff
    marginTop: s(8),
  },
  offerRightImage: {
    width: s(179), // Increased from 150
    height: s(189),
    resizeMode: 'cover',
  },
  offerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 10,
    // alignSelf: 'flex-start',
    paddingHorizontal: 16,
    // width:134.81,
    // height:32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBtnText: { color: '#111', fontWeight: '700' },

  // Updated service card styles to match the design exactly
  serviceCard: {
    width: 140,
    height: 180,
    marginRight: 12,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: 12,
  },
  serviceImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  nameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0a0909ff',
  },
  serviceDesc: {
    color: '#111111',
    fontSize: 8,
    marginBottom: 8,
    lineHeight: 16,
  },
  bookBtn: {
    backgroundColor: '#F6B745',
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    width: 68,
    height: 22,
  },
  bookBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 8,
  },

  appointmentBanner: {
    marginHorizontal: 15,
    marginTop: 15, // Increased from 6
    height: 202,
    borderRadius: 16, // Increased from 12
    overflow: 'hidden',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bannerText: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  bookNowBtn: {
    backgroundColor: '#F6B745',
    padding: 10,
    borderRadius: 25,
    height: 39,
    width: 154,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productCard: {
    width: 170, // Increased from 160
    marginHorizontal: 8, // Increased from 5
    marginVertical: 10,
    borderRadius: 16, // Increased from 12
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    padding: 12, // Increased from 10
  },
  productImage: {
    width: '100%',
    height: 100, // Increased from 90
    borderRadius: 12, // Increased from 10
  },
  productName: {
    marginTop: 6,
    fontWeight: '700',
  },
  productPrice: {
    color: '#777',
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F0F0',
  },
  pillText: {
    fontSize: 11,
    marginLeft: 4,
    color: '#333',
  },

  videoCard: {
    width: 150,
    height: 100,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  videoImage: { width: '100%', height: '100%' },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  certStrip: {
    marginHorizontal: 15,
    marginTop: 15, // Increased from 10
    backgroundColor: '#FFF4D6', // Lighter yellow
    borderRadius: 16, // Increased from 12
    padding: 16, // Increased from 12
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  certItem: {
    width: '48%',
    backgroundColor: '#fff7dd',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  certImage: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  certCaption: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },

  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  aboutBox: {
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    elevation: 1,
  },
  aboutTop: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  aboutBottom: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    marginTop: 2,
  },

  packageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  packageCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  packageTitle: { fontWeight: '800', flex: 1, marginRight: 6 },
  packagePrice: { color: '#F6B745', fontWeight: '800' },
  packageLabel: { color: '#777', fontSize: 12 },
  packageValue: { color: '#333', fontWeight: '600' },
  packageBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6B745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  packageBtnText: { color: '#fff', fontWeight: '700' },

  smallPackCard: {
    width: 180,
    backgroundColor: '#FFF8E5',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 1,
  },
  smallPackTitle: { fontWeight: '800', flex: 1, marginRight: 6 },
  smallPackRate: { fontWeight: '800', color: '#333' },
  smallPackLine: { color: '#555', marginBottom: 6 },
  smallPackTag: { fontSize: 11, color: '#9C7A00', marginBottom: 8 },
  smallPackBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  smallPackBtnText: { color: '#333', fontWeight: '700' },

  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20, // Increased from 16
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: '#1A1A1A', // Darker
    width: '90%', // Reduced from 92%
    height: 60, // Increased from 54
    borderRadius: 30, // Increased from 28
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15, // Increased from 10
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabCircle: {
    width: 50, // Increased from 44
    height: 50, // Increased from 44
    borderRadius: 25, // Increased from 22
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // Increased from -14
    elevation: 4,
  },
});
