import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [gender, setGender] = useState('male');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log('token accept');
    return token;
  };

  // ✅ PROPER GENDER LOGIC - EXACT FROM PACKAGES REFERENCE
  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');
        console.log('Loaded Gender:', savedGender);

        // ✅ PROPER GENDER LOGIC: saved > default
        if (savedGender && savedGender !== 'null') {
          const normalizedGender = savedGender.toLowerCase().trim();
          setGender(
            normalizedGender === 'male' || normalizedGender === 'female'
              ? normalizedGender
              : 'male',
          );
          console.log('✅ Valid Gender Set:', normalizedGender);
        } else {
          console.log('⚠️ No valid saved gender, using default: male');
        }

        // ⭐ Clear saved gender after use for fresh value next time
        await AsyncStorage.removeItem('selectedGender');
        console.log('🗑️ Old gender cleared from AsyncStorage');
      } catch (error) {
        console.log('❌ Gender load error:', error);
        setGender('male'); // Fallback to default
      }
    };

    loadGender();
  }, []);

  // 🔥 PROPER FETCH SERVICES - EXACT FROM PACKAGES REFERENCE
  const fetchServices = async (selectedGender = null) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        console.log('❌ No token available');
        return;
      }

      // 🔥 PROPER GENDER PRIORITY: selectedGender > state > default
      let finalGender = 'male';
      if (selectedGender) {
        finalGender = selectedGender.toLowerCase().trim();
      } else if (gender && gender !== 'null') {
        finalGender = gender.toLowerCase().trim();
      }

      // ✅ Validate gender value
      if (!['male', 'female'].includes(finalGender)) {
        finalGender = 'male';
      }

      console.log('🔍 Fetching services for gender:', finalGender);

      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('📦 Services Full Response:', data);

      if (!data?.success || !data.data) {
        console.log('❌ API response not successful');
        return;
      }

      let rawServices = data.data || [];

      // 🔥 FILTER BY VALIDATED GENDER - EXACT FROM PACKAGES
      const genderFilteredServices = rawServices.filter(
        (service: any) =>
          String(service.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      console.log(
        '✅ Gender Filtered Services for',
        finalGender,
        ':',
        genderFilteredServices.length,
        'items',
      );

      // Store GENDER FILTERED services as allServices
      setAllServices(genderFilteredServices);

      // Extract unique categories from GENDER FILTERED services
      const uniqueCategories = Array.from(
        new Set(
          genderFilteredServices.map((service: any) => service.serviceName),
        ),
      ).map((serviceName, index) => {
        const service = genderFilteredServices.find(
          (s: any) => s.serviceName === serviceName,
        );
        return {
          id: index.toString(),
          name: serviceName,
          imageUrl: service?.imageUrl,
          gender: service?.gender,
        };
      });

      console.log(
        '🏷️ Unique Categories for',
        finalGender,
        ':',
        uniqueCategories,
      );
      setCategories(uniqueCategories);

      // Set services to ALL gender-filtered services initially
      setServices(genderFilteredServices);

      // Set first category as selected if exists
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0].name);
        console.log('✅ First category selected:', uniqueCategories[0].name);
      } else {
        setSelectedCategory(null);
        console.log('❌ No categories found for this gender');
      }
    } catch (err) {
      console.log('🔥 Services fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch services whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchServices(gender);
    }
  }, [gender]);

  // Filter services by category - ALWAYS GENDER FILTERED FIRST
  const filterServicesByCategory = (categoryName: string) => {
    try {
      setCategoryLoading(true);

      // allServices is already GENDER FILTERED from fetchServices
      const categoryFiltered = allServices.filter(
        (service: any) => service.serviceName === categoryName,
      );

      console.log(
        `🔍 Filtered by Category "${categoryName}" (gender: ${gender}):`,
        categoryFiltered,
      );
      setServices(categoryFiltered);
      setSelectedCategory(categoryName);
    } catch (err) {
      console.log('❌ Filter category error:', err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCategoryPress = (category: any, index: number) => {
    console.log(`🎯 Category selected: ${category.name}, Index: ${index}`);
    setStorySelect(index);
    filterServicesByCategory(category.name);
  };

  // 👇 COMMENTED OUT: RefreshControl functionality
  /*
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.spring(translateY, { toValue: 60, useNativeDriver: true }).start();
    await fetchServices();
    Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }).start();
    setRefreshing(false);
  };
  */

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
      <View
        style={[styles.categoryFallback, { backgroundColor: COLORS.primary }]}
      >
        <Text style={styles.fallbackText}>
          {category.name ? category.name.charAt(0).toUpperCase() : 'S'}
        </Text>
      </View>
    );
  };

  // Show full screen loading indicator
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Head title="Services" />
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          {/* <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading services for {gender}...
          </Text> */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ transform: [{ translateY }] }}
        contentContainerStyle={{ paddingBottom: hp('4%') }}
        // 👇 REMOVED: refreshControl prop
        /*
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        */
      >
        {/* 🔹 Header */}
        <Head title="Services" />

        {/* 🔹 Categories */}
        {categories.length > 0 ? (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id}
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
                <Text
                  style={[styles.categoryText, { color: theme.textPrimary }]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noCategoriesContainer}>
            <Text
              style={[styles.noCategoriesText, { color: theme.textSecondary }]}
            >
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
        {!categoryLoading && services.length > 0 ? (
          <FlatList
            data={services}
            keyExtractor={item => item._id}
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
                    <Text
                      style={[styles.mainText, { color: theme.textPrimary }]}
                    >
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
            <Text
              style={[styles.noServicesText, { color: theme.textSecondary }]}
            >
              {selectedCategory
                ? `No ${selectedCategory} services found for ${gender}.`
                : `No services available for ${gender}.`}
            </Text>
            <Text
              style={[styles.noServicesSubtext, { color: theme.textSecondary }]}
            >
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
    flex: 1,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
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
