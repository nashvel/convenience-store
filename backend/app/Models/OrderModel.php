<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table            = 'orders';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'customer_id',
        'store_id',
        'rider_id',
        'total_price',
        'delivery_fee',
        'status',
        'delivery_address',
        'payment_method',
        'notes'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
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

    public function getOrderDetails($order_id)
    {
        $this->select('orders.*, s.name as store_name, s.latitude as store_latitude, s.longitude as store_longitude, a.full_name as delivery_full_name, a.phone_number as delivery_phone_number, a.address_line_1, a.city, a.province, a.postal_code, a.latitude as customer_latitude, a.longitude as customer_longitude, r.latitude as rider_latitude, r.longitude as rider_longitude, CONCAT(r.first_name, " ", r.last_name) as rider_name', false);
        $this->join('stores s', 's.id = orders.store_id');
        $this->join('users u', 'u.id = orders.customer_id');
        $this->join('users r', 'r.id = orders.rider_id', 'left'); // Join to get rider's name
        $this->join('user_addresses da', 'da.id = orders.delivery_address_id', 'left');
        $this->join('user_addresses sa', 'sa.user_id = s.client_id AND sa.is_default = 1', 'left');
        $this->where('orders.id', $order_id);
        return $this->first();
    }

    public function getOrderItems($order_id)
    {
        $builder = $this->db->table('order_items oi');
        $builder->select('p.name, oi.quantity, oi.price');
        $builder->join('products p', 'p.id = oi.product_id');
        $builder->where('oi.order_id', $order_id);
        return $builder->get()->getResultArray();
    }
}
