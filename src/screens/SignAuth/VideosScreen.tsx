// File: YoutubeComponent.js
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';


const YoutubeComponent = () => {

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { theme } = useTheme();

    const fetchVideos = async () => {
        try {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg";

            const res = await fetch("https://naushad.onrender.com/api/youtube", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setVideos(data);
            console.log("Youtube Token : ", token);
            console.log("Youtube Data:", data);
        } catch (err) {
            console.log("Error loading:", err);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [])


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
              /* ✅ Force black background */
              height: 100%;
              width: 100%;
            }
            iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&mute=1"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowfullscreen
      ></iframe>
        </body>
      </html>`;

        return (
            <View
                style={{
                    width: cardWidth,
                    height: cardHeight,
                    overflow: 'hidden',
                    borderRadius: wp('2%'),
                    margin: wp('2%'),
                    backgroundColor: '#f8f5f5ff', 
                }}
            >
                <WebView
                    originWhitelist={['*']}
                    source={{ html }}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                    style={{
                        flex: 1,
                        backgroundColor: '#f7f3f3ff', 
                    }}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>  
            <Head title="Videos" />
            <FlatList
                data={videos.data || []}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                    paddingHorizontal: wp('3%'),
                    paddingBottom: hp('3%'),
                    paddingTop: hp('2%'),
                }}
                renderItem={({ item }) => <VideoCard videoId={item.videoUrl} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default YoutubeComponent;
