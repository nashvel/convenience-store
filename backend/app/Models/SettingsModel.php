<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingsModel extends Model
{
    protected $table = 'settings';
    protected $primaryKey = 'id';
    protected $allowedFields = ['key', 'value'];
    protected $useTimestamps = true;

    // Only admin can modify settings
    public function isAdminRequired(): bool
    {
        return true;
    }

    // Get setting by key
    public function getSetting(string $key)
    {
        return $this->where('key', $key)->first();
    }

    // Update setting (admin only)
    public function updateSetting(string $key, string $value)
    {
        return $this->update(
            ['key' => $key],
            ['value' => $value]
        );
    }

    // Get all settings
    public function getAllSettings()
    {
        return $this->findAll();
    }
}
