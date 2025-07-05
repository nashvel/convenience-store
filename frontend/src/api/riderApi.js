const mockOrders = [
  {
    id: 'ORD12345',
    storeName: 'Jollibee',
    storeAddress: '123 Main St, Manila',
    customerName: 'John Doe',
    deliveryAddress: '456 Oak Ave, Quezon City',
    status: 'Pending',
    items: [
      { name: 'Chickenjoy Bucket', quantity: 1 },
      { name: 'Jolly Spaghetti', quantity: 2 },
    ],
    total: 750.00,
  },
  {
    id: 'ORD12346',
    storeName: 'McDonald\'s',
    storeAddress: '789 Pine St, Makati',
    customerName: 'Jane Smith',
    deliveryAddress: '101 Maple Dr, Pasig',
    status: 'Pending',
    items: [
      { name: 'Big Mac', quantity: 1 },
      { name: 'McFries', quantity: 1 },
      { name: 'Coke McFloat', quantity: 1 },
    ],
    total: 350.00,
  },
];

export const getAvailableOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 500);
  });
};
