import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import Head from '../../components/Head';
import  {PackageData} from '../../components/PackageData';


type RootStackParamList = {
    OurPackages: undefined,
    PackageDetails: {item: PackageData}
}

type PackageDetailsRouteProp = RouteProp<RootStackParamList, 'PackageDetails'>

const PackageDetails = () => {
    const route = useRoute<PackageDetailsRouteProp>()
    const { item } = route.params
    return (
        <View style={styles.container}>
            <Head title='Our Packages'></Head>
            <Image style={styles.img} source={item.image} />
            <View style={styles.detail}>
                <View style={styles.titleContain}>
                    <Text style={styles.titleTxt}>{item.title}</Text>
                    <Text style={styles.priceTxt}>{item.price}</Text>
                </View>
                <Text style={styles.aboutTxt}>{item.about}</Text>
                <Text>{item.discount}</Text>
            </View>
            <View style={styles.serviceListContain}>
                <Text style={styles.serviceListHeadTxt}>Service List</Text>
                {item.serviceList.map((service, index) => (
                    <View key={index} style={styles.ServiceListTxtContain}>
                        <Text>✅</Text>
                        <Text style={styles.serviceListTxt} >
                            {service}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={styles.ratContain}>
                <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={20}
                    startingValue={item.rating}
                    readonly={true}
                    
                />

                <Text style={styles.ratTxt}>({item.review}  reviews)</Text>
            </View>
            <View style={styles.bookAppoint}>
                <Text style={styles.bookAppointTxt}>Book Appointment</Text>
            </View>
        </View>
    )
}

export default PackageDetails


const styles = StyleSheet.create({
    container: {
        gap: 40
    },
   
    img: {
        width: 350,
        height: 182,
        alignSelf: 'center',
        borderRadius: 12
    },
    titleTxt: {
        fontWeight: 500,
        fontSize: 20
    },
    priceTxt: {
        fontSize: 20,
        fontWeight: 500,
        color: '#000000'
    },
    titleContain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    aboutTxt: {
        color: '#00000075',
        fontSize: 14,
        fontWeight: 500,

    },
    detail: {
        width: '80%',
        alignSelf: 'center',
        gap: 5
    },
    serviceListHeadTxt: {
        fontSize: 20,
        fontWeight: 500
    },
    serviceListTxt: {
        fontSize: 14,
        color: '#00000075'
    },
    ServiceListTxtContain: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    serviceListContain: {
        width: '80%',
        alignSelf: 'center'
    },
    ratTxt: {
        fontSize: 14,
        fontWeight: 500,
        color: '#0000006E'
    },
    ratContain: {
        flexDirection: 'row',
        gap: 20,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center'
    },
    bookAppoint: {
        height: 41,
        width: 350,
        backgroundColor: '#F6B745',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    bookAppointTxt: {
        fontSize: 15,
        fontWeight: 500,
        color: '#FFFFFF'
    },

})