export const mockProducts = [
    {
      id: 1, name: 'Vintage Leather Jacket', product_type: 'variable', price: null, stock: null, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16e2a9?w=500', 
      variants: [
        { id: 'vj1', size: 'Medium', color: 'Black', price: '120.00', stock: '10', sku: 'VLJ-MD-BK', imageUrl: '' },
        { id: 'vj2', size: 'Large', color: 'Black', price: '125.00', stock: '5', sku: 'VLJ-LG-BK', imageUrl: '' },
        { id: 'vj3', size: 'Medium', color: 'Brown', price: '120.00', stock: '8', sku: 'VLJ-MD-BR', imageUrl: '' },
      ]
    },
    {
      id: 7,
      name: 'Cotton T-Shirt',
      product_type: 'variable',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
      price: null, // Base price is null for variable products
      stock: null, // Base stock is null for variable products
      variants: [
        { id: 'v1', size: 'Small', color: 'Red', price: '22.99', stock: '50', sku: 'TS-SM-RD', imageUrl: 'https://images.unsplash.com/photo-1622470953794-3150722c2124?w=500' },
        { id: 'v2', size: 'Medium', color: 'Red', price: '22.99', stock: '45', sku: 'TS-MD-RD', imageUrl: 'https://images.unsplash.com/photo-1622470953794-3150722c2124?w=500' },
        { id: 'v3', size: 'Small', color: 'Blue', price: '22.99', stock: '30', sku: 'TS-SM-BL', imageUrl: 'https://images.unsplash.com/photo-1622470837236-a89546a782a0?w=500' },
        { id: 'v4', size: 'Medium', color: 'Blue', price: '22.99', stock: '25', sku: 'TS-MD-BL', imageUrl: 'https://images.unsplash.com/photo-1622470837236-a89546a782a0?w=500' },
      ]
    },
    { id: 2, name: 'Classic Denim Jeans', product_type: 'single', price: 75.50, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1602293589914-9e296ba2a7c4?w=500', variants: [] },
    { id: 8, name: 'Elegant Wristwatch', product_type: 'single', price: 250.00, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', variants: [] },
  ];
