<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderTrackingModel extends Model
{
    protected $table = 'rider_locations';
    protected $primaryKey = 'id';
    protected $allowedFields = ['order_id', 'rider_id', 'latitude', 'longitude'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function addLocation($data)
    {
        return $this->insert($data);
    }

    public function getLatestLocation($orderId)
    {
        return $this->where('order_id', $orderId)
                    ->orderBy('created_at', 'DESC')
                    ->first();
    }
}
