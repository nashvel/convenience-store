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
