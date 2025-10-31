import { StyleSheet, View, FlatList, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Product, products } from './ProductsArray';
import ProductCard from './ProductCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
type FlatListCompProps = {
  products: Product[];
  likedProducts: string[];
  onToggleLike: (id: string) => void;
};
const FlatListComp: React.FC<FlatListCompProps> = ({ likedProducts, onToggleLike }) => {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();
  const isPortrait = height >= width;
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg";

      const res = await fetch("https://naushad.onrender.com/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await res.json();
      setProducts(data.data);
      console.log("Product data : ", data);
    } catch (error) {
      console.log("Product error : ", error)
    }
  }
  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={isPortrait ? 2 : 4}
        columnWrapperStyle={{
          justifyContent: 'flex-start'
        }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            liked={likedProducts.includes(item.id)}
            onToggleLike={() => onToggleLike(item.id)}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default FlatListComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('2%')
  },
  listContainer: {
    paddingBottom: hp('4%'),
    paddingVertical: wp('2%'),
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: hp('1%')
  }
});
