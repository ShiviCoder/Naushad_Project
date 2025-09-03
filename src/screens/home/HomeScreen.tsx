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
// Uncomment this if you're using React Navigation
 import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  
  // Uncomment this if using React Navigation
   const navigation = useNavigation();

  // Navigation handler function for "See all" buttons
  const handleSectionNavigation = (section: string) => {
    switch (section) {
      case 'offers':
        // navigation.navigate('SpecialOffersScreen');
        console.log('Navigate to Special Offers Screen');
        break;
      case 'services':
        // navigation.navigate('ServicesScreen');
        // console.log('Navigate to Services');
        navigation.navigate('Services')
        break;
      case 'products':
        // navigation.navigate('ProductsScreen');
        console.log('Navigate to Products Screen');
        break;
      case 'videos':
        // navigation.navigate('VideosScreen');
        console.log('Navigate to Videos Screen');
        break;
      case 'certificates':
        // navigation.navigate('CertificatesScreen');
        console.log('Navigate to Certificates Screen');
        break;
      case 'packages':
        // navigation.navigate('PackagesScreen');
        console.log('Navigate to Packages Screen');
        break;
      case 'productPackages':
        // navigation.navigate('ProductPackagesScreen');
        console.log('Navigate to Product Packages Screen');
        break;
      default:
        console.log('Unknown section');
    }
  };

  // Services (added short description)
  const services = [
    { id: '1', name: 'Hair Cut', price: '₹350.00', desc: 'Stylish cut with blow dry', image: require('../../assets/images/haircut1.png') },
    { id: '2', name: 'Hair Coloring', price: '₹400.00', desc: 'Long-lasting shades', image: require('../../assets/images/haircolor1.png') },
    { id: '3', name: 'Facial', price: '₹600.00', desc: 'Glow facial therapy', image: require('../../assets/images/facial.jpg') },
  ];

  // Products (added rating + tag)
  const products = [
    { id: '1', name: 'Beard oil  —  100 ml', price: '₹299', offer: '25%OFF', rating: '4.1', tag: '100% natural oil', image: require('../../assets/images/beardoil.png') },
    { id: '2', name: 'Detan — Face', price: '₹299', offer: '33%OFF', rating: '4.1', tag: 'Instant visible result', image: require('../../assets/images/detan.png') },
    { id: '3', name: 'Hair spa', price: '₹299', offer: '20%OFF', rating: '4.1', tag: 'Salon grade', image: require('../../assets/images/hairspa.webp') },
  ];

  // Videos row (thumbnails with play)
  const videos = [
    { id: '1', thumb: require('../../assets/images/haircut1.png') },
    { id: '2', thumb: require('../../assets/images/hairspa.webp') },
    { id: '3', thumb: require('../../assets/images/haircolor1.png') },
  ];

  // Certificates (two items like the mock)
  const certificates = [
    { id: '1', title: 'Hair Styling Certificate', image: require('../../assets/images/certificate1.png') },
    { id: '2', title: 'Certified Hair Cutting Expert', image: require('../../assets/images/certificate2.png') },
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
    { id: '1', title: 'Grooming Deluxe', rate: '₹699', line1: 'Facewash, scrub, mask', tag: 'Ideal for oily skin' },
    { id: '2', title: 'Glow & Go Pack', rate: '₹599', line1: 'Facewash, Bleach, Threading', tag: 'Quick glow for party' },
    { id: '3', title: 'Beard Care Pro', rate: '₹499', line1: 'Oil, Balm, Comb', tag: 'Shape + nourish' },
    { id: '4', title: 'Hair Care Kit', rate: '₹799', line1: 'Shampoo, Serum, Mask', tag: 'Repair + shine' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hi Aanchal!</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Icon name="location-outline" size={14} color="#777" />
              <Text style={styles.locationText}> Indore</Text>
            </View>
          </View>

          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

          <View style={styles.headerIcons}>
            <Icon name="notifications-outline" size={24} />
            <Icon name="person-circle-outline" size={28} style={{ marginLeft: 10 }} />
          </View>
        </View>

        {/* Gender Selection (radio-like) */}
        <View style={styles.genderSelection}>
          {['Male', 'Female'].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g as 'Male' | 'Female')}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
              activeOpacity={0.8}
            >
              <View style={[styles.radioOuter, gender === g && styles.radioOuterActive]}>
                {gender === g ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar with filter */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#9E9E9E" />
          <TextInput placeholder="Search" placeholderTextColor="#9E9E9E" style={styles.searchInput} />
          <TouchableOpacity style={styles.searchIconBtn}>
            <Icon name="options-outline" size={20} color="#333" />
          </TouchableOpacity>
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
          <Image source={require('../../assets/images/specialhaircut.png')} style={styles.offerRightImage} />
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={item.image} style={styles.serviceImage} />
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>{item.price}</Text>
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
            <Text style={styles.bannerText}>and take your look to the next level</Text>
            <TouchableOpacity style={styles.bookNowBtn}>
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {item.price}  <Text style={{ color: '#29A244' }}>({item.offer})</Text>
              </Text>

              {/* rating + tag pills */}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                <View style={styles.pill}>
                  <Icon name="star" size={12} color="#29A244" />
                  <Text style={styles.pillText}>{item.rating}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: '#E8F6EF' }]}>
                  <Text style={[styles.pillText, { color: '#29A244' }]} numberOfLines={1}>{item.tag}</Text>
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
          keyExtractor={(item) => item.id}
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
          {certificates.map((c) => (
            <View key={c.id} style={styles.certItem}>
              <Image source={c.image} style={styles.certImage} />
              <Text numberOfLines={2} style={styles.certCaption}>{c.title}</Text>
            </View>
          ))}
        </View>

        {/* About our salon - No "See all" button needed */}
        <SectionTitle 
          title="About our salon" 
          showSeeAll={false}
        />
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
          {packages.map((p) => (
            <View key={p.id} style={styles.packageCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.packageTitle}>{p.title}</Text>
                <Text style={styles.packagePrice}>{p.price}</Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Text style={styles.packageLabel}>Services:- <Text style={styles.packageValue}>{p.services}</Text></Text>
                <Text style={[styles.packageLabel, { marginTop: 2 }]}>About:- <Text style={styles.packageValue}>{p.about}</Text></Text>
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
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.smallPackCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
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
          <Icon name="person-outline" size={22} color="#fff" />
        </View>
      </View>
    </View>
  );
};

// Updated SectionTitle component with navigation support
const SectionTitle = ({ 
  title, 
  onPress,
  showSeeAll = true 
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
    padding: 15,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600'
  },
  locationText: {
    fontSize: 14,
    color: '#777'
  },
  logo: {
    width: 154,
    height: 87,
    resizeMode: 'contain'
  },
  headerIcons: { flexDirection: 'row' },

  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 6,
    paddingHorizontal: 15,
    gap: 16,
  },
  genderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  genderBtnActive: {
    borderColor: '#F6B745',
    backgroundColor: '#FFF8E5'
  },
  genderText: {
    marginLeft: 8,
    color: '#111'
  },
  genderTextActive: {
    color: '#111',
    fontWeight: '600'
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: '#BDBDBD'
  },
  radioOuterActive: {
    borderColor: '#F6B745'
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F6B745',
    position: 'absolute',
    top: 3.5,
    left: 3.5
  },

  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F7',
    marginHorizontal: 15,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0
  },
  searchIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 18,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  seeAll: { color: '#20A090', fontWeight: '600' },

  // Offer split card
  offerCard: {
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  offerLeft: {
    flex: 1,
    backgroundColor: '#F6B745',
    padding: 14,
    justifyContent: 'center',
  },
  offerBig: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ece8e8ff'
  },
  offerSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1ececff',
    marginTop: 2
  },
  offerDate: {
    color: '#eae9e3ff',
    marginTop: 8
  },
  offerRightImage: {
    width: 150,
    height: '100%',
    resizeMode: 'cover'
  },
  offerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 16
  },
  offerBtnText: { color: '#111', fontWeight: '700' },

  serviceCard: {
    width: 160,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    padding: 10,
  },
  serviceImage: {
    width: '100%',
    height: 90,
    borderRadius: 10
  },
  serviceName: {
    marginTop: 6,
    fontWeight: '700'
  },
  servicePrice: {
    color: '#777',
    marginTop: 2
  },
  serviceDesc: {
    color: '#999',
    fontSize: 12,
    marginTop: 2
  },
  bookBtn: {
    backgroundColor: '#F6B745',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8
  },
  bookBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },

  appointmentBanner: {
    marginHorizontal: 15,
    marginTop: 6,
    height: 202,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  bannerText: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  bookNowBtn: {
    backgroundColor: '#F6B745',
    padding: 10,
    borderRadius: 25,
    height: 39,
    width: 154,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  productCard: {
    width: 160,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 10
  },
  productName: {
    marginTop: 6,
    fontWeight: '700'
  },
  productPrice: {
    color: '#777',
    marginTop: 2
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F0F0'
  },
  pillText: {
    fontSize: 11,
    marginLeft: 4,
    color: '#333'
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
    marginTop: 10,
    backgroundColor: '#FFE6A9',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  certItem: {
    width: '48%',
    backgroundColor: '#fff7dd',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  },
  certImage: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
    marginBottom: 6
  },
  certCaption: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333'
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
    textAlign: 'center'
  },
  aboutBottom: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    marginTop: 2
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
    marginTop: 10
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
    borderRadius: 14
  },
  smallPackBtnText: { color: '#333', fontWeight: '700' },

  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center'
  },
  bottomNav: {
    backgroundColor: '#111',
    width: '92%',
    height: 54,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  fabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
});
