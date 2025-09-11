import { ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  description: string;
  rating: number;
  reviews: number;
  image: ImageSourcePropType;
  featureIcon: ImageSourcePropType;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Beard oil - 100 ml',
    price: 299,
    oldPrice: 399,
    discount: '(25%OFF)',
    description: '100% natural oil',
    rating: 4.1,
    reviews: 5802,
    image: require('../../assets/OurProduct/productImage.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '2',
    name: 'Face Wash - 150 ml',
    price: 199,
    oldPrice: 249,
    discount: '(20%OFF)',
    description: 'Cleansing & refreshing',
    rating: 4.5,
    reviews: 4200,
    image: require('../../assets/OurProduct/productImage1.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '3',
    name: 'Hair Serum - 200 ml',
    price: 349,
    oldPrice: 449,
    discount: '(22%OFF)',
    description: 'Smooth & shiny hair',
    rating: 4.3,
    reviews: 3100,
    image: require('../../assets/OurProduct/productImage2.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '4',
    name: 'Charcoal Soap - 125 gm',
    price: 99,
    oldPrice: 149,
    discount: '(34%OFF)',
    description: 'Detox & deep clean',
    rating: 4.0,
    reviews: 2750,
    image: require('../../assets/OurProduct/productImage3.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '5',
    name: 'Shampoo - 250 ml',
    price: 249,
    oldPrice: 299,
    discount: '(17%OFF)',
    description: 'Anti-dandruff formula',
    rating: 4.2,
    reviews: 3300,
    image: require('../../assets/OurProduct/productImage4.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '6',
    name: 'Aloe Vera Gel - 200 ml',
    price: 150,
    oldPrice: 199,
    discount: '(25%OFF)',
    description: 'Soothing & moisturizing',
    rating: 4.4,
    reviews: 1800,
    image: require('../../assets/OurProduct/productImage5.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
  {
    id: '7',
    name: 'Body Lotion - 300 ml',
    price: 299,
    oldPrice: 379,
    discount: '(21%OFF)',
    description: 'Hydrating & nourishing',
    rating: 4.3,
    reviews: 2400,
    image: require('../../assets/OurProduct/productImage6.png'),
    featureIcon: require('../../assets/OurProduct/Leaf1.png'),
  },
];
