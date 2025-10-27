import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Certificates = () => {
  const { theme } = useTheme();
  const [certificates, setCertificates] = useState<any[]>([]);
  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }
  const fetchCertificates = async () => {
    try {
      //const token = getToken();
      const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg';
      const response = await fetch('https://naushad.onrender.com/api/certificates', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log('Certificate  Response:', json);

      // setCertificates to the data array from response
      setCertificates(json.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]); // fallback
    }
  }

  useEffect(() => {
    fetchCertificates();
  }, []);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="🏅 Certificates" />
      <View style={{ paddingHorizontal: 15, paddingBottom: 70 }}>
        <FlatList
          data={certificates}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text style={[styles.title]}>{item.title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
export default Certificates;

const styles = StyleSheet.create({
  container: { 
    flex: 1 
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
  image: { width: '100%', height: 180, backgroundColor: 'lightgray' },
  title: { padding: 10, fontSize: 16, fontWeight: '600' },
});
