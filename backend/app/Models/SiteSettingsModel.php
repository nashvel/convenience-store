<?php

namespace App\Models;

use CodeIgniter\Model;

class SiteSettingsModel extends Model
{
    protected $table = 'site_settings';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'setting_name',
        'setting_value'
    ];

    public function getSetting($name)
    {
        $result = $this->where('setting_name', $name)->first();
        return $result ? $result['setting_value'] : null;
    }

    public function setSetting($name, $value)
    {
        $data = ['setting_name' => $name, 'setting_value' => $value];
        $existing = $this->where('setting_name', $name)->first();

        if ($existing) {
            return $this->update($existing['id'], ['setting_value' => $value]);
        } else {
            return $this->insert($data);
        }
    }
}
