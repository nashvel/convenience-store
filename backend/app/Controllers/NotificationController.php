<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class NotificationController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to view notifications.');
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

    public function markAsRead($id = null)
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in.');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('notifications');

        $notification = $builder->where('id', $id)->where('user_id', $userId)->get()->getRow();

        if (!$notification) {
            return $this->failNotFound('Notification not found.');
        }

        $builder->where('id', $id)->set('is_read', 1)->update();

        return $this->respond(['success' => true, 'message' => 'Notification marked as read.']);
    }

    public function markAllAsRead()
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in.');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('notifications');

        $builder->where('user_id', $userId)->set('is_read', 1)->update();

        return $this->respond(['success' => true, 'message' => 'All notifications marked as read.']);
    }
}
