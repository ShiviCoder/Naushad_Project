import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';

const certificates = [
  {
    id: '1',
    title: '🎓 Hair Styling Certificate',
    image: require('../../assets/images/certificate2.png')
  },
  {
    id: '2',
    title: '💅 Nail Art Certificate',
    image: require('../../assets/images/certificate2.png')
  },
  {
    id: '3',
    title: '💆 Skin Care Training',
    image: require('../../assets/images/certificate2.png')
  },
  {
    id: '4',
    title: '💄 Makeup Masterclass',
    image: require('../../assets/images/certificate2.png')
  },
];

const Certificates = () => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container,{backgroundColor : theme.background}]}>
        <Head title="🏅 Certificates"/>
      
     <View style={{paddingHorizontal : 15, paddingBottom : 70}}>
         <FlatList
        data={certificates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={ item.image } style={styles.image} />
            <Text style={[styles.title]}>{item.title}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
     </View>
    </View>
  );
};

export default Certificates;

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
  },
  image: { width: '100%', height: 180, backgroundColor: 'lightgray' },
  title: { padding: 10, fontSize: 16, fontWeight: '600' },
});
