<?php

namespace App\Models;

use CodeIgniter\Model;

class VerificationModel extends Model
{
    protected $table = 'email_verifications';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'token',
        'expires_at',
        'created_at'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    protected $validationRules = [];
    protected $validationMessages = [];
    protected $skipValidation = false;

    public function generateToken($userId)
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $data = [
            'user_id' => $userId,
            'token' => $token,
            'expires_at' => $expiresAt
        ];

        $this->insert($data);
        return $token;
    }

    public function verifyToken($token)
    {
        $verification = $this->where('token', $token)
            ->where('expires_at >', date('Y-m-d H:i:s'))
            ->first();

        if ($verification) {
            $this->delete($verification['id']);
            return $verification['user_id'];
        }

        return null;
    }
}
