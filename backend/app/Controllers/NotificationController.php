<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class NotificationController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $userId = $this->request->getVar('userId');

        if (!$userId) {
            return $this->fail('User ID is required.');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('notifications');

        try {
            $notifications = $builder->where('user_id', $userId)
                                     ->orderBy('created_at', 'DESC')
                                     ->get()
                                     ->getResultArray();

            return $this->respond(['success' => true, 'notifications' => $notifications]);
        } catch (\Exception $e) {
            // Log the error message
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching notifications: ' . $e->getMessage());
        }
    }
}
