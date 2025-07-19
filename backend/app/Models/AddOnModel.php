<?php

namespace App\Models;

use CodeIgniter\Model;

class AddOnModel extends Model
{
    protected $table            = 'addons';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'store_id', 
        'addon_category_id', 
        'name', 
        'description', 
        'image', 
        'base_price', 
        'is_required', 
        'max_selections', 
        'display_order', 
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
        'store_id' => 'required|integer',
        'addon_category_id' => 'required|integer',
        'name' => 'required|string|max_length[255]',
        'base_price' => 'required|decimal',
        'is_required' => 'in_list[0,1]',
        'max_selections' => 'integer',
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
