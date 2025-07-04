<?php

namespace App\Models;

use CodeIgniter\Model;

class ChatMessageMediaModel extends Model
{
    protected $table = 'chat_message_media';
    protected $primaryKey = 'id';
    protected $allowedFields = ['chat_message_id', 'media_type', 'media_url', 'thumbnail_url'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = null;
}
