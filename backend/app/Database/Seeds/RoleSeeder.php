<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'name' => 'customer',
                'description' => 'Regular customer',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'client',
                'description' => 'Store owner',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'rider',
                'description' => 'Delivery rider',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'admin',
                'description' => 'System administrator',
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ];

        // Using Query Builder
        $this->db->table('roles')->insertBatch($data);
    }
}
