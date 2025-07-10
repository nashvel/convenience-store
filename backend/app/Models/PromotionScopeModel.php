<?php

namespace App\Models;

use CodeIgniter\Model;

class PromotionScopeModel extends Model
{
    protected $table = 'promotion_scopes';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'promotion_id',
        'scope_type',
        'scope_value'
    ];
}
