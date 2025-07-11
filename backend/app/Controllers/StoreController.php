<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Log\Logger;

class StoreController extends ResourceController
{
    protected $modelName = 'App\Models\StoreModel';
    protected $format    = 'json';

    public function index()
    {
        try {
            $stores = $this->model
                ->select('stores.*, owners.id as owner_id, owners.first_name, owners.last_name, owners.email, roles.name as role, owners.avatar')
                ->join('users as owners', 'owners.id = stores.client_id', 'left')
                ->join('roles', 'roles.id = owners.role_id', 'left')
                ->findAll();

            $result = array_map(function($store) {
                $store['owner'] = [
                    'id' => $store['owner_id'],
                    'first_name' => $store['first_name'],
                    'last_name' => $store['last_name'],
                    'email' => $store['email'],
                    'role' => $store['role'],
                    'avatar' => $store['avatar']
                ];
                // Unset redundant fields from the top-level store object
                unset($store['owner_id'], $store['first_name'], $store['last_name'], $store['email'], $store['role'], $store['avatar']);
                return $store;
            }, $stores);

            return $this->response->setJSON($result);
        } catch (\Exception $e) {
            log_message('error', 'Database error in StoreController::index: ' . $e->getMessage());
            return $this->failServerError('An error occurred while fetching stores.');
        }
    }

    public function show($id = null)
    {
        try {
            $store = $this->model
                ->select('stores.*, owners.id as owner_id, owners.first_name, owners.last_name, owners.email, roles.name as role, owners.avatar')
                ->join('users as owners', 'owners.id = stores.client_id', 'left')
                ->join('roles', 'roles.id = owners.role_id', 'left')
                ->find($id);

            if ($store === null) {
                return $this->failNotFound('Store not found');
            }

            $store['owner'] = [
                'id' => $store['owner_id'],
                'first_name' => $store['first_name'],
                'last_name' => $store['last_name'],
                'email' => $store['email'],
                'role' => $store['role'],
                'avatar' => $store['avatar']
            ];
            unset($store['owner_id'], $store['first_name'], $store['last_name'], $store['email'], $store['role'], $store['avatar']);

            return $this->respond($store);
        } catch (\Exception $e) {
            log_message('error', 'Database error in StoreController::show: ' . $e->getMessage());
            return $this->failServerError('An error occurred while fetching the store.');
        }
    }
}
