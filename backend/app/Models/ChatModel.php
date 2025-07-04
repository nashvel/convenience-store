<?php

namespace App\Models;

use CodeIgniter\Model;

class ChatModel extends Model
{
    protected $table = 'chats';
    protected $primaryKey = 'id';
        protected $allowedFields = ['store_id', 'customer_id', 'order_id'];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
        protected $updatedField = '';
}
