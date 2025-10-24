import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const BookAppoinment = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/image1.jpg')}
        style={styles.image}
      />
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          backgroundColor: '#aaaaaaa8',
          width: 357,
          height: 202,
<<<<<<< HEAD
          padding: 40,
          gap: 50,
=======
          padding:40,
          gap:50,
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        }}
      >
        <Text style={styles.text}>
          Book your appointmenday and take your look to the next level
        </Text>

        <TouchableOpacity style={styles.Btn}>
          <Text>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookAppoinment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'relative',
    width: 357,
    height: 202,
  },
  Btn: {
    backgroundColor: '#f6b845ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 39,
    width: 154,
  },
<<<<<<< HEAD
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 5,
  },
=======
  text:{
    fontSize:16,
    fontWeight:'bold',
    letterSpacing:5,
  }
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
});
