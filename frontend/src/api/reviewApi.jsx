// Mock data for reviews, now with productId
export const mockReviews = [
  {
    id: 1,
    productId: '1', // Instant Ramen Cup
    customerName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=john',
    rating: 5,
    comment: 'Absolutely love this ramen! Quick, easy, and surprisingly flavorful. A pantry staple for sure.',
    date: '2025-06-15',
  },
  {
    id: 2,
    productId: '3', // Potato Chips
    customerName: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    rating: 4,
    comment: 'Very crunchy and well-seasoned. Could be a little less salty, but overall a great snack.',
    date: '2025-06-14',
  },
  {
    id: 3,
    productId: '7', // Coffee
    customerName: 'Sam Wilson',
    avatar: 'https://i.pravatar.cc/150?u=sam',
    rating: 5,
    comment: 'Best coffee I’ve had in a while. Smooth, rich, and no bitter aftertaste. Perfect start to my day!',
    date: '2025-06-12',
  },
  {
    id: 4,
    productId: '5', // Chocolate Bar
    customerName: 'Emily Brown',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    rating: 5,
    comment: 'So creamy and delicious. The perfect afternoon treat. Melts in your mouth!',
    date: '2025-06-10',
  },
  {
    id: 5,
    productId: '1', // Instant Ramen Cup
    customerName: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    rating: 4,
    comment: 'Good for a quick meal, but the vegetable packet is a bit sparse. I usually add my own extras.',
    date: '2025-06-09',
  },
];

// API function to fetch reviews by product ID
export const fetchReviewsByProductId = async (productId) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const reviews = mockReviews.filter(review => review.productId === productId);
  return reviews;
};
