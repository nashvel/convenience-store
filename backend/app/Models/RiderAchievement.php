<?php

namespace App\Models;

use CodeIgniter\Model;

class RiderAchievement extends Model
{
    protected $table            = 'rider_achievements';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['rider_id', 'achievement_id', 'progress', 'unlocked_at'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
