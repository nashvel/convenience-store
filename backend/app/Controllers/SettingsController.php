<?php

namespace App\Controllers;

use App\Models\SettingsModel;
use CodeIgniter\RESTful\ResourceController;

class SettingsController extends ResourceController
{
    protected $settingsModel;

    public function __construct()
    {
        $this->settingsModel = new SettingsModel();
    }

    public function getPublicSettings()
    {
        try {
            $publicSettingsKeys = [
                'app_name',
                'app_description',
                'facebook_url',
                'twitter_url',
                'instagram_url',
                'linkedin_url',
                'restaurant_banner_text',
                'main_banner_text'
            ];
            
            $settings = $this->settingsModel->whereIn('key', $publicSettingsKeys)->findAll();

            $formattedSettings = [];
            foreach ($settings as $setting) {
                $formattedSettings[$setting['key']] = $setting['value'];
            }

            return $this->respond($formattedSettings);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while fetching public settings.');
        }
    }
}
