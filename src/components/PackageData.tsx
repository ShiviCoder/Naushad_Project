<<<<<<< HEAD
export type PackageData = {
  id: string;
  title: string;
  price: string;
  services: string[];
  about: string;
  image: any;
  review: number;
  rating: number;
  discount: string;
  serviceList: string[];
};
=======
export type PackageData  = {
    id : string;
    title :  string;
    price: string;
    services: string[];
    about : string;
    image: any;
    review: number;
    rating: number;
    discount: string;
    serviceList : string[];
}
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

export const packageData: PackageData[] = [
  {
    id: '1',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Refresh your skin',
    image: require('../assets/pkgImage1.png'),
    review: 23,
    rating: 5,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '2',
    title: 'Deluxe Facial Package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage2.png'),
    review: 23,
    rating: 3,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '3',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage3.png'),
    review: 23,
    rating: 1,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '4',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage1.png'),
    review: 23,
    rating: 4.5,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '5',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage1.png'),
    review: 23,
    rating: 2,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '6',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage1.png'),
    review: 23,
    rating: 3,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
  {
    id: '7',
    title: 'Basic hair cut package',
    price: '₹490',
    services: ['Haircut , Shampoo '],
    about: 'Perfect for daily grooming',
    image: require('../assets/pkgImage1.png'),
    review: 23,
    rating: 1,
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
  },
];

export default packageData;
