<?php

namespace App\Models;

use CodeIgniter\Model;

class UsersModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'role_id', 'email', 'password_hash', 'first_name', 'last_name',
        'phone', 'avatar', 'address', 'is_verified', 'is_blacklisted',
        'password_reset_token', 'password_reset_expires'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation rules
    protected $validationRules = [
        'email' => 'required|valid_email|is_unique[users.email]',
        'password_hash' => 'required',
        'first_name' => 'required',
        'last_name' => 'required',
        'phone' => 'required|is_unique[users.phone]',
    ];

    // Validation messages
    protected $validationMessages = [
        'email' => [
            'is_unique' => 'This email is already registered.',
        ],
        'phone' => [
            'is_unique' => 'This phone number is already registered.',
        ],
    ];

    // Before create event
    protected function beforeCreate(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['password_hash'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }
        return $data;
    }

    // Before update event
    protected function beforeUpdate(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['password_hash'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }
        return $data;
    }

    // Get user with role
    public function getUserWithRole($userId)
    {
        return $this->select('users.*, roles.name as role_name')
            ->join('roles', 'roles.id = users.role_id')
            ->where('users.id', $userId)
            ->first();
    }

    // Get user by email
    public function getUserByEmail($email)
    {
        return $this->select('users.*, roles.name as role_name')
            ->join('roles', 'roles.id = users.role_id')
            ->where('users.email', $email)
            ->first();
    }
}
