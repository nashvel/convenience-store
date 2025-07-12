<?php

namespace App\Models;

use CodeIgniter\Model;

class StoreModel extends Model
{
    protected $table = 'stores';
    protected $primaryKey = 'id';
                    protected $allowedFields = ['user_id', 'client_id', 'name', 'description', 'address', 'logo', 'is_active', 'latitude', 'longitude', 'contact_number', 'opening_time', 'closing_time', 'payment_methods'];
}
