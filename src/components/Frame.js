import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const services = [
  {
    id: '1',
    title: 'Hair Cut',
    image: require('../assets/images/haircut.jpg'),
  },
  {
    id: '2',
    title: 'Hair Color',
    image: require('../assets/images/haircolor.jpg'),
  },
  { id: '3', title: 'Facial', image: require('../assets/images/facial.jpg') },
  { id: '4', title: 'Shaving', image: require('../assets/images/beard.jpg') },
  { id: '5', title: 'Nail Art', image: require('../assets/images/nail.jpg') },
  {
    id: '6',
    title: 'Hair Cut',
    image: require('../assets/images/haircut.jpg'),
  },
  {
    id: '7',
    title: 'Hair Color',
    image: require('../assets/images/haircolor.jpg'),
  },
  { id: '8', title: 'Facial', image: require('../assets/images/facial.jpg') },
  { id: '9', title: 'Shaving', image: require('../assets/images/beard.jpg') },
  { id: '10', title: 'Nail Art', image: require('../assets/images/nail.jpg') },
];

const ServiceList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    color: '#000',
  },
});

export default ServiceList;
