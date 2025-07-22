<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run()
    {
        // Get client IDs
        $roles_result = $this->db->table('roles')->where('name', 'client')->get()->getRow();
        $client_role_id = $roles_result->id;

        $users_result = $this->db->table('users')->where('role_id', $client_role_id)->orderBy('id', 'ASC')->get()->getResultArray();
        $client_ids = array_column($users_result, 'id');

        $data = [
            [
                'client_id' => $client_ids[0],
                'name' => 'Tech World',
                'description' => 'Your one-stop shop for all things tech.',
                'address' => '123 Tech Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Fashion Forward',
                'description' => 'The latest trends in fashion.',
                'address' => '456 Fashion Ave, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Home Essentials',
                'description' => 'Everything you need for your home.',
                'address' => '789 Home Blvd, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[3],
                'name' => 'Pizza Palace',
                'description' => 'Delicious pizzas made fresh.',
                'address' => '101 Pizza Lane, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            // Additional Restaurant Stores
            [
                'client_id' => $client_ids[0], // Reusing client IDs for demo
                'name' => 'Burger Junction',
                'description' => 'Gourmet burgers and fries.',
                'address' => '202 Burger Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Asian Fusion',
                'description' => 'Authentic Asian cuisine with a modern twist.',
                'address' => '303 Asia Avenue, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Healthy Bites',
                'description' => 'Fresh salads, smoothies, and healthy meals.',
                'address' => '404 Health Way, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[3],
                'name' => 'Sweet Treats',
                'description' => 'Cakes, pastries, and desserts.',
                'address' => '505 Dessert Drive, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[0],
                'name' => 'Coffee Corner',
                'description' => 'Premium coffee and light snacks.',
                'address' => '606 Coffee Court, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Quick Bites',
                'description' => 'Fast food favorites and quick meals.',
                'address' => '707 Fast Lane, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Ocean Delights',
                'description' => 'Fresh seafood and marine cuisine.',
                'address' => '808 Seafood Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
                'created_at' => date('Y-m-d H:i:s')
            ],
        ];

        $this->db->table('stores')->insertBatch($data);
    }
}
