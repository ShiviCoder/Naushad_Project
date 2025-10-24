import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react';
import Head from '../../components/Head';
import { RouteProp, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

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

const services = [
  {
    id: '1',
    name: 'Shampoo',
    price: 499,
    includes: 'wash, Cut, Blowdry',
    image: require('../../assets/SHH.png'),
  },
  {
    id: '2',
    name: 'Head massage',
    price: 499,
    includes: 'wash, Cut, Blowdry',
    image: require('../../assets/SHH.png'),
  },
];
console.log(services)
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
  const [selectedService, setSelectedService] = useState(null);

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, { backgroundColor: theme.background,height : '100%' }]}>
        <Head title="Our Services" />
        <View style={{ gap: hp('2%') }}>
          <Image style={styles.image} source={item.image} />
          <View style={styles.nameCont}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.price, { color: theme.textPrimary }]}>{item.price}</Text>
          </View>

          <Text style={[styles.desc, { color: theme.subtext }]}>"{item.description}"</Text>

          <View style={styles.highlightCont}>
            <Text style={[styles.hightlightHead, { color: theme.textPrimary }]}>Highlights</Text>
            {item.highlights?.map((element, index) => (
              <View key={index} style={styles.highInCon}>
                <View style={[styles.circle, { backgroundColor: COLORS.primary }]} />
                <Text style={[styles.highlightTxt, { color: theme.subtext }]}>{element}</Text>
              </View>
            ))}
          </View>

          <View style={styles.extra}>
            <Text style={[styles.extraHead, { color: theme.textPrimary }]}>Extra</Text>

            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  { backgroundColor: theme.card },
                  selectedService === service.id && {
                  },
                ]}
                onPress={() => setSelectedService(service.id)}
                activeOpacity={0.8}
              >
                {/* Image */}
                <Image source={service.image} style={styles.serviceImage} />

                {/* Service Details */}
                <View style={styles.serviceDetails}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.serviceName, { color: theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {service.name}
                    </Text>
                    <Text
                      style={[styles.serviceIncludes, { color: theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      Includes: {service.includes}
                    </Text>
                  </View>

                  {/* Price + Checkbox */}
                  <View style={styles.rightSection}>
                    <Text style={[styles.price, { color: theme.textPrimary }]}>
                      ₹ {service.price}
                    </Text>
                    <View style={[styles.checkbox, { borderColor: theme.textSecondary }]}>
                      {selectedService === service.id && (
                        <View
                          style={[
                            styles.checkboxFill,
                            { backgroundColor: theme.secondary },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>


          <TouchableOpacity
            style={[styles.BookAppointBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => {
              navigation.navigate("BookAppointmentScreen"); // showTab false by default

            }}
          >
            <Text style={[styles.BookAppointBtnTxt, { color: theme.background }]}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginTop: hp('2%')
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
    gap: hp("0.3%"),
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
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp("1.2%"),
    borderRadius: wp("2%"),
    marginBottom: hp("1.5%"),
  },
  serviceImage: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("2%"),
    marginRight: wp("3%"),
  },
  serviceDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: wp("4%"),
    fontWeight: "700",
    fontFamily: "Poppins-Medium",

  },
  serviceIncludes: {
    fontSize: wp("3.3%"),
    marginTop: hp("0.3%"),
    fontFamily: "Poppins-Medium",

  },
  rightSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    gap: wp("2%"),
    marginBottom: hp('3%')
  },

  checkbox: {
    width: wp("4.5%"),
    height: wp("4.5%"),
    backgroundColor: '#D9D9D9',
    borderRadius: wp("1%"),
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  checkboxFill: {
    width: "100%",
    height: "100%",
    borderRadius: wp("1%"),
  },
  content: { flex: 1, paddingHorizontal: wp('5%') },
  servicesContainer: { marginTop: hp('3.125%') },
  proceedButton: {
    marginHorizontal: wp('5.56%'),
    marginVertical: hp('2.5%'),
    paddingVertical: hp('1.875%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: hp('1.875%'), fontWeight: '600', fontFamily: "Poppins-Medium",
  },

});
