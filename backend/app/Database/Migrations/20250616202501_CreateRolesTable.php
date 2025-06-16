<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRolesTable extends Migration
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
            'description' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
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
        $this->forge->createTable('roles');

        // Insert default roles
        $this->db->table('roles')->insertBatch([
            ['name' => 'customer', 'description' => 'Regular customer', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'client', 'description' => 'Store owner', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'rider', 'description' => 'Delivery rider', 'created_at' => date('Y-m-d H:i:s')],
            ['name' => 'admin', 'description' => 'System administrator', 'created_at' => date('Y-m-d H:i:s')],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('roles');
    }
}
