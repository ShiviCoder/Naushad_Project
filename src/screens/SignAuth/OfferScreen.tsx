import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
  const translateY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('male');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  };

  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');

        if (savedGender && savedGender !== 'null') {
          const normalized = savedGender.toLowerCase().trim();
          setGender(
            ['male', 'female'].includes(normalized) ? normalized : 'male',
          );
        }

        await AsyncStorage.removeItem('selectedGender');
      } catch {
        setGender('male');
      }
    };

    loadGender();
  }, []);

  const fetchSpecialOffers = async selectedGender => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      let finalGender = selectedGender || gender || 'male';

      if (!['male', 'female'].includes(finalGender)) {
        finalGender = 'male';
      }

      const response = await fetch(`https://naushad.onrender.com/api/offers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (!json?.success) return;

      let data = json.data || [];

      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      setOffers(data);
    } catch (error) {
      console.log('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gender) fetchSpecialOffers(gender);
  }, [gender]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
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
        contentContainerStyle={{
          paddingBottom: hp('3%'),
          paddingHorizontal: wp('3%'),
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No special offers available for {gender}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.offerCard, { backgroundColor: COLORS.primary }]}>
            {/* LEFT SIDE */}
            <View style={styles.offerLeft}>
              <Text style={styles.offerTitle}>{item.title}</Text>

              <Text style={styles.offerDiscount}>{item.discount}</Text>

              <Text style={styles.offerDate}>{item.date}</Text>

              <Text style={styles.offerDesc}>{item.description}</Text>

              <TouchableOpacity
                style={styles.codeBtn}
                onPress={() => navigation.navigate('Services')}
              >
                <Text style={styles.codeText}>Get Now</Text>
              </TouchableOpacity>
            </View>

            {/* RIGHT IMAGE */}
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.offerRightImage}
              />
            ) : (
              <View style={styles.noImg} />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OfferScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    textAlign: 'center',
  },

  /* CARD BOX FIXED */
  offerCard: {
    flexDirection: 'row',
    borderRadius: wp('4%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    alignItems: 'flex-start',
  },

  offerLeft: {
    width: '55%',
    paddingRight: wp('2%'),
  },

  offerRightImage: {
    width: '45%',
    height: hp('20%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover',
  },

  noImg: {
    width: '45%',
    height: hp('20%'),
    backgroundColor: '#9993',
    borderRadius: wp('3%'),
  },

  /* TEXT FIXES */
  offerTitle: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },

  offerDiscount: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('0.4%'),
  },

  offerDate: {
    fontSize: wp('3.5%'),
    color: '#fff',
    marginBottom: hp('0.6%'),
  },

  offerDesc: {
    fontSize: wp('3.2%'),
    color: '#f0f0f0',
    lineHeight: hp('2.2%'),
  },

  codeBtn: {
    backgroundColor: '#fff',
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    marginTop: hp('1.2%'),
    alignSelf: 'flex-start',
  },
  codeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: wp('3.3%'),
  },
});
