<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React, { useEffect, useState } from "react";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
<<<<<<< HEAD
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';
=======

  Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import { useTheme } from "../../context/ThemeContext";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
};

<<<<<<< HEAD
export default function ServicesScreen() {
  //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const { theme } = useTheme();
  const fetchHomeServices = async () => {
    try {
      const response = await fetch(
        'https://naushad.onrender.com/api/home-services/',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDUyMTE4OCwiZXhwIjoxNzYxMTI1OTg4fQ.haFkDaIdOrq85-Z1LMnweYsEXT8CrB0aavDdkargyi8', // Postman me jo token use kiya tha
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      console.log('Home services : ', json);
      setServices(json.data);
    } catch (error) {
      console.log('Home services error , ', error);
    }
  };

  useEffect(() => {
    fetchHomeServices();
  }, []);
=======



export default function ServicesScreen() {
  //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigation = useNavigation();
  const [services , setServices] = useState([]);
  const {theme} = useTheme();
const fetchHomeServices = async() => {
  try {
     const response = await fetch('https://naushad.onrender.com/api/home-services/', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDUyMTE4OCwiZXhwIjoxNzYxMTI1OTg4fQ.haFkDaIdOrq85-Z1LMnweYsEXT8CrB0aavDdkargyi8', // Postman me jo token use kiya tha
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log("Home services : ", json);
      setServices(json.data);
  }catch(error){
    console.log("Home services error , ", error);
  }
}

useEffect(()=>{
   fetchHomeServices();
},[])
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

  // Multiple back button methods
  const handleBackPress = () => {
    console.log('Back button pressed');

    try {
      // Method 1: Try goBack first
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Method 2: Navigate directly to Home if can't go back
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      // Method 3: Reset navigation stack as fallback
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Head title="Home Services" />
=======
    <SafeAreaView style={[styles.container,{backgroundColor : theme.background}]}>
      {/* Header */}
      <Head title='Home Services' />

>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

      {/* Services List */}
      <ScrollView style={styles.servicesContainer}>
        {services.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>₹{item.price}.00</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
<<<<<<< HEAD
              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: COLORS.primary }]}
                onPress={() =>
                  navigation.navigate('ServiceDetails', {
                    item: { ...item, image: item.image },
                  })
                }
              >
=======
              <TouchableOpacity style={[styles.bookBtn,{backgroundColor : COLORS.primary}]} onPress={() => navigation.navigate('ServiceDetails', {
                item: { ...item, image: item.image }
              })}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fff',
=======
    backgroundColor: "#fff"
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  // Categories
  categoryScroll: {
    marginVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  categoryItem: {
<<<<<<< HEAD
    alignItems: 'center',
=======
    alignItems: "center",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    marginRight: wp('4%'),
    width: wp('18%'),
  },
  categoryImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('1%'),
  },
  categoryText: {
    fontSize: hp('1.5%'),
<<<<<<< HEAD
    color: '#333',
    textAlign: 'center',
=======
    color: "#333",
    textAlign: "center",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    fontWeight: '500',
    lineHeight: hp('2%'),
  },

  // Services Container
  servicesContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('12%'), // space for bottom navigation
  },

  // Service Cards
  card: {
<<<<<<< HEAD
    flexDirection: 'row',
    backgroundColor: '#fff',
=======
    flexDirection: "row",
    backgroundColor: "#fff",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    elevation: 3,
    padding: wp('4%'),
<<<<<<< HEAD
    shadowColor: '#000',
=======
    shadowColor: "#000",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
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
<<<<<<< HEAD
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#333',
=======
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: hp('2.5%'),
    fontWeight: "bold",
    color: "#333",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    marginBottom: hp('0.5%'),
  },
  cardPrice: {
    fontSize: hp('2%'),
<<<<<<< HEAD
    fontWeight: '600',
    color: '#333',
=======
    fontWeight: "600",
    color: "#333",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    marginBottom: hp('1%'),
  },
  cardDesc: {
    fontSize: hp('1.6%'),
<<<<<<< HEAD
    color: '#666',
=======
    color: "#666",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    marginBottom: hp('1.5%'),
    lineHeight: hp('2%'),
  },
  bookBtn: {
<<<<<<< HEAD
    alignSelf: 'flex-start',
=======
    alignSelf: "flex-start",
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  bookBtnText: {
<<<<<<< HEAD
    color: '#fff',
    fontSize: hp('1.6%'),
    fontWeight: 'bold',
  },
});
=======
    color: "#fff",
    fontSize: hp('1.6%'),
    fontWeight: "bold",
  },
});

>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
