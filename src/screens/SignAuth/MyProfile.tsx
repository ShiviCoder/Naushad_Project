import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../context/ThemeContext"; // ✅ import theme
import Head from '../../components/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';



const MyProfile = () => {
    const [gender, setGender] = useState('')
    const [filePath, setFilePath] = useState({});
    const [modal, setModal] = useState(false);
    const navigation = useNavigation<any>();
      const [dob, setDob] = useState("");

    const { theme } = useTheme();

    const chooseFile = () => {
        let options = {
            mediaType: 'photo',
            quality: 1,
        };

    const handleChange = (text) => {
    // Remove non-digit characters
    let cleaned = text.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // Add slashes after every 2 digits (first two and next two)
    let formatted = "";
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }

    setDob(formatted);
  };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                // Image mil gayi hai
                console.log('Selected Image: ', response.assets[0].uri);
                setFilePath(response.assets[0]);
            }
        });
    };
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Head title='My Profile' rightComponent={
                <TouchableOpacity>
                    <Text style={[styles.saveText, { color: theme.textPrimary }]}>Save</Text>
                </TouchableOpacity>} />


            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={() => setModal(true)}>
                    <Image
                        style={styles.profilePic}
                        source={filePath.uri ? { uri: filePath.uri } : require('../../assets/images/profilepic.png')}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraContainer} onPress={chooseFile}>
                    <Icon name="camera" size={wp('5%')} color="#3E4347" />
                </TouchableOpacity>
            </View>

            <Modal visible={modal} transparent={true}>
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.closeArea} onPress={() => setModal(false)}>
                        <Image
                            style={styles.fullImage}
                            resizeMode="contain"
                            source={filePath.uri ? { uri: filePath.uri } : require('../../assets/images/profilepic.png')}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>


            <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>

                <Text style={[styles.label, { color: theme.textPrimary }]}>Full Name</Text>
                <TextInput placeholder='Enter your name' placeholderTextColor={'gray'} style={[styles.input, { color: theme.textPrimary }]} />

                <Text style={[styles.label, { color: theme.textPrimary }]}>Email</Text>
                <TextInput placeholder='Enter your email' placeholderTextColor={'gray'} style={[styles.input, { color: theme.textPrimary }]} keyboardType='email-address' />

                <Text style={[styles.label, { color: theme.textPrimary }]}>Phone Number</Text>
                <TextInput placeholder='Enter your number' placeholderTextColor={'gray'} value={dob} style={[styles.input, { color: theme.textPrimary }]} keyboardType='phone-pad' />

                <Text style={[styles.label, { color: theme.textPrimary }]}>Date of Birth</Text>
                <TextInput placeholder='Enter your date of birth' onChangeText={handleChange} placeholderTextColor={'gray'} style={[styles.input, { color: theme.textPrimary }]} />

                <Text style={[styles.label, { color: theme.textPrimary }]}>Address</Text>
                <TextInput placeholder='Enter your address' placeholderTextColor={'gray'} style={[styles.input, { color: theme.textPrimary }]} multiline />

                <Text style={[styles.label, { color: theme.textPrimary }]}>Gender</Text>
                <View style={styles.radioContainer}>
                    {['male', 'female', 'other'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.radioOption]}
                            onPress={() => setGender(option)}
                        >
                            <View
                                style={[
                                    styles.radioCircle,
                                    gender === option && { borderColor: COLORS.primary, borderWidth: wp('1.5%') }
                                ]}
                            >
                            </View>
                            <Text style={{ color: theme.textPrimary }}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("2%"),
        justifyContent: "space-between",
    },
    headText: {
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#333",
        fontFamily: "Poppins-Bold",
    },
    saveText: {
        fontSize: wp("4%"),
        fontWeight: "700",
        color: "#333",
        fontFamily: "Poppins-Bold",
    },
    photoContainer: {
        width: wp('30%'),
        height: wp('30%'),
        position: 'relative',
        alignSelf: 'center',
        marginVertical: hp('3%')
    },
    profilePic: {
        width: '100%',
        height: '100%',
        borderRadius: wp('50%'),
    },
    cameraContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        elevation: 5, // shadow (Android)
        shadowColor: '#000', // shadow (iOS)
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    inputContainer: {
        padding: wp("5%"),
        backgroundColor: "#fff",
    },
    label: {
        fontSize: wp("4%"),
        fontWeight: "500",
        marginBottom: hp("0.5%"),
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1%"),
        fontSize: wp("3.5%"),
        marginBottom: hp("2%"),
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp("5%"),
        marginTop: hp("1%"),
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: wp("5%"),
        height: wp("5%"),
        borderRadius: wp("2.5%"),
        borderWidth: wp('1.5%'),
        borderColor: "#3E4347",
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp("2%"),
    },
    radioDot: {
        width: wp("2.5%"),
        height: wp("2.5%"),
        borderRadius: wp("1.25%"),
        backgroundColor: "red", // selected dot color
    },
    radioLabel: {
        fontSize: wp("4%"),
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: wp('90%'),
        height: hp('70%'),
        borderRadius: 10,
    },
})

export default MyProfile;