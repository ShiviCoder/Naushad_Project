import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation , useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../components/Svg';
import { StarSvgIcon } from '../components/Svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomNavbar = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<string>('home');
    const route = useRoute();
    useEffect(() => {
        switch (route.name) {
            case 'HomeScreen':
                setActiveTab('home');
                break;
            case 'BookingScreen':
                setActiveTab('book');
                break;
            case 'BookAppointmentScreen':
                setActiveTab('add');
                break;
            case 'StarScreen':
                setActiveTab('blank');
                break;
            case 'AccountScreen':
                setActiveTab('account');
                break;
            default:
                setActiveTab('home');
        }
    }, [route.name]);
    const handlePress = (tab: string, screen: string) => {
        setActiveTab(tab);
        navigation.navigate(screen);
    };

    return (
        <View style={styles.bottomBarWrap}>
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => handlePress('home', 'HomeScreen')}>
                    <View style={[styles.iconWrapper, activeTab === 'home' && styles.activeWrapper]}>
                        <Icon
                            name="home"
                            size={wp('7%')}
                            color={activeTab === 'home' ? '#F6B745' : '#fff'}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('book', 'BookingScreen')}>
                    <View style={[styles.iconWrapper, activeTab === 'book' && styles.activeWrapper]}>
                        <MySvgIcon
                            width={wp('7%')}
                            height={hp('3%')}
                            fill={activeTab === 'book' ? '#F6B745' : '#fff'}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('add', 'BookAppointmentScreen')}>
                    <View style={styles.fabCircle}>
                        <Icon name="add" size={wp('7%')} color="#000" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('blank', 'BlankScreen')}>
                    <View style={[styles.iconWrapper, activeTab === 'star' && styles.activeWrapper]}>
                        <StarSvgIcon
                            width={hp('5%')}
                            height={hp('3%')}
                            fill={activeTab === 'blank' ? '#F6B745' : 'white'}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('account', 'AccountScreen')}>
                    <View style={[styles.iconWrapper, activeTab === 'account' && styles.activeWrapper]}>
                        <Icon
                            name="person-outline"
                            size={wp('7%')}
                            color={activeTab === 'account' ? '#F6B745' : '#fff'}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomBarWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: hp('2%'), // Increased from 16
        alignItems: 'center',

    },
    bottomNav: {
        backgroundColor: '#1A1A1A', // Darker
        width: '90%', // Reduced from 92%
        height: hp('8%'), // Increased from 54
        borderRadius: wp('205'), // Increased from 28
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabCircle: {
        width: wp('13%'),
        height: wp('13%'),
        borderRadius: wp('50%'),
        backgroundColor: '#F6B745',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
    },
    iconWrapper: {
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('50%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeWrapper: {
        backgroundColor: '#fff',
        borderRadius: '50%'
    },
})


export default BottomNavbar;
