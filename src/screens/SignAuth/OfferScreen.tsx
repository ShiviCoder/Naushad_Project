import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext'; // theme context import
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const OfferScreen = () => {
  const { theme } = useTheme(); // theme access
  const navigation = useNavigation();
  // const offers = [
  //   {
  //     id: "1",
  //     title: "Haircut",
  //     discount: "20% off",
  //     date: "July 16 - July 24",
  //     desc: "Get a fresh look with our expert haircut service at a discounted price.",
  //     imageMale: require('../../assets/images/man-offer.jpg'),
  //   },
  //   {
  //     id: "2",
  //     title: "Facial",
  //     discount: "15% off",
  //     date: "July 20 - July 28",
  //     desc: "Rejuvenate your skin with our premium facial treatments.",
  //     imageMale: require('../../assets/images/male-offer1.jpg'),

  //   },
  //   {
  //     id: "3",
  //     title: "Spa",
  //     discount: "25% off",
  //     date: "Aug 1 - Aug 10",
  //     desc: "Unwind and relax with our exclusive spa therapy sessions.",
  //     imageMale: require('../../assets/images/male-offer2.jpg'),
  //   },
  //   {
  //     id: "4",
  //     title: "Shaving",
  //     discount: "10% off",
  //     date: "Aug 5 - Aug 15",
  //     desc: "Experience a smooth, refreshing shave with our professional service.",
  //     imageMale: require('../../assets/images/male-offer3.jpg'),
  //   },
  // ];


  const [offers,setOffers] = useState([]);
  const fetchOffers = async() => {
     try {
      //const token =await  getToken();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg';
      const response = await fetch('https://naushad.onrender.com/api/offers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      //console.log("Special offer token : ", token)
      console.log("Special offer data : ", json);
      setOffers(json.data);
    } catch (error) {
      console.log("special offer error : ", error)
    }
  }

  useEffect(()=>{
    fetchOffers();
  },[])
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="OfferScreen" />
      <FlatList
        data={offers}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('9%'), paddingHorizontal: wp('1%') }}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View key={item.id} style={[styles.offerCard, { backgroundColor: COLORS.primary }]}>
            <View style={[styles.offerLeft, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.offerBig}>{item.title}</Text>
              <Text style={styles.offerSmall}>{item.discount}</Text>
              <Text style={styles.offerDate}>{item.date}</Text>
              <Text style={styles.offerDesc}>{item.description}</Text>
              <TouchableOpacity style={styles.codeBtn} onPress={()=>navigation.navigate('Services')}>
                <Text style={styles.codeText}>Get Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{uri : item.imageUrl}}
              style={styles.offerRightImage}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
export default OfferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offerCard: {
    marginHorizontal: wp('1%'),
    marginBottom: hp('1.5%'),
    borderRadius: wp('4%'), // Increased from 12
    elevation: 4, // Increased from 3
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
    fontFamily: "Poppins-Medium"
  },
  offerSmall: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp('0.1%'), 
    fontFamily: "Poppins-Medium"
  },
  offerDate: {
    color: '#fff',
    marginTop: hp('0.1%'),
    fontFamily: "Poppins-Medium"
  },
  offerRightImage: {
    width: '50%',
    resizeMode: 'cover',
    height: '100%',
    borderRadius: 0,
    borderTopLeftRadius: wp('4%'),
    borderBottomLeftRadius: wp('4%')
  },
  offerDesc: {
    color: '#f0f0f0',
    fontSize: wp('3.2%'),
    marginTop: hp('0.1%'),
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
  },
  codeBtn: {
    backgroundColor: '#fff',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
    marginTop: hp('0.3%'),
    alignSelf: 'flex-start',
  },
  codeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: wp('3%'),
  },
});