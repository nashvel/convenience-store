<?php

namespace App\Models;

use CodeIgniter\Model;

class StorePromotionModel extends Model
{
    protected $table = 'store_promotions';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'store_id',
        'promotion_id',
        'is_participating'
    ];

    public function getStoreParticipation($storeId, $promotionId)
    {
        return $this->where('store_id', $storeId)
                    ->where('promotion_id', $promotionId)
                    ->first();
    }
}
