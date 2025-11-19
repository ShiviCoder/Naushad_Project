import { StyleSheet, View, FlatList, useWindowDimensions, RefreshControl } from 'react-native';
import React from 'react';
import ProductCard from './ProductCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: any;
  description: string;
  offer: string;
  rating: number;
  reviews: string[];
};

type FlatListCompProps = {
  products: Product[];
  likedProducts: string[];
  onToggleLike: (id: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
};

const FlatListComp: React.FC<FlatListCompProps> = ({
  products,
  likedProducts,
  onToggleLike,
  refreshing,
  onRefresh,
}) => {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();
  const isPortrait = height >= width;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={isPortrait ? 2 : 4}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0f8a43']}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            liked={likedProducts.includes(item._id)}
            onToggleLike={() => onToggleLike(item._id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default FlatListComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('2%'),
  },
});
