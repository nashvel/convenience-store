<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSettingsTable extends Migration
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
            'key' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'value' => [
                'type' => 'TEXT',
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
        $this->forge->addKey('key', true);
        $this->forge->createTable('settings');

        // Insert default settings
        $this->db->table('settings')->insertBatch([
            ['key' => 'app_name', 'value' => 'NashQuickMart', 'created_at' => date('Y-m-d H:i:s')],
            ['key' => 'app_description', 'value' => 'Quick and Easy Shopping at Your Fingertips\nOrder your favorite convenience store items with just a few clicks', 'created_at' => date('Y-m-d H:i:s')],
            ['key' => 'facebook_url', 'value' => '', 'created_at' => date('Y-m-d H:i:s')],
            ['key' => 'twitter_url', 'value' => '', 'created_at' => date('Y-m-d H:i:s')],
            ['key' => 'instagram_url', 'value' => '', 'created_at' => date('Y-m-d H:i:s')],
            ['key' => 'api_logging', 'value' => 'true', 'created_at' => date('Y-m-d H:i:s')],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('settings');
    }
}
