<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class TruncateTables extends Seeder
{
    public function run()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS = 0;');

        $tables = [
            'cart_items', 'user_addresses', 'users', 'roles', 'stores', 'categories', 'products', 'orders', 'order_items',
            'reviews', 'chats', 'chat_messages', 'settings', 'user_devices', 'remember_me_tokens', 'order_tracking',
            'rider_locations', 'email_verifications', 'notifications'
        ];

        foreach ($tables as $table) {
            if ($this->db->tableExists($table)) {
                $this->db->table($table)->truncate();
            }
        }

        $this->db->query('SET FOREIGN_KEY_CHECKS = 1;');

        echo "All tables truncated successfully.\n";
    }
}
