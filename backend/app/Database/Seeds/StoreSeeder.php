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
        ];

        $this->db->table('stores')->insertBatch($data);
    }
}
