<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
        protected $allowedFields = ['store_id', 'category_id', 'name', 'description', 'price', 'image', 'stock', 'is_approved', 'featured', 'sales_count'];
}
