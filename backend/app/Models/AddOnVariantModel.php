<?php

namespace App\Models;

use CodeIgniter\Model;

class AddOnVariantModel extends Model
{
    protected $table            = 'addon_variants';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'addon_id', 
        'variant_name', 
        'variant_value', 
        'price_modifier', 
        'stock_quantity', 
        'is_unlimited_stock', 
        'is_active', 
        'is_approved'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'addon_id' => 'required|integer',
        'variant_name' => 'required|string|max_length[100]',
        'variant_value' => 'required|string|max_length[100]',
        'price_modifier' => 'decimal',
        'stock_quantity' => 'integer',
        'is_unlimited_stock' => 'in_list[0,1]',
        'is_active' => 'in_list[0,1]',
        'is_approved' => 'in_list[0,1]'
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}
