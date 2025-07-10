<?php

namespace App\Models;

use CodeIgniter\Model;

class PromotionModel extends Model
{
    protected $table = 'promotions';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'description',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'promo_image_banner',
        'is_active'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getActivePromotionsWithScopes()
    {
        $now = date('Y-m-d H:i:s');
        return $this->select('promotions.*, ps.scope_type, ps.scope_value')
                    ->join('promotion_scopes as ps', 'ps.promotion_id = promotions.id')
                    ->where('promotions.is_active', 1)
                    ->where('promotions.start_date <=', $now)
                    ->where('promotions.end_date >=', $now)
                    ->findAll();
    }
}
