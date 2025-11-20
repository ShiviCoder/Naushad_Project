// File: YoutubeComponent.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import COLORS from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YoutubeComponent = () => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }


  const fetchVideos = async () => {
    try {
      // const token =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';
      const token = await getToken();

      const res = await fetch('https://naushad.onrender.com/api/youtube', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setVideos(data);
      console.log('✅ Youtube Data:', data);
      console.log("Youtube token : ", token)
    } catch (err) {
      console.log('❌ Error loading:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchVideos();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const extractVideoId = (url) => {
    const regex = /v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const VideoCard = ({ videoId }) => {
    const cardWidth = wp('44%');
    const cardHeight = hp('40%');

    const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin:0; background:black; }
      iframe { width:100%; height:100%; border:0; }
    </style>
  </head>
  <body>
    <iframe
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://localhost"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen
    ></iframe>
  </body>
</html>`;
    return (
      <Animated.View style={{ transform: [{ translateY }] }}>
        <View
          style={{
            width: cardWidth,
            height: cardHeight,
            overflow: 'hidden',
            borderRadius: wp('2%'),
            margin: wp('2%'),
            backgroundColor: '#f8f5f5ff',
          }}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            style={{ flex: 1, backgroundColor: '#000' }}
          />
        </View>
      </Animated.View>
    );
  };

 if (loading) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Head title="Videos" />
      <FlatList
        data={videos.data || []}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: wp('3%'),
          paddingBottom: hp('3%'),
          paddingTop: hp('2%'),
          backgroundColor: theme.background, // ✅ Full background
        }}
        renderItem={({ item }) => (
          <VideoCard videoId={extractVideoId(item.videoUrl)} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

export default YoutubeComponent;
