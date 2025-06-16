<?php

namespace App\Models;

use CodeIgniter\Model;

class RolesModel extends Model
{
    protected $table = 'roles';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['name', 'description'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    // Get role by name
    public function getRoleByName($name)
    {
        return $this->where('name', $name)->first();
    }

    // Get all roles
    public function getAllRoles()
    {
        return $this->findAll();
    }
}
