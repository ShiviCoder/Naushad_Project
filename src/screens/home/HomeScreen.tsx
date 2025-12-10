import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  Animated,
  StyleSheet,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PendingBookingMessage from '../home/PendingBookingMessage';
import COLORS from '../../utils/Colors';
import { requestAppPermissions } from '../../utils/Permission';

// Import all components
import Header from './HomeComponents/Header';
import GenderToggle from './HomeComponents/GenderToggle';
import SearchBar from './HomeComponents/SearchBar';
import SpecialOffers from './HomeComponents/SpecialOffers';
import OurServices from './HomeComponents/OurServices';
import AppointmentBanner from './HomeComponents/AppointmentBanner';
import OurProducts from './HomeComponents/OurProducts';
import VideosSection from './HomeComponents/VideosSection';
import OurCertificates from './HomeComponents/OurCertificates';
import AboutSalon from './HomeComponents/AboutSalon';
import OurPackages from './HomeComponents/OurPackages';
import ProductPackages from './HomeComponents/ProductPackages';
import HomeServices from './HomeComponents/HomeServices';
import ExitPopup from './HomeComponents/ExitPopup';

const HomeScreen = () => {
  const [gender, setGender] = useState('male');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exitPopup, setExitPopup] = useState(false);
  const [user, setUser] = useState(null);

  // Data states
  const [offers, setOffers] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [aboutData, setAboutData] = useState([]);
  const [packages, setPackages] = useState([]);
  const [productPackages, setProductPackages] = useState([]);
  const [homeServices, setHomeService] = useState([]);

  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const translateY = useRef(new Animated.Value(0)).current;

  // Token reference to avoid async calls in every function
  const tokenRef = useRef(null);

  useEffect(() => {
    requestAppPermissions();
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    const backAction = () => {
      setExitPopup(true);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => subscription.remove();
  }, [isFocused]);

  const initializeApp = async () => {
    try {
      // Load token and user data in parallel
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      tokenRef.current = token;

      // Set user
      if (userData) {
        const parsed = JSON.parse(userData);
        const userInfo = parsed?.user ? parsed.user : parsed;
        setUser(userInfo);
      }

      // Get gender from storage or user data
      let selectedGender = await AsyncStorage.getItem('selectedGender');

      if (!selectedGender) {
        // Try to get gender from user data
        if (userData) {
          const parsed = JSON.parse(userData);
          const userInfo = parsed?.user ? parsed.user : parsed;
          if (userInfo?.gender) {
            selectedGender = userInfo.gender.toLowerCase().trim();
          }
        }
        // Default to male if still not found
        selectedGender = selectedGender || 'male';
        await AsyncStorage.setItem('selectedGender', selectedGender);
      }

      setGender(selectedGender);

      // Fetch all data without loading indicator for initial load
      fetchAllData();
    } catch (error) {
      console.log('Error initializing app');
    }
  };

  const fetchAllData = async () => {
    try {
      const token = tokenRef.current;
      if (!token) return;

      // Fetch all data in parallel for faster loading
      const [
        servicesData,
        productsData,
        videosData,
        certificatesData,
        aboutDataResponse,
        packagesData,
        productPackagesData,
        offersData,
        homeServicesData,
      ] = await Promise.all([
        fetchServices(token),
        fetchProducts(token),
        fetchVideos(token),
        fetchCertificates(token),
        fetchAboutData(token),
        fetchPackages(token),
        fetchProductPackages(token),
        fetchSpecialOffers(token),
        fetchHomeServices(token),
      ]);

      // Set all states at once
      setServices(servicesData);
      setProducts(productsData);
      setVideos(videosData);
      setCertificates(certificatesData);
      setAboutData(aboutDataResponse);
      setPackages(packagesData);
      setProductPackages(productPackagesData);
      setOffers(offersData);
      setHomeService(homeServicesData);
    } catch (error) {
      // Silently handle errors
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    Animated.timing(translateY, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start();

    await fetchAllData();

    Animated.timing(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  // API Functions - optimized with caching and error handling
  const fetchServices = async token => {
    try {
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

      const json = await response.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchProducts = async token => {
    try {
      const res = await fetch('https://naushad.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchVideos = async token => {
    try {
      const res = await fetch('https://naushad.onrender.com/api/youtube', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { data: [] };
    }
  };

  const fetchCertificates = async token => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/certificates',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      return [];
    }
  };

  const fetchPackages = async token => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/packages',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (err) {
      return [];
    }
  };

  const fetchProductPackages = async token => {
    try {
      const response = await fetch(
        `https://naushad.onrender.com/api/product-packages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (err) {
      return [];
    }
  };

  const fetchSpecialOffers = async token => {
    try {
      const response = await fetch(
        `https://naushad.onnder.com/api/offers?gender=${gender}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchHomeServices = async token => {
    try {
      const response = await fetch(
        `https://naushad.onrender.com/api/home-services?gender=${gender}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      if (!json?.success) return [];

      let data = json.data || [];
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender,
      );
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchAboutData = async token => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/about-salon',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      return [];
    }
  };

  const handleGenderChange = async value => {
    const formatted = value.toLowerCase();

    // Save to AsyncStorage
    await AsyncStorage.setItem('selectedGender', formatted);

    // Update state
    setGender(formatted);

    // Show loading indicator
    setLoading(true);

    // Fetch new data
    await fetchAllData();

    // Hide loading indicator
    setLoading(false);
  };

  const handleSectionNavigation = section => {
    switch (section) {
      case 'services':
        navigation.navigate('Services');
        break;
      case 'products':
        navigation.navigate('OurProducts');
        break;
      case 'certificates':
        navigation.navigate('Certificates');
        break;
      case 'packages':
        navigation.navigate('PackagesScreen');
        break;
      case 'productPackages':
        navigation.navigate('ProductPackageScreen');
        break;
      case 'homeServices':
        navigation.navigate('HomeServices');
        break;
      case 'videos':
        navigation.navigate('VideosScreen');
        break;
      default:
        break;
    }
  };

  // Show initial loading only if no data is loaded yet
  const showInitialLoading =
    loading && services.length === 0 && products.length === 0;

  if (showInitialLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {loading && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY }],
          opacity: loading ? 0.7 : 1,
        }}
      >
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
          contentContainerStyle={styles.scrollContent}
        >
          <Header user={user} theme={theme} navigation={navigation} />

          <GenderToggle
            gender={gender}
            onGenderChange={handleGenderChange}
            style={styles.genderToggleContainer}
          />

          <SearchBar theme={theme} />

          <PendingBookingMessage />

          <SpecialOffers
            offers={offers}
            navigation={navigation}
            theme={theme}
          />

          <OurServices
            services={services}
            gender={gender}
            navigation={navigation}
            handleSectionNavigation={handleSectionNavigation}
          />

          <AppointmentBanner
            gender={gender}
            navigation={navigation}
            theme={theme}
          />

          <OurProducts
            products={products}
            gender={gender}
            navigation={navigation}
            handleSectionNavigation={handleSectionNavigation}
          />

          <VideosSection
            videos={videos}
            handleSectionNavigation={handleSectionNavigation}
          />

          <OurCertificates
            certificates={certificates}
            handleSectionNavigation={handleSectionNavigation}
          />

          <AboutSalon aboutData={aboutData} theme={theme} />

          <OurPackages
            packages={packages}
            navigation={navigation}
            handleSectionNavigation={handleSectionNavigation}
          />

          <ProductPackages
            productPackages={productPackages}
            navigation={navigation}
            handleSectionNavigation={handleSectionNavigation}
            theme={theme}
          />

          <HomeServices
            homeServices={homeServices}
            gender={gender}
            navigation={navigation}
            handleSectionNavigation={handleSectionNavigation}
          />
        </ScrollView>
      </Animated.View>

      <ExitPopup
        visible={exitPopup}
        onClose={() => setExitPopup(false)}
        onExit={() => BackHandler.exitApp()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: hp('10%'),
  },
  genderToggleContainer: {
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlayLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
});

export default HomeScreen;
