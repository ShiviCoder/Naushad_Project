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
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ServicesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // 🔥 PROPER FETCH HOME SERVICES - EXACT FROM PACKAGES REFERENCE
  const fetchHomeServices = async (selectedGender = null) => {
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

      console.log('🔍 Fetching home services for gender:', finalGender);

      const response = await fetch(
        `https://naushad.onrender.com/api/home-services`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      console.log('📦 Home Services Full Response:', json);

      if (!json?.success) {
        console.log('❌ API response not successful');
        return;
      }

      let data = json.data || [];

      // 🔥 FILTER BY VALIDATED GENDER - EXACT FROM PACKAGES
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      console.log(
        '✅ Filtered Home Services for',
        finalGender,
        ':',
        data.length,
        'items',
      );
      setServices(data);
    } catch (error) {
      console.log('🔥 Home services fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch home services whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchHomeServices(gender);
    }
  }, [gender]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // 👇 COMMENTED OUT: RefreshControl functionality
  /*
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();
    await fetchHomeServices();
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
        {/* Header */}
        <Head title="Home Services" />
        <Text style={styles.Head2}>Services only for older clients</Text>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.length > 0 ? (
            services.map((item, index) => (
              <View key={index} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardPrice}>₹{item.price}.00</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate('ServiceDetails', { item })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No home services available for {gender}
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  servicesContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#faf7f7ff',
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    elevation: 3,
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
  },
  cardImage: {
    width: wp('25%'),
    height: wp('31%'),
    borderRadius: wp('3%'),
  },
  cardContent: {
    flex: 1,
    paddingLeft: wp('4%'),
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  cardPrice: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  cardDesc: {
    fontSize: hp('1.6%'),
    color: '#666',
    marginBottom: hp('1.5%'),
    lineHeight: hp('2%'),
  },
  bookBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  bookBtnText: {
    color: '#fff',
    fontSize: hp('1.6%'),
    fontWeight: 'bold',
  },
  Head2: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: hp('0.7%'),
    textAlign: 'center',
    opacity: 0.9,
  },
});
