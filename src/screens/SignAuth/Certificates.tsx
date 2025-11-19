// File: Certificates.js
import { StyleSheet, Text, View, FlatList, Image, Animated, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Certificates = () => {
  const { theme } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    return token;
  };

  const fetchCertificates = async () => {
    try {
      // const token =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';

      const token = await getToken();
      const response = await fetch('https://naushad.onrender.com/api/certificates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log('Certificate Response:', json);
      console.log('Certificate tokens ',token)
      setCertificates(json.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchCertificates();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
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
        contentContainerStyle={{ paddingBottom: hp('10%') }}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <Head title="🏅 Certificates" />
          <View style={styles.listContainer}>
            <FlatList
              data={certificates}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </Animated.View>
  );
};

export default Certificates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('10%'),
  },
  card: {
    marginBottom: hp('2%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: hp('25%'),
    backgroundColor: 'lightgray',
  },
  title: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});
