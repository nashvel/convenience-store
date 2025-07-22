<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Electronics', 'icon' => 'fas fa-laptop', 'sub_categories' => [
                ['name' => 'Computers & Accessories'], ['name' => 'Headphones'], ['name' => 'Cameras & Photography'], ['name' => 'Smartphones & Tablets']
            ]],
            ['name' => 'Fashion', 'icon' => 'fas fa-tshirt', 'sub_categories' => [
                ['name' => "Females Wear"], ['name' => "Mens Wear"], ['name' => "Childrens Wear"], ['name' => 'Shoes'], ['name' => 'Bags'], ['name' => 'Glasses']
            ]],
            ['name' => 'Home & Kitchen', 'icon' => 'fas fa-home', 'sub_categories' => [
                ['name' => 'Kitchen & Dining'], ['name' => 'Furniture'], ['name' => 'Home Decor'], ['name' => 'Bed & Bath']
            ]],
            ['name' => 'Books', 'icon' => 'fas fa-book', 'sub_categories' => [
                ['name' => 'Fiction'], ['name' => 'Non-Fiction'], ['name' => 'Science & Technology'], ['name' => 'Comics']
            ]],
            ['name' => 'Sports & Outdoors', 'icon' => 'fas fa-futbol', 'sub_categories' => [
                ['name' => 'Team Sports'], ['name' => 'Exercise & Fitness'], ['name' => 'Outdoor Recreation'], ['name' => 'Sports Apparel']
            ]],
            ['name' => 'Food & Grocery', 'icon' => 'fas fa-utensils', 'sub_categories' => [
                ['name' => 'Fresh Produce'], ['name' => 'Beverages'], ['name' => 'Snacks'], ['name' => 'Dairy & Chilled']
            ]],
            // Restaurant Food Categories
            ['name' => 'Pizza', 'icon' => 'fas fa-pizza-slice', 'sub_categories' => [
                ['name' => 'Margherita'], ['name' => 'Pepperoni'], ['name' => 'Supreme'], ['name' => 'Vegetarian']
            ]],
            ['name' => 'Burgers', 'icon' => 'fas fa-hamburger', 'sub_categories' => [
                ['name' => 'Beef Burgers'], ['name' => 'Chicken Burgers'], ['name' => 'Veggie Burgers'], ['name' => 'Fish Burgers']
            ]],
            ['name' => 'Asian', 'icon' => 'fas fa-bowl-rice', 'sub_categories' => [
                ['name' => 'Chinese'], ['name' => 'Japanese'], ['name' => 'Thai'], ['name' => 'Korean']
            ]],
            ['name' => 'Healthy', 'icon' => 'fas fa-leaf', 'sub_categories' => [
                ['name' => 'Salads'], ['name' => 'Smoothies'], ['name' => 'Grain Bowls'], ['name' => 'Wraps']
            ]],
            ['name' => 'Desserts', 'icon' => 'fas fa-ice-cream', 'sub_categories' => [
                ['name' => 'Cakes'], ['name' => 'Ice Cream'], ['name' => 'Pastries'], ['name' => 'Cookies']
            ]],
            ['name' => 'Coffee', 'icon' => 'fas fa-coffee', 'sub_categories' => [
                ['name' => 'Espresso'], ['name' => 'Latte'], ['name' => 'Cappuccino'], ['name' => 'Cold Brew']
            ]],
            ['name' => 'Fast Food', 'icon' => 'fas fa-hotdog', 'sub_categories' => [
                ['name' => 'Fried Chicken'], ['name' => 'Hot Dogs'], ['name' => 'Tacos'], ['name' => 'Sandwiches']
            ]],
            ['name' => 'Seafood', 'icon' => 'fas fa-fish', 'sub_categories' => [
                ['name' => 'Grilled Fish'], ['name' => 'Shrimp'], ['name' => 'Crab'], ['name' => 'Sushi']
            ]]
        ];

        foreach ($categories as $category) {
            $parent_data = [
                'name' => $category['name'],
                'icon' => $category['icon'],
                'created_at' => date('Y-m-d H:i:s')
            ];
            $this->db->table('categories')->insert($parent_data);
            $parent_id = $this->db->insertID();

            foreach ($category['sub_categories'] as $sub_category) {
                $sub_data = [
                    'name' => $sub_category['name'],
                    'parent_id' => $parent_id,
                    'created_at' => date('Y-m-d H:i:s')
                ];
                $this->db->table('categories')->insert($sub_data);
            }
        }
    }
}
