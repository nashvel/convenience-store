<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Log\Logger;

class StoreController extends ResourceController
{
    protected $modelName = 'App\Models\StoreModel';
    protected $format    = 'json';

    public function getStoreForSeller()
    {
        try {
            // The AuthMiddleware has already verified the user and attached the user object to the request.
            $userId = $this->request->user->id;

            if (!$userId) {
                return $this->failUnauthorized('User ID not found in request.');
            }

            $store = $this->model->where('client_id', $userId)->first();

            if (!$store) {
                return $this->failNotFound('No store associated with this seller.');
            }

            return $this->respond($store);
        } catch (\Exception $e) {
            log_message('error', 'Error in getStoreForSeller: ' . $e->getMessage());
            return $this->failServerError('An internal error occurred while fetching store data.');
        }
    }

    public function update($id = null)
    {
        log_message('info', 'Store update request received for store ID: ' . $id);

        $userId = $this->request->user->id;
        $data = $this->request->getJSON(true);

        log_message('debug', 'Update data received: ' . json_encode($data));

        if (!$userId) {
            return $this->failUnauthorized('User not logged in or session expired.');
        }

        $store = $this->model->find($id);
        if (!$store) {
            return $this->failNotFound('Store not found.');
        }

        if ($store['client_id'] != $userId) {
            log_message('warning', 'Forbidden attempt to update store ID: ' . $id . ' by user ID: ' . $userId);
            return $this->failForbidden('You are not authorized to update this store.');
        }

        $updateData = [];
        $fieldMapping = [
            'storeName' => 'name',
            'openingTime' => 'opening_time',
            'closingTime' => 'closing_time',
            'contactNumber' => 'contact_number',
            'paymentMethods' => 'payment_methods',
            'address' => 'address',
            'latitude' => 'latitude',
            'longitude' => 'longitude',
            'description' => 'description',
        ];

        foreach ($fieldMapping as $jsonKey => $dbKey) {
            if (array_key_exists($jsonKey, $data)) {
                $updateData[$dbKey] = $data[$jsonKey];
            }
        }



        log_message('info', 'Attempting to update store with data: ' . json_encode($updateData));

        try {
            if ($this->model->update($id, $updateData)) {
                log_message('info', 'Store ID: ' . $id . ' updated successfully.');
                return $this->respondUpdated($data, 'Store updated successfully.');
            } else {
                $errors = $this->model->errors();
                log_message('warning', 'Store update validation failed for store ID: ' . $id . '. Errors: ' . json_encode($errors));
                return $this->failValidationErrors($errors);
            }
        } catch (\Exception $e) {
            log_message('error', 'Exception during store update for store ID: ' . $id . '. Message: ' . $e->getMessage());
            return $this->failServerError('An internal error occurred while updating the store.');
        }
    }
    public function index()
    {
        try {
            $stores = $this->model
                ->select('stores.*, owners.id as owner_id, owners.first_name, owners.last_name, owners.email, roles.name as role, owners.avatar')
                ->join('users as owners', 'owners.id = stores.client_id', 'left')
                ->join('roles', 'roles.id = owners.role_id', 'left')
                ->where('stores.is_active', 1)
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

    public function toggleStatus()
    {
        $userId = $this->request->user->id;
        if (!$userId) {
            return $this->failUnauthorized('User not logged in.');
        }

        $store = $this->model->where('client_id', $userId)->first();
        if (!$store) {
            return $this->failNotFound('Store not found for this user.');
        }

        $data = $this->request->getJSON(true);
        if (!isset($data['is_active'])) {
            return $this->failValidationErrors('is_active field is required.');
        }

        $updateData = ['is_active' => $data['is_active'] ? 1 : 0];

        if ($this->model->update($store['id'], $updateData)) {
            return $this->respondUpdated(['status' => 'success'], 'Store status updated.');
        } else {
            return $this->failServerError('Could not update store status.');
        }
    }
}
