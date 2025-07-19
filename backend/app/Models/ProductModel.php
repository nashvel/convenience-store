<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';

    protected $allowedFields = ['store_id', 'category_id', 'name', 'description', 'price', 'stock', 'image', 'is_active', 'is_approved', 'product_type', 'sales_count'];
}
