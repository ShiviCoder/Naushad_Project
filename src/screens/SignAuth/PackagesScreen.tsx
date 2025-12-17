import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Head from '../../components/Head';
import packageData from '../../components/PackageData';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PackagesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('male');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log('token accept');
    return token;
  };

  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');
        console.log('Loaded Gender:', savedGender);

        // ✅ PROPER GENDER LOGIC: param > state > saved > default
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

  const fetchPackages = async (selectedGender = null) => {
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

      console.log('🔍 Fetching packages for gender:', finalGender);

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
      console.log('📦 Packages Full Response:', json);

      if (!json?.success) {
        console.log('❌ API response not successful');
        return;
      }

      let data = json.data || [];

      // 🔥 FILTER BY VALIDATED GENDER
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      console.log(
        '✅ Filtered Packages for',
        finalGender,
        ':',
        data.length,
        'items',
      );
      setPackages(data);
    } catch (err) {
      console.log('🔥 Packages fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch packages whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchPackages(gender);
    }
  }, [gender]);

  // 👇 COMMENTED OUT: RefreshControl functionality
  /*
  const onRefresh = async () => {
    setRefreshing(true);

    // Animate down
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    // Simulate data reload
    await fetchPackages();

    // Animate back up
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };
  */

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Animated.ScrollView
        style={{ transform: [{ translateY }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp('3%'),
        }}
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
        {/* Header (no padding) */}
        <Head title="Our Packages" />

        {/* Add padding ONLY for cards */}
        <View style={{ paddingHorizontal: wp('4%') }}>
          {packages.length > 0 ? (
            packages.map((item, index) => (
              <View key={index} style={styles.cardWrapper}>
                <Shadow
                  distance={wp('2%')}
                  startColor={COLORS.shadow}
                  offset={[0, 0]}
                  style={[
                    styles.mainContainer,
                    { backgroundColor: COLORS.secondary },
                  ]}
                >
                  {/* Text Section */}
                  <View style={styles.mainText}>
                    <View style={styles.title}>
                      <Text
                        style={styles.titleText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                    </View>
                    <Text
                      style={styles.serviceText}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Services:{' '}
                      <Text
                        style={{ color: '#000' }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.services}
                      </Text>
                    </Text>
                    <Text
                      style={styles.aboutText}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      About:{' '}
                      <Text
                        style={{ color: '#000' }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {item.about}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('PackageDetails', { item })
                      }
                      style={[
                        styles.bookNowButton,
                        { backgroundColor: COLORS.primary },
                      ]}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Image Section */}
                  <View style={styles.mainImage}>
                    <Image source={{ uri: item.image }} style={styles.Image} />
                  </View>
                </Shadow>
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: hp('5%'), alignItems: 'center' }}>
              <Text style={{ fontSize: wp('4%'), color: '#666' }}>
                No packages available for {gender}
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    paddingVertical: hp('1%'),
    width: '100%',
  },
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: wp('4%'),
    paddingLeft: wp('3%'),
    paddingRight: wp('2%'),
    marginBottom: hp('1%'),
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: hp('24%'),
    minHeight: hp('22%'),
  },
  mainText: {
    flex: 1,
    marginRight: wp('3%'),
    justifyContent: 'space-between',
    paddingVertical: wp('2%'),
    paddingRight: wp('1%'),
    gap: hp('0.8%'),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('0.5%'),
  },
  titleText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  priceText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#B07813',
    flexShrink: 0,
  },
  serviceText: {
    fontSize: wp('3.3%'),
    color: '#42BA86',
    lineHeight: wp('4.5%'),
  },
  aboutText: {
    fontSize: wp('3.3%'),
    color: '#42BA86',
    lineHeight: wp('4.5%'),
    flexShrink: 1,
  },
  bookNowButton: {
    borderRadius: wp('10%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  mainImage: {
    width: wp('32%'),
    height: '100%',
    overflow: 'hidden',
    borderTopRightRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
    marginLeft: wp('1%'),
  },
  Image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default PackagesScreen;
