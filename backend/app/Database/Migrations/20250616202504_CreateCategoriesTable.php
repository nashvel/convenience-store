<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCategoriesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'icon' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('categories');

        // Insert default categories
        $this->db->table('categories')->insertBatch([
            ['name' => 'Electronics', 'icon' => 'tv', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'Apparel', 'icon' => 'tshirt', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'Home Goods', 'icon' => 'home', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'Books', 'icon' => 'book', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'Sports', 'icon' => 'futbol', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'Food', 'icon' => 'utensils', 'created_at' => date('Y-m-d H:i:s')],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('categories');
    }
}
