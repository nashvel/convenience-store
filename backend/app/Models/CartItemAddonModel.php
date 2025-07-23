<?php

namespace App\Models;

use CodeIgniter\Model;

class CartItemAddonModel extends Model
{
    protected $table = 'cart_item_addons';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'cart_item_id',
        'addon_id', 
        'addon_variant_id',
        'quantity',
        'price'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'cart_item_id' => 'required|integer',
        'addon_id' => 'required|integer',
        'quantity' => 'required|integer|greater_than[0]',
        'price' => 'required|decimal'
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = [];
    protected $afterInsert = [];
    protected $beforeUpdate = [];
    protected $afterUpdate = [];
    protected $beforeFind = [];
    protected $afterFind = [];
    protected $beforeDelete = [];
    protected $afterDelete = [];

    /**
     * Get add-ons for a specific cart item with addon and variant details
     */
        public function getCartItemAddOns($cartItemId)
    {
        return $this->select('
                cart_item_addons.*,
                addons.name as addon_name,
                addons.description as addon_description,
                addons.image as addon_image,
                addon_categories.name as category_name,
                addon_variants.variant_name,
                addon_variants.variant_value,
                addon_variants.price_modifier
            ')
            ->join('addons', 'addons.id = cart_item_addons.addon_id')
            ->join('addon_categories', 'addon_categories.id = addons.addon_category_id')
            ->join('addon_variants', 'addon_variants.id = cart_item_addons.addon_variant_id', 'left')
            ->where('cart_item_addons.cart_item_id', $cartItemId)
            ->findAll();
    }

    /**
     * Delete all add-ons for a specific cart item
     */
    public function deleteByCartItem($cartItemId)
    {
        return $this->where('cart_item_id', $cartItemId)->delete();
    }
}
