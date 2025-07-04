<?php

namespace App\Models;

use CodeIgniter\Model;

class StoreModel extends Model
{
    protected $table = 'stores';
    protected $primaryKey = 'id';
            protected $allowedFields = ['client_id', 'name', 'description', 'address', 'logo', 'is_active'];
}
