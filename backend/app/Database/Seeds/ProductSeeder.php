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
            ['store_id' => $store_ids[0], 'category_name' => 'Beverages', 'name' => 'Energy Drink', 'description' => 'A can of energy drink.', 'price' => 2.99, 'image' => 'energy_drink.jpg', 'stock' => 500, 'featured' => 0, 'sales_count' => 400, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
    
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
            ['store_id' => $store_ids[2], 'category_name' => 'Snacks', 'name' => 'Instant Noodles', 'description' => 'Pack of 5 instant noodles.', 'price' => 4.99, 'image' => 'noodles.jpg', 'stock' => 500, 'featured' => 0, 'sales_count' => 450, 'is_approved' => 1, 'cuisine' => null, 'ingredients' => null, 'prep_time' => null],
    
            // Pizza Palace (Store 4)
            ['store_id' => $store_ids[3], 'category_name' => 'Margherita', 'name' => 'Margherita Pizza', 'description' => 'Classic pizza with tomatoes, mozzarella, and basil.', 'price' => 15.99, 'image' => 'margherita.jpg', 'stock' => 50, 'featured' => 1, 'sales_count' => 200, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, basil, olive oil', 'prep_time' => 15],
            ['store_id' => $store_ids[3], 'category_name' => 'Pepperoni', 'name' => 'Pepperoni Pizza', 'description' => 'Pizza with pepperoni and cheese.', 'price' => 17.99, 'image' => 'pepperoni.jpg', 'stock' => 40, 'featured' => 0, 'sales_count' => 150, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, pepperoni', 'prep_time' => 18],
            ['store_id' => $store_ids[3], 'category_name' => 'Supreme', 'name' => 'Supreme Pizza', 'description' => 'Pizza loaded with pepperoni, sausage, peppers, and mushrooms.', 'price' => 19.99, 'image' => 'supreme.jpg', 'stock' => 30, 'featured' => 1, 'sales_count' => 120, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, pepperoni, sausage, peppers, mushrooms', 'prep_time' => 20],
            ['store_id' => $store_ids[3], 'category_name' => 'Vegetarian', 'name' => 'Veggie Pizza', 'description' => 'Fresh vegetables on a crispy crust.', 'price' => 16.99, 'image' => 'veggie.jpg', 'stock' => 35, 'featured' => 0, 'sales_count' => 90, 'is_approved' => 1, 'cuisine' => 'Italian', 'ingredients' => 'Dough, tomatoes, mozzarella, bell peppers, mushrooms, onions, olives', 'prep_time' => 18],

            // Burger Junction (Store 5)
            ['store_id' => $store_ids[4], 'category_name' => 'Beef Burgers', 'name' => 'Classic Beef Burger', 'description' => 'Juicy beef patty with lettuce, tomato, and cheese.', 'price' => 12.99, 'image' => 'beef_burger.jpg', 'stock' => 60, 'featured' => 1, 'sales_count' => 180, 'is_approved' => 1, 'cuisine' => 'American', 'ingredients' => 'Beef patty, bun, lettuce, tomato, cheese, onion', 'prep_time' => 12],
            ['store_id' => $store_ids[4], 'category_name' => 'Chicken Burgers', 'name' => 'Crispy Chicken Burger', 'description' => 'Crispy fried chicken with mayo and pickles.', 'price' => 11.99, 'image' => 'chicken_burger.jpg', 'stock' => 45, 'featured' => 0, 'sales_count' => 160, 'is_approved' => 1, 'cuisine' => 'American', 'ingredients' => 'Chicken breast, bun, mayo, pickles, lettuce', 'prep_time' => 10],
            ['store_id' => $store_ids[4], 'category_name' => 'Veggie Burgers', 'name' => 'Plant-Based Burger', 'description' => 'Delicious plant-based patty with fresh toppings.', 'price' => 13.99, 'image' => 'veggie_burger.jpg', 'stock' => 40, 'featured' => 1, 'sales_count' => 85, 'is_approved' => 1, 'cuisine' => 'Vegetarian', 'ingredients' => 'Plant patty, bun, lettuce, tomato, avocado, sprouts', 'prep_time' => 8],

            // Asian Fusion (Store 6)
            ['store_id' => $store_ids[5], 'category_name' => 'Chinese', 'name' => 'Kung Pao Chicken', 'description' => 'Spicy stir-fried chicken with peanuts and vegetables.', 'price' => 14.99, 'image' => 'kung_pao.jpg', 'stock' => 50, 'featured' => 1, 'sales_count' => 140, 'is_approved' => 1, 'cuisine' => 'Chinese', 'ingredients' => 'Chicken, peanuts, vegetables, chili, soy sauce', 'prep_time' => 15],
            ['store_id' => $store_ids[5], 'category_name' => 'Japanese', 'name' => 'Chicken Teriyaki Bowl', 'description' => 'Grilled chicken with teriyaki sauce over rice.', 'price' => 13.99, 'image' => 'teriyaki.jpg', 'stock' => 55, 'featured' => 0, 'sales_count' => 125, 'is_approved' => 1, 'cuisine' => 'Japanese', 'ingredients' => 'Chicken, rice, teriyaki sauce, vegetables', 'prep_time' => 12],
            ['store_id' => $store_ids[5], 'category_name' => 'Thai', 'name' => 'Pad Thai', 'description' => 'Traditional Thai stir-fried noodles with shrimp.', 'price' => 15.99, 'image' => 'pad_thai.jpg', 'stock' => 40, 'featured' => 1, 'sales_count' => 110, 'is_approved' => 1, 'cuisine' => 'Thai', 'ingredients' => 'Rice noodles, shrimp, bean sprouts, eggs, tamarind', 'prep_time' => 18],

            // Healthy Bites (Store 7)
            ['store_id' => $store_ids[6], 'category_name' => 'Salads', 'name' => 'Caesar Salad', 'description' => 'Fresh romaine lettuce with caesar dressing and croutons.', 'price' => 9.99, 'image' => 'caesar_salad.jpg', 'stock' => 70, 'featured' => 1, 'sales_count' => 95, 'is_approved' => 1, 'cuisine' => 'Healthy', 'ingredients' => 'Romaine lettuce, caesar dressing, croutons, parmesan', 'prep_time' => 5],
            ['store_id' => $store_ids[6], 'category_name' => 'Smoothies', 'name' => 'Green Power Smoothie', 'description' => 'Spinach, banana, and mango smoothie packed with nutrients.', 'price' => 7.99, 'image' => 'green_smoothie.jpg', 'stock' => 80, 'featured' => 0, 'sales_count' => 75, 'is_approved' => 1, 'cuisine' => 'Healthy', 'ingredients' => 'Spinach, banana, mango, coconut water, chia seeds', 'prep_time' => 3],
            ['store_id' => $store_ids[6], 'category_name' => 'Grain Bowls', 'name' => 'Quinoa Power Bowl', 'description' => 'Quinoa bowl with roasted vegetables and tahini dressing.', 'price' => 12.99, 'image' => 'quinoa_bowl.jpg', 'stock' => 45, 'featured' => 1, 'sales_count' => 65, 'is_approved' => 1, 'cuisine' => 'Healthy', 'ingredients' => 'Quinoa, roasted vegetables, tahini, chickpeas, avocado', 'prep_time' => 10],

            // Sweet Treats (Store 8)
            ['store_id' => $store_ids[7], 'category_name' => 'Cakes', 'name' => 'Chocolate Fudge Cake', 'description' => 'Rich chocolate cake with fudge frosting.', 'price' => 4.99, 'image' => 'chocolate_cake.jpg', 'stock' => 25, 'featured' => 1, 'sales_count' => 85, 'is_approved' => 1, 'cuisine' => 'Dessert', 'ingredients' => 'Chocolate, flour, eggs, butter, sugar, cocoa', 'prep_time' => 5],
            ['store_id' => $store_ids[7], 'category_name' => 'Ice Cream', 'name' => 'Vanilla Bean Ice Cream', 'description' => 'Creamy vanilla ice cream made with real vanilla beans.', 'price' => 3.99, 'image' => 'vanilla_ice_cream.jpg', 'stock' => 100, 'featured' => 0, 'sales_count' => 120, 'is_approved' => 1, 'cuisine' => 'Dessert', 'ingredients' => 'Cream, milk, vanilla beans, sugar, eggs', 'prep_time' => 2],

            // Coffee Corner (Store 9)
            ['store_id' => $store_ids[8], 'category_name' => 'Espresso', 'name' => 'Double Espresso', 'description' => 'Rich and bold double shot of espresso.', 'price' => 3.99, 'image' => 'espresso.jpg', 'stock' => 200, 'featured' => 1, 'sales_count' => 300, 'is_approved' => 1, 'cuisine' => 'Coffee', 'ingredients' => 'Espresso beans', 'prep_time' => 2],
            ['store_id' => $store_ids[8], 'category_name' => 'Latte', 'name' => 'Caramel Latte', 'description' => 'Smooth latte with caramel syrup and steamed milk.', 'price' => 5.99, 'image' => 'caramel_latte.jpg', 'stock' => 150, 'featured' => 0, 'sales_count' => 180, 'is_approved' => 1, 'cuisine' => 'Coffee', 'ingredients' => 'Espresso, steamed milk, caramel syrup', 'prep_time' => 4],

            // Quick Bites (Store 10)
            ['store_id' => $store_ids[9], 'category_name' => 'Fried Chicken', 'name' => 'Crispy Fried Chicken', 'description' => 'Golden crispy fried chicken pieces.', 'price' => 8.99, 'image' => 'fried_chicken.jpg', 'stock' => 80, 'featured' => 1, 'sales_count' => 220, 'is_approved' => 1, 'cuisine' => 'Fast Food', 'ingredients' => 'Chicken, flour, spices, oil', 'prep_time' => 8],
            ['store_id' => $store_ids[9], 'category_name' => 'Hot Dogs', 'name' => 'Classic Hot Dog', 'description' => 'All-beef hot dog with mustard and ketchup.', 'price' => 4.99, 'image' => 'hot_dog.jpg', 'stock' => 120, 'featured' => 0, 'sales_count' => 190, 'is_approved' => 1, 'cuisine' => 'Fast Food', 'ingredients' => 'Beef hot dog, bun, mustard, ketchup, onions', 'prep_time' => 3],

            // Ocean Delights (Store 11)
            ['store_id' => $store_ids[10], 'category_name' => 'Grilled Fish', 'name' => 'Grilled Salmon', 'description' => 'Fresh Atlantic salmon grilled to perfection.', 'price' => 18.99, 'image' => 'grilled_salmon.jpg', 'stock' => 30, 'featured' => 1, 'sales_count' => 95, 'is_approved' => 1, 'cuisine' => 'Seafood', 'ingredients' => 'Salmon fillet, herbs, lemon, olive oil', 'prep_time' => 15],
            ['store_id' => $store_ids[10], 'category_name' => 'Shrimp', 'name' => 'Garlic Butter Shrimp', 'description' => 'Succulent shrimp sautéed in garlic butter.', 'price' => 16.99, 'image' => 'garlic_shrimp.jpg', 'stock' => 40, 'featured' => 0, 'sales_count' => 75, 'is_approved' => 1, 'cuisine' => 'Seafood', 'ingredients' => 'Shrimp, garlic, butter, parsley, white wine', 'prep_time' => 8],
        ];

        foreach ($products as $p) {
            $category_name = $p['category_name'];
            if (!isset($category_map[$category_name])) {
                log_message('error', "ProductSeeder: Category '{$category_name}' not found for product '{$p['name']}'. Available categories: " . implode(', ', array_keys($category_map)));
                continue; // Skip if category name is not found
            }
            
            log_message('debug', "ProductSeeder: Processing product '{$p['name']}' with category '{$category_name}' for store_id {$p['store_id']}");

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
                        'is_active' => 1,
                        'is_approved' => 1, // Seeded variants are pre-approved
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
