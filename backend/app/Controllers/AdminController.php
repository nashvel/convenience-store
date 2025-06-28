<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\StoreModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class AdminController extends ResourceController
{
    use ResponseTrait;

    protected $userModel;
    protected $storeModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->storeModel = new StoreModel();
    }

    public function getClients()
    {
        // For now, we will assume an admin check has been performed by a filter.
        // A real implementation should have a robust JWT or session-based auth check.

        try {
            $clients = $this->userModel
                ->select('users.id, users.first_name, users.last_name, users.email, users.created_at, users.is_verified, stores.name as store_name, stores.logo as store_logo')
                ->join('stores', 'stores.client_id = users.id', 'left')
                ->where('users.role_id', 2)
                ->findAll();

            return $this->respond($clients);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching client data.');
        }
    }

    public function getCustomers()
    {
        try {
            $customers = $this->userModel
                ->select('id, first_name, last_name, email, phone, avatar, created_at, is_verified')
                ->where('role_id', 1)
                ->findAll();

            return $this->respond($customers);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function getRiders()
    {
        try {
            $riders = $this->userModel
                ->select('id, first_name, last_name, email, created_at, is_verified')
                ->where('role_id', 3)
                ->findAll();

            return $this->respond($riders);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }
}
