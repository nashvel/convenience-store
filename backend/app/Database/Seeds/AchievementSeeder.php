<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run()
    {
        $achievements = [
            [
                'title'       => 'Speedy Starter',
                'description' => 'Complete 10 orders in your first week.',
                'icon'        => 'FaRocket',
                'metric'      => 'completed_orders_first_week',
                'goal'        => 10,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Trip Master',
                'description' => 'Complete 250 successful trips.',
                'icon'        => 'FaTrophy',
                'metric'      => 'completed_trips',
                'goal'        => 250,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Safety First',
                'description' => 'Maintain a 5-star rating for 30 consecutive days.',
                'icon'        => 'FaShieldAlt',
                'metric'      => 'perfect_rating_streak_days',
                'goal'        => 30,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Platform Royalty',
                'description' => 'Become one of the top 1% of riders this month.',
                'icon'        => 'FaCrown',
                'metric'      => 'top_percentile_rider',
                'goal'        => 1,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Perfect Week',
                'description' => 'Complete a full week with a perfect 5.0 rating.',
                'icon'        => 'FaStar',
                'metric'      => 'perfect_rating_week',
                'goal'        => 7,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Night Owl',
                'description' => 'Complete 50 orders between 10 PM and 6 AM.',
                'icon'        => 'FaClock',
                'metric'      => 'night_orders',
                'goal'        => 50,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Dedicated Driver',
                'description' => 'Work 100 consecutive days without a break.',
                'icon'        => 'FaCalendarCheck',
                'metric'      => 'consecutive_work_days',
                'goal'        => 100,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
        ];

        // Using Query Builder
        $this->db->table('achievements')->insertBatch($achievements);
    }
}
