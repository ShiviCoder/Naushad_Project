import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
  ScrollView,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import { useTheme } from "../../context/ThemeContext";

export default function ServicesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const fetchHomeServices = async () => {
    try {
      const response = await fetch("https://naushad.onrender.com/api/home-services/", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE",
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log("Home services:", json);
      setServices(json.data);
    } catch (error) {
      console.log("Home services error:", error);
    }
  };

  useEffect(() => {
    fetchHomeServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    // Animate full screen down
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchHomeServices();

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
      >
        {/* Header */}
        <Head title="Home Services" />
        <Text style={styles.Head2}>
          Services only for older clients
        </Text>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>₹{item.price}.00</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: COLORS.primary }]}
                  onPress={() => navigation.navigate('ServiceDetails', { item })}
                >
                  <Text style={styles.bookBtnText}>Book now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),

  },
  card: {
    flexDirection: "row",
    backgroundColor: "#faf7f7ff",
    marginBottom: hp("2%"),
    borderRadius: wp("4%"),
    elevation: 3,
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp("2%"),
  },
  cardImage: {
    width: wp("25%"),
    height: wp("31%"),
    borderRadius: wp("3%"),
  },
  cardContent: {
    flex: 1,
    paddingLeft: wp("4%"),
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  cardPrice: {
    fontSize: hp("2%"),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp("1%"),
  },
  cardDesc: {
    fontSize: hp("1.6%"),
    color: "#666",
    marginBottom: hp("1.5%"),
    lineHeight: hp("2%"),
  },
  bookBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("2%"),
  },
  bookBtnText: {
    color: "#fff",
    fontSize: hp("1.6%"),
    fontWeight: "bold",
  },
  Head2: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.primary,      
    marginTop: hp('0.7%'),
    textAlign: 'center',
    opacity: 0.9,
  }
});
