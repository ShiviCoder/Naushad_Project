import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfferScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

 const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }

  const [gender, setGender] = useState("male");

useEffect(() => {
  const loadGender = async () => {
    const savedGender = await AsyncStorage.getItem("selectedGender");

    console.log("Loaded Gender:", savedGender);

    // Fallback to male if null/undefined/"null"
    if (!savedGender || savedGender === "null") {
      setGender("male");
    } else {
      setGender(savedGender);
    }

      // ⭐ Remove saved gender so next time fresh value will be used
    await AsyncStorage.removeItem("selectedGender");
    console.log("Old gender removed from AsyncStorage");
  };

  

  loadGender();
}, []);


const fetchSpecialOffers = async (selectedGender) => {
    try {
      const token = await getToken();
      const g = (selectedGender || gender || "male").toLowerCase().trim();
      console.log("Selected Gender for special offers:", g);

      const response = await fetch(`https://naushad.onrender.com/api/offers?gender=${g}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      console.log("📦 Full Response:", json);

      if (!json?.success) return;

      let data = json.data || [];

      // 🔥 FINAL FILTER
      data = data.filter((item) =>
        String(item.gender || "")
          .trim()
          .toLowerCase() === g
      );

      console.log("Special Filtered Data:", data);
      setOffers(data);
    } catch (error) {
      console.log("special offer error : ", error)
    }
  };

  useEffect(() => {
    fetchSpecialOffers(gender);
  }, [gender]);

  const onRefresh = async () => {
    setRefreshing(true);

    // Animate pull down
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchOffers();

    // Animate back up
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  // ✅ Add return here
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.FlatList
        data={offers}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        style={{ transform: [{ translateY }] }}
        ListHeaderComponent={
          <>
            <Head title="OfferScreen" />
            <View style={{ height: hp('2%') }} />
          </>
        }
        contentContainerStyle={{ paddingBottom: hp('1%') }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.offerCard, { backgroundColor: COLORS.primary }]}>
            <View style={styles.offerLeft}>
              <Text style={styles.offerBig}>{item.title}</Text>
              <Text style={styles.offerSmall}>{item.discount}</Text>
              <Text style={styles.offerDate}>{item.date}</Text>
              <Text style={styles.offerDesc}>{item.description}</Text>
              <TouchableOpacity
                style={styles.codeBtn}
                onPress={() => navigation.navigate('Services')}
              >
                <Text style={styles.codeText}>Get Now</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: item.imageUrl }} style={styles.offerRightImage} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OfferScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  offerCard: {
    marginBottom: hp('1.5%'),
    borderRadius: wp('4%'),
    elevation: 4,
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
    paddingHorizontal: wp('4%'),
    justifyContent: 'flex-start',
    width: '50%',
  },
  offerBig: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: '#fff',
    marginTop: hp('1%'),
  },
  offerSmall: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp('0.5%'),
  },
  offerDate: { color: '#fff', marginTop: hp('0.3%') },
  offerRightImage: {
    width: '50%',
    resizeMode: 'cover',
    height: '100%',
  },
  offerDesc: {
    color: '#f0f0f0',
    fontSize: wp('3.2%'),
    marginTop: hp('0.5%'),
    lineHeight: 18,
  },
  codeBtn: {
    backgroundColor: '#fff',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
    alignSelf: 'flex-start',
  },
  codeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: wp('3%'),
  },
});
