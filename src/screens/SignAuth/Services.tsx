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
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
  ServiceDetails: { item: any };
};

const categories = [
  { name: 'Haircut', image: require('../../assets/images/haircut.jpg') },
  { name: 'Hair coloring', image: require('../../assets/images/haircolor.jpg') },
  { name: 'Facial', image: require('../../assets/images/facial.jpg') },
  { name: 'Beard', image: require('../../assets/images/beard.jpg') },
  { name: 'Nail', image: require('../../assets/images/nail.jpg') },
];

export default function ServicesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [storySelect, setStorySelect] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const fetchServices = async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';
      const res = await fetch('https://naushad.onrender.com/api/ourservice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setServices(data.data || []);
    } catch (err) {
      console.log('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    // Pull down animation
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchServices();
    console.log("Fetch data on refresh")

    // Push back up animation
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

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
      contentContainerStyle={{
        paddingBottom: hp('4%'),
      }}
    >
      {/* 🔹 Header (moves with scroll & refresh) */}
      <Head title="Services" />

      {/* 🔹 Categories Section */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: hp('2%'),
          paddingHorizontal: wp('3%'),
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => setStorySelect(index)}
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
              <Image source={item.image} style={styles.categoryImage} />
            </View>
            <Text style={[styles.categoryText, { color: theme.textPrimary }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 🔹 Services List */}
      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.MainView, { backgroundColor: theme.card }]}>
            <View style={styles.imgContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.sectionImage} />
            </View>
            <View style={styles.rightContainer}>
              <Text style={[styles.mainText, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.price, { color: theme.textSecondary }]}>
                ₹{item.price}
              </Text>
              <Text style={[styles.desc, { color: theme.textSecondary }]}>
                {item.serviceName}
              </Text>
              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: COLORS.primary }]}
                onPress={() => navigation.navigate('ServiceDetails', { item })}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </Animated.ScrollView>
  </SafeAreaView>
);


}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // 🔹 Categories
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
    padding : wp("1%"),
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: wp('9%'),
  },
  categoryText: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
    marginTop: hp('0.5%'),
    textAlign: 'center',
  },

  // 🔹 Services
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
  },
  mainText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  desc: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
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
  fixedHeader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  backgroundColor: '#fff',
},
});
