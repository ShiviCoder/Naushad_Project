import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react';
import Head from '../../components/Head';
import { RouteProp, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../../context/ThemeContext';

type extra = {
  product: string;
  price: number;
}

type Service = {
  name: string;
  price: number;
  desc: string;
  image: any;
  highlights: string[];
  extras: extra[];
};

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
  ServiceDetails: { item: Service };
};

const ServiceDetails = () => {
  const { theme } = useTheme();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const navigation = useNavigation();
  const toggleSelection = (index: number) => {
    if (selectedExtras.includes(index.toString())) {
      setSelectedExtras(selectedExtras.filter((item) => item !== index.toString()));
    } else setSelectedExtras([...selectedExtras, index.toString()]);
  };

  const route = useRoute<RouteProp<RootStackParamList, 'ServiceDetails'>>();
  const { item } = route.params;



  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Our Services" />
      <View style={{gap : hp('2%')}}>
        <Image style={styles.image} source={item.image} />

      <View style={styles.nameCont}>
        <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.price, { color: theme.textPrimary }]}>₹ {item.price}</Text>
      </View>

      <Text style={[styles.desc, { color: theme.subtext }]}>"{item.desc}"</Text>

      <View style={styles.highlightCont}>
        <Text style={[styles.hightlightHead, { color: theme.textPrimary }]}>Highlights</Text>
        {item.highlights?.map((element, index) => (
          <View key={index} style={styles.highInCon}>
            <View style={[styles.circle, { backgroundColor: '#F6B745' }]} />
            <Text style={[styles.highlightTxt, { color: theme.subtext }]}>{element}</Text>
          </View>
        ))}
      </View>

      <View style={styles.extra}>
        <Text style={[styles.extraHead, { color: theme === 'Dark' ? '#fff' : theme.textPrimary }]}>Extra</Text>
        {item.extras?.map((extraItem, index) => (
          <View style={styles.extraItemContain} key={index}>
            <View style={styles.extraItemSubCon}>
              <CheckBox
                value={selectedExtras.includes(index.toString())}
                onValueChange={() => toggleSelection(index)}
                tintColors={{ true: theme.accent, false: '#888' }}
              />
              <Text style={[styles.extraTxt, { color: theme.textSecondary }]}>{extraItem.product}</Text>
            </View>
            <Text style={[styles.extraTxt, { color: theme.textSecondary }]}>₹ {extraItem.price}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.BookAppointBtn, { backgroundColor: '#F6B745' }]}
        onPress={() => {
          navigation.navigate('MainTabs', {
            screen: 'BookAppointmentScreen',
            params: { image: item.image }
          });
        }}
      >
        <Text style={[styles.BookAppointBtnTxt, { color: theme.background }]}>Book Appointment</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    gap: hp("4%"),
  },
  image: {
    width: '90%', // 90% of screen width
    height: hp("25%"), // 25% of screen height
    alignSelf: "center",
    borderRadius: wp("3%"),
  },
  nameCont: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop : hp('2%')
  },
  name: {
    fontSize: hp("3%"),
    fontWeight: "700",
    fontFamily: 'Poppins-Medium'


  },
  price: {
    fontSize: hp("2.2%"),
    fontWeight: "500",
    fontFamily: 'Poppins-Medium'

  },
  desc: {
    fontSize: hp("1.8%"),
    fontWeight: "500",
    color: "#00000075",
    width: '90%',
    alignSelf: "center",
    textAlign: "justify",
    fontFamily: 'Poppins-Medium'
  },
  highlightCont: {
    gap: hp("1.5%"),
    width: "90%",
    alignSelf: "center",
  },
  highInCon: {
    flexDirection: "row",
    gap: wp("4%"),
    alignItems: "center",
  },
  circle: {
    height: wp("4%"),
    width: wp("4%"),
    backgroundColor: "#F6B745",
    borderRadius: '50%',
  },
  highlightTxt: {
    color: "#00000075",
    fontSize: hp("1.6%"),
    fontWeight: "500",
    fontFamily: 'Poppins-Medium'
  },
  hightlightHead: {
    fontSize: hp("2.2%"),
    fontWeight: "700",
    fontFamily: 'Poppins-Medium'
  },
  extraItemContain: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  extraHead: {
    fontSize: hp("3%"),
    fontWeight: "500",
    fontFamily: 'Poppins-Medium'
  },
  extra: {
    width: '90%',
    alignSelf: "center",
    gap: hp("1%"),
  },
  extraTxt: {
    fontSize: hp("1.9%"),
    fontWeight: "500",
    fontFamily: 'Poppins-Medium'
  },
  extraItemSubCon: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  BookAppointBtn: {
    width: '90%',
    paddingVertical: hp("2%"),
    backgroundColor: "#F6B745",
    borderRadius: wp("3%"),
    alignSelf: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  BookAppointBtnTxt: {
    fontSize: hp("2%"),
    fontWeight: "600",
    color: "#fff",
    fontFamily: 'Poppins-Medium'
  },
});
