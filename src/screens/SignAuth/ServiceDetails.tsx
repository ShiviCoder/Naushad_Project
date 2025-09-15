import { StyleSheet, Text, View, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react';
import Head from '../../components/Head';
import { RouteProp, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type extra = {
  product: string;
  price: number;
}

type Service = {
  name: string;
  price: string;
  desc: string;
  image: any;
  highlights: string[];
  extras: extra[];
};

type RootStackParamList = {
  ServiceDetails: { item: Service };
};

const ServiceDetails = () => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const toggleSelection = (product: string) => {
    if (selectedExtras.includes(product)) {
      setSelectedExtras(selectedExtras.filter((item) => item !== product))
    }
    else
      setSelectedExtras([...selectedExtras, product])
  }
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceDetails'>>();
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <Head title="Our Services"></Head>
      <Image style={styles.image} source={item.image} />
      <View style={styles.nameCont}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
      <View style={styles.highlightCont}>
        <Text style={styles.hightlightHead}>Highlights</Text>
        {item.highlights.map((element, index) => <View key={index} style={styles.highInCon}>
          <View style={styles.circle} ></View>
          <Text style={styles.highlightTxt} >
            {element}
          </Text>
        </View>)}
      </View>
      <View style={styles.extra} >
        <Text style={styles.extraHead}>Extra</Text>
        {
          item.extras.map((extraItem, index) => (
            <View style={styles.extraItemContain} key={index}>
              <View style={styles.extraItemSubCon}>
                <CheckBox
                  value={selectedExtras.includes(extraItem.product)}
                  onValueChange={() => toggleSelection(extraItem.product)}
                  tintColors={{ true: '#F6B745', false: '#00000075' }}
                />
                <Text style={styles.extraTxt} >{extraItem.product}</Text>
              </View>
              <Text style={styles.extraTxt}>₹ {extraItem.price}</Text>
            </View>
          ))
        }
      </View>
      <View style={styles.BookAppointBtn}>
        <Text style={styles.BookAppointBtnTxt}>Book Appointment</Text>
      </View>
    </View>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    gap: hp('4%')
  },
  image: {
    width: 350,
    height: 182,
    alignSelf: 'center',
    borderRadius: 12,
  },
  nameCont: {
    flexDirection: 'row',
    width: wp('80%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },
  name: {
    fontSize: 20,
    fontWeight: 500
  },
  price: {
    fontSize: 20,
    fontWeight: 500
  },
  desc: {
    fontSize: 14,
    fontWeight: 500,
    color: '#00000075',
    width: wp('80%'),
    alignSelf: 'center',
  },
  highlightCont: {
    gap: 10,
    width: wp('80%'),
    alignSelf: 'center',
  },
  highInCon: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  circle: {
    height: 15,
    width: 15,
    backgroundColor: '#F6B745',
    borderRadius: 50
  },
  highlightTxt: {
    color: '#00000075',
    fontSize: 11,
    fontWeight: 500
  },
  hightlightHead: {
    fontSize: 20,
    fontWeight: 500
  },
  extraItemContain: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },
  extraHead: {
    fontSize: 20,
    fontWeight: 500
  },
  extra: {
    width: wp('80%'),
    alignSelf: 'center',
    gap: 10,
  },
  extraTxt: {
    fontSize: 15,
    fontWeight: 500
  },
  extraItemSubCon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  }
});
