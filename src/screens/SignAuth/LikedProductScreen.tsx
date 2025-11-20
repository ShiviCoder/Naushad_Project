import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "../../utils/Colors";


export default function LikedProductsScreen({ route, navigation }) {
  const { likedProducts = [], products = [], theme } = route.params || {};

  const likedItems = products.filter((p) => likedProducts.includes(p._id));

  useEffect(() => {
  const backAction = () => {
    navigation.goBack(); 
    return true; 
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);


  return (
    <>
     <Head title="Liked Products" onBackPress={() => navigation.goBack()} />
    <View
      style={{
        flex: 1,
        backgroundColor: theme?.dark ? "#000" : "#fff",
        paddingHorizontal: wp("1%"),
      }}
    >
     

      {likedItems.length > 0 ? (
        <FlatList
          data={likedItems}
          numColumns={2}
          contentContainerStyle={{ paddingVertical: hp("2%") }}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            const selectedImage = { uri: item.image }; // fallback
            return (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate("ProductDetails", { product: item })
                }
              >
                <Image
                  resizeMode="cover"
                  source={selectedImage}
                  style={styles.ImageStyle}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.productName, { color: "#000" }]}
                >
                  {item.name}
                </Text>

                <View style={styles.OuterPriceContainer}>
                  <View style={styles.InnerPriceContainer}>
                    <Text style={[styles.priceStyle, { color: "#000" }]}>
                      ₹{item.price}
                    </Text>
                    <Text
                      style={[
                        styles.DiscountStyle,
                        { color: theme?.dark ? "#42BA86" : "#42BA86" },
                      ]}
                    >
                      ({item.offer})
                    </Text>
                  </View>
                </View>

                <View style={styles.descContain}>
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: "http://naushad.onrender.com/uploads/icons/1761913753959-Leaf1.png",
                    }}
                    style={styles.featureIconStyle}
                  />
                  <Text
                    style={[styles.DescStyle, { color: "#000" }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>

                <View style={styles.OutRatContain}>
                  <View
                    style={[
                      styles.InnerRatContain,
                      {
                        backgroundColor: theme?.dark ? "#0f8a43" : "#09932B",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ratingTextStyle,
                        {
                          color: theme?.dark ? "#861919ff" : "#e6e2e2ff",
                        },
                      ]}
                    >
                      {item.rating}
                    </Text>
                    <Image
                      resizeMode="contain"
                      style={styles.starStyle}
                      source={require("../../assets/OurProduct/star1.png")}
                    />
                  </View>
                  <Text
                    style={[
                      styles.reviewStyle,
                      { color: theme?.dark ? "#ccc" : "#ACACAC" },
                    ]}
                  >
                    ({item.reviews?.[0] || 0})
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: hp("20%"),
            fontSize: wp("5%"),
            color: theme?.textPrimary,
          }}
        >
          No liked products yet ❤️
        </Text>
      )}
    </View></>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: wp("44%"),
    borderRadius: wp("7%"),
    alignItems: "center",
    marginVertical: hp("1%"),
    marginHorizontal: wp("2%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: COLORS.shadow,
  },
  ImageStyle: {
    width: wp("40%"),
    height: wp("30%"),
    borderRadius: wp("5%"),
    marginBottom: hp("3%"),
  },
  OuterPriceContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    gap: wp("2.5%"),
    marginBottom: hp("1%"),
  },
  InnerPriceContainer: {
    flexDirection: "row",
    gap: wp("4%"),
  },
  priceStyle: {
    fontSize: wp("3.8%"),
    fontWeight: "500",
  },
  featureIconStyle: {
    width: wp("4%"),
    height: hp("2%"),
  },
  starStyle: {
    width: wp("3.2%"),
    height: wp("3.2%"),
  },
  descContain: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    gap: wp("1%"),
    marginBottom: hp("1%"),
  },
  OutRatContain: {
    width: "100%",
    flexDirection: "row",
    gap: wp("2%"),
    alignItems: "center",
  },
  InnerRatContain: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#09932B",
    borderRadius: wp("3%"),
    paddingVertical: hp("0.2%"),
    paddingHorizontal: wp("1.5%"),
  },
  ratingTextStyle: {
    fontSize: wp("3.2%"),
    marginRight: wp("1%"),
  },
  productName: {
    fontSize: wp("4%"),
    alignSelf: "flex-start",
    fontWeight: "700",
    marginBottom: hp("1%"),
  },
  DescStyle: {
    flex: 1,
    fontSize: wp("3.5%"),
    fontWeight: "600",
  },
  DiscountStyle: {
    color: "#42BA86",
    fontSize: wp("3.5%"),
    fontWeight: "600",
  },
  reviewStyle: {
    marginLeft: wp("1%"),
    fontSize: wp("3.2%"),
  },
});
