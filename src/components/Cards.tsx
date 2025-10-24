import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polygon } from "react-native-svg";
import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../utils/Colors';

const Card = ({ item }) => {
  // dynamic sizes
  const cardWidth = wp("40%");  // each card takes ~40% of screen width
  const cardHeight = hp("20%"); // proportional height
  const {theme} = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.cardWrapper, { width: cardWidth, height: cardHeight }]}>
      {/* Folded top corners */}
      <Svg height={hp("12%")} width={cardWidth} style={styles.foldSvg}>
      <Polygon 
  points={`0,0 ${wp("5%")},0 0,${wp("5%")}`} 
  fill={theme.background} 
/>

<Polygon 
  points={`${cardWidth},0 ${cardWidth - wp("5%")},0 ${cardWidth},${wp("5%")}`} 
  fill={theme.background}  
/>
</Svg>

      <Shadow distance={2} startColor={COLORS.shadow} offset={[0, hp("2%")]}>
        {/* Main Card */}
        <View style={[styles.container, { width: cardWidth, height: cardHeight }]}>
          {/* Hexagon Header */}
          <View style={styles.header}>
            <Svg height={hp("6%")} width={cardWidth * 0.6}>
              <Polygon
                points={`0,0 ${cardWidth * 0.6},0 ${cardWidth * 0.6},${hp("4%")} ${(cardWidth * 0.6) / 2},${hp("6%")} 0,${hp("4%")}`}
                fill={COLORS.primary}
              />
            </Svg>
            <Text style={styles.headerText}>{item.name}</Text>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={styles.rate}>
              Rate: <Text style={styles.bold}>{item.price}</Text>
            </Text>
            <Text style={styles.products}>
              Products: <Text style={styles.bold}> {item.products}</Text>
            </Text>
            <View style={styles.footerCon}>
              <Text style={styles.about}>{item.tag}</Text>
              <TouchableOpacity style={[styles.bookButton,{ backgroundColor: COLORS.primary}]} onPress={()=>navigation.navigate('ProductPakage',{item})}>
                <Text style={styles.bookText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    // margin: wp("2%"),
    alignItems: 'center',
     marginHorizontal : wp('3%'),
    overflow: 'visible',
    justifyContent : 'space-evenly'
  },
  foldSvg: {
    position: 'absolute',
    top: -1,
    left: 0,
    zIndex: 2,
  },
  container: {
    backgroundColor: "#EDEDED",
    borderRadius: wp("2%"),
    alignItems: "center",
    paddingHorizontal: wp("3%"),
    paddingBottom: hp("2%"),
    // marginHorizontal : wp('3%'),
    overflow: 'visible',
  },
  header: {
    width: "100%",
    height: hp("6%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1%"),
  },
  headerText: {
    position: "absolute",
    fontSize: wp("3%"),
    fontWeight: '500',
    color: "#FFFFFF",
  },
  cardContent: {
    width: "90%",
    justifyContent: 'space-evenly',
  },
  rate: { fontSize: wp("3%"), marginBottom: hp("0.5%") },
  products: { fontSize: wp("2.8%"), marginBottom: hp("1%") },
  about: {
    fontSize: wp("2.5%"),
    fontStyle: "italic",
    color: "#D19B00",
    marginBottom: hp("0.5%"),
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#FFC107",
    borderRadius: wp("5%"),
    minWidth: wp("18%"),
    paddingVertical: hp("0.8%"),
    alignItems: "center",
  },
  bookText: { color: "#fff", fontWeight: "bold", fontSize: wp("3%") },
  bold: { fontWeight: "bold" },
  footerCon: { alignItems: 'center' },
});

export default Card;