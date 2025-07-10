<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            ['key' => 'app_name', 'value' => 'Ecomxpert'],
            ['key' => 'app_description', 'value' => "Quick and Easy Shopping at Your Fingertips\nOrder your favorite convenience store items with just a few clicks"],
            ['key' => 'facebook_url', 'value' => ''],
            ['key' => 'twitter_url', 'value' => ''],
            ['key' => 'instagram_url', 'value' => ''],
            ['key' => 'api_logging', 'value' => 'true'],
            ['key' => 'restaurant_banner_text', 'value' => 'Explore our Restaurants with a delivery at your fingertips'],
            ['key' => 'main_banner_text', 'value' => 'Your Everyday Essentials, Delivered.'],
        ];

        foreach ($settings as $setting) {
            $data = [
                'key' => $setting['key'],
                'value' => $setting['value'],
                'created_at' => date('Y-m-d H:i:s')
            ];
            $this->db->table('settings')->insert($data);
        }
    }
}
