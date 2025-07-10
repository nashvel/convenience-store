<?php

namespace App\Controllers;

use App\Models\SiteSettingsModel;
use CodeIgniter\RESTful\ResourceController;

class SiteSettingsController extends ResourceController
{
    public function getSettings()
    {
        $model = new SiteSettingsModel();
        $settings = $model->findAll();
        $formattedSettings = [];
        foreach ($settings as $setting) {
            $formattedSettings[$setting['setting_name']] = $setting['setting_value'];
        }
        return $this->respond($formattedSettings);
    }

    public function updateSettings()
    {
        $model = new SiteSettingsModel();
        
        // Handle logo upload
        $logoFile = $this->request->getFile('logo');
        if ($logoFile && $logoFile->isValid() && !$logoFile->hasMoved()) {
            $newName = 'logo.' . $logoFile->getExtension();
            $logoFile->move(FCPATH . 'uploads', $newName, true); // Overwrite existing
            $model->setSetting('logo_url', '/uploads/' . $newName);
        }

        // Handle restaurant banner upload
        $bannerFile = $this->request->getFile('restaurant_banner');
        if ($bannerFile && $bannerFile->isValid() && !$bannerFile->hasMoved()) {
            $newName = 'restaurant_banner.' . $bannerFile->getExtension();
            $bannerFile->move(FCPATH . 'uploads', $newName, true); // Overwrite existing
            $model->setSetting('restaurant_banner_url', '/uploads/' . $newName);
        }

        return $this->respond(['message' => 'Settings updated successfully']);
    }
}
