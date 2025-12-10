import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';
import VideoCard from '../HomeComponents/VideoCard'; // This will import from the new file

const VideosSection = ({ videos, handleSectionNavigation }) => {
  const videoData = videos?.data || [];

  const renderVideoItem = ({ item }) => <VideoCard videoId={item.videoId} />;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Videos</Text>
        <TouchableOpacity
          onPress={() => handleSectionNavigation('videos')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={videoData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderVideoItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available</Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: wp('3.8%'),
  },
  listContainer: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('2%'),
  },
  emptyContainer: {
    width: wp('90%'),
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: wp('3.8%'),
  },
});

export default VideosSection;
