<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Get role IDs
        $roles_result = $this->db->table('roles')->get()->getResultArray();
        $roles = array_column($roles_result, 'id', 'name');

        // Hashed password for all users (password is 'password')
        $password_hash = password_hash('password', PASSWORD_DEFAULT);

        // --- Admin ---
        $this->createUser(
            $roles['admin'], 'nashvelbusiness@gmail.com', $password_hash, 'Admin', 'User', '111111111', 'Office', 
            '456 Admin Ave', 'Tagoloan', 'Misamis Oriental', '12345'
        );

        // --- Clients ---
        $this->createUser(
            $roles['client'], 'zereffdraken@gmail.com', $password_hash, 'Jay', 'Nashvel', '1234567890', 'Home', 
            '123 Tech Street', 'Tagoloan', 'Misamis Oriental', '54321'
        );
        $this->createUser(
            $roles['client'], 'nozelikari@gmail.com', $password_hash, 'Ann', 'Angel', '0987654321', 'Home', 
            '456 Fashion Ave', 'Tagoloan', 'Misamis Oriental', '67890'
        );
        $this->createUser(
            $roles['client'], 'yutarosalad3@gmail.com', $password_hash, 'Ash', 'Keion', '1122334455', 'Home', 
            '789 Home Blvd', 'Tagoloan', 'Misamis Oriental', '13579'
        );
        $this->createUser(
            $roles['client'], 'akaliii.me@gmail.com', $password_hash, 'Kent', 'Russel', '5566778899', 'Home', 
            '101 Pizza Lane', 'Tagoloan', 'Misamis Oriental', '24680'
        );

        // --- Customers ---
        $this->createUser(
            $roles['customer'], 'customer1@example.com', $password_hash, 'John', 'Doe', '111222333', 'Home', 
            '1 Customer Rd', 'Tagoloan', 'Misamis Oriental', '11111'
        );
        $this->createUser(
            $roles['customer'], 'customer2@example.com', $password_hash, 'Jane', 'Smith', '444555666', 'Work', 
            '2 Shopper St', 'Tagoloan', 'Misamis Oriental', '22222'
        );

        // --- Riders ---
        $this->createUser(
            $roles['rider'], 'rider1@example.com', $password_hash, 'Mike', 'Rider', '777888999', 'Home', 
            '1 Rider Route', 'Tagoloan', 'Misamis Oriental', '33333'
        );
        $this->createUser(
            $roles['rider'], 'rider2@example.com', $password_hash, 'Dave', 'Driver', '100200300', 'Home', 
            '2 Delivery Drive', 'Tagoloan', 'Misamis Oriental', '44444'
        );
    }

    private function createUser($role_id, $email, $password_hash, $first_name, $last_name, $phone, $label, $line1, $city, $province, $zip_code)
    {
        $user_data = [
            'role_id' => $role_id,
            'email' => $email,
            'password_hash' => $password_hash,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'phone' => $phone,
            'is_verified' => true,
            'created_at' => date('Y-m-d H:i:s')
        ];
        $this->db->table('users')->insert($user_data);
        $user_id = $this->db->insertID();

        $address_data = [
            'user_id' => $user_id,
            'label' => $label,
            'is_default' => true,
            'full_name' => "$first_name $last_name",
            'phone' => $phone,
            'line1' => $line1,
            'city' => $city,
            'province' => $province,
            'zip_code' => $zip_code,
            'created_at' => date('Y-m-d H:i:s')
        ];
        $this->db->table('user_addresses')->insert($address_data);
    }
}
