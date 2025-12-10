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
  const [allServices, setAllServices] = useState<any[]>([]); // Store all services for filtering
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const [gender, setGender] = useState("male");

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  }

  // Load gender from AsyncStorage
  useEffect(() => {
    const loadGender = async () => {
      const savedGender = await AsyncStorage.getItem("selectedGender");
      console.log("📱 Loaded Gender from Storage:", savedGender);

      // Fallback to male if null/undefined/"null"
      if (!savedGender || savedGender === "null") {
        setGender("male");
      } else {
        setGender(savedGender);
      }

      // Remove saved gender so next time fresh value will be used
      await AsyncStorage.removeItem("selectedGender");
      console.log("🗑️ Old gender removed from AsyncStorage");
    };

    loadGender();
  }, []);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      console.log("🔍 Fetching services with gender:", gender);
      
      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      console.log("📦 Full API Response:", data);
      
      if (data.success && data.data) {
        // Store all services
        setAllServices(data.data);
        
        // Apply gender filter
        const genderFilteredServices = data.data.filter((service: any) =>
          String(service.gender || "").trim().toLowerCase() === gender.toLowerCase()
        );
        
        console.log(`👤 Gender Filtered Services (${gender}):`, genderFilteredServices);
        
        setServices(genderFilteredServices);
        
        // Extract unique categories from gender-filtered services
        const uniqueCategories = Array.from(
          new Set(genderFilteredServices.map((service: any) => service.serviceName))
        ).map((serviceName, index) => {
          const service = genderFilteredServices.find((s: any) => s.serviceName === serviceName);
          return {
            id: index.toString(),
            name: serviceName,
            imageUrl: service?.imageUrl,
            gender: service?.gender
          };
        });
        
        console.log("🏷️ Unique Categories:", uniqueCategories);
        setCategories(uniqueCategories);
        
        // Set first category as selected by default if categories exist
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0].name);
          // Filter services for the first category
          const firstCategoryServices = genderFilteredServices.filter((service: any) => 
            service.serviceName === uniqueCategories[0].name
          );
          setServices(firstCategoryServices);
          console.log("✅ First category services:", firstCategoryServices);
        } else {
          setSelectedCategory(null);
          console.log("❌ No categories found for this gender");
        }
      }
    } catch (err) {
      console.log('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter services by category
  const filterServicesByCategory = (categoryName: string) => {
    try {
      setCategoryLoading(true);
      
      // First apply gender filter to all services
      const genderFiltered = allServices.filter((service: any) =>
        String(service.gender || "").trim().toLowerCase() === gender.toLowerCase()
      );
      
      // Then apply category filter
      const categoryFiltered = genderFiltered.filter((service: any) => 
        service.serviceName === categoryName
      );
      
      console.log(`🔍 Filtered by Category "${categoryName}":`, categoryFiltered);
      setServices(categoryFiltered);
    } catch (err) {
      console.log('❌ Filter category error:', err);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Refetch services when gender changes
  useEffect(() => {
    if (gender) {
      console.log("🔄 Gender changed, refetching services:", gender);
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
    console.log(`🎯 Category selected: ${category.name}, Index: ${index}`);
    setStorySelect(index);
    setSelectedCategory(category.name);
    setCategoryLoading(true);
    filterServicesByCategory(category.name);
  };

  // Filter services based on selected category and gender
  const filteredServices = services.filter(service => 
    String(service.gender || "").trim().toLowerCase() === gender.toLowerCase() &&
    (!selectedCategory || service.serviceName === selectedCategory)
  );

  console.log("🎯 Final Filtered Services:", filteredServices);

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
    // Fallback to a simple colored circle with first letter
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
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading services for {gender}...
          </Text>
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
        {/* 🔹 Categories */}
        {categories.length > 0 ? (
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
        ) : (
          <View style={styles.noCategoriesContainer}>
            <Text style={[styles.noCategoriesText, { color: theme.textSecondary }]}>
              No categories available for {gender}
            </Text>
          </View>
        )}

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
                  <View style={styles.serviceHeader}>
                    <Text style={[styles.mainText, { color: theme.textPrimary }]}>
                      {item.serviceName}
                    </Text>
                  </View>
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
            <Text style={[styles.noServicesText, { color: theme.textSecondary }]}>
              {selectedCategory 
                ? `No ${selectedCategory} services found for ${gender}.`
                : `No services available for ${gender}.`
              }
            </Text>
            <Text style={[styles.noServicesSubtext, { color: theme.textSecondary }]}>
              Try changing gender or check back later.
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
    paddingHorizontal: wp('5%'),
  },
  genderIndicator: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  genderText: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
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
    maxWidth: wp('20%'),
  },
  MainView: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('0.5%'),
  },
  mainText: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: wp('2%'),
  },
  genderBadge: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1%'),
  },
  genderBadgeText: {
    fontSize: wp('2.8%'),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
    fontWeight: '600',
  },
  desc: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
    lineHeight: hp('2%'),
  },
  timeText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
  },
  bookButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('2%'),
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  centerLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp('50%'),
    paddingHorizontal: wp('5%'),
  },
  loadingText: {
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  noCategoriesContainer: {
    paddingVertical: hp('3%'),
    alignItems: 'center',
  },
  noCategoriesText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  noServicesText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  noServicesSubtext: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});