<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AddOnsSeeder extends Seeder
{
    public function run()
    {
        // Get Pizza Palace store ID
        $store = $this->db->table('stores')->where('name', 'Pizza Palace')->get()->getRow();
        if (!$store) {
            echo "Pizza Palace store not found. Please run StoreSeeder first.\n";
            return;
        }
        
        $store_id = $store->id;
        
        // Create addon categories
        $categories = [
            [
                'store_id' => $store_id,
                'name' => 'Beverages',
                'description' => 'Refreshing drinks to complement your meal',
                'display_order' => 1,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'name' => 'Sides',
                'description' => 'Delicious sides to complete your order',
                'display_order' => 2,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'name' => 'Desserts',
                'description' => 'Sweet treats to end your meal',
                'display_order' => 3,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'name' => 'Extras',
                'description' => 'Additional toppings and extras',
                'display_order' => 4,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];
        
        $this->db->table('addon_categories')->insertBatch($categories);
        
        // Get inserted category IDs
        $beverages_cat = $this->db->table('addon_categories')->where(['store_id' => $store_id, 'name' => 'Beverages'])->get()->getRow();
        $sides_cat = $this->db->table('addon_categories')->where(['store_id' => $store_id, 'name' => 'Sides'])->get()->getRow();
        $desserts_cat = $this->db->table('addon_categories')->where(['store_id' => $store_id, 'name' => 'Desserts'])->get()->getRow();
        $extras_cat = $this->db->table('addon_categories')->where(['store_id' => $store_id, 'name' => 'Extras'])->get()->getRow();
        
        // Create addons
        $addons = [
            // Beverages
            [
                'store_id' => $store_id,
                'addon_category_id' => $beverages_cat->id,
                'name' => 'Coca Cola',
                'description' => 'Classic refreshing cola',
                'image' => 'coca-cola.jpg',
                'base_price' => 45.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 1,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $beverages_cat->id,
                'name' => 'Pepsi',
                'description' => 'Bold and refreshing cola',
                'image' => 'pepsi.jpg',
                'base_price' => 45.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 2,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $beverages_cat->id,
                'name' => 'Orange Juice',
                'description' => 'Fresh squeezed orange juice',
                'image' => 'orange-juice.jpg',
                'base_price' => 65.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 3,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $beverages_cat->id,
                'name' => 'Iced Tea',
                'description' => 'Refreshing iced tea',
                'image' => 'iced-tea.jpg',
                'base_price' => 40.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 4,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Sides
            [
                'store_id' => $store_id,
                'addon_category_id' => $sides_cat->id,
                'name' => 'Garlic Bread',
                'description' => 'Crispy garlic bread with herbs',
                'image' => 'garlic-bread.jpg',
                'base_price' => 85.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 1,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $sides_cat->id,
                'name' => 'Buffalo Wings',
                'description' => 'Spicy buffalo chicken wings',
                'image' => 'buffalo-wings.jpg',
                'base_price' => 180.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 2,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $sides_cat->id,
                'name' => 'Mozzarella Sticks',
                'description' => 'Golden fried mozzarella sticks',
                'image' => 'mozzarella-sticks.jpg',
                'base_price' => 140.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 3,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $sides_cat->id,
                'name' => 'Caesar Salad',
                'description' => 'Fresh romaine lettuce with caesar dressing',
                'image' => 'caesar-salad.jpg',
                'base_price' => 120.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 4,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Desserts
            [
                'store_id' => $store_id,
                'addon_category_id' => $desserts_cat->id,
                'name' => 'Chocolate Brownie',
                'description' => 'Rich chocolate brownie with vanilla ice cream',
                'image' => 'chocolate-brownie.jpg',
                'base_price' => 95.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 1,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $desserts_cat->id,
                'name' => 'Tiramisu',
                'description' => 'Classic Italian tiramisu',
                'image' => 'tiramisu.jpg',
                'base_price' => 110.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 2,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $desserts_cat->id,
                'name' => 'Cheesecake',
                'description' => 'New York style cheesecake',
                'image' => 'cheesecake.jpg',
                'base_price' => 95.00,
                'is_required' => false,
                'max_selections' => 1,
                'display_order' => 3,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Extras
            [
                'store_id' => $store_id,
                'addon_category_id' => $extras_cat->id,
                'name' => 'Extra Cheese',
                'description' => 'Additional mozzarella cheese',
                'image' => 'extra-cheese.jpg',
                'base_price' => 35.00,
                'is_required' => false,
                'max_selections' => 3,
                'display_order' => 1,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $extras_cat->id,
                'name' => 'Pepperoni',
                'description' => 'Extra pepperoni topping',
                'image' => 'pepperoni.jpg',
                'base_price' => 45.00,
                'is_required' => false,
                'max_selections' => 2,
                'display_order' => 2,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'store_id' => $store_id,
                'addon_category_id' => $extras_cat->id,
                'name' => 'Mushrooms',
                'description' => 'Fresh mushroom topping',
                'image' => 'mushrooms.jpg',
                'base_price' => 30.00,
                'is_required' => false,
                'max_selections' => 2,
                'display_order' => 3,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];
        
        $this->db->table('addons')->insertBatch($addons);
        
        // Get addon IDs for creating variants
        $coca_cola = $this->db->table('addons')->where(['store_id' => $store_id, 'name' => 'Coca Cola'])->get()->getRow();
        $pepsi = $this->db->table('addons')->where(['store_id' => $store_id, 'name' => 'Pepsi'])->get()->getRow();
        $orange_juice = $this->db->table('addons')->where(['store_id' => $store_id, 'name' => 'Orange Juice'])->get()->getRow();
        $iced_tea = $this->db->table('addons')->where(['store_id' => $store_id, 'name' => 'Iced Tea'])->get()->getRow();
        $buffalo_wings = $this->db->table('addons')->where(['store_id' => $store_id, 'name' => 'Buffalo Wings'])->get()->getRow();
        
        // Create addon variants
        $variants = [
            // Coca Cola variants
            [
                'addon_id' => $coca_cola->id,
                'variant_name' => 'Size',
                'variant_value' => 'Small (12oz)',
                'price_modifier' => 0.00,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $coca_cola->id,
                'variant_name' => 'Size',
                'variant_value' => 'Medium (16oz)',
                'price_modifier' => 0.50,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $coca_cola->id,
                'variant_name' => 'Size',
                'variant_value' => 'Large (20oz)',
                'price_modifier' => 1.00,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Pepsi variants
            [
                'addon_id' => $pepsi->id,
                'variant_name' => 'Size',
                'variant_value' => 'Small (12oz)',
                'price_modifier' => 0.00,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $pepsi->id,
                'variant_name' => 'Size',
                'variant_value' => 'Medium (16oz)',
                'price_modifier' => 0.50,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $pepsi->id,
                'variant_name' => 'Size',
                'variant_value' => 'Large (20oz)',
                'price_modifier' => 1.00,
                'stock_quantity' => 100,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Orange Juice variants
            [
                'addon_id' => $orange_juice->id,
                'variant_name' => 'Size',
                'variant_value' => 'Regular (12oz)',
                'price_modifier' => 0.00,
                'stock_quantity' => 50,
                'is_unlimited_stock' => false,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $orange_juice->id,
                'variant_name' => 'Size',
                'variant_value' => 'Large (16oz)',
                'price_modifier' => 1.00,
                'stock_quantity' => 30,
                'is_unlimited_stock' => false,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Iced Tea variants
            [
                'addon_id' => $iced_tea->id,
                'variant_name' => 'Size',
                'variant_value' => 'Regular (16oz)',
                'price_modifier' => 0.00,
                'stock_quantity' => 75,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $iced_tea->id,
                'variant_name' => 'Flavor',
                'variant_value' => 'Sweet Tea',
                'price_modifier' => 0.25,
                'stock_quantity' => 75,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            
            // Buffalo Wings variants
            [
                'addon_id' => $buffalo_wings->id,
                'variant_name' => 'Quantity',
                'variant_value' => '6 pieces',
                'price_modifier' => 0.00,
                'stock_quantity' => 25,
                'is_unlimited_stock' => false,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $buffalo_wings->id,
                'variant_name' => 'Quantity',
                'variant_value' => '12 pieces',
                'price_modifier' => 6.00,
                'stock_quantity' => 20,
                'is_unlimited_stock' => false,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $buffalo_wings->id,
                'variant_name' => 'Spice Level',
                'variant_value' => 'Mild',
                'price_modifier' => 0.00,
                'stock_quantity' => 0,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'addon_id' => $buffalo_wings->id,
                'variant_name' => 'Spice Level',
                'variant_value' => 'Hot',
                'price_modifier' => 0.00,
                'stock_quantity' => 0,
                'is_unlimited_stock' => true,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];
        
        $this->db->table('addon_variants')->insertBatch($variants);
        
        echo "Add-ons seeder completed successfully for Pizza Palace!\n";
        echo "Created:\n";
        echo "- 4 addon categories (Beverages, Sides, Desserts, Extras)\n";
        echo "- 14 addons with various options\n";
        echo "- Multiple variants with different sizes, flavors, and quantities\n";
    }
}
