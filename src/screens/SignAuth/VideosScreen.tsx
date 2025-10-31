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

const YoutubeComponent = () => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  const fetchVideos = async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE';

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

  const VideoCard = ({ videoId }) => {
    const cardWidth = wp('44%');
    const cardHeight = hp('40%');

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: black;
              height: 100%;
              width: 100%;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&fs=1"
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
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
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
        renderItem={({ item }) => <VideoCard videoId={item.videoUrl} />}
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
