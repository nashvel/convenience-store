<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRememberMeFieldsToUsersTable extends Migration
{
    public function up()
    {
        $this->forge->addColumn('users', [
            'remember_token' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'last_login_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'last_login_ip' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'remember_token');
        $this->forge->dropColumn('users', 'last_login_at');
        $this->forge->dropColumn('users', 'last_login_ip');
    }
}
