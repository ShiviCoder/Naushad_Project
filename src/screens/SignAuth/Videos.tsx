import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';

const salonVideos = [
  {
    id: '1',
    title: '💇 Hair Styling Tips',
    thumbnail: require('../../assets/images/haircut1.png')
  },
  {
    id: '2',
    title: '💅 Nail Art Tutorial',
    thumbnail: require('../../assets/images/hairspa.webp'),
  },
  {
    id: '3',
    title: '💆 Skin Care Routine',
    thumbnail: require('../../assets/images/haircolor1.png'),
  },
  {
    id: '4',
    title: '💄 Bridal Makeup Look',
    thumbnail: require('../../assets/images/haircut1.png'),
  },
];

const TestVideos = () => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container,{backgroundColor : theme.background}]}>
        <Head title='Videos'/>
     
     <View style={{paddingHorizontal : 15, paddingBottom : 100}}>
         <Text style={[styles.heading,{color : theme.textPrimary}]}>✨ Salon Tutorial Videos</Text>
      <FlatList
        data={salonVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={ item.thumbnail }
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
     </View>
    </View>
  );
};

export default TestVideos;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  heading: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
  },
  thumbnail: { 
    width: '100%', 
    height: 180, 
    backgroundColor: 'gray' 
  },
  title: { 
    padding: 10, 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
