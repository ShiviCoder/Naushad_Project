import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal} from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';


const MyProfile = () => {
    const [gender, setGender] = useState('male')
    const [filePath, setFilePath] = useState({});
    const [modal , setModal] = useState(false);
        const navigation = useNavigation<any>()
    
    const chooseFile = () => {
        let options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                // Image mil gayi hai
                console.log('Selected Image: ', response.assets[0].uri);
                setFilePath(response.assets[0]);  // yeh state me image store karega
            }
        });
    };
    return (
        <View style={styles.container}>
            <View style={styles.headContainer}>
                <TouchableOpacity onPress={()=>
                    {
                        navigation.goBack()
                    }
                }>
                    <Icon name='chevron-back' size={wp('7%')} color="#0e0d0dff" />
                </TouchableOpacity>
                <Text style={styles.headText} >My Profile</Text>
                <TouchableOpacity>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.photoContainer}>
               <TouchableOpacity onPress={()=>setModal(true)}>
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


            <View style={styles.inputContainer}>

                <Text style={styles.label}>Full Name</Text>
                <TextInput placeholder='' style={styles.input} />

                <Text style={styles.label}>Email</Text>
                <TextInput placeholder='' style={styles.input} keyboardType='email-address' />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput placeholder='' style={styles.input} keyboardType='phone-pad' />

                <Text style={styles.label}>Date of Birth</Text>
                <TextInput placeholder='' style={styles.input} />

                <Text style={styles.label}>Address</Text>
                <TextInput placeholder='' style={styles.input} multiline />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioContainer}>
                    {['male', 'female', 'other'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.radioOption}
                            onPress={() => setGender(option)}
                        >
                            <View
                                style={[
                                    styles.radioCircle,
                                    gender === option && { borderColor: "#F62121", borderWidth: wp('1.5%') }
                                ]}
                            >
                            </View>
                            <Text>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("4%"),
        paddingTop: hp("2%"),
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