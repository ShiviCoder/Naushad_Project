import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
  ScrollView,
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

const PackagesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [packages,setPackages] = useState([]);

const fetchPackages = async () => {
    try {
      //const token = await getToken();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';
      const response = await fetch('https://naushad.onrender.com/api/packages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log("Package response : ", json);
      console.log('Package token : ', token)
      setPackages(json.data);
    } catch (err) {
      console.log("Package error : ", err)
    }
  }

  useEffect(()=>{
    fetchPackages();
  },[])

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
  <Animated.ScrollView
    style={{ transform: [{ translateY }] }}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[COLORS.primary]}
        tintColor={COLORS.primary}
      />
    }
    contentContainerStyle={{
      paddingBottom: hp('3%'),
    }}
  >
    {/* Header (no padding) */}
    <Head title="Our Packages" />

    {/* Add padding ONLY for cards */}
    <View style={{ paddingHorizontal: wp('4%') }}>
      {packages.map((item, index) => (
        <View key={index} style={styles.cardWrapper}>
          <Shadow
            distance={wp('2%')}
            startColor={COLORS.shadow}
            offset={[0, 0]}
            style={[styles.mainContainer, { backgroundColor: COLORS.secondary }]}
          >
            {/* Text Section */}
            <View style={styles.mainText}>
              <View style={styles.title}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.priceText}>₹{item.price}</Text>
              </View>
              <Text style={styles.serviceText}>
                Services: <Text style={{ color: '#000' }}>{item.services}</Text>
              </Text>
              <Text style={styles.aboutText}>
                About: <Text style={{ color: '#000' }}>{item.about}</Text>
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PackageDetails', { item })}
                style={[styles.bookNowButton, { backgroundColor: COLORS.primary }]}
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
      ))}
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
    marginBottom: hp('1%'),
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: hp('22%'),
  },
  mainText: {
    flex: 1,
    marginRight: wp('3%'),
    justifyContent: 'center',
    gap: hp('1.2%'),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('6%'),
  },
  titleText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#B07813',
  },
  serviceText: {
    fontSize: wp('3.5%'),
    color: '#42BA86',
  },
  aboutText: {
    fontSize: wp('3.5%'),
    color: '#42BA86',
  },
  bookNowButton: {
    borderRadius: wp('10%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  mainImage: {
    width: wp('35%'),
    height: '100%',
    overflow: 'hidden',
    borderTopRightRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
  },
  Image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default PackagesScreen;
