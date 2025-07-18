<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks and truncate tables
        $this->db->query('SET FOREIGN_KEY_CHECKS=0');
        $this->db->table('cart_items')->truncate();
        $this->db->table('product_variant_attributes')->truncate();
        $this->db->table('product_variants')->truncate();
        $this->db->table('products')->truncate();
        $this->db->table('attribute_values')->truncate();
        $this->db->table('attributes')->truncate();
        $this->db->query('SET FOREIGN_KEY_CHECKS=1');

        // Get store IDs
        $stores_result = $this->db->table('stores')->orderBy('id', 'ASC')->get()->getResultArray();
        $store_ids = array_column($stores_result, 'id');

        // Get category IDs
        // Fetch all categories and create a map of category names to their IDs and parent IDs
        $all_categories_result = $this->db->table('categories')->get()->getResultArray();
        $category_map = [];
        foreach ($all_categories_result as $cat) {
            $category_map[$cat['name']] = ['id' => $cat['id'], 'parent_id' => $cat['parent_id']];
        }

        // Create a map of parent IDs to parent names for easier lookup
        $parent_category_map = [];
        foreach ($all_categories_result as $cat) {
            if ($cat['parent_id'] === null) {
                $parent_category_map[$cat['id']] = $cat['name'];
            }
        }

        // Seed Attributes and their values
        $attributes = [
            ['name' => 'Color'],
            ['name' => 'Size'],
        ];
        $this->db->table('attributes')->insertBatch($attributes);

        $color_attribute_id = $this->db->table('attributes')->where('name', 'Color')->get()->getRow()->id;
        $size_attribute_id = $this->db->table('attributes')->where('name', 'Size')->get()->getRow()->id;

        $attribute_values = [
            ['attribute_id' => $color_attribute_id, 'value' => 'Black'],
            ['attribute_id' => $color_attribute_id, 'value' => 'Blue'],
            ['attribute_id' => $color_attribute_id, 'value' => 'White'],
            ['attribute_id' => $size_attribute_id, 'value' => 'Small'],
            ['attribute_id' => $size_attribute_id, 'value' => 'Medium'],
            ['attribute_id' => $size_attribute_id, 'value' => 'Large'],
        ];
        $this->db->table('attribute_values')->insertBatch($attribute_values);

        // Fetch all attribute values for easy lookup
        $attr_values_result = $this->db->table('attribute_values')->get()->getResultArray();
        $attr_values_map = [];
        $all_attributes_result = $this->db->table('attributes')->get()->getResultArray();
        $attributes_map = array_column($all_attributes_result, 'name', 'id');
        foreach ($attr_values_result as $val) {
            $attr_name = $attributes_map[$val['attribute_id']];
            $attr_values_map[$attr_name][$val['value']] = $val['id'];
        }

        $products = [
            // Tech World (Store 1)
            [
                'store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'Wireless Mouse', 'description' => 'Ergonomic wireless mouse with multiple color options.', 'price' => null, 'image' => 'mouse.jpg', 'stock' => null, 'featured' => 1, 'sales_count' => 250, 'is_approved' => 1, 'product_type' => 'variable',
                'variants' => [
                    ['price' => 25.00, 'stock' => 50, 'sku' => 'WM-BLK', 'image_url' => 'mouse_black.jpg', 'attributes' => ['Color' => 'Black', 'Size' => 'Medium']],
                    ['price' => 25.00, 'stock' => 35, 'sku' => 'WM-BLU', 'image_url' => 'mouse_blue.jpg', 'attributes' => ['Color' => 'Blue', 'Size' => 'Medium']],
                    ['price' => 22.00, 'stock' => 75, 'sku' => 'WM-WHT', 'image_url' => 'mouse_white.jpg', 'attributes' => ['Color' => 'White', 'Size' => 'Medium']],
                ]
            ],
            ['store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'Mechanical Keyboard', 'description' => 'RGB mechanical keyboard.', 'price' => 69.99, 'image' => 'keyboard.jpg', 'stock' => 120, 'featured' => 0, 'sales_count' => 120, 'is_approved' => 1, 'product_type' => 'single'],
            ['store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'USB-C Hub', 'description' => '7-in-1 USB-C hub.', 'price' => 39.99, 'image' => 'usbc_hub.jpg', 'stock' => 200, 'featured' => 0, 'sales_count' => 80, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Headphones', 'name' => 'Noise Cancelling Headphones', 'description' => 'Over-ear headphones.', 'price' => 199.99, 'image' => 'headphones.jpg', 'stock' => 80, 'featured' => 1, 'sales_count' => 300, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Cameras & Photography', 'name' => '4K Webcam', 'description' => 'Webcam with ring light.', 'price' => 89.99, 'image' => 'webcam.jpg', 'stock' => 100, 'featured' => 0, 'sales_count' => 90, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'Portable SSD', 'description' => '1TB portable SSD.', 'price' => 129.99, 'image' => 'ssd.jpg', 'stock' => 70, 'featured' => 1, 'sales_count' => 180, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'Gaming Monitor', 'description' => '27-inch 144Hz gaming monitor.', 'price' => 299.99, 'image' => 'monitor.jpg', 'stock' => 50, 'featured' => 0, 'sales_count' => 40, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Computers & Accessories', 'name' => 'Laptop Stand', 'description' => 'Adjustable aluminum laptop stand.', 'price' => 29.99, 'image' => 'laptop_stand.jpg', 'stock' => 180, 'featured' => 0, 'sales_count' => 60, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Fiction', 'name' => 'The Great Gatsby', 'description' => 'A classic novel.', 'price' => 12.99, 'image' => 'thegreatgatsby.jpg', 'stock' => 250, 'featured' => 0, 'sales_count' => 150, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[0], 'category_name' => 'Beverages', 'name' => 'Energy Drink', 'description' => 'A can of energy drink.', 'price' => 2.99, 'image' => 'energy_drink.jpg', 'stock' => 500, 'featured' => 0, 'sales_count' => 400, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => 2],
    
            // Fashion Hub (Store 2)
            ['store_id' => $store_ids[1], 'category_name' => 'Females Wear', 'name' => 'Summer Dress', 'description' => 'Light and airy summer dress.', 'price' => 39.99, 'image' => 'summer_dress.jpg', 'stock' => 120, 'featured' => 1, 'sales_count' => 210, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Mens Wear', 'name' => 'Leather Jacket', 'description' => 'Classic leather jacket.', 'price' => 149.99, 'image' => 'leather_jacket.jpg', 'stock' => 60, 'featured' => 0, 'sales_count' => 90, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Mens Wear', 'name' => 'Skinny Jeans', 'description' => 'Comfortable skinny jeans.', 'price' => 59.99, 'image' => 'jeans.jpg', 'stock' => 200, 'featured' => 0, 'sales_count' => 180, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Mens Wear', 'name' => 'T-Shirt', 'description' => 'Plain white t-shirt.', 'price' => 19.99, 'image' => 'tshirt.jpg', 'stock' => 300, 'featured' => 0, 'sales_count' => 250, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Shoes', 'name' => 'Sneakers', 'description' => 'Stylish sneakers.', 'price' => 79.99, 'image' => 'sneakers.jpg', 'stock' => 150, 'featured' => 1, 'sales_count' => 320, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Glasses', 'name' => 'Sunglasses', 'description' => 'UV protection sunglasses.', 'price' => 24.99, 'image' => 'sunglasses.jpg', 'stock' => 180, 'featured' => 0, 'sales_count' => 110, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Bags', 'name' => 'Watch', 'description' => 'Minimalist wrist watch.', 'price' => 99.99, 'image' => 'watch.jpg', 'stock' => 90, 'featured' => 0, 'sales_count' => 70, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Mens Wear', 'name' => 'Beanie', 'description' => 'Warm winter beanie.', 'price' => 14.99, 'image' => 'beanie.jpg', 'stock' => 220, 'featured' => 0, 'sales_count' => 130, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Bags', 'name' => 'Umbrella', 'description' => 'Windproof umbrella.', 'price' => 29.99, 'image' => 'umbrella.jpg', 'stock' => 130, 'featured' => 0, 'sales_count' => 50, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[1], 'category_name' => 'Team Sports', 'name' => 'Basketball', 'description' => 'Official size basketball.', 'price' => 24.99, 'image' => 'basketball.jpg', 'stock' => 100, 'featured' => 1, 'sales_count' => 190, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
    
            // Home Essentials (Store 3)
            ['store_id' => $store_ids[2], 'category_name' => 'Bed & Bath', 'name' => 'Pillow', 'description' => 'Memory foam pillow.', 'price' => 19.99, 'image' => 'pillow.jpg', 'stock' => 200, 'featured' => 1, 'sales_count' => 280, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Home Decor', 'name' => 'Scented Candles', 'description' => 'Set of 3 scented candles.', 'price' => 24.99, 'image' => 'candles.jpg', 'stock' => 250, 'featured' => 0, 'sales_count' => 180, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Kitchen & Dining', 'name' => 'Coffee Maker', 'description' => '12-cup coffee maker.', 'price' => 49.99, 'image' => 'coffee_maker.jpg', 'stock' => 80, 'featured' => 0, 'sales_count' => 120, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Bed & Bath', 'name' => 'Towel Set', 'description' => '6-piece towel set.', 'price' => 34.99, 'image' => 'towel_set.jpg', 'stock' => 150, 'featured' => 0, 'sales_count' => 90, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Kitchen & Dining', 'name' => 'Cookware Set', 'description' => '10-piece non-stick cookware set.', 'price' => 89.99, 'image' => 'cookware.jpg', 'stock' => 60, 'featured' => 1, 'sales_count' => 220, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Home Decor', 'name' => 'Picture Frame', 'description' => '8x10 picture frame.', 'price' => 9.99, 'image' => 'picture_frame.jpg', 'stock' => 300, 'featured' => 0, 'sales_count' => 50, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Home Decor', 'name' => 'Wall Clock', 'description' => 'Modern wall clock.', 'price' => 19.99, 'image' => 'wall_clock.jpg', 'stock' => 120, 'featured' => 0, 'sales_count' => 70, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Home Decor', 'name' => 'Desk Lamp', 'description' => 'LED desk lamp.', 'price' => 29.99, 'image' => 'desk_lamp.jpg', 'stock' => 140, 'featured' => 0, 'sales_count' => 100, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Home Decor', 'name' => 'Throw Blanket', 'description' => 'Cozy throw blanket.', 'price' => 24.99, 'image' => 'blanket.jpg', 'stock' => 180, 'featured' => 1, 'sales_count' => 260, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
            ['store_id' => $store_ids[2], 'category_name' => 'Snacks', 'name' => 'Instant Noodles', 'description' => 'Pack of 5 instant noodles.', 'price' => 4.99, 'image' => 'noodles.jpg', 'stock' => 500, 'featured' => 0, 'sales_count' => 450, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => 3],
    
            // Pizza Palace (Store 4)
            ['store_id' => $store_ids[3], 'category_name' => 'Snacks', 'name' => 'Margherita Pizza', 'description' => 'Classic pizza with tomatoes, mozzarella, and basil.', 'price' => 15.99, 'image' => 'margherita.jpg', 'stock' => 50, 'featured' => 1, 'sales_count' => 200, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, basil, olive oil', 'prep_time' => 15],
            ['store_id' => $store_ids[3], 'category_name' => 'Snacks', 'name' => 'Pepperoni Pizza', 'description' => 'Pizza with pepperoni and cheese.', 'price' => 17.99, 'image' => 'pepperoni.jpg', 'stock' => 40, 'featured' => 0, 'sales_count' => 150, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, pepperoni', 'prep_time' => 18],
            ['store_id' => $store_ids[3], 'category_name' => 'Snacks', 'name' => 'Garlic Bread', 'description' => 'Warm garlic bread with herbs.', 'price' => 5.99, 'image' => 'garlic_bread.jpg', 'stock' => 100, 'featured' => 0, 'sales_count' => 300, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Baguette, garlic, butter, parsley', 'prep_time' => 10],
        ];

        foreach ($products as $p) {
            $category_name = $p['category_name'];
            if (!isset($category_map[$category_name])) continue; // Skip if category name is not found

            $category_info = $category_map[$category_name];
            $category_id = $category_info['id'];

            // Prepare base product data
            $data = [
                'store_id' => $p['store_id'],
                'category_id' => $category_id,
                'name' => $p['name'],
                'description' => $p['description'],
                'product_type' => $p['product_type'] ?? 'single',
                'price' => $p['price'],
                'image' => $p['image'],
                'stock' => $p['stock'],
                'is_active' => 1,
                'is_approved' => $p['is_approved'],
                'created_at' => date('Y-m-d H:i:s')
            ];

            $this->db->table('products')->insert($data);
            $product_id = $this->db->insertID();

            if ($data['product_type'] === 'variable' && isset($p['variants'])) {
                foreach ($p['variants'] as $variant_data) {
                    $variant = [
                        'product_id' => $product_id,
                        'price' => $variant_data['price'],
                        'stock' => $variant_data['stock'],
                        'sku' => $variant_data['sku'],
                        'image_url' => $variant_data['image_url'] ?? null,
                        'attributes' => json_encode($variant_data['attributes']),
                        'created_at' => date('Y-m-d H:i:s')
                    ];
                    $this->db->table('product_variants')->insert($variant);
                    $variant_id = $this->db->insertID();

                    foreach ($variant_data['attributes'] as $attr_name => $attr_value) {
                        if (isset($attr_values_map[$attr_name][$attr_value])) {
                            $attribute_value_id = $attr_values_map[$attr_name][$attr_value];
                            $this->db->table('product_variant_attributes')->insert([
                                'variant_id' => $variant_id,
                                'attribute_value_id' => $attribute_value_id
                            ]);
                        }
                    }
                }
            }


        }
    }
}
