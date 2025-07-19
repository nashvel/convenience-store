<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('TruncateTables');
        $this->call('RoleSeeder');
        $this->call('UserSeeder');
        $this->call('StoreSeeder');
        $this->call('CategorySeeder');
        $this->call('ProductSeeder');
        $this->call('AddOnsSeeder');
        $this->call('SettingSeeder');
        $this->call('AchievementSeeder');
        $this->call('RiderStoreAssignmentSeeder');
    }
}
