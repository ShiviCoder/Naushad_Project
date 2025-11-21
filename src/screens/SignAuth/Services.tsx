import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
  ServiceDetails: { item: any };
};

export default function ServicesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [storySelect, setStorySelect] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [gender, setGender] = useState('male');
  const translateY = useRef(new Animated.Value(0)).current;

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  }

  // Load gender preference from AsyncStorage
  const loadGenderPreference = async () => {
    try {
      const savedGender = await AsyncStorage.getItem('selectedGender');
      if (savedGender && (savedGender === 'male' || savedGender === 'female')) {
        setGender(savedGender);
        console.log('Loaded gender from storage:', savedGender);
      } else {
        setGender('male');
        console.log('Default gender set: male');
      }
    } catch (error) {
      console.log('Error loading gender preference:', error);
      setGender('male');
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        // Store all services
        setAllServices(data.data);
        
        // Filter services by gender
        const genderFilteredServices = data.data.filter((service: any) => 
          service.gender?.toLowerCase() === gender.toLowerCase()
        );
        
        setServices(genderFilteredServices);
        
        // Extract unique categories from filtered services
        const uniqueCategories = Array.from(
          new Set(genderFilteredServices.map((service: any) => service.serviceName))
        ).map((serviceName, index) => ({
          id: index.toString(),
          name: serviceName,
          imageUrl: genderFilteredServices.find((s: any) => s.serviceName === serviceName)?.imageUrl 
        }));
        
        setCategories(uniqueCategories);
        
        // Set first category as selected by default
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0].name);
          // Filter services for the first category
          const firstCategoryServices = genderFilteredServices.filter((service: any) => 
            service.serviceName === uniqueCategories[0].name
          );
          setServices(firstCategoryServices);
        }
      }
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesByCategory = async (categoryName: string) => {
    try {
      setCategoryLoading(true);
      const token = await getToken();
      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        // Filter by both gender and category
        const filteredServices = data.data.filter((service: any) => 
          service.serviceName === categoryName && 
          service.gender?.toLowerCase() === gender.toLowerCase()
        );
        setServices(filteredServices);
      }
    } catch (err) {
      console.log('Fetch category error:', err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleGenderToggle = async (value: boolean) => {
    const newGender = value ? 'female' : 'male';
    setGender(newGender);
    console.log('Selected gender:', newGender);
    
    // Save gender preference
    try {
      await AsyncStorage.setItem('selectedGender', newGender);
    } catch (error) {
      console.log('Error saving gender preference:', error);
    }
    
    // Reload services with new gender filter
    setCategoryLoading(true);
    const genderFilteredServices = allServices.filter((service: any) => 
      service.gender?.toLowerCase() === newGender.toLowerCase()
    );
    
    setServices(genderFilteredServices);
    
    // Update categories based on gender filtered services
    const uniqueCategories = Array.from(
      new Set(genderFilteredServices.map((service: any) => service.serviceName))
    ).map((serviceName, index) => ({
      id: index.toString(),
      name: serviceName,
      imageUrl: genderFilteredServices.find((s: any) => s.serviceName === serviceName)?.imageUrl 
    }));
    
    setCategories(uniqueCategories);
    
    // Reset to first category if available
    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0].name);
      setStorySelect(0);
      const firstCategoryServices = genderFilteredServices.filter((service: any) => 
        service.serviceName === uniqueCategories[0].name
      );
      setServices(firstCategoryServices);
    } else {
      setSelectedCategory(null);
      setStorySelect(null);
    }
    
    setCategoryLoading(false);
  };

  useEffect(() => {
    loadGenderPreference();
  }, []);

  useEffect(() => {
    if (gender) {
      fetchServices();
    }
  }, [gender]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    Animated.spring(translateY, { toValue: 60, useNativeDriver: true }).start();
    await fetchServices();
    Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }).start();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: any, index: number) => {
    setStorySelect(index);
    setSelectedCategory(category.name);
    setCategoryLoading(true);
    fetchServicesByCategory(category.name);
  };

  // Filter services based on selected category
  const filteredServices = selectedCategory
    ? services.filter(service => service.serviceName === selectedCategory)
    : services;

  // Render category image with fallback
  const renderCategoryImage = (category: any) => {
    if (category.imageUrl) {
      return (
        <Image 
          source={{ uri: category.imageUrl }} 
          style={styles.categoryImage} 
        />
      );
    }
    return (
      <View style={[styles.categoryFallback, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.fallbackText}>
          {category.name ? category.name.charAt(0).toUpperCase() : 'S'}
        </Text>
      </View>
    );
  };

  // Show full screen loading indicator
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Head title="Services" />
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ transform: [{ translateY }] }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: hp('4%') }}
      >
        {/* 🔹 Header */}
        <Head title="Services" />

        {/* 🔹 Gender Toggle */}
        <View style={styles.genderToggleContainer}>
          <Text style={[styles.genderLabel, { color: theme.textPrimary }]}>
            Male
          </Text>
          <Switch
            value={gender === 'female'}
            onValueChange={handleGenderToggle}
            trackColor={{ false: COLORS.primary, true: COLORS.secondary }}
            thumbColor={gender === 'female' ? COLORS.primary : '#f4f3f4'}
            style={styles.genderSwitch}
          />
          <Text style={[styles.genderLabel, { color: theme.textPrimary }]}>
            Female
          </Text>
        </View>

        {/* 🔹 Categories */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: hp('2%'),
            paddingHorizontal: wp('3%'),
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item, index)}
            >
              <View
                style={[
                  styles.categoryCircle,
                  {
                    borderColor:
                      storySelect === index ? COLORS.primary : 'transparent',
                    borderWidth: storySelect === index ? 2 : 0,
                  },
                ]}
              >
                {renderCategoryImage(item)}
              </View>
              <Text style={[styles.categoryText, { color: theme.textPrimary }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* 🔹 Services Loading Indicator */}
        {categoryLoading && (
          <View style={styles.centerLoadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {/* 🔹 Services */}
        {!categoryLoading && filteredServices.length > 0 ? (
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.MainView, { backgroundColor: theme.card }]}>
                <View style={styles.imgContainer}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.sectionImage}
                  />
                </View>
                <View style={styles.rightContainer}>
                  <Text style={[styles.mainText, { color: theme.textPrimary }]}>
                    {item.serviceName}
                  </Text>
                  <Text style={[styles.price, { color: theme.textSecondary }]}>
                    ₹{item.price}
                  </Text>
                  <Text style={[styles.desc, { color: theme.textSecondary }]}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookButton,
                      { backgroundColor: COLORS.primary },
                    ]}
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
        ) : !categoryLoading && !loading ? (
          <View style={styles.centerLoadingContainer}>
            <Text
              style={{
                textAlign: 'center',
                color: theme.textSecondary,
                fontSize: wp('4%'),
                fontFamily: 'Poppins-Medium',
              }}
            >
              {selectedCategory 
                ? `No ${gender} services found for ${selectedCategory}.`
                : `No ${gender} services available.`
              }
            </Text>
          </View>
        ) : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  genderLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    marginHorizontal: wp('3%'),
  },
  genderSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: wp('5%'),
  },
  categoryCircle: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('1%'),
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: wp('9%'),
  },
  categoryFallback: {
    width: '100%',
    height: '100%',
    borderRadius: wp('9%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  categoryText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginTop: hp('0.5%'),
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  MainView: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2%'),
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
    height: '90%',
    resizeMode: 'cover',
    borderRadius: wp('3%'),
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: wp('3%'),
  },
  mainText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
  },
  desc: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
  },
  bookButton: {
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('3%'),
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  centerLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp('50%'),
  },
});