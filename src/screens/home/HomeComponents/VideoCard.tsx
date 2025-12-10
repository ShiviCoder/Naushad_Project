import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const extractVideoId = url => {
  if (!url) return null;

  const regex1 = /v=([^&]+)/;
  const match1 = url.match(regex1);
  if (match1) return match1[1];

  const regex2 = /youtu\.be\/([^?]+)/;
  const match2 = url.match(regex2);
  if (match2) return match2[1];

  if (url.length === 11) return url;

  return null;
};

const VideoCard = ({ videoId }) => {
  const cardWidth = wp('40%');
  const cardHeight = hp('25%');
  const finalVideoId = extractVideoId(videoId);

  if (!finalVideoId) {
    return (
      <View
        style={[
          styles.videoContainer,
          { width: cardWidth, height: cardHeight },
        ]}
      >
        <Text style={styles.errorText}>Invalid video URL</Text>
      </View>
    );
  }

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent;
            height:100%;
            width:100%;
          }
          .video-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 177.77%;
            height: 100%;
            transform: translate(-50%, -50%);
            border: 0;
          }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.youtube.com/embed/${finalVideoId}?controls=0&modestbranding=1&rel=0&fs=0&autoplay=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View
      style={[styles.videoContainer, { width: cardWidth, height: cardHeight }]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webView}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    overflow: 'hidden',
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
    backgroundColor: '#dadada',
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
    padding: wp('5%'),
    fontSize: wp('3.5%'),
  },
});

export default VideoCard;
